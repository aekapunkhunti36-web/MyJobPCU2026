import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { RoleBadge, StatusBadge } from '../common/Badge';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  UserCheck 
} from 'lucide-react';

export const PersonnelView: React.FC = () => {
  const { 
    personnel, 
    tasks, 
    workgroups, 
    addPersonnel, 
    updatePersonnel, 
    deletePersonnel, 
    setSelectedTaskForDetail, 
    setActiveTab,
    currentUser 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [workgroupFilter, setWorkgroupFilter] = useState<string>('all');

  // Selected staff for task drawer/modal
  const [selectedStaffForTasks, setSelectedStaffForTasks] = useState<User | null>(null);

  // Add/Edit staff modal
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [position, setPosition] = useState('');
  const [workgroupId, setWorkgroupId] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('officer');

  const filteredPersonnel = useMemo(() => {
    return personnel.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchUser = p.username?.toLowerCase().includes(q);
        const matchPos = p.position.toLowerCase().includes(q);
        const matchResp = p.responsibility.toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchPos && !matchResp) return false;
      }

      if (roleFilter !== 'all' && p.role !== roleFilter) {
        return false;
      }

      if (workgroupFilter !== 'all' && p.workgroupId !== workgroupFilter) {
        return false;
      }

      return true;
    });
  }, [personnel, searchQuery, roleFilter, workgroupFilter]);

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setName('');
    setUsername('');
    setPassword('password123');
    setPosition('พยาบาลวิชาชีพปฏิบัติการ');
    setWorkgroupId(workgroups[0]?.id || 'wg-01');
    setResponsibility('');
    setPhone('081-xxx-xxxx');
    setEmail('staff@phonnahospital.go.th');
    setRole('officer');
    setIsStaffModalOpen(true);
  };

  const handleOpenEditModal = (staff: User) => {
    setEditingStaff(staff);
    setName(staff.name);
    setUsername(staff.username || '');
    setPassword(staff.password || 'password123');
    setPosition(staff.position);
    setWorkgroupId(staff.workgroupId);
    setResponsibility(staff.responsibility);
    setPhone(staff.phone || '');
    setEmail(staff.email || '');
    setRole(staff.role);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedUsername = username.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Date.now().toString().slice(-4)}`;

    if (editingStaff) {
      updatePersonnel(editingStaff.id, {
        name: name.trim(),
        username: generatedUsername,
        password: password.trim() || 'password123',
        position: position.trim(),
        workgroupId,
        responsibility: responsibility.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role
      });
    } else {
      addPersonnel({
        name: name.trim(),
        username: generatedUsername,
        password: password.trim() || 'password123',
        position: position.trim(),
        workgroupId,
        responsibility: responsibility.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role
      });
    }
    setIsStaffModalOpen(false);
  };

  const handleDeleteStaff = (staffId: string, staffName: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลบุคลากร "${staffName}"?`)) {
      deletePersonnel(staffId);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>👥 ทำเนียบบุคลากรและภาระงาน (Personnel & Workload)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
              {filteredPersonnel.length} ท่าน
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ทีมบุคลากรกลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มบุคลากรใหม่</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ ตำแหน่ง หรือภาระงานรับผิดชอบ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">ทุกระดับสิทธิ์ (Role)</option>
            <option value="admin">ผู้ดูแลระบบ (Admin)</option>
            <option value="head">หัวหน้ากลุ่มงาน</option>
            <option value="officer">เจ้าหน้าที่</option>
            <option value="viewer">ผู้เข้าชม</option>
          </select>

          <select
            value={workgroupFilter}
            onChange={e => setWorkgroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">ทุกกลุ่มงาน (13 กลุ่ม)</option>
            {workgroups.map(wg => (
              <option key={wg.id} value={wg.id}>
                {wg.code}. {wg.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPersonnel.map(person => {
          const staffTasks = tasks.filter(t => t.mainAssigneeId === person.id || t.coAssigneeIds?.includes(person.id));
          const completed = staffTasks.filter(t => t.status === 'completed').length;
          const inProgress = staffTasks.filter(t => t.status === 'in_progress').length;
          const overdue = staffTasks.filter(t => t.status === 'overdue').length;
          const primaryWg = workgroups.find(w => w.id === person.workgroupId);
          const isLeaderOf = workgroups.filter(w => w.leaderId === person.id);

          return (
            <div
              key={person.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between p-5 group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-black text-sm flex items-center justify-center shadow-md">
                      {person.name.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition flex items-center gap-1.5">
                        {person.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          @{person.username || person.id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate">{person.position}</span>
                      </div>
                    </div>
                  </div>

                  <RoleBadge role={person.role} />
                </div>

                {/* Primary Workgroup */}
                <div className="mb-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs">
                  <Layers className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-slate-600">กลุ่มงานหลัก:</span>
                  <strong className="text-slate-800 truncate font-semibold">
                    {primaryWg?.code}. {primaryWg?.name}
                  </strong>
                </div>

                {/* Responsibilities */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  <span className="font-semibold text-slate-700">ภารกิจ: </span>
                  {person.responsibility}
                </p>

                {/* Contact */}
                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  {person.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                  {person.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{person.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Workload Stats & Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">งานทั้งหมด</span>
                    <strong className="text-slate-800 font-bold">{staffTasks.length}</strong>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <span className="text-emerald-600 block text-[10px]">เสร็จสิ้น</span>
                    <strong className="text-emerald-800 font-bold">{completed}</strong>
                  </div>
                  <div className={`p-2 rounded-lg ${overdue > 0 ? 'bg-rose-50' : 'bg-blue-50'}`}>
                    <span className={`block text-[10px] ${overdue > 0 ? 'text-rose-600 font-bold' : 'text-blue-600'}`}>
                      {overdue > 0 ? 'เกินกำหนด' : 'ดำเนินงาน'}
                    </span>
                    <strong className={`font-bold ${overdue > 0 ? 'text-rose-800' : 'text-blue-800'}`}>
                      {overdue > 0 ? overdue : inProgress}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setSelectedStaffForTasks(person)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>ดูรายการงาน ({staffTasks.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(person)}
                      className="p-1 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {personnel.length > 1 && (
                      <button
                        onClick={() => handleDeleteStaff(person.id, person.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="ลบบุคลากร"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: View Tasks Assigned to a Staff Member */}
      {selectedStaffForTasks && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  งานที่ได้รับมอบหมาย: {selectedStaffForTasks.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedStaffForTasks.position}</p>
              </div>
              <button
                onClick={() => setSelectedStaffForTasks(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {tasks.filter(t => t.mainAssigneeId === selectedStaffForTasks.id || t.coAssigneeIds?.includes(selectedStaffForTasks.id)).length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-xs">ยังไม่มีงานที่มอบหมายให้เจ้าหน้าที่ท่านนี้</p>
              ) : (
                tasks.filter(t => t.mainAssigneeId === selectedStaffForTasks.id || t.coAssigneeIds?.includes(selectedStaffForTasks.id)).map(task => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedStaffForTasks(null);
                      setSelectedTaskForDetail(task);
                    }}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-teal-400 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-teal-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {task.taskCode}
                        </span>
                        <StatusBadge status={task.status} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">ครบกำหนด: {task.dueDate} • ก้าวหน้า {task.progress}%</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-right">
              <button
                onClick={() => setSelectedStaffForTasks(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Personnel */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingStaff ? 'แก้ไขข้อมูลบุคลากร' : '+ เพิ่มบุคลากรใหม่'}
              </h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อ - สกุล (พร้อมคำนำหน้า) *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นพ.วิศรุต วงศ์พิริยะ หรือ พว.สมใจ ใจดี"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500"
                />
              </div>

              {/* Login Credentials Section */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>ข้อมูลบัญชีผู้ใช้งานสำหรับเข้าสู่ระบบ (Login Credentials)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ชื่อผู้ใช้ (Username) *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น somjai.j หรือ admin"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">รหัสผ่าน (Password) *</label>
                    <input
                      type="text"
                      required
                      placeholder="เริ่มต้น: password123"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ตำแหน่ง *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น พยาบาลวิชาชีพชำนาญการ"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">บทบาทสิทธิ์ (Role) *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    <option value="head">หัวหน้ากลุ่มงาน</option>
                    <option value="officer">เจ้าหน้าที่</option>
                    <option value="viewer">ผู้เข้าชม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">กลุ่มงานที่สังกัดหลัก *</label>
                <select
                  value={workgroupId}
                  onChange={e => setWorkgroupId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                >
                  {workgroups.map(wg => (
                    <option key={wg.id} value={wg.id}>
                      {wg.code}. {wg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ภาระงานรับผิดชอบ</label>
                <textarea
                  rows={2}
                  placeholder="ระบุหน้าที่รับผิดชอบ เช่น ดูแลผู้ป่วยเบาหวานความดัน งานเยี่ยมบ้าน..."
                  value={responsibility}
                  onChange={e => setResponsibility(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">อีเมล</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
