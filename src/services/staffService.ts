import { StaffAccount, StaffPermissions, StaffRole, ShowroomBranch, StaffStatus } from '../types';

const STAFF_STORAGE_KEY = 'royaljpcar_staff_accounts_v1';

/**
 * DEFAULT PERMISSION PRESETS ACCORDING TO SPECIFICATIONS:
 * 1. Super Admin: Toàn bộ quyền quản lý hệ thống
 * 2. Quản lý Showroom:
 *    - Có: Xem Dashboard, Thêm xe, Sửa xe, Quản lý KH, Xem thông tin liên hệ, Xem xe, Sửa giá, Cập nhật trạng thái, Xem NV
 *    - Không: Xóa tài khoản NV, Quản lý Super Admin, Thay đổi cài đặt HT quan trọng (Cài đặt, Tỷ giá, Reset dữ liệu)
 * 3. Nhân viên kinh doanh:
 *    - Có: Xem DS xe, Cập nhật trạng thái xe, Quản lý KH (Xem, Sửa, Xem liên hệ)
 *    - Không: Xóa xe, Thêm/sửa/xóa nhân viên, Thay đổi cài đặt hệ thống, Thêm/sửa xe, Sửa giá xe
 * 4. Nhân viên kho xe:
 *    - Có: Xem xe, Thêm xe, Sửa thông tin xe, Cập nhật trạng thái xe
 *    - Không: Quản lý KH, Quản lý nhân viên, Cài đặt hệ thống
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, StaffPermissions> = {
  'Super Admin': {
    cars_view: true,
    cars_add: true,
    cars_edit: true,
    cars_delete: true,
    cars_change_price: true,
    cars_change_status: true,
    customers_view: true,
    customers_edit: true,
    customers_delete: true,
    customers_view_contact: true,
    staff_view: true,
    staff_add: true,
    staff_edit: true,
    staff_lock: true,
    staff_delete: true,
    system_view_dashboard: true,
    system_edit_settings: true,
    system_change_exchange_rate: true,
    system_reset_data: true,
  },
  'Quản lý Showroom': {
    cars_view: true,
    cars_add: true,
    cars_edit: true,
    cars_delete: false,
    cars_change_price: true,
    cars_change_status: true,
    customers_view: true,
    customers_edit: true,
    customers_delete: false,
    customers_view_contact: true,
    staff_view: true,
    staff_add: false,
    staff_edit: false,
    staff_lock: false,
    staff_delete: false,
    system_view_dashboard: true,
    system_edit_settings: false,
    system_change_exchange_rate: false,
    system_reset_data: false,
  },
  'Nhân viên kinh doanh': {
    cars_view: true,
    cars_add: false,
    cars_edit: false,
    cars_delete: false,
    cars_change_price: false,
    cars_change_status: true,
    customers_view: true,
    customers_edit: true,
    customers_delete: false,
    customers_view_contact: true,
    staff_view: false,
    staff_add: false,
    staff_edit: false,
    staff_lock: false,
    staff_delete: false,
    system_view_dashboard: false,
    system_edit_settings: false,
    system_change_exchange_rate: false,
    system_reset_data: false,
  },
  'Nhân viên kho xe': {
    cars_view: true,
    cars_add: true,
    cars_edit: true,
    cars_delete: false,
    cars_change_price: false,
    cars_change_status: true,
    customers_view: false,
    customers_edit: false,
    customers_delete: false,
    customers_view_contact: false,
    staff_view: false,
    staff_add: false,
    staff_edit: false,
    staff_lock: false,
    staff_delete: false,
    system_view_dashboard: false,
    system_edit_settings: false,
    system_change_exchange_rate: false,
    system_reset_data: false,
  },
};

/**
 * INITIAL ROYAL JPCAR LUXURY STAFF DATA
 * Compatible with Firebase Firestore Collection "staff_accounts"
 */
export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-admin-001',
    fullName: 'Nguyễn Thành Trung',
    username: 'admin',
    email: 'director@royaljpcar.com',
    phone: '+81 90 8888 9999',
    position: 'Tổng Giám Đốc Điều Hành (Super Admin)',
    branch: 'Tokyo Roppongi',
    role: 'Super Admin',
    status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS['Super Admin'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    lastLogin: new Date().toISOString(),
    createdAt: '2025-01-10T08:00:00.000Z',
    firebaseUid: 'usr_fb_admin_001',
    authProvider: 'firebase_auth',
  },
  {
    id: 'staff-002',
    fullName: 'Kenji Takahashi',
    username: 'kenji.takahashi',
    email: 'k.takahashi@royaljpcar.jp',
    phone: '+81 80 1234 5678',
    position: 'Giám Đốc Chi Nhánh Roppongi',
    branch: 'Tokyo Roppongi',
    role: 'Quản lý Showroom',
    status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS['Quản lý Showroom'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    lastLogin: '2026-09-05T18:40:00.000Z',
    createdAt: '2025-02-15T09:30:00.000Z',
    firebaseUid: 'usr_fb_kenji_002',
    authProvider: 'firebase_auth',
  },
  {
    id: 'staff-003',
    fullName: 'Trần Minh Quân',
    username: 'quan.tran',
    email: 'quan.tm@royaljpcar.com',
    phone: '0912 345 678',
    position: 'Chuyên Viên Tư Vấn Siêu Xe VIP',
    branch: 'Osaka',
    role: 'Nhân viên kinh doanh',
    status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS['Nhân viên kinh doanh'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    lastLogin: '2026-09-06T09:15:00.000Z',
    createdAt: '2025-03-01T10:00:00.000Z',
    firebaseUid: 'usr_fb_quan_003',
    authProvider: 'firebase_auth',
  },
  {
    id: 'staff-004',
    fullName: 'Daiki Sato',
    username: 'daiki.sato',
    email: 'sato.daiki@royaljpcar.jp',
    phone: '+81 70 9876 5432',
    position: 'Kỹ Thuật Trưởng & Quản Lý Kho Xe',
    branch: 'Tokyo Roppongi',
    role: 'Nhân viên kho xe',
    status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS['Nhân viên kho xe'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
    lastLogin: '2026-09-04T15:20:00.000Z',
    createdAt: '2025-03-12T11:00:00.000Z',
    firebaseUid: 'usr_fb_sato_004',
    authProvider: 'firebase_auth',
  },
  {
    id: 'staff-005',
    fullName: 'Vũ Hoàng Yến',
    username: 'yen.vu',
    email: 'yen.vh@royaljpcar.com',
    phone: '0988 777 666',
    position: 'Chuyên Viên Kinh Doanh Xe Sang',
    branch: 'Yokohama',
    role: 'Nhân viên kinh doanh',
    status: 'suspended',
    permissions: DEFAULT_ROLE_PERMISSIONS['Nhân viên kinh doanh'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    lastLogin: '2026-08-20T11:10:00.000Z',
    createdAt: '2025-04-05T14:30:00.000Z',
    firebaseUid: 'usr_fb_yen_005',
    authProvider: 'firebase_auth',
  },
];

/**
 * Staff Storage & Firebase Firestore Data Service
 * - Manages staff accounts in Firestore schema
 * - Ready for Firebase Authentication & Firestore SDK
 * - Synchronizes with client storage and dispatches custom updates
 */
export class StaffStorageService {
  private static notifyUpdates() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royaljpcar-staff-updated'));
    }
  }

  /**
   * Generates clean username from Vietnamese or Japanese Full Name
   */
  public static generateUsername(fullName: string): string {
    const clean = fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/);
    
    if (clean.length === 1) return clean[0] || `staff_${Math.floor(Math.random() * 1000)}`;
    const lastName = clean[clean.length - 1];
    const firstInitials = clean.slice(0, -1).map(part => part[0]).join('');
    return `${lastName}.${firstInitials}`;
  }

  /**
   * Get all staff accounts
   */
  public static getStaffList(): StaffAccount[] {
    try {
      const data = localStorage.getItem(STAFF_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    // Initialize default staff
    try {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF_ACCOUNTS));
    } catch {
      // ignore
    }
    return INITIAL_STAFF_ACCOUNTS;
  }

  /**
   * Save staff list
   */
  public static saveAll(staffList: StaffAccount[]): void {
    try {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
      this.notifyUpdates();
    } catch (e) {
      console.error('Failed to save staff list', e);
    }
  }

  /**
   * Get single staff by ID
   */
  public static getStaffById(id: string): StaffAccount | undefined {
    const list = this.getStaffList();
    return list.find(s => s.id === id);
  }

  /**
   * Add a new staff account
   */
  public static addStaff(data: {
    fullName: string;
    username?: string;
    email: string;
    phone: string;
    position: string;
    branch: ShowroomBranch;
    role: StaffRole;
    avatarUrl?: string;
  }): StaffAccount {
    const list = this.getStaffList();
    const username = data.username?.trim() || this.generateUsername(data.fullName);
    
    // Ensure unique username
    let finalUsername = username;
    let counter = 1;
    while (list.some(s => s.username.toLowerCase() === finalUsername.toLowerCase())) {
      finalUsername = `${username}${counter}`;
      counter++;
    }

    const newStaff: StaffAccount = {
      id: `staff-${Date.now()}`,
      fullName: data.fullName.trim(),
      username: finalUsername,
      email: data.email.trim(),
      phone: data.phone.trim(),
      position: data.position.trim(),
      branch: data.branch,
      role: data.role,
      status: 'active',
      permissions: { ...DEFAULT_ROLE_PERMISSIONS[data.role] },
      avatarUrl: data.avatarUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
      lastLogin: undefined,
      firebaseUid: `usr_fb_${Date.now()}`,
      authProvider: 'firebase_auth',
    };

    list.unshift(newStaff);
    this.saveAll(list);
    return newStaff;
  }

  /**
   * Update existing staff information
   */
  public static updateStaff(id: string, updates: Partial<StaffAccount>): StaffAccount | null {
    const list = this.getStaffList();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return null;

    const current = list[index];
    // If role changed and permissions not explicitly provided, update permissions to role default
    let newPermissions = current.permissions;
    if (updates.role && updates.role !== current.role && !updates.permissions) {
      newPermissions = { ...DEFAULT_ROLE_PERMISSIONS[updates.role] };
    } else if (updates.permissions) {
      newPermissions = updates.permissions;
    }

    const updated: StaffAccount = {
      ...current,
      ...updates,
      permissions: newPermissions,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveAll(list);
    return updated;
  }

  /**
   * Update specific permissions for a staff member
   */
  public static updatePermissions(id: string, permissions: StaffPermissions): boolean {
    const list = this.getStaffList();
    const staff = list.find(s => s.id === id);
    if (!staff) return false;

    staff.permissions = { ...permissions };
    staff.updatedAt = new Date().toISOString();
    this.saveAll(list);
    return true;
  }

  /**
   * Toggle lock/unlock status of a staff member
   */
  public static toggleLock(id: string, currentAdminUsername?: string): { success: boolean; staff?: StaffAccount; error?: string } {
    const list = this.getStaffList();
    const staff = list.find(s => s.id === id);
    if (!staff) return { success: false, error: 'Không tìm thấy tài khoản.' };

    // GUARD: Do not allow locking the current logged in Super Admin
    if (currentAdminUsername && staff.username.toLowerCase() === currentAdminUsername.toLowerCase()) {
      return { success: false, error: 'Không thể khóa tài khoản Super Admin đang đăng nhập hệ thống.' };
    }

    // Toggle: if active -> suspended, if suspended -> active, if resigned -> active
    staff.status = staff.status === 'suspended' ? 'active' : 'suspended';
    staff.updatedAt = new Date().toISOString();
    this.saveAll(list);
    return { success: true, staff };
  }

  /**
   * Delete staff member
   */
  public static deleteStaff(id: string, currentAdminUsername?: string): { success: boolean; error?: string } {
    const list = this.getStaffList();
    const staff = list.find(s => s.id === id);
    if (!staff) return { success: false, error: 'Không tìm thấy tài khoản.' };

    // GUARD: Do not allow deleting the current logged in Super Admin
    if (currentAdminUsername && staff.username.toLowerCase() === currentAdminUsername.toLowerCase()) {
      return { success: false, error: 'Không thể xóa tài khoản Super Admin đang đăng nhập hệ thống.' };
    }

    const filtered = list.filter(s => s.id !== id);
    this.saveAll(filtered);
    return { success: true };
  }

  /**
   * Invite a new staff member
   * - Creates account ready for Firebase Auth
   * - Securely returns username & portal URL, NO plain password
   */
  public static inviteStaff(data: {
    fullName: string;
    email: string;
    position: string;
    branch: ShowroomBranch;
    role: StaffRole;
  }): { success: boolean; username: string; account: StaffAccount } {
    const account = this.addStaff({
      fullName: data.fullName,
      email: data.email,
      phone: '',
      position: data.position,
      branch: data.branch,
      role: data.role,
    });

    account.invitedAt = new Date().toISOString();
    this.updateStaff(account.id, { invitedAt: account.invitedAt });

    return {
      success: true,
      username: account.username,
      account,
    };
  }

  /**
   * Reset staff list to default luxury demo state
   */
  public static resetToDefaults(): void {
    this.saveAll(INITIAL_STAFF_ACCOUNTS);
  }
}
