import {
  auth,
  storage,
  storageRef,
  uploadBytesResumable,
  deleteObject,
  db,
  collection,
  getDocs,
} from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';

/**
 * CÔNG CỤ CHẨN ĐOÁN FIREBASE (chỉ chạy ở môi trường dev)
 *
 * Dự án dùng Firebase modular SDK nên KHÔNG có biến toàn cục `firebase`.
 * Module này gắn `window.royalDebug` để kiểm tra nhanh trong DevTools Console:
 *
 *   await royalDebug.check()
 *
 * Kiểm tra đủ 3 điều kiện cần để upload ảnh hoạt động:
 *   1. Đã bật Cloud Storage cho dự án chưa
 *   2. storage.rules đã publish và cho phép ghi chưa
 *   3. Có phiên Firebase Auth thật hay không
 */

type CheckResult = {
  ok: boolean;
  label: string;
  detail: string;
};

function line(result: CheckResult): void {
  // Dòng thất bại in bằng console.error để vẫn hiện khi DevTools đang lọc tab
  // "Errors" — nếu không, kết quả chẩn đoán bị ẩn đúng lúc cần đọc nhất.
  const log = result.ok ? console.log : console.error;
  log(`${result.ok ? '✅' : '❌'} ${result.label}\n   ${result.detail}`);
}

async function checkAuth(): Promise<CheckResult> {
  const user = auth.currentUser;

  if (!user) {
    return {
      ok: false,
      label: 'Phiên Firebase Auth',
      detail:
        'Chưa đăng nhập bằng Firebase Auth. Nếu bạn đang thấy giao diện admin ' +
        'thì phiên đó đến từ nhánh mật khẩu dự phòng trong adminAuthService — ' +
        'nhánh này KHÔNG tạo phiên Firebase, nên mọi thao tác ghi lên Storage ' +
        'sẽ bị từ chối. Cần một tài khoản có thật trong Authentication > Users.',
    };
  }

  return {
    ok: true,
    label: 'Phiên Firebase Auth',
    detail: `Đã đăng nhập: ${user.email || '(không có email)'} — uid: ${user.uid}`,
  };
}

async function checkStorage(): Promise<CheckResult> {
  const bucket = firebaseConfig.storageBucket;
  const path = `cars/__diagnostic__/${Date.now()}.jpg`;

  if (!auth.currentUser) {
    return {
      ok: false,
      label: 'Cloud Storage (ghi thử)',
      detail: `Bỏ qua vì chưa đăng nhập. Bucket cấu hình: ${bucket}`,
    };
  }

  // Ghi thử một file rỗng rồi xoá ngay: cách duy nhất phân biệt chắc chắn
  // "chưa bật Storage" với "rules từ chối".
  const blob = new Blob([new Uint8Array([0])], { type: 'image/jpeg' });
  const fileRef = storageRef(storage, path);

  // Mặc định SDK thử lại tới 2 phút và làm ngập Console vì mỗi lần thử sinh
  // 2 dòng lỗi. Chẩn đoán thì cần biết kết quả nhanh, không cần kiên nhẫn.
  const originalRetryTime = storage.maxUploadRetryTime;
  storage.maxUploadRetryTime = 8000;

  try {
    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(fileRef, blob, { contentType: 'image/jpeg' });
      task.on('state_changed', undefined, reject, () => resolve());
    });

    await deleteObject(fileRef).catch(() => {});

    return {
      ok: true,
      label: 'Cloud Storage (ghi thử)',
      detail: `Ghi và xoá thành công trên bucket ${bucket}. Upload ảnh sẽ hoạt động.`,
    };
  } catch (error: any) {
    const code = error?.code || '(không có mã lỗi)';

    let hint = 'Xem lại cấu hình Storage của dự án.';

    if (code === 'storage/unauthorized') {
      hint =
        'Bucket TỒN TẠI nhưng rules từ chối ghi. Publish nội dung storage.rules ' +
        'trong Console > Storage > Rules.';
    } else if (code === 'storage/unknown' || code === 'storage/retry-limit-exceeded') {
      // Bucket không tồn tại thì request OPTIONS bị trả lỗi, và trình duyệt
      // báo thành "CORS policy" thay vì 404 — dễ bị hiểu nhầm thành lỗi CORS.
      hint =
        'Dự án CHƯA bật Cloud Storage (các lỗi "blocked by CORS policy" trong ' +
        'Console chính là biểu hiện của việc bucket không tồn tại, không phải ' +
        'lỗi CORS thật). Vào Console > Build > Storage > Get started để tạo bucket, ' +
        `sau đó đối chiếu tên bucket Firebase cấp với giá trị đang cấu hình: ${bucket}`;
    }

    return {
      ok: false,
      label: 'Cloud Storage (ghi thử)',
      detail: `Thất bại (${code}) trên bucket ${bucket}. ${hint}`,
    };
  } finally {
    storage.maxUploadRetryTime = originalRetryTime;
  }
}

async function checkFirestore(): Promise<CheckResult> {
  try {
    const snapshot = await getDocs(collection(db, 'cars'));
    return {
      ok: true,
      label: 'Firestore (đọc collection cars)',
      detail: `Đọc được ${snapshot.size} xe.`,
    };
  } catch (error: any) {
    return {
      ok: false,
      label: 'Firestore (đọc collection cars)',
      detail: `Thất bại (${error?.code || 'không rõ'}). Kiểm tra firestore.rules.`,
    };
  }
}

async function check(): Promise<void> {
  console.log('%c— CHẨN ĐOÁN FIREBASE —', 'font-weight:bold');
  console.log(`Dự án: ${firebaseConfig.projectId}\n`);

  line(await checkAuth());
  line(await checkFirestore());
  line(await checkStorage());

  console.log('\nCần cả 3 dấu ✅ thì chức năng upload ảnh mới chạy được.');
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).royalDebug = { check, auth, db, storage, config: firebaseConfig };
  console.info(
    '[royalJPcar] Công cụ chẩn đoán đã sẵn sàng. Gõ trong Console:  await royalDebug.check()'
  );
}

export { check };
