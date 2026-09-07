import { auth, db, collection, getDocs } from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  isUploadConfigured,
  describeUploadConfig,
} from '../services/imageUploadService';

/**
 * CÔNG CỤ CHẨN ĐOÁN FIREBASE (chỉ chạy ở môi trường dev)
 *
 * Dự án dùng Firebase modular SDK nên KHÔNG có biến toàn cục `firebase`.
 * Module này gắn `window.royalDebug` để kiểm tra nhanh trong DevTools Console:
 *
 *   await royalDebug.check()
 *
 * Kiểm tra 3 điều kiện cần để admin hoạt động đầy đủ:
 *   1. Có phiên Firebase Auth thật hay không
 *   2. Firestore đọc được dữ liệu xe chưa
 *   3. Dịch vụ lưu ảnh (Cloudinary) đã cấu hình chưa
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

async function checkImageUpload(): Promise<CheckResult> {
  if (!isUploadConfigured()) {
    return {
      ok: false,
      label: 'Dịch vụ lưu ảnh (Cloudinary)',
      detail:
        describeUploadConfig() +
        ' Tạo tài khoản tại cloudinary.com, thêm một Upload preset với ' +
        'Signing Mode = Unsigned, rồi đặt hai biến môi trường đó (file .env ở ' +
        'local, Environment Variables trên Vercel) và khởi động lại.',
    };
  }

  return {
    ok: true,
    label: 'Dịch vụ lưu ảnh (Cloudinary)',
    detail: `Đã cấu hình: ${describeUploadConfig()}`,
  };
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
  line(await checkImageUpload());

  console.log('\nCần cả 3 dấu ✅ thì chức năng upload ảnh mới chạy được.');
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).royalDebug = { check, auth, db, config: firebaseConfig };
  console.info(
    '[royalJPcar] Công cụ chẩn đoán đã sẵn sàng. Gõ trong Console:  await royalDebug.check()'
  );
}

export { check };
