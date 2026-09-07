export type CarCategory = 'all' | 'sedan' | 'suv' | 'mpv' | 'hatchback' | 'pickup';

export type CarStatus = 'available' | 'reserved' | 'sold';

export interface CarColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Car {
  id: string;
  name: string;
  nameJa?: string;
  brand?: string;
  category: Exclude<CarCategory, 'all'>;
  categoryLabel: string;
  categoryLabelJa?: string;
  price: string;
  priceJa?: string;
  priceRaw: number;
  image: string;
  images?: string[];
  engine: string;
  engineJa?: string;
  horsepower: string;
  acceleration: string;
  topSpeed: string;
  transmission: string;
  transmissionJa?: string;
  fuelType: string;
  fuelTypeJa?: string;
  year: number;
  mileage?: string | number;
  status?: CarStatus;
  colorName?: string;
  tag?: string;
  tagJa?: string;
  tagType?: 'gold' | 'navy' | 'silver';
  description: string;
  descriptionJa?: string;
  colors?: CarColor[];
  features: string[];
  featuresJa?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type AdminTab = 'overview' | 'cars' | 'add-car' | 'customers' | 'settings';

export type StaffRole = 
  | 'Super Admin' 
  | 'Quản lý Showroom' 
  | 'Nhân viên kinh doanh' 
  | 'Nhân viên kho xe';

export type StaffStatus = 'active' | 'suspended' | 'resigned';

export type ShowroomBranch = 'Tokyo Roppongi' | 'Yokohama' | 'Osaka' | 'ROYAL JPcar';

export interface StaffPermissions {
  // QUẢN LÝ XE
  cars_view: boolean;
  cars_add: boolean;
  cars_edit: boolean;
  cars_delete: boolean;
  cars_change_price: boolean;
  cars_change_status: boolean;
  // QUẢN LÝ KHÁCH HÀNG
  customers_view: boolean;
  customers_edit: boolean;
  customers_delete: boolean;
  customers_view_contact: boolean;
  // QUẢN LÝ NHÂN VIÊN
  staff_view: boolean;
  staff_add: boolean;
  staff_edit: boolean;
  staff_lock: boolean;
  staff_delete: boolean;
  // HỆ THỐNG
  system_view_dashboard: boolean;
  system_edit_settings: boolean;
  system_change_exchange_rate: boolean;
  system_reset_data: boolean;
}

export interface StaffAccount {
  id: string; // Document ID / Firebase UID
  fullName: string;
  username: string;
  email: string;
  phone: string;
  position: string;
  branch: ShowroomBranch;
  role: StaffRole;
  status: StaffStatus;
  permissions: StaffPermissions;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  invitedAt?: string;
  // Firebase Authentication & Firestore metadata structure
  firebaseUid?: string;
  authProvider?: 'firebase_auth' | 'internal';
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Sales Director' | StaffRole;
  avatarUrl?: string;
  lastLogin?: string;
  phone?: string;
  branch?: ShowroomBranch;
  permissions?: StaffPermissions;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  carInterest: string;
  carId?: string;
  type: 'consultation' | 'test_drive' | 'deposit' | 'custom_order';
  message: string;
  preferredBranch: string;
  status: 'new' | 'contacted' | 'appointment' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleJa?: string;
  category: string;
  categoryJa?: string;
  date: string;
  dateJa?: string;
  image: string;
  readTime: string;
  readTimeJa?: string;
  summary: string;
  summaryJa?: string;
}

export interface FeatureBenefit {
  number: string;
  title: string;
  titleJa?: string;
  description: string;
  descriptionJa?: string;
  badge: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  tier: 'Diamond' | 'Gold' | 'Silver';
  membershipId: string;
  points: number;
  joinedDate: string;
  currentCar?: string;
  city?: string;
  address?: string;
  avatarUrl?: string;
  authProvider?: 'local' | 'google';
}

export interface UserBooking {
  id: string;
  type: 'showroom_visit' | 'maintenance' | 'appraisal' | 'consultation';
  typeLabel: string;
  title: string;
  date: string;
  time: string;
  location: string;
  carModel?: string;
  status: 'confirmed' | 'pending' | 'completed';
  notes?: string;
}
