import { Car, CarStatus, CustomerInquiry } from '../types';

import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from '../lib/firebase';

const INQUIRIES_STORAGE_KEY = 'royaljpcar_admin_inquiries_v1';

// Helper to deduce brand from car name
export function detectCarBrand(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes('mercedes') || lower.includes('maybach')) {
    return 'Mercedes-Benz';
  }

  if (lower.includes('porsche')) {
    return 'Porsche';
  }

  if (lower.includes('rolls-royce') || lower.includes('phantom')) {
    return 'Rolls-Royce';
  }

  if (lower.includes('ferrari')) {
    return 'Ferrari';
  }

  if (lower.includes('lamborghini') || lower.includes('revuelto')) {
    return 'Lamborghini';
  }

  if (lower.includes('bentley')) {
    return 'Bentley';
  }

  if (lower.includes('lexus')) {
    return 'Lexus';
  }

  if (lower.includes('range rover') || lower.includes('land rover')) {
    return 'Range Rover';
  }

  if (lower.includes('bmw')) {
    return 'BMW';
  }

  if (lower.includes('aston martin')) {
    return 'Aston Martin';
  }

  if (lower.includes('audi')) {
    return 'Audi';
  }

  return 'Khác';
}


// =========================
// INITIAL INQUIRIES
// =========================

const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-101',
    customerName: 'Nguyễn Văn Hùng (CEO Hùng Phát Group)',
    phone: '0903 888 999',
    email: 'hung.nguyen@hungphat.vn',
    carInterest: 'Mercedes-Maybach S680 First Class',
    type: 'consultation',
    message:
      'Tôi muốn tư vấn phiên bản ngoại thất Two-tone và gói option âm thanh Burmester 4D.',
    preferredBranch: 'Tokyo Roppongi Flagship',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Khách VIP, ưu tiên gọi điện lúc 14h chiều.',
  },

  {
    id: 'inq-102',
    customerName: 'Trần Minh Đức (Kỹ sư trưởng)',
    phone: '0912 345 678',
    email: 'duc.tran@vinatech.jp',
    carInterest: 'Porsche Panamera Turbo E-Hybrid',
    type: 'test_drive',
    message:
      'Đặt lịch trải nghiệm lái thử tại Showroom Yokohama cuối tuần này.',
    preferredBranch: 'Yokohama Service & Delivery Hub',
    status: 'appointment',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Đã xác nhận lịch hẹn 10:00 sáng Thứ Bảy.',
  },

  {
    id: 'inq-103',
    customerName: 'Bà Lê Thúy Hằng',
    phone: '0988 777 666',
    email: 'thuyhang.le@investcorp.com',
    carInterest: 'Range Rover SV Autobiography LWB',
    type: 'deposit',
    message:
      'Đã thảo luận sơ bộ về thủ tục hải quan chuyển xe về TP.HCM.',
    preferredBranch: 'Tokyo Roppongi Flagship',
    status: 'contacted',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Đang chuẩn bị hợp đồng đặt cọc giữ xe 15 ngày.',
  },

  {
    id: 'inq-104',
    customerName: 'Takeshi Sato',
    phone: '080-1234-5678',
    email: 'sato.t@executive-japan.co.jp',
    carInterest: 'Lexus LM 500h 4 Chỗ Hoàng Gia',
    type: 'custom_order',
    message:
      '希望定制隔音玻璃及专属香氛系统，请发送最新配置清单。',
    preferredBranch: 'Osaka Umeda Premium Lounge',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    notes: 'Đã hoàn tất ký hợp đồng bàn giao tháng tới.',
  },
];


// =========================
// CARS STORAGE SERVICE
// =========================

export const CarsStorageService = {

  // =========================
  // GET ALL CARS FROM FIREBASE
  // =========================

  async getCars(): Promise<Car[]> {
    try {
      const carsRef = collection(db, 'cars');

      const snapshot = await getDocs(carsRef);

      if (snapshot.empty) {
        console.log('Firebase chưa có xe.');
        return [];
      }

      return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Car[];

    } catch (error) {
      console.error(
        'Lỗi lấy dữ liệu xe từ Firebase:',
        error
      );

      return [];
    }
  },


  // =========================
  // GET ONE CAR
  // =========================

  async getCarById(
    id: string
  ): Promise<Car | undefined> {

    try {
      const carRef = doc(db, 'cars', id);

      const snapshot = await getDoc(carRef);

      if (!snapshot.exists()) {
        return undefined;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Car;

    } catch (error) {
      console.error(
        'Lỗi lấy thông tin xe:',
        error
      );

      return undefined;
    }
  },


  // =========================
  // CREATE OR UPDATE CAR
  // =========================

  async saveCar(
    carData: Partial<Car>
  ): Promise<Car> {

    const now = new Date().toISOString();


    // =========================
    // UPDATE EXISTING CAR
    // =========================

    if (carData.id) {

      const carRef = doc(
        db,
        'cars',
        carData.id
      );

      const existingSnapshot =
        await getDoc(carRef);

      if (existingSnapshot.exists()) {

        const existingCar =
          existingSnapshot.data() as Car;

        const updatedCar: Car = {
          ...existingCar,
          ...carData,

          id: carData.id,

          brand:
            carData.brand ||
            detectCarBrand(
              carData.name ||
              existingCar.name
            ),

          updatedAt: now,
        };


        await setDoc(
          carRef,
          updatedCar
        );


        this.notifyChange();

        return updatedCar;
      }
    }


    // =========================
    // CREATE NEW CAR
    // =========================

    const newId =
      `royal-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;


    const brand =
      carData.brand ||
      detectCarBrand(
        carData.name || ''
      );


    let priceStr =
      carData.price || '¥0';


    const rawPrice =
      carData.priceRaw || 0;


    if (
      rawPrice &&
      !carData.price
    ) {
      priceStr =
        `¥${rawPrice.toLocaleString()}`;
    }


    const defaultImage =
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop';


    const newCar: Car = {

      id: newId,


      name:
        carData.name ||
        'Mẫu Xe Sang Chưa Đặt Tên',


      nameJa:
        carData.nameJa ||
        carData.name ||
        '',


      brand,


      category:
        carData.category ||
        'sedan',


      categoryLabel:
        carData.categoryLabel ||
        (
          carData.category
            ? carData.category.toUpperCase()
            : 'SEDAN'
        ),


      categoryLabelJa:
        carData.categoryLabelJa ||
        'セダン',


      price:
        priceStr,


      priceRaw:
        rawPrice,


      image:
        carData.image ||
        (
          carData.images &&
          carData.images[0]
        ) ||
        defaultImage,


      images:

        carData.images &&
        carData.images.length > 0

          ? carData.images

          : [
              carData.image ||
              defaultImage
            ],


      engine:
        carData.engine ||
        'V8 BiTurbo',


      horsepower:
        carData.horsepower ||
        '500 HP',


      acceleration:
        carData.acceleration ||
        '3.8s',


      topSpeed:
        carData.topSpeed ||
        '250 km/h',


      transmission:
        carData.transmission ||
        'Tự động 8 cấp',


      fuelType:
        carData.fuelType ||
        'Xăng',


      year:
        carData.year ||
        new Date().getFullYear(),


      mileage:
        carData.mileage ||
        'Mới 100%',


      status:
        carData.status ||
        'available',


      colorName:
        carData.colorName ||
        'Tiêu chuẩn',


      tag:
        carData.tag ||
        'Mới Nhập Khẩu',


      tagJa:
        carData.tagJa ||
        '新着直輸入車',


      tagType:
        carData.tagType ||
        'gold',


      description:
        carData.description ||
        'Tuyệt tác xe sang nhập khẩu nguyên chiếc từ thị trường Châu Âu / Nhật Bản.',


      descriptionJa:
        carData.descriptionJa ||
        '欧州・日本市場より直輸入された極上のプレミアムモデル。',


      colors:

        carData.colors ||

        [
          {
            name:
              carData.colorName ||
              'Standard',

            hex:
              '#17212B',
          },
        ],


      features:

        carData.features &&
        carData.features.length > 0

          ? carData.features

          : [

              'Bảo hành 3 năm chính hãng',

              'Kiểm định 120 hạng mục tiêu chuẩn Đức',

              'Nội thất bọc da Nappa cao cấp',

              'Hệ thống âm thanh vòm đỉnh cao',

            ],


      createdAt:
        now,


      updatedAt:
        now,
    };


    // =========================
    // SAVE TO FIREBASE
    // =========================

    await setDoc(
      doc(
        db,
        'cars',
        newCar.id
      ),

      newCar
    );


    this.notifyChange();


    return newCar;
  },


  // =========================
  // DELETE CAR
  // =========================

  async deleteCar(
    id: string
  ): Promise<boolean> {

    try {

      await deleteDoc(
        doc(
          db,
          'cars',
          id
        )
      );


      this.notifyChange();


      return true;

    } catch (error) {

      console.error(
        'Lỗi xóa xe khỏi Firebase:',
        error
      );


      return false;
    }
  },


  // =========================
  // UPDATE CAR STATUS
  // =========================

  async updateCarStatus(
    id: string,
    status: CarStatus
  ): Promise<boolean> {

    try {

      const carRef =
        doc(
          db,
          'cars',
          id
        );


      await updateDoc(
        carRef,
        {
          status,

          updatedAt:
            new Date().toISOString(),
        }
      );


      this.notifyChange();


      return true;

    } catch (error) {

      console.error(
        'Lỗi cập nhật trạng thái xe:',
        error
      );


      return false;
    }
  },


  // =========================
  // NOTIFY REACT COMPONENTS
  // =========================

  notifyChange() {

    if (
      typeof window !==
      'undefined'
    ) {

      window.dispatchEvent(

        new CustomEvent(
          'royaljpcar-cars-updated'
        )
      );
    }
  },


  // =========================
  // INQUIRIES
  // =========================

  getInquiries(): CustomerInquiry[] {

    try {

      const stored =
        localStorage.getItem(
          INQUIRIES_STORAGE_KEY
        );


      if (!stored) {

        localStorage.setItem(

          INQUIRIES_STORAGE_KEY,

          JSON.stringify(
            INITIAL_INQUIRIES
          )
        );


        return INITIAL_INQUIRIES;
      }


      return JSON.parse(
        stored
      );

    } catch {

      return INITIAL_INQUIRIES;
    }
  },


  // =========================
  // UPDATE INQUIRY STATUS
  // =========================

  updateInquiryStatus(

    id: string,

    status:
      CustomerInquiry['status'],

    notes?: string

  ): boolean {

    const inqs =
      this.getInquiries();


    const item =
      inqs.find(
        (i) =>
          i.id === id
      );


    if (item) {

      item.status =
        status;


      if (
        notes !== undefined
      ) {

        item.notes =
          notes;
      }


      localStorage.setItem(

        INQUIRIES_STORAGE_KEY,

        JSON.stringify(
          inqs
        )
      );


      window.dispatchEvent(

        new CustomEvent(
          'royaljpcar-inquiries-updated'
        )
      );


      return true;
    }


    return false;
  },


  // =========================
  // DELETE INQUIRY
  // =========================

  deleteInquiry(
    id: string
  ): boolean {

    const inqs =
      this.getInquiries();


    const filtered =
      inqs.filter(
        (i) =>
          i.id !== id
      );


    if (
      filtered.length !==
      inqs.length
    ) {

      localStorage.setItem(

        INQUIRIES_STORAGE_KEY,

        JSON.stringify(
          filtered
        )
      );


      window.dispatchEvent(

        new CustomEvent(
          'royaljpcar-inquiries-updated'
        )
      );


      return true;
    }


    return false;
  },
};