export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type TaskStatus = 'not_started' | 'in_progress' | 'pending' | 'completed' | 'overdue';

export type UserRole = 'admin' | 'head' | 'officer' | 'viewer';

export interface User {
  id: string;
  username: string; // e.g. 'wisarut.w', 'admin', 'kanjana.s'
  password?: string; // Default or custom password
  name: string;
  position: string;
  workgroupId: string;
  responsibility: string;
  phone: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  lastLoginAt?: string;
}

export interface Workgroup {
  id: string;
  code: string; // e.g. '01', '02', ..., '13'
  name: string;
  shortName: string;
  description: string;
  leaderId: string;
  color: string;
  bgLight: string;
  iconName: string;
  subActivities: string[];
}

export interface TimelineLog {
  id: string;
  step: string;
  status: TaskStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userPosition?: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  fileType: 'pdf' | 'word' | 'excel' | 'image' | 'other';
  fileSize: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  docType: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  taskCode: string; // e.g. "PNK-67-001"
  title: string;
  description: string;
  workgroupId: string;
  subActivity: string;
  mainAssigneeId: string;
  coAssigneeIds: string[];
  startDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  progress: number; // 0 - 100
  kpiId?: string;
  targetValue?: string;
  notes?: string;
  fiscalYear: number; // 2567, 2568
  createdAt: string;
  updatedAt: string;
  subtasks?: SubTask[];
  timeline: TimelineLog[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

export type KpiStatus = 'achieved' | 'nearly' | 'not_achieved';

export interface KPI {
  id: string;
  code: string; // e.g. "KPI-PNK-01"
  name: string;
  workgroupId: string;
  target: number;
  actual: number;
  unit: string; // e.g. "%", "ราย", "แห่ง", "ครั้ง"
  achievementRate: number; // calculated %
  fiscalYear: number;
  assigneeId: string;
  responsiblePerson?: string;
  formula?: string;
  status: KpiStatus;
  description?: string;
  updatedAt: string;
}

export type EventType = 'meeting' | 'home_visit' | 'campaign' | 'supervision' | 'report_deadline' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  location?: string;
  workgroupId: string;
  attendees?: string[];
  taskId?: string;
  notes?: string;
}

export type NotificationType = 'due_soon' | 'overdue' | 'new_task' | 'assigned' | 'kpi_alert' | 'evidence_added';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  relatedTaskId?: string;
  relatedKpiId?: string;
}

export interface FilterOptions {
  searchQuery: string;
  workgroupId: string;
  status: string;
  priority: string;
  assigneeId: string;
  month: string;
  fiscalYear: string;
}

// Project Management Types
export type ProjectType = 
  | 'hospital_fund'      // โครงการเงินบำรุง รพ.
  | 'local_fund'          // โครงการกองทุนหลักประกันสุขภาพระดับท้องถิ่น (กปท.)
  | 'nhso_pp'             // โครงการ PP Express / งบสร้างเสริมสุขภาพ สปสช.
  | 'strategic'           // โครงการตามยุทธศาสตร์ สสจ. / กสธ.
  | 'primary_care'        // โครงการพัฒนาระบบบริการปฐมภูมิและหมอครอบครัว
  | 'quality_improvement' // โครงการพัฒนาคุณภาพบริการ / HA / PCA
  | 'other';              // โครงการอื่นๆ

export type ProjectStatus = 
  | 'draft'               // ร่างโครงการ
  | 'submitted'           // ยื่นขออนุมัติ
  | 'approved'            // อนุมัติแล้ว
  | 'in_progress'         // กำลังดำเนินงาน
  | 'completed'           // เสร็จสิ้นโครงการ
  | 'evaluated'           // สรุปและประเมินผลแล้ว
  | 'rejected';           // ส่งกลับแก้ไข / ไม่อนุมัติ

export type ProjectDocCategory = 
  | 'proposal'            // แบบเสนอโครงการ (Proposal)
  | 'approval'            // ใบอนุมัติ / คำสั่งแต่งตั้ง
  | 'schedule'            // กำหนดการ / แผนงาน
  | 'budget_plan'         // แผนประมาณการงบประมาณ
  | 'attendance'          // ทะเบียนรายชื่อผู้เข้าร่วม
  | 'summary_report'      // รายงานสรุปผล / ภาพกิจกรรม
  | 'other';              // เอกสารอื่นๆ

export interface ProjectFile {
  id: string;
  fileName: string;
  fileType: 'doc' | 'docx' | 'pdf' | 'excel' | 'other';
  fileSize: string;
  fileData?: string; // Data URL for preview & download
  docCategory: ProjectDocCategory;
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
}

export interface ProjectChecklistItems {
  // 1. กปท.10
  kpt10_report: boolean; // แบบรายงานผลการดำเนินแผนงาน/โครงการ/กิจกรรม (กปท.10) - หัวหน้า/ผู้บริหารสูงสุด เป็นผู้รายงาน

  // 2. ซื้อ/จ้าง ร้านค้า
  shop_receipt: boolean; // ใบเสร็จ/บิลเงินสด โดยเจ้าของร้านค้าเป็นผู้รับเงิน
  shop_id_card: boolean; // สำเนาบัตรประชาชนเจ้าของร้านค้า
  shop_inspection_cert: boolean; // ใบตรวจรับ/ บันทึกการตรวจรับ
  shop_delivery_note: boolean; // ใบส่งของ/ ใบแจ้งหนี้/ ใบส่งมอบงาน/ ใบส่งมอบพัสดุ แล้วแต่กรณี
  shop_commercial_reg: boolean; // ใบจดทะเบียนพาณิชย์/ เอกสารจดทะเบียนร้านค้า
  shop_po_agreement: boolean; // ใบสั่งซื้อสั่งจ้าง/ บันทึกข้อตกลงซื้อจ้าง
  shop_winner_announcement: boolean; // ประกาศผู้ชนะการเสนอราคา
  shop_approval_report: boolean; // รายงานผลการพิจารณาและอนุมัติสั่งซื้อสั่งจ้าง
  shop_price_agreement: boolean; // บันทึกการตกลงราคา
  shop_quotation: boolean; // ใบเสนอราคา
  shop_committee_appointment: boolean; // สำเนาคำสั่งแต่งตั้งผู้ตรวจรับ/ คณะกรรมการตรวจรับพัสดุ (ถ้ามี)
  shop_egp_report: boolean; // รายงานขอซื้อขอจ้าง (จากระบบ e-GP)
  shop_tor_note: boolean; // บันทึกข้อความ ขอความเห็นชอบรายละเอียดคุณลักษณะฯ (Tor)
  shop_tor_draft: boolean; // การจัดทำร่างกำหนดคุณลักษณะเฉพาะของพัสดุ
  shop_tor_appointment: boolean; // คำสั่งแต่งตั้งผู้กำหนดคุณลักษณะ/ คณะกรรมการกำหนดคุณลักษณะ (Tor)

  // จ้างประกอบอาหาร อาหารว่าง (มิใช่ซื้อจ้างร้านค้า)
  food_receipt: boolean; // ใบเสร็จ/บิลเงินสด/ใบสำคัญรับเงิน
  food_id_card: boolean; // สำเนาบัตรประชาชนของผู้ประกอบอาหาร อาหารว่าง
  food_inspection_cert: boolean; // ใบตรวจรับ/ บันทึกการตรวจรับ

  // กรณี ค่าสมนาคุณวิทยากร
  speaker_receipt: boolean; // ใบสำคัญรับเงิน
  speaker_id_card: boolean; // สำเนาบัตรประชาชนของวิทยากร
  speaker_acceptance: boolean; // ใบตอบรับการเป็นวิทยากร
  speaker_invitation_letter: boolean; // หนังสือขอความอนุเคราะห์เป็นวิทยากร****
  speaker_inspection_cert: boolean; // ใบตรวจรับ/ บันทึกการตรวจรับ

  // 3. รูปถ่ายกิจกรรมตามโครงการและรูปป้ายโครงการ
  activity_photos: boolean;

  // 4. รายชื่อผู้เข้าร่วมโครงการ พร้อมเลขบัตรประชาชนผู้เข้าร่วมโครงการ
  attendance_with_id: boolean;

  // 5. สำเนาโครงการและกำหนดการ
  project_copy_schedule: boolean;

  // 6. บันทึกข้อความขออนุมัติจัดทำโครงการ
  approval_memo: boolean;
}

export interface ProjectDocumentChecklist {
  id?: string;
  projectId?: string;
  projectCode?: string;
  fundName: string; // เช่น กองทุนหลักประกันสุขภาพเทศบาลตำบลนาแก้ว
  agencyName: string; // หน่วยงาน เช่น โรงพยาบาลโพนนาแก้ว
  projectTitle: string; // ชื่อโครงการ
  year: string; // ปี พ.ศ. เช่น 2568, 2569
  activities: string[]; // รายการกิจกรรม (1 - 7 หรือเพิ่มเติม)
  totalBudget: number; // งบประมาณทั้งสิ้น (บาท)
  spentBudget: number; // งบประมาณที่ใช้ (บาท)
  remainingBudget: number; // งบประมาณคงเหลือ/ส่งคืนกองทุนฯ (บาท)
  returnItemsDescription?: string; // รายการส่งคืน
  items: ProjectChecklistItems;
  reviewResult: 'pass' | 'amend' | 'pending'; // ผลการตรวจ
  notes?: string; // ข้อสังเกต / หมายเหตุ
  reviewerName: string; // ผู้ตรวจเอกสาร
  reviewerPosition: string; // ตำแหน่ง
  reviewDate: string; // วันที่ตรวจเอกสาร YYYY-MM-DD
  approverName?: string; // ผู้รับรอง/เห็นชอบ (เช่น นายตฤณพงศ์  ธีรพงศ์ธนสุข)
  approverPosition?: string; // ตำแหน่ง (ผู้อำนวยการโรงพยาบาลโพนนาแก้ว)
  approvalDate?: string; // วันที่เห็นชอบ
  updatedAt?: string;
}

export interface Project {
  id: string;
  projectCode: string; // e.g. "PRJ-69-001"
  title: string;
  type: ProjectType;
  workgroupId: string; // From 13 Workgroups
  coWorkgroupIds?: string[];
  leaderId: string; // Main responsible user
  fiscalYear: number; // e.g. 2568, 2569
  status: ProjectStatus;
  budgetRequested: number; // Baht
  budgetApproved: number;  // Baht
  budgetSpent: number;     // Baht
  fundingSource: string;   // e.g. "เงินบำรุง รพ.โพนนาแก้ว", "กองทุน กปท. อบต.บ้านนาแก้ว"
  targetGroup: string;     // e.g. "ผู้ป่วยเบาหวาน 350 คน"
  targetCount: number;
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  location: string;
  objectives: string[];
  expectedOutcomes: string[];
  kpiIds?: string[];
  linkedTaskIds?: string[];
  progress: number;        // 0 - 100%
  files: ProjectFile[];
  checklist?: ProjectDocumentChecklist;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
