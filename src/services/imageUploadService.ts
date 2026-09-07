/**
 * DỊCH VỤ ẢNH XE — Cloudinary (unsigned upload)
 *
 * Firestore giới hạn 1MB cho mỗi document, nên ảnh KHÔNG được nhúng dưới dạng
 * base64 vào bản ghi xe (một tấm ảnh điện thoại đã vượt giới hạn).
 * Ảnh được nén ở trình duyệt rồi tải lên Cloudinary; Firestore chỉ lưu URL.
 *
 * Vì sao Cloudinary mà không phải Firebase Storage: từ cuối 2024 Firebase bắt
 * buộc gói Blaze (phải gắn thẻ thanh toán) mới tạo được Storage bucket.
 * Cloudinary cho upload thẳng từ trình duyệt qua "unsigned upload preset",
 * không cần backend và không cần thẻ.
 *
 * CẤU HÌNH (xem .env.example):
 *   VITE_CLOUDINARY_CLOUD_NAME     — tên cloud, lấy ở Dashboard
 *   VITE_CLOUDINARY_UPLOAD_PRESET  — tên preset, phải đặt Signing Mode = Unsigned
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

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export class ImageUploadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

/** Cấu hình Cloudinary đã có đủ chưa. */
export function isUploadConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

/** Mô tả tình trạng cấu hình, dùng cho công cụ chẩn đoán. */
export function describeUploadConfig(): string {
  if (!CLOUD_NAME && !UPLOAD_PRESET) {
    return 'Chưa cấu hình VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET.';
  }
  if (!CLOUD_NAME) return 'Thiếu VITE_CLOUDINARY_CLOUD_NAME.';
  if (!UPLOAD_PRESET) return 'Thiếu VITE_CLOUDINARY_UPLOAD_PRESET.';
  return `cloud="${CLOUD_NAME}", preset="${UPLOAD_PRESET}"`;
}

/** URL trỏ tới Cloudinary (ảnh do ta quản lý). */
export function isCloudinaryUrl(url: string): boolean {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
}

/**
 * Ảnh nằm trên kho lưu trữ của chúng ta (không phải link ngoài như Unsplash).
 * Giữ tên cũ để các module khác không phải đổi theo.
 */
export function isStorageUrl(url: string): boolean {
  return isCloudinaryUrl(url);
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
 * không giải mã được (ví dụ HEIC) — Cloudinary vẫn nhận, chỉ là không tối ưu.
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

/**
 * Token xoá do Cloudinary trả về khi upload unsigned.
 *
 * Đây là cách DUY NHẤT xoá được ảnh mà không cần API secret (tức không cần
 * backend). Token chỉ sống 10 phút, nên chỉ dùng được cho tình huống người
 * dùng vừa tải ảnh lên rồi đổi ý gỡ ra ngay trong lúc điền form.
 */
const deleteTokens = new Map<string, string>();

type CloudinaryResponse = {
  secure_url?: string;
  url?: string;
  delete_token?: string;
  error?: { message?: string };
};

function describeUploadError(status: number, body: string, fileName: string): string {
  let serverMessage = '';
  try {
    serverMessage = (JSON.parse(body) as CloudinaryResponse).error?.message || '';
  } catch {
    serverMessage = '';
  }

  if (status === 400 && /preset/i.test(serverMessage)) {
    return (
      `Upload preset không hợp lệ. Kiểm tra VITE_CLOUDINARY_UPLOAD_PRESET và ` +
      `đảm bảo preset đó đang để Signing Mode = Unsigned. (${serverMessage})`
    );
  }

  if (status === 401 || status === 403) {
    return (
      `Cloudinary từ chối yêu cầu. Preset nhiều khả năng đang để chế độ Signed ` +
      `thay vì Unsigned. (${serverMessage || status})`
    );
  }

  if (status === 404) {
    return `Không tìm thấy cloud "${CLOUD_NAME}". Kiểm tra lại VITE_CLOUDINARY_CLOUD_NAME.`;
  }

  if (status === 420 || status === 429) {
    return 'Đã vượt hạn mức Cloudinary. Vui lòng thử lại sau.';
  }

  return `Không tải được ảnh "${fileName}" lên Cloudinary${
    serverMessage ? `: ${serverMessage}` : ` (HTTP ${status})`
  }.`;
}

/**
 * Nén rồi tải một ảnh lên Cloudinary.
 *
 * Dùng XMLHttpRequest thay vì fetch vì chỉ XHR mới báo được tiến độ upload.
 *
 * @param ownerId Thư mục nhóm ảnh — id xe, hoặc id bản nháp khi thêm xe mới.
 * @param onProgress Nhận tiến độ 0-100.
 * @returns URL ảnh, dùng làm giá trị cho `Car.image` / `Car.images`.
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

  if (!isUploadConfigured()) {
    throw new ImageUploadError(
      'Chưa cấu hình dịch vụ lưu ảnh. Cần đặt VITE_CLOUDINARY_CLOUD_NAME và ' +
        'VITE_CLOUDINARY_UPLOAD_PRESET trong biến môi trường rồi khởi động lại.'
    );
  }

  const blob = await compressImage(file);

  const form = new FormData();
  form.append('file', blob);
  form.append('upload_preset', UPLOAD_PRESET as string);
  form.append('folder', `royaljpcar/cars/${ownerId}`);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onerror = () =>
      reject(
        new ImageUploadError(
          `Mất kết nối khi tải ảnh "${file.name}". Kiểm tra mạng rồi thử lại.`
        )
      );

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(
          new ImageUploadError(describeUploadError(xhr.status, xhr.responseText, file.name))
        );
        return;
      }

      try {
        const data = JSON.parse(xhr.responseText) as CloudinaryResponse;
        const url = data.secure_url || data.url;

        if (!url) {
          reject(new ImageUploadError('Cloudinary không trả về đường dẫn ảnh.'));
          return;
        }

        if (data.delete_token) {
          deleteTokens.set(url, data.delete_token);
        }

        resolve(url);
      } catch (error) {
        reject(new ImageUploadError('Không đọc được phản hồi từ Cloudinary.', error));
      }
    };

    xhr.send(form);
  });
}

/**
 * Xoá một ảnh vừa tải lên trong phiên hiện tại.
 *
 * GIỚI HẠN: upload unsigned chỉ xoá được bằng `delete_token` mà Cloudinary trả
 * về ngay lúc tải lên, và token hết hạn sau 10 phút. Ảnh của xe đã lưu từ
 * trước KHÔNG xoá được từ trình duyệt — muốn vậy phải có route backend ký bằng
 * API secret. Hàm này im lặng bỏ qua những trường hợp đó.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  const token = deleteTokens.get(url);
  if (!token || !CLOUD_NAME) return;

  try {
    const form = new FormData();
    form.append('token', token);

    await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`, {
      method: 'POST',
      body: form,
    });
  } catch (error) {
    console.warn('Không xoá được ảnh khỏi Cloudinary:', url, error);
  } finally {
    deleteTokens.delete(url);
  }
}

/**
 * Xoá nhiều ảnh cùng lúc; một ảnh lỗi không chặn các ảnh còn lại.
 *
 * Cùng giới hạn như {@link deleteImageByUrl}: chỉ có tác dụng với ảnh vừa tải
 * lên trong 10 phút gần nhất. Ảnh của xe bị xoá sẽ nằm lại trên Cloudinary.
 */
export async function deleteImagesByUrls(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.filter(isCloudinaryUrl).map(deleteImageByUrl));
}
