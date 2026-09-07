import React, { useState, useEffect, useMemo } from 'react';
import { 
  AdminUser, 
  StaffAccount, 
  StaffPermissions, 
  StaffRole, 
  ShowroomBranch, 
  StaffStatus 
} from '../../types';
import { 
  StaffStorageService, 
  DEFAULT_ROLE_PERMISSIONS 
} from '../../services/staffService';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  Unlock, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Building2, 
  Copy, 
  AlertCircle, 
  ExternalLink,
  CheckCircle2,
  Database
} from 'lucide-react';

interface AdminStaffManagementProps {
  adminUser: AdminUser;
  onShowToast?: (message: string) => void;
}

// Sample executive avatars for quick selection
const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
];

export const AdminStaffManagement: React.FC<AdminStaffManagementProps> = ({
  adminUser,
  onShowToast,
}) => {
  // Staff list state
  const [staffList, setStaffList] = useState<StaffAccount[]>(() => 
    StaffStorageService.getStaffList()
  );

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | StaffStatus>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
  const [permissionsStaff, setPermissionsStaff] = useState<StaffAccount | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffAccount | null>(null);

  // Modal forms state
  const [inviteSuccessInfo, setInviteSuccessInfo] = useState<{
    username: string;
    email: string;
    role: StaffRole;
    position: string;
    branch: ShowroomBranch;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Add staff form
  const [addForm, setAddForm] = useState({
  fullName: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  avatarUrl: SAMPLE_AVATARS[0],
  position: 'Chuyên Viên Tư Vấn Siêu Xe',
  branch: 'Tokyo Roppongi' as ShowroomBranch,
  role: 'Nhân viên kinh doanh' as StaffRole,
});

<div>
  <label className="block text-[#8C95A0] mb-1 font-semibold">
    Mật khẩu đăng nhập <span className="text-[#C8A96B]">*</span>
  </label>

  <input
    type="password"
    required
    value={addForm.password}
    onChange={(e) =>
      setAddForm({
        ...addForm,
        password: e.target.value
      })
    }
    placeholder="Nhập mật khẩu cho nhân viên"
    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
  />
</div>

  // Edit staff form
  const [editForm, setEditForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string;
    position: string;
    branch: ShowroomBranch;
    role: StaffRole;
    status: StaffStatus;
  }>({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    position: '',
    branch: 'Tokyo Roppongi',
    role: 'Nhân viên kinh doanh',
    status: 'active',
  });

  // Detailed permissions state for modal
  const [activePermissions, setActivePermissions] = useState<StaffPermissions>(
    DEFAULT_ROLE_PERMISSIONS['Nhân viên kinh doanh']
  );

  // Invite form
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    position: 'Chuyên Viên Tư Vấn Siêu Xe',
    branch: 'Tokyo Roppongi' as ShowroomBranch,
    role: 'Nhân viên kinh doanh' as StaffRole,
  });

  // Check if current user has Super Admin authority
  const isSuperAdmin = adminUser.role === 'Super Admin';

  // Listen to staff updates
  useEffect(() => {
    const handleUpdate = () => {
      setStaffList(StaffStorageService.getStaffList());
    };
    window.addEventListener('royaljpcar-staff-updated', handleUpdate);
    return () => {
      window.removeEventListener('royaljpcar-staff-updated', handleUpdate);
    };
  }, []);

  const toast = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      // Search
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        staff.fullName.toLowerCase().includes(term) ||
        staff.username.toLowerCase().includes(term) ||
        staff.email.toLowerCase().includes(term) ||
        staff.position.toLowerCase().includes(term) ||
        staff.phone.includes(term);

      // Role
      const matchRole = roleFilter === 'all' || staff.role === roleFilter;

      // Status
      const matchStatus = statusFilter === 'all' || staff.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [staffList, searchTerm, roleFilter, statusFilter]);

  // Handle Add Staff
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.fullName.trim() || !addForm.email.trim()) {
      alert('Vui lòng nhập đầy đủ họ tên và email nhân viên.');
      return;
    }

    const newStaff = StaffStorageService.addStaff({
      fullName: addForm.fullName,
      username: addForm.username || undefined,
      email: addForm.email,
      phone: addForm.phone,
      position: addForm.position,
      branch: addForm.branch,
      role: addForm.role,
      avatarUrl: addForm.avatarUrl,
    });

    toast(`Đã thêm nhân viên "${newStaff.fullName}" thành công.`);
    setIsAddModalOpen(false);
    // Reset form
    setAddForm({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      avatarUrl: SAMPLE_AVATARS[0],
      position: 'Chuyên Viên Tư Vấn Siêu Xe',
      branch: 'Tokyo Roppongi',
      role: 'Nhân viên kinh doanh',
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (staff: StaffAccount) => {
    setEditingStaff(staff);
    setEditForm({
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      avatarUrl: staff.avatarUrl || SAMPLE_AVATARS[0],
      position: staff.position,
      branch: staff.branch,
      role: staff.role,
      status: staff.status,
    });
  };

  // Submit Edit Staff
  const handleEditStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    StaffStorageService.updateStaff(editingStaff.id, {
      fullName: editForm.fullName.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      avatarUrl: editForm.avatarUrl.trim(),
      position: editForm.position.trim(),
      branch: editForm.branch,
      role: editForm.role,
      status: editForm.status,
    });

    toast(`Đã cập nhật thông tin nhân viên "${editForm.fullName}".`);
    setEditingStaff(null);
  };

  // Open Permissions Modal
  const handleOpenPermissions = (staff: StaffAccount) => {
    setPermissionsStaff(staff);
    setActivePermissions({ ...staff.permissions });
  };

  // Save Permissions
  const handleSavePermissions = () => {
    if (!permissionsStaff) return;
    StaffStorageService.updatePermissions(permissionsStaff.id, activePermissions);
    toast(`Đã cập nhật chi tiết quyền truy cập cho "${permissionsStaff.fullName}".`);
    setPermissionsStaff(null);
  };

  // Toggle permission switch
  const handleTogglePerm = (key: keyof StaffPermissions) => {
    setActivePermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Apply Role Preset to Permissions Modal
  const handleApplyRolePreset = (presetRole: StaffRole) => {
    setActivePermissions({ ...DEFAULT_ROLE_PERMISSIONS[presetRole] });
    toast(`Đã áp dụng mẫu phân quyền chuẩn của "${presetRole}".`);
  };

  // Toggle Lock/Unlock
  const handleToggleLock = (staff: StaffAccount) => {
    if (!isSuperAdmin) {
      alert('Chỉ Super Admin mới có quyền khóa/mở khóa tài khoản nhân viên.');
      return;
    }
    const res = StaffStorageService.toggleLock(staff.id, adminUser.username);
    if (!res.success) {
      alert(res.error || 'Thao tác không hợp lệ.');
      return;
    }
    toast(
      res.staff?.status === 'suspended'
        ? `Đã tạm khóa tài khoản "${staff.fullName}".`
        : `Đã mở khóa hoạt động cho "${staff.fullName}".`
    );
  };

  // Delete Staff
  const handleConfirmDelete = () => {
    if (!deletingStaff) return;
    if (!isSuperAdmin) {
      alert('Chỉ Super Admin mới có quyền xóa tài khoản nhân viên.');
      return;
    }
    const res = StaffStorageService.deleteStaff(deletingStaff.id, adminUser.username);
    if (!res.success) {
      alert(res.error || 'Không thể xóa tài khoản này.');
      return;
    }
    toast(`Đã xóa tài khoản nhân viên "${deletingStaff.fullName}".`);
    setDeletingStaff(null);
  };

  // Submit Invite Staff
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.fullName.trim() || !inviteForm.email.trim()) {
      alert('Vui lòng nhập họ tên và email nhân viên được mời.');
      return;
    }

    const result = StaffStorageService.inviteStaff({
      fullName: inviteForm.fullName,
      email: inviteForm.email,
      position: inviteForm.position,
      branch: inviteForm.branch,
      role: inviteForm.role,
    });

    setInviteSuccessInfo({
      username: result.username,
      email: inviteForm.email,
      role: inviteForm.role,
      position: inviteForm.position,
      branch: inviteForm.branch,
    });

    toast(`Đã tạo tài khoản thành công cho ${inviteForm.fullName}.`);
  };

  // Helper to copy login link
  const handleCopyLoginLink = () => {
    const loginUrl = `${window.location.origin}/quan-tri-vien`;
    navigator.clipboard.writeText(loginUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Check if staff is current logged in admin
  const isCurrentLoggedIn = (staff: StaffAccount) => {
    return staff.username.toLowerCase() === adminUser.username.toLowerCase();
  };

  // Role Badge Styling
  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-[#C8A96B]/15 text-[#E6C687] border border-[#C8A96B]/40 font-bold';
      case 'Quản lý Showroom':
        return 'bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold';
      case 'Nhân viên kinh doanh':
        return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold';
      case 'Nhân viên kho xe':
        return 'bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold';
      default:
        return 'bg-slate-500/15 text-slate-300 border border-slate-500/30';
    }
  };

  // Status Badge Styling
  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Đang hoạt động
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Tạm khóa
          </span>
        );
      case 'resigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Nghỉ việc
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[#161B22] border border-[#C8A96B]/30 shadow-2xl p-6 sm:p-8 text-white space-y-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C8A96B]/15 border border-[#C8A96B]/30 text-[#C8A96B]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#C8A96B]">
                HỆ THỐNG PHÂN QUYỀN
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                QUẢN LÝ NHÂN VIÊN
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#8C95A0] mt-1.5 max-w-xl">
            Quản lý tài khoản và quyền truy cập của đội ngũ ROYAL JPcar.
          </p>
        </div>

        {/* Action buttons on header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!isSuperAdmin}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border cursor-pointer ${
              isSuperAdmin
                ? 'bg-white/5 hover:bg-white/10 text-[#C8A96B] border-[#C8A96B]/40 shadow-sm'
                : 'opacity-50 cursor-not-allowed bg-white/5 text-slate-400 border-white/10'
            }`}
            title={!isSuperAdmin ? 'Chỉ Super Admin mới có quyền mời nhân viên' : 'Mời nhân viên mới'}
          >
            <Mail className="w-4 h-4 text-[#C8A96B]" />
            <span>Mời nhân viên</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            disabled={!isSuperAdmin}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isSuperAdmin
                ? 'bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B]'
                : 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400'
            }`}
            title={!isSuperAdmin ? 'Chỉ Super Admin mới có quyền thêm nhân viên' : 'Thêm nhân viên mới'}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Thêm nhân viên</span>
          </button>
        </div>
      </div>

      {/* Permission warning banner if not Super Admin */}
      {!isSuperAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Quý quản trị viên đang đăng nhập với vai trò <strong>{adminUser.role}</strong>. Chỉ <strong>Super Admin</strong> mới có quyền thêm, khóa, xóa tài khoản và thay đổi cấu hình quyền truy cập.
          </span>
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email hoặc chức vụ..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white placeholder-[#8C95A0] text-xs focus:outline-none focus:border-[#C8A96B] transition-colors"
          />
          <Search className="w-4 h-4 text-[#8C95A0] absolute left-3 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 p-0.5 rounded text-[#8C95A0] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C8A96B] cursor-pointer"
          >
            <option value="all">Tất cả quyền</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Quản lý Showroom">Quản lý Showroom</option>
            <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
            <option value="Nhân viên kho xe">Nhân viên kho xe</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C8A96B] cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="suspended">Tạm khóa</option>
            <option value="resigned">Nghỉ việc</option>
          </select>
        </div>
      </div>

      {/* 3. Staff Accounts Table / List */}
      <div className="relative z-10 overflow-hidden rounded-xl border border-white/10 bg-[#0D1117]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#161B22] text-[11px] uppercase tracking-wider text-[#8C95A0] border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-bold">Nhân Viên</th>
                <th className="py-3 px-4 font-bold">Liên Hệ</th>
                <th className="py-3 px-4 font-bold">Chức Vụ & Chi Nhánh</th>
                <th className="py-3 px-4 font-bold">Quyền Truy Cập</th>
                <th className="py-3 px-4 font-bold">Trạng Thái</th>
                <th className="py-3 px-4 font-bold">Lần Đăng Nhập</th>
                <th className="py-3 px-4 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-[#8C95A0]">
                    Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const isCurrent = isCurrentLoggedIn(staff);
                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Avatar & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {staff.avatarUrl ? (
                              <img
                                src={staff.avatarUrl}
                                alt={staff.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-[#C8A96B]/40 shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#161B22] border border-[#C8A96B]/50 flex items-center justify-center font-serif font-bold text-sm text-[#C8A96B]">
                                {staff.fullName.charAt(0)}
                              </div>
                            )}
                            {isCurrent && (
                              <span
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0D1117]"
                                title="Tài khoản đang đăng nhập"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{staff.fullName}</span>
                              {isCurrent && (
                                <span className="text-[10px] text-[#C8A96B] font-semibold bg-[#C8A96B]/10 px-1.5 py-0.5 rounded border border-[#C8A96B]/20">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8C95A0]">
                              @{staff.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact: Email & Phone */}
                      <td className="py-3.5 px-4 text-[#C8D1D9]">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-[#8C95A0]" />
                            <span>{staff.email}</span>
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[#8C95A0]">
                              <Phone className="w-3 h-3 text-[#8C95A0]" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Position & Branch */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {staff.position}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#C8A96B] mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>{staff.branch}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] tracking-wide ${getRoleBadge(
                            staff.role
                          )}`}
                        >
                          {staff.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(staff.status)}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-[11px] text-[#8C95A0]">
                        {staff.lastLogin ? (
                          new Date(staff.lastLogin).toLocaleString('vi-VN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        ) : (
                          <span className="text-slate-500 italic">Chưa đăng nhập</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(staff)}
                            disabled={!isSuperAdmin}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isSuperAdmin
                                ? 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/30'
                                : 'opacity-40 cursor-not-allowed bg-transparent border-transparent text-slate-500'
                            }`}
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Change Permissions */}
                          <button
                            type="button"
                            onClick={() => handleOpenPermissions(staff)}
                            disabled={!isSuperAdmin}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isSuperAdmin
                                ? 'bg-[#C8A96B]/10 hover:bg-[#C8A96B]/20 text-[#C8A96B] border-[#C8A96B]/30'
                                : 'opacity-40 cursor-not-allowed bg-transparent border-transparent text-slate-500'
                            }`}
                            title="Thay đổi quyền"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Lock/Unlock Account */}
                          <button
                            type="button"
                            onClick={() => handleToggleLock(staff)}
                            disabled={!isSuperAdmin || isCurrent}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isCurrent
                                ? 'opacity-30 cursor-not-allowed bg-transparent border-transparent text-slate-500'
                                : staff.status === 'suspended'
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-white/5 hover:bg-amber-500/20 text-white hover:text-amber-400 border-white/10'
                            }`}
                            title={
                              isCurrent
                                ? 'Không thể khóa tài khoản đang đăng nhập'
                                : staff.status === 'suspended'
                                ? 'Mở khóa tài khoản'
                                : 'Khóa tài khoản'
                            }
                          >
                            {staff.status === 'suspended' ? (
                              <Unlock className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* 4. Delete Account */}
                          <button
                            type="button"
                            onClick={() => setDeletingStaff(staff)}
                            disabled={!isSuperAdmin || isCurrent}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isCurrent
                                ? 'opacity-30 cursor-not-allowed bg-transparent border-transparent text-slate-500'
                                : 'bg-red-500/10 hover:bg-red-500/25 text-red-400 border-red-500/20'
                            }`}
                            title={
                              isCurrent
                                ? 'Không thể xóa tài khoản đang đăng nhập'
                                : 'Xóa tài khoản'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="p-3 bg-[#161B22] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C95A0] gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>
              Firestore ready collection: <code className="text-[#C8A96B] font-mono">staff_accounts</code>
            </span>
          </div>
          <div>
            Hiển thị <strong className="text-white">{filteredStaff.length}</strong> / {staffList.length} tài khoản nhân viên
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: THÊM NHÂN VIÊN                                                   */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161B22] border border-[#C8A96B]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#C8A96B]/15 text-[#C8A96B]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Thêm Tài Khoản Nhân Viên Mới
                  </h3>
                  <p className="text-xs text-[#8C95A0]">
                    Tạo tài khoản và phân quyền quản trị nội bộ ROYAL JPcar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#8C95A0] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddStaffSubmit} className="space-y-5 text-xs">
              {/* SECTION: THÔNG TIN CÁ NHÂN */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C8A96B] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>1. THÔNG TIN CÁ NHÂN</span>
                </div>

                {/* Avatar selection & URL */}
                <div>
                  <label className="block text-[#8C95A0] mb-1.5 font-semibold">
                    Ảnh đại diện hoặc Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={addForm.avatarUrl || SAMPLE_AVATARS[0]}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#C8A96B] shadow-md shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={addForm.avatarUrl}
                        onChange={(e) =>
                          setAddForm({ ...addForm, avatarUrl: e.target.value })
                        }
                        placeholder="Nhập URL ảnh đại diện (https://...)"
                        className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8C95A0]">Hoặc chọn mẫu:</span>
                        {SAMPLE_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAddForm({ ...addForm, avatarUrl: url })}
                            className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                              addForm.avatarUrl === url
                                ? 'border-[#C8A96B]'
                                : 'border-transparent opacity-60'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Họ và tên <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={addForm.fullName}
                      onChange={(e) => {
                        const name = e.target.value;
                        const autoUsername = StaffStorageService.generateUsername(name);
                        setAddForm({
                          ...addForm,
                          fullName: name,
                          username: addForm.username ? addForm.username : autoUsername,
                        });
                      }}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Tên đăng nhập (Username)
                    </label>
                    <input
                      type="text"
                      value={addForm.username}
                      onChange={(e) =>
                        setAddForm({ ...addForm, username: e.target.value.toLowerCase().replace(/\s+/g, '.') })
                      }
                      placeholder="a.nguyen (tự tạo nếu để trống)"
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Email làm việc <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={addForm.email}
                      onChange={(e) =>
                        setAddForm({ ...addForm, email: e.target.value })
                      }
                      placeholder="nv.a@royaljpcar.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="tel"
                      value={addForm.phone}
                      onChange={(e) =>
                        setAddForm({ ...addForm, phone: e.target.value })
                      }
                      placeholder="+81 90 1234 5678 / 0903..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: THÔNG TIN CÔNG VIỆC */}
              <div className="space-y-3.5 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C8A96B] uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>2. THÔNG TIN CÔNG VIỆC & PHÂN QUYỀN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Chức vụ / Vị trí
                    </label>
                    <input
                      type="text"
                      value={addForm.position}
                      onChange={(e) =>
                        setAddForm({ ...addForm, position: e.target.value })
                      }
                      placeholder="Chuyên Viên Tư Vấn Siêu Xe VIP"
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Chi nhánh làm việc
                    </label>
                    <select
                      value={addForm.branch}
                      onChange={(e) =>
                        setAddForm({ ...addForm, branch: e.target.value as ShowroomBranch })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B] cursor-pointer"
                    >
                      <option value="Tokyo Roppongi">Tokyo Roppongi</option>
                      <option value="Yokohama">Yokohama</option>
                      <option value="Osaka">Osaka</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#8C95A0] mb-1.5 font-semibold">
                      Cấp quyền truy cập hệ thống
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(
                        [
                          'Super Admin',
                          'Quản lý Showroom',
                          'Nhân viên kinh doanh',
                          'Nhân viên kho xe',
                        ] as StaffRole[]
                      ).map((r) => (
                        <label
                          key={r}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            addForm.role === r
                              ? 'bg-[#C8A96B]/15 border-[#C8A96B] text-white'
                              : 'bg-[#0D1117] border-white/10 text-[#8C95A0] hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={r}
                            checked={addForm.role === r}
                            onChange={() => setAddForm({ ...addForm, role: r })}
                            className="mt-0.5 text-[#C8A96B] focus:ring-0"
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{r}</div>
                            <div className="text-[10px] text-[#8C95A0] mt-0.5">
                              {r === 'Super Admin' && 'Toàn quyền điều hành và thiết lập'}
                              {r === 'Quản lý Showroom' && 'Quản lý xe, khách hàng và báo cáo'}
                              {r === 'Nhân viên kinh doanh' && 'Xem xe, cập nhật trạng thái & khách hàng'}
                              {r === 'Nhân viên kho xe' && 'Thêm/sửa xe, ảnh và trạng thái kho'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-semibold text-[#8C95A0] hover:bg-white/5 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  + Thêm Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHỈNH SỬA THÔNG TIN NHÂN VIÊN                                    */}
      {/* ========================================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161B22] border border-[#C8A96B]/40 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#C8A96B]/15 text-[#C8A96B]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Chỉnh Sửa Thông Tin Nhân Viên
                  </h3>
                  <p className="text-xs text-[#8C95A0]">
                    Cập nhật hồ sơ tài khoản @{editingStaff.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-1 rounded-lg text-[#8C95A0] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} className="space-y-4 text-xs">
              {/* Avatar */}
              <div>
                <label className="block text-[#8C95A0] mb-1 font-semibold">
                  Ảnh đại diện (URL)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editForm.avatarUrl || SAMPLE_AVATARS[0]}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C8A96B]"
                  />
                  <input
                    type="url"
                    value={editForm.avatarUrl}
                    onChange={(e) =>
                      setEditForm({ ...editForm, avatarUrl: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) =>
                      setEditForm({ ...editForm, position: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Chi nhánh làm việc
                  </label>
                  <select
                    value={editForm.branch}
                    onChange={(e) =>
                      setEditForm({ ...editForm, branch: e.target.value as ShowroomBranch })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  >
                    <option value="Tokyo Roppongi">Tokyo Roppongi</option>
                    <option value="Yokohama">Yokohama</option>
                    <option value="Osaka">Osaka</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Trạng thái tài khoản
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value as StaffStatus })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
                    <option value="resigned">Nghỉ việc</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#8C95A0] mb-1 font-semibold">
                    Cấp quyền
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value as StaffRole })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Quản lý Showroom">Quản lý Showroom</option>
                    <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
                    <option value="Nhân viên kho xe">Nhân viên kho xe</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold text-[#8C95A0] hover:bg-white/5"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  LƯU THAY ĐỔI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PHÂN QUYỀN CHI TIẾT (SWITCHES/TOGGLES)                           */}
      {/* ========================================================================= */}
      {permissionsStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161B22] border border-[#C8A96B]/40 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-white">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#C8A96B]/15 text-[#C8A96B]">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#C8A96B] font-bold">
                    CẤU HÌNH PHÂN QUYỀN HỆ THỐNG
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {permissionsStaff.fullName}
                  </h3>
                  <div className="text-xs text-[#8C95A0] flex items-center gap-2 mt-0.5">
                    <span>@{permissionsStaff.username}</span>
                    <span>•</span>
                    <span className="text-[#C8A96B]">{permissionsStaff.position}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getRoleBadge(permissionsStaff.role)}`}>
                      {permissionsStaff.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPermissionsStaff(null)}
                className="p-1 rounded-lg text-[#8C95A0] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick apply role preset */}
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#8C95A0] block">
                Áp dụng nhanh mẫu phân quyền chuẩn theo cấp bậc:
              </span>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Super Admin',
                    'Quản lý Showroom',
                    'Nhân viên kinh doanh',
                    'Nhân viên kho xe',
                  ] as StaffRole[]
                ).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleApplyRolePreset(r)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A96B]/50 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Chuẩn {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Groups of Detailed Toggles */}
            <div className="space-y-5 text-xs">
              {/* GROUP 1: QUẢN LÝ XE */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="font-bold text-[#C8A96B] uppercase tracking-wider text-xs flex items-center gap-2">
                    <span>QUẢN LÝ XE</span>
                  </h4>
                  <span className="text-[10px] text-[#8C95A0]">Kho xe & Niêm yết</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'cars_view', label: 'Xem xe' },
                    { key: 'cars_add', label: 'Thêm xe' },
                    { key: 'cars_edit', label: 'Chỉnh sửa xe' },
                    { key: 'cars_delete', label: 'Xóa xe' },
                    { key: 'cars_change_price', label: 'Thay đổi giá xe' },
                    { key: 'cars_change_status', label: 'Thay đổi trạng thái xe' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#161B22] border border-white/5 hover:border-white/15 cursor-pointer transition-colors"
                    >
                      <span className="font-semibold text-white">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePerm(item.key as keyof StaffPermissions)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                          activePermissions[item.key as keyof StaffPermissions]
                            ? 'bg-[#C8A96B]'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            activePermissions[item.key as keyof StaffPermissions]
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              {/* GROUP 2: QUẢN LÝ KHÁCH HÀNG */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="font-bold text-[#C8A96B] uppercase tracking-wider text-xs flex items-center gap-2">
                    <span>QUẢN LÝ KHÁCH HÀNG</span>
                  </h4>
                  <span className="text-[10px] text-[#8C95A0]">Khách VIP & Lịch hẹn</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'customers_view', label: 'Xem khách hàng' },
                    { key: 'customers_edit', label: 'Chỉnh sửa khách hàng' },
                    { key: 'customers_delete', label: 'Xóa khách hàng' },
                    { key: 'customers_view_contact', label: 'Xem thông tin liên hệ' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#161B22] border border-white/5 hover:border-white/15 cursor-pointer transition-colors"
                    >
                      <span className="font-semibold text-white">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePerm(item.key as keyof StaffPermissions)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                          activePermissions[item.key as keyof StaffPermissions]
                            ? 'bg-[#C8A96B]'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            activePermissions[item.key as keyof StaffPermissions]
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              {/* GROUP 3: QUẢN LÝ NHÂN VIÊN */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="font-bold text-[#C8A96B] uppercase tracking-wider text-xs flex items-center gap-2">
                    <span>QUẢN LÝ NHÂN VIÊN</span>
                  </h4>
                  <span className="text-[10px] text-[#8C95A0]">Đội ngũ & Tài khoản</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'staff_view', label: 'Xem nhân viên' },
                    { key: 'staff_add', label: 'Thêm nhân viên' },
                    { key: 'staff_edit', label: 'Chỉnh sửa nhân viên' },
                    { key: 'staff_lock', label: 'Khóa tài khoản' },
                    { key: 'staff_delete', label: 'Xóa tài khoản' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#161B22] border border-white/5 hover:border-white/15 cursor-pointer transition-colors"
                    >
                      <span className="font-semibold text-white">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePerm(item.key as keyof StaffPermissions)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                          activePermissions[item.key as keyof StaffPermissions]
                            ? 'bg-[#C8A96B]'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            activePermissions[item.key as keyof StaffPermissions]
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              {/* GROUP 4: HỆ THỐNG */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="font-bold text-[#C8A96B] uppercase tracking-wider text-xs flex items-center gap-2">
                    <span>HỆ THỐNG</span>
                  </h4>
                  <span className="text-[10px] text-[#8C95A0]">Cấu hình cấp cao</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'system_view_dashboard', label: 'Xem Dashboard' },
                    { key: 'system_edit_settings', label: 'Thay đổi cài đặt showroom' },
                    { key: 'system_change_exchange_rate', label: 'Thay đổi tỷ giá JPY/VND' },
                    { key: 'system_reset_data', label: 'Khôi phục dữ liệu gốc' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#161B22] border border-white/5 hover:border-white/15 cursor-pointer transition-colors"
                    >
                      <span className="font-semibold text-white">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePerm(item.key as keyof StaffPermissions)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                          activePermissions[item.key as keyof StaffPermissions]
                            ? 'bg-[#C8A96B]'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            activePermissions[item.key as keyof StaffPermissions]
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPermissionsStaff(null)}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-semibold text-[#8C95A0] hover:bg-white/5 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="px-6 py-2.5 rounded-lg bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                LƯU THAY ĐỔI QUYỀN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MỜI NHÂN VIÊN & XÁC NHẬN TẠO TÀI KHOẢN (FIREBASE AUTH READY)      */}
      {/* ========================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161B22] border border-[#C8A96B]/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-5 text-white">
            {inviteSuccessInfo ? (
              // Success Screen
              <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Đã tạo tài khoản thành công
                  </h3>
                  <p className="text-xs text-[#8C95A0] mt-1">
                    Thông tin tài khoản đã sẵn sàng cho nhân viên đăng nhập hệ thống.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 text-left space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[#8C95A0]">Tên đăng nhập:</span>
                    <strong className="text-[#C8A96B] font-mono text-sm">
                      {inviteSuccessInfo.username}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[#8C95A0]">Email nhân viên:</span>
                    <span className="text-white font-semibold">{inviteSuccessInfo.email}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[#8C95A0]">Chức vụ & Chi nhánh:</span>
                    <span className="text-white">
                      {inviteSuccessInfo.position} ({inviteSuccessInfo.branch})
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[#8C95A0]">Cấp quyền:</span>
                    <span className="text-[#C8A96B] font-bold">{inviteSuccessInfo.role}</span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[#8C95A0] block mb-1">
                      Nhân viên có thể đăng nhập tại:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400 select-all border border-white/5">
                        /quan-tri-vien
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLoginLink}
                        className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security notice: DO NOT SHOW PASSWORD */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quy chuẩn bảo mật:</strong> Mật khẩu không được hiển thị công khai sau khi tạo. Hệ thống đã chuẩn bị liên kết thiết lập mật khẩu một lần qua Firebase Authentication để gửi trực tiếp tới hòm thư <strong>{inviteSuccessInfo.email}</strong>.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInviteSuccessInfo(null);
                      setIsInviteModalOpen(false);
                      setInviteForm({
                        fullName: '',
                        email: '',
                        position: 'Chuyên Viên Tư Vấn Siêu Xe',
                        branch: 'Tokyo Roppongi',
                        role: 'Nhân viên kinh doanh',
                      });
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Hoàn Tất
                  </button>
                </div>
              </div>
            ) : (
              // Invite Form
              <>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#C8A96B]" />
                    <h3 className="text-lg font-serif font-bold text-white">
                      Mời Nhân Viên Mới
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(false)}
                    className="p-1 rounded text-[#8C95A0] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-[#8C95A0]">
                  Gửi lời mời gia nhập ban quản trị showroom. Hệ thống tự động tạo mã định danh và cấp quyền truy cập.
                </p>

                <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Họ và tên nhân viên <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.fullName}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Tuấn Anh"
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Email tiếp nhận lời mời <span className="text-[#C8A96B]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteForm.email}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, email: e.target.value })
                      }
                      placeholder="tuananh.nguyen@royaljpcar.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#8C95A0] mb-1 font-semibold">
                        Chức vụ
                      </label>
                      <input
                        type="text"
                        value={inviteForm.position}
                        onChange={(e) =>
                          setInviteForm({ ...inviteForm, position: e.target.value })
                        }
                        placeholder="Chuyên viên tư vấn VIP"
                        className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8C95A0] mb-1 font-semibold">
                        Chi nhánh
                      </label>
                      <select
                        value={inviteForm.branch}
                        onChange={(e) =>
                          setInviteForm({
                            ...inviteForm,
                            branch: e.target.value as ShowroomBranch,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                      >
                        <option value="Tokyo Roppongi">Tokyo Roppongi</option>
                        <option value="Yokohama">Yokohama</option>
                        <option value="Osaka">Osaka</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8C95A0] mb-1 font-semibold">
                      Cấp quyền
                    </label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) =>
                        setInviteForm({
                          ...inviteForm,
                          role: e.target.value as StaffRole,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1117] border border-white/10 text-white focus:outline-none focus:border-[#C8A96B]"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Quản lý Showroom">Quản lý Showroom</option>
                      <option value="Nhân viên kinh doanh">Nhân viên kinh doanh</option>
                      <option value="Nhân viên kho xe">Nhân viên kho xe</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-[#8C95A0] hover:bg-white/5"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                    >
                      Tạo Lời Mời
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: XÁC NHẬN XÓA TÀI KHOẢN                                           */}
      {/* ========================================================================= */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161B22] border border-red-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-4 text-white">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Xóa Tài Khoản Nhân Viên?
              </h3>
              <p className="text-xs text-[#8C95A0] mt-1 leading-relaxed">
                Bạn có chắc chắn muốn xóa tài khoản của{' '}
                <strong className="text-white">{deletingStaff.fullName}</strong> (
                @{deletingStaff.username})? Thao tác này sẽ hủy toàn bộ quyền truy cập nội bộ của nhân viên này.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0D1117] border border-white/5 text-xs text-[#8C95A0] space-y-1">
              <div>Email: <span className="text-white">{deletingStaff.email}</span></div>
              <div>Chức vụ: <span className="text-white">{deletingStaff.position}</span></div>
              <div>Cấp quyền: <span className="text-[#C8A96B]">{deletingStaff.role}</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold text-[#8C95A0] hover:bg-white/5"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
