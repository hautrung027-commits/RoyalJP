import {
  auth,
  storage,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '../lib/firebase';

/**
 * DỊCH VỤ ẢNH XE
 *
 * Firestore giới hạn 1MB cho mỗi document, nên ảnh KHÔNG được nhúng dưới dạng
 * base64 vào bản ghi xe (một tấm ảnh điện thoại đã vượt giới hạn).
 * Ảnh được nén ở trình duyệt rồi tải lên Cloud Storage; Firestore chỉ lưu URL.
 */

/** Cạnh dài nhất của ảnh sau khi nén. Đủ cho ảnh hero full-width. */
const MAX_DIMENSION = 1920;

/** Chất lượng JPEG khởi điểm. */
const INITIAL_QUALITY = 0.85;

/** Chất lượng thấp nhất chấp nhận được khi phải nén thêm. */
const MIN_QUALITY = 0.5;

/** Ngưỡng mục tiêu sau nén (600 KB). Vượt thì hạ chất lượng và thử lại. */
const TARGET_BYTES = 600 * 1024;

/** Kích thước file gốc tối đa cho phép chọn (25 MB). */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

/** Định dạng ảnh chấp nhận. */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export class ImageUploadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

/**
 * Dịch mã lỗi của Firebase Storage sang thông báo nói rõ nguyên nhân và cách xử lý.
 *
 * Không có bảng này thì mọi sự cố cấu hình đều hiện ra như "storage/unknown",
 * rất khó đoán đang thiếu bước nào.
 */
function describeStorageError(error: any, fileName: string): string {
  const code: string = error?.code || '';

  switch (code) {
    case 'storage/unauthorized':
      return (
        `Không có quyền tải ảnh lên. Phiên đăng nhập hiện tại không phải phiên ` +
        `Firebase Auth thật (đăng nhập bằng mật khẩu dự phòng sẽ không tạo phiên này), ` +
        `hoặc storage.rules chưa được publish.`
      );

    case 'storage/unauthenticated':
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi thử lại.';

    case 'storage/retry-limit-exceeded':
      return `Tải ảnh "${fileName}" quá lâu và đã bị huỷ. Kiểm tra kết nối mạng rồi thử lại.`;

    case 'storage/canceled':
      return `Đã huỷ tải ảnh "${fileName}".`;

    case 'storage/quota-exceeded':
      return 'Dung lượng lưu trữ của dự án đã hết. Vui lòng kiểm tra gói Firebase.';

    case 'storage/unknown':
      return (
        `Không kết nối được tới Cloud Storage. Nguyên nhân thường gặp: chưa bật ` +
        `Storage cho dự án trong Firebase Console (Build → Storage → Get started).`
      );

    default:
      return `Không tải được ảnh "${fileName}" lên máy chủ${code ? ` (${code})` : ''}.`;
  }
}

/** URL trỏ tới Cloud Storage của dự án (ảnh do ta quản lý, xoá được). */
export function isStorageUrl(url: string): boolean {
  return (
    typeof url === 'string' &&
    (url.includes('firebasestorage.googleapis.com') ||
      url.includes('firebasestorage.app'))
  );
}

/** Chuỗi base64 nhúng thẳng — dạng dữ liệu cũ cần loại bỏ. */
export function isDataUrl(url: string): boolean {
  return typeof url === 'string' && url.startsWith('data:');
}

/** Kiểm tra file người dùng chọn trước khi xử lý. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return `"${file.name}": định dạng không được hỗ trợ (chỉ nhận JPG, PNG, WebP, AVIF).`;
  }

  if (file.size > MAX_SOURCE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `"${file.name}": ảnh nặng ${mb} MB, vượt giới hạn 25 MB.`;
  }

  return null;
}

/** Đọc file thành HTMLImageElement để vẽ lên canvas. */
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageUploadError(`Không đọc được ảnh "${file.name}".`));
    };

    img.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new ImageUploadError('Không nén được ảnh.'));
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Thu nhỏ và nén ảnh ở trình duyệt.
 *
 * Giảm cạnh dài nhất về {@link MAX_DIMENSION}, xuất JPEG, và hạ dần chất lượng
 * cho tới khi đạt {@link TARGET_BYTES}. Trả về chính file gốc nếu trình duyệt
 * không giải mã được (ví dụ HEIC) — Storage vẫn nhận, chỉ là không tối ưu.
 */
export async function compressImage(file: File): Promise<Blob> {
  try {
    const img = await loadImageElement(file);

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    // Nền trắng: ảnh PNG trong suốt chuyển sang JPEG sẽ không bị nền đen.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    let quality = INITIAL_QUALITY;
    let blob = await canvasToBlob(canvas, quality);

    while (blob.size > TARGET_BYTES && quality > MIN_QUALITY) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, quality);
    }

    // Nếu nén xong vẫn to hơn bản gốc thì giữ bản gốc.
    return blob.size < file.size ? blob : file;
  } catch (error) {
    console.warn('Không nén được ảnh, dùng file gốc:', error);
    return file;
  }
}

function buildStoragePath(ownerId: string, file: File): string {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .slice(0, 40) || 'image';

  return `cars/${ownerId}/${unique}-${safeName}.jpg`;
}

/**
 * Nén rồi tải một ảnh lên Cloud Storage.
 *
 * @param ownerId Thư mục nhóm ảnh — id xe, hoặc id bản nháp khi thêm xe mới.
 * @param onProgress Nhận tiến độ 0-100.
 * @returns URL tải về, dùng làm giá trị cho `Car.image` / `Car.images`.
 */
export async function uploadCarImage(
  file: File,
  ownerId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new ImageUploadError(validationError);
  }

  // Kiểm tra sớm: storage.rules yêu cầu request.auth != null. Không có phiên
  // Firebase Auth thì báo ngay thay vì để người dùng chờ hết tiến trình nén
  // và tải rồi mới nhận một lỗi khó hiểu.
  if (!auth.currentUser) {
    throw new ImageUploadError(
      'Chưa có phiên đăng nhập Firebase Auth nên không thể tải ảnh lên. ' +
        'Vui lòng đăng xuất và đăng nhập lại bằng tài khoản Firebase thật.'
    );
  }

  const blob = await compressImage(file);
  const path = buildStoragePath(ownerId, file);
  const fileRef = storageRef(storage, path);

  const task = uploadBytesResumable(fileRef, blob, {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000',
  });

  return new Promise<string>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          onProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        }
      },
      (error) => {
        console.error('Lỗi tải ảnh lên Storage:', error);
        reject(new ImageUploadError(describeStorageError(error, file.name), error));
      },
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (error) {
          reject(
            new ImageUploadError('Tải ảnh xong nhưng không lấy được đường dẫn.', error)
          );
        }
      }
    );
  });
}

/**
 * Xoá một ảnh khỏi Cloud Storage theo URL tải về.
 * Bỏ qua ảnh ngoài (Unsplash...) và ảnh đã bị xoá trước đó.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!isStorageUrl(url)) return;

  try {
    await deleteObject(storageRef(storage, url));
  } catch (error: any) {
    // Ảnh không còn tồn tại thì coi như đã xoá xong.
    if (error?.code === 'storage/object-not-found') return;
    console.warn('Không xoá được ảnh khỏi Storage:', url, error);
  }
}

/** Xoá nhiều ảnh cùng lúc; một ảnh lỗi không chặn các ảnh còn lại. */
export async function deleteImagesByUrls(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.filter(isStorageUrl).map(deleteImageByUrl));
}
