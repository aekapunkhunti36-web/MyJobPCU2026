import { Workgroup, User, Task, KPI, CalendarEvent, NotificationItem, Project } from '../types';

export const initialWorkgroups: Workgroup[] = [
  {
    id: 'wg-01',
    code: '01',
    name: 'เวชปฏิบัติครอบครัวและชุมชน',
    shortName: 'เวชปฏิบัติฯ',
    description: 'งานบริหารปฐมภูมิ บริการเวชปฏิบัติครอบครัว งานวิชาการ พัฒนาคุณภาพ HA, QA, Internal Control, Green & Clean Hospital และ EMS Smart Hospital',
    leaderId: 'usr-01',
    color: '#0d9488', // teal
    bgLight: '#f0fdfa',
    iconName: 'Stethoscope',
    subActivities: [
      'งานบริหารกลุ่มงานด้านปฐมภูมิและองค์รวม',
      'งานบริการสุขภาพด้านเวชปฏิบัติครอบครัวและชุมชน',
      'งานวิชาการ วิจัย และนวัตกรรม',
      'งานพัฒนาคุณภาพบริการ',
      'HA (Hospital Accreditation)',
      'มาตรฐานบริการสุขภาพปฐมภูมิ',
      'QA (Quality Assurance)',
      'Internal Control (การควบคุมภายใน)',
      'มาตรฐานบริการสุขภาพ',
      'GREEN & CLEAN Hospital',
      'EMS & Smart Hospital'
    ]
  },
  {
    id: 'wg-02',
    code: '02',
    name: 'การพยาบาลในชุมชน',
    shortName: 'การพยาบาลชุมชน',
    description: 'การดูแลต่อเนื่องที่บ้าน Home Ward, Home Health Care, Home Visit, COC, LTC, Palliative Care และการจัดการรายกรณี Case Manager',
    leaderId: 'usr-02',
    color: '#2563eb', // blue
    bgLight: '#eff6ff',
    iconName: 'HeartPulse',
    subActivities: [
      'Home Ward (หอผู้ป่วยที่บ้าน)',
      'Home Health Care (การดูแลสุขภาพที่บ้าน)',
      'Home Visit (การเยี่ยมบ้าน)',
      'COC (Continuity of Care)',
      'LTC (Long Term Care ดูแลระยะยาว)',
      'Palliative Care (การดูแลแบบประคับประคอง)',
      'Case Manager (การจัดการรายกรณี)'
    ]
  },
  {
    id: 'wg-03',
    code: '03',
    name: 'ส่งเสริมสุขภาพทุกกลุ่มวัย',
    shortName: 'ส่งเสริมสุขภาพ',
    description: 'ดูแลส่งเสริมสุขภาพกลุ่มมารดา ทารก ปฐมวัย วัยเรียน วัยรุ่น วัยทำงาน ผู้สูงอายุ และพระภิกษุสงฆ์',
    leaderId: 'usr-03',
    color: '#0284c7', // sky
    bgLight: '#f0f9ff',
    iconName: 'Users',
    subActivities: [
      'มารดาและทารก',
      'เด็กก่อนวัยเรียน (0-5 ปี)',
      'เด็กวัยเรียน (6-14 ปี)',
      'วัยรุ่น (15-24 ปี)',
      'วัยทำงาน (25-59 ปี)',
      'ผู้สูงอายุ (60 ปีขึ้นไป)',
      'พระภิกษุและสามเณร'
    ]
  },
  {
    id: 'wg-04',
    code: '04',
    name: 'ป้องกันและควบคุมโรคและระบาดวิทยา',
    shortName: 'ควบคุมโรคและระบาด',
    description: 'เฝ้าระวัง ควบคุมโรคไม่ติดต่อเรื้อรัง (NCDs) โรคติดต่อ วัคซีน ระบาดวิทยา เครือข่าย NCD และ EOC ภาวะฉุกเฉิน',
    leaderId: 'usr-04',
    color: '#e11d48', // rose
    bgLight: '#fff1f2',
    iconName: 'ShieldAlert',
    subActivities: [
      'NCD - เบาหวานและความดันโลหิตสูง',
      'NCD - คัดกรองมะเร็งปากมดลูก/เต้านม/ลำไส้/ตับ-ท่อน้ำดี',
      'NCD - ป้องกันอุบัติเหตุทางถนนในชุมชน',
      'NCD - พัฒนาเครือข่าย NCD Clinic Plus',
      'โรคติดต่อ - ไข้เลือดออกและยุงลาย',
      'โรคติดต่อ - COVID-19 & อุบัติใหม่',
      'โรคติดต่อ - สร้างเสริมภูมิคุ้มกันด้วยวัคซีน (EPI)',
      'โรคติดต่อ - โรคติดต่อผิวหนัง/เรื้อน/สัตว์สู่คน/หนอนพยาธิ',
      'โรคติดต่อ - Leptospirosis (ไข้ฉี่หนู)',
      'โรคติดต่อ - วัณโรค (TB)',
      'โรคติดต่อ - HIV/AIDS และโรคติดต่อทางเพศสัมพันธ์ (STIs)',
      'สาธารณภัย / EOC / ทีม SRRT ระบาดวิทยา'
    ]
  },
  {
    id: 'wg-05',
    code: '05',
    name: 'อาชีวอนามัยและความปลอดภัย',
    shortName: 'อาชีวอนามัย',
    description: 'คลินิกสุขภาพเกษตรกร คลินิก DPAC สุขภาพคนทำงาน อาชีวอนามัย เวชกรรมสิ่งแวดล้อม และเฝ้าระวังฝุ่น PM2.5 (AQI)',
    leaderId: 'usr-05',
    color: '#d97706', // amber
    bgLight: '#fffbeb',
    iconName: 'ActivitySquare',
    subActivities: [
      'คลินิกสุขภาพเกษตรกร (ตรวจสารเคมีตกค้าง)',
      'DPAC (คลินิกไร้พุง ปรับเปลี่ยนพฤติกรรม)',
      'อาชีวอนามัยและเวชกรรมสิ่งแวดล้อม',
      'เฝ้าระวังคุณภาพอากาศและฝุ่นละออง (AQI)'
    ]
  },
  {
    id: 'wg-06',
    code: '06',
    name: 'สุขาภิบาลและอนามัยสิ่งแวดล้อม',
    shortName: 'สุขาภิบาลสิ่งแวดล้อม',
    description: 'ตรวจสอบสุขาภิบาลสิ่งแวดล้อม สุขาภิบาลอาหารและน้ำดื่ม ร้านอาหาร ตลาดสด และบังคับใช้กฎหมายการสาธารณสุข',
    leaderId: 'usr-06',
    color: '#16a34a', // green
    bgLight: '#f0fdf4',
    iconName: 'Trees',
    subActivities: [
      'สุขาภิบาลสิ่งแวดล้อมและขยะมูลฝอย',
      'สุขาภิบาลอาหารและน้ำบริโภค ปลอดภัย',
      'การบังคับใช้กฎหมายการสาธารณสุขและ พ.ร.บ.'
    ]
  },
  {
    id: 'wg-07',
    code: '07',
    name: 'พัฒนาระบบบริการปฐมภูมิและสนับสนุนเครือข่าย',
    shortName: 'ระบบปฐมภูมิ & เครือข่าย',
    description: 'ขับเคลื่อนนโยบาย 3 หมอ พัฒนาหน่วยบริการปฐมภูมิ PCU/NPCU คณะกรรมการ พชอ. และประเมินมาตรฐาน รพ.สต.ติดดาว',
    leaderId: 'usr-01',
    color: '#7c3aed', // purple
    bgLight: '#faf5ff',
    iconName: 'Network',
    subActivities: [
      'ระบบการแพทย์ปฐมภูมิ 3 หมอ (อสม. หมอสาธารณสุข หมอครอบครัว)',
      'การจัดตั้งและพัฒนา PCU / NPCU แม่ข่าย',
      'คณะกรรมการพัฒนาคุณภาพชีวิตระดับอำเภอ (พชอ.)',
      'การประเมินและรับรอง รพ.สต.ติดดาว 5 ดาว 5 ดี'
    ]
  },
  {
    id: 'wg-08',
    code: '08',
    name: 'อนามัยโรงเรียน',
    shortName: 'อนามัยโรงเรียน',
    description: 'บริการสุขภาพและตรวจร่างกายนักเรียน โรงเรียนส่งเสริมสุขภาพระดับเพชร และการพัฒนาศูนย์พัฒนาเด็กเล็กคุณภาพ',
    leaderId: 'usr-07',
    color: '#0891b2', // cyan
    bgLight: '#ecfeff',
    iconName: 'GraduationCap',
    subActivities: [
      'บริการตรวจสุขภาพและอนามัยโรงเรียน',
      'โรงเรียนส่งเสริมสุขภาพและสุขบัญญัติ',
      'ศูนย์พัฒนาเด็กเล็กคุณภาพ (ศพด.)'
    ]
  },
  {
    id: 'wg-09',
    code: '09',
    name: 'สุขภาพจิตและจิตเวชในชุมชน',
    shortName: 'สุขภาพจิตชุมชน',
    description: 'การส่งเสริมสุขภาพจิต การคัดกรอง 2Q/9Q/8Q ป้องกันภาวะซึมเศร้าและฆ่าตัวตาย และการฟื้นฟูผู้ป่วยจิตเวชเรื้อรังในชุมชน',
    leaderId: 'usr-08',
    color: '#4f46e5', // indigo
    bgLight: '#eef2ff',
    iconName: 'Brain',
    subActivities: [
      'ส่งเสริมสุขภาพจิตและสร้างความตระหนักรู้',
      'คัดกรองและป้องกันปัญหาสุขภาพจิต / ภาวะซึมเศร้า',
      'การดูแลและฟื้นฟูสมรรถภาพผู้ป่วยจิตเวชในชุมชน'
    ]
  },
  {
    id: 'wg-10',
    code: '10',
    name: 'บำบัดยาเสพติด สุรา บุหรี่',
    shortName: 'บำบัดยาเสพติดฯ',
    description: 'การป้องกัน การคัดกรอง ASSIST ปรับเปลี่ยนพฤติกรรม คลินิกบำบัดฟื้นฟูผู้ติดยาเสพติด และการติดตามผู้ผ่านการบำบัด (CBTx)',
    leaderId: 'usr-08',
    color: '#c026d3', // fuchsia
    bgLight: '#fdf4ff',
    iconName: 'FlameKindling',
    subActivities: [
      'งานป้องกันยาเสพติด สุรา และยาสูบในเยาวชน/ชุมชน',
      'การปรับเปลี่ยนพฤติกรรมและลดอันตราย (Harm Reduction)',
      'คลินิกบำบัดรักษาผู้ติดยาเสพติด (CBTx)',
      'การฟื้นฟูสมรรถภาพและติดตามดูแลต่อเนื่องหลังบำบัด'
    ]
  },
  {
    id: 'wg-11',
    code: '11',
    name: 'สุขศึกษาและพัฒนาพฤติกรรมสุขภาพ',
    shortName: 'สุขศึกษาและพฤติกรรม',
    description: 'การจัดบริการสุขศึกษา การให้คำปรึกษา Counseling ปรับเปลี่ยนพฤติกรรมสุขภาพ สนับสนุนหมู่บ้านจัดการสุขภาพ และศูนย์เรียนรู้',
    leaderId: 'usr-09',
    color: '#ea580c', // orange
    bgLight: '#fff7ed',
    iconName: 'Megaphone',
    subActivities: [
      'การจัดบริการสุขศึกษาและสื่อสารสุขภาพ',
      'การให้คำปรึกษาทางสุขภาพ (Health Counseling)',
      'การปรับเปลี่ยนพฤติกรรมสุขภาพ 3อ. 2ส.',
      'การพัฒนาและสนับสนุนเครือข่ายชุมชน/อสม.',
      'ศูนย์เรียนรู้สุขภาพชุมชน',
      'มาตรฐานบริการสุขศึกษาและพัฒนาพฤติกรรมสุขภาพ'
    ]
  },
  {
    id: 'wg-12',
    code: '12',
    name: 'จัดเก็บรายได้หน่วยบริการ',
    shortName: 'จัดเก็บรายได้',
    description: 'ระบบติดตามงานจัดเก็บรายได้ บริหารสิทธิประกันสุขภาพ การเบิกจ่ายกองทุนหลักประกันสุขภาพ (UC/SSS/OFC) และ Free Schedule',
    leaderId: 'usr-10',
    color: '#059669', // emerald
    bgLight: '#ecfdf5',
    iconName: 'Receipt',
    subActivities: [
      'ระบบติดตามงานจัดเก็บรายได้และสถานะการดำเนินงาน',
      'การตรวจสอบสิทธิและบันทึกข้อมูลบริการปฐมภูมิ',
      'การติดตามการชดเชยค่าบริการส่งเสริมป้องกัน (PP Fee Schedule)'
    ]
  },
  {
    id: 'wg-13',
    code: '13',
    name: 'ข้อมูลคุณภาพ',
    shortName: 'ข้อมูลคุณภาพ & KPI',
    description: 'การกำกับติดตาม KPI ระดับกลุ่มงาน การตรวจสอบคุณภาพข้อมูล (Data Quality Audit) จัดทำรายงานสถิติ และระบบสารสนเทศ Dashboard',
    leaderId: 'usr-09',
    color: '#0284c7', // sky blue
    bgLight: '#f0f9ff',
    iconName: 'BarChart3',
    subActivities: [
      'การติดตามและประเมินผลตัวชี้วัด (KPI Monitoring)',
      'การตรวจสอบความถูกต้องและสมบูรณ์ของข้อมูล (Data Quality)',
      'การจัดทำรายงานสถิติสุขภาพและสารสนเทศประจำงวด',
      'การพัฒนาระบบเทคโนโลยีสารสนเทศและ Dashboard ปฐมภูมิ'
    ]
  }
];

export const initialPersonnel: User[] = [
  {
    id: 'usr-01',
    username: 'wisarut.w',
    password: 'password123',
    name: 'นพ.วิศรุต วงศ์พิริยะ',
    position: 'นายแพทย์ชำนาญการ / หัวหน้ากลุ่มงาน',
    workgroupId: 'wg-01',
    responsibility: 'กำกับดูแลงานบริการปฐมภูมิและองค์รวมทั้งหมด, คลินิกเวชปฏิบัติครอบครัว, งานคุณภาพ HA/PCU',
    phone: '081-456-7890',
    email: 'wisarut.w@phonnahospital.go.th',
    role: 'head',
    department: 'กลุ่มงานบริการด้านปฐมภูมิและองค์รวม'
  },
  {
    id: 'usr-02',
    username: 'kanjana.s',
    password: 'password123',
    name: 'พว.กาญจนา ศรีประเสริฐ',
    position: 'พยาบาลวิชาชีพชำนาญการพิเศษ',
    workgroupId: 'wg-02',
    responsibility: 'หัวหน้างานการพยาบาลในชุมชน, ผู้รับผิดชอบ Home Ward, Palliative Care, Long Term Care (LTC)',
    phone: '089-123-4567',
    email: 'kanjana.s@phonnahospital.go.th',
    role: 'head',
    department: 'งานการพยาบาลในชุมชน'
  },
  {
    id: 'usr-03',
    username: 'nonglak.m',
    password: 'password123',
    name: 'พว.นงลักษณ์ มงคลกุล',
    position: 'พยาบาลวิชาชีพชำนาญการ',
    workgroupId: 'wg-03',
    responsibility: 'หัวหน้างานส่งเสริมสุขภาพทุกกลุ่มวัย, คลินิก ANC, คัดกรองพัฒนาการเด็กปฐมวัย, ผู้สูงอายุ',
    phone: '084-345-6789',
    email: 'nonglak.m@phonnahospital.go.th',
    role: 'officer',
    department: 'งานส่งเสริมสุขภาพทุกกลุ่มวัย'
  },
  {
    id: 'usr-04',
    username: 'thanakrit.s',
    password: 'password123',
    name: 'นายธนกฤต แสนสุข',
    position: 'นักวิชาการสาธารณสุขชำนาญการ',
    workgroupId: 'wg-04',
    responsibility: 'หัวหน้างานควบคุมโรคติดต่อและไม่ติดต่อ, เครือข่าย NCD, งานระบาดวิทยา และทีม SRRT',
    phone: '087-987-6543',
    email: 'thanakrit.s@phonnahospital.go.th',
    role: 'head',
    department: 'งานป้องกันและควบคุมโรคและระบาดวิทยา'
  },
  {
    id: 'usr-05',
    username: 'kamonchanok.p',
    password: 'password123',
    name: 'นางกมลชนก ภูมิภาค',
    position: 'พยาบาลวิชาชีพชำนาญการ (เวชปฏิบัติ)',
    workgroupId: 'wg-05',
    responsibility: 'รับผิดชอบงานอาชีวอนามัย คลินิกตรวจสารเคมีตกค้างเกษตรกร คลินิก DPAC และเฝ้าระวังฝุ่น AQI',
    phone: '086-765-4321',
    email: 'kamonchanok.p@phonnahospital.go.th',
    role: 'officer',
    department: 'งานอาชีวอนามัยและความปลอดภัย'
  },
  {
    id: 'usr-06',
    username: 'chaiyuth.t',
    password: 'password123',
    name: 'นายชัยยุทธ ทิพย์โสภา',
    position: 'นักวิชาการสาธารณสุขปฏิบัติการ',
    workgroupId: 'wg-06',
    responsibility: 'งานสุขาภิบาลอาหารและน้ำ, ตรวจมาตรฐานร้านอาหาร ตลาดสด, Green & Clean Hospital',
    phone: '085-432-1098',
    email: 'chaiyuth.t@phonnahospital.go.th',
    role: 'officer',
    department: 'งานสุขาภิบาลและอนามัยสิ่งแวดล้อม'
  },
  {
    id: 'usr-07',
    username: 'sudarat.p',
    password: 'password123',
    name: 'พว.สุดารัตน์ พลจันทร์',
    position: 'พยาบาลวิชาชีพปฏิบัติการ',
    workgroupId: 'wg-08',
    responsibility: 'งานอนามัยโรงเรียน, การตรวจสุขภาพนักเรียนประถม-มัธยม, ฉีดวัคซีน HPV/dT โรงเรียน',
    phone: '083-210-9876',
    email: 'sudarat.p@phonnahospital.go.th',
    role: 'officer',
    department: 'งานอนามัยโรงเรียน'
  },
  {
    id: 'usr-08',
    username: 'pimpa.s',
    password: 'password123',
    name: 'นางสาวพิมพา สุวรรณโคตร',
    position: 'นักจิตวิทยาคลินิกปฏิบัติการ',
    workgroupId: 'wg-09',
    responsibility: 'งานสุขภาพจิตชุมชน คลินิกบำบัดยาเสพติด CBTx การคัดกรอง 2Q/9Q/8Q และฟื้นฟูจิตเวช',
    phone: '082-109-8765',
    email: 'pimpa.s@phonnahospital.go.th',
    role: 'officer',
    department: 'งานสุขภาพจิตและบำบัดยาเสพติด'
  },
  {
    id: 'usr-09',
    username: 'admin',
    password: 'admin123',
    name: 'นายอดิศร วรราช',
    position: 'นักวิชาการคอมพิวเตอร์ / สถิติสาธารณสุข',
    workgroupId: 'wg-13',
    responsibility: 'ผู้ดูแลระบบสารสนเทศ (Admin), Data Quality Audit, การประมวลผล KPI และรายงานสถิติ',
    phone: '081-998-8776',
    email: 'adisor.w@phonnahospital.go.th',
    role: 'admin',
    department: 'งานสารสนเทศและข้อมูลคุณภาพ'
  },
  {
    id: 'usr-10',
    username: 'supaporn.b',
    password: 'password123',
    name: 'นางสุภาภรณ์ บุญเลิศ',
    position: 'เจ้าพนักงานสาธารณสุขชำนาญงาน',
    workgroupId: 'wg-12',
    responsibility: 'งานจัดเก็บรายได้หน่วยบริการ, การตรวจสอบสิทธิและการส่งเบิก PP Fee Schedule กองทุนหลักประกัน',
    phone: '086-332-1144',
    email: 'supaporn.b@phonnahospital.go.th',
    role: 'officer',
    department: 'งานจัดเก็บรายได้หน่วยบริการ'
  },
  {
    id: 'usr-11',
    username: 'areeya.n',
    password: 'password123',
    name: 'พว.อารียา นามบุตร',
    position: 'พยาบาลวิชาชีพปฏิบัติการ (Case Manager)',
    workgroupId: 'wg-02',
    responsibility: 'ผู้จัดการรายกรณีผู้ป่วยกลุ่มโรคเรื้อรังและผู้ป่วยระยะท้าย (COC & Palliative Care)',
    phone: '084-556-6778',
    email: 'areeya.n@phonnahospital.go.th',
    role: 'officer',
    department: 'งานการพยาบาลในชุมชน'
  },
  {
    id: 'usr-12',
    username: 'kittikhun.m',
    password: 'password123',
    name: 'นายกิตติคุณ เมืองจันทร์',
    position: 'นักวิชาการสาธารณสุขปฏิบัติการ',
    workgroupId: 'wg-11',
    responsibility: 'งานสุขศึกษา พัฒนาพฤติกรรมสุขภาพ อสม. และการสื่อสารความเสี่ยงสุขภาพชุมชน',
    phone: '089-776-5544',
    email: 'kittikhun.m@phonnahospital.go.th',
    role: 'officer',
    department: 'งานสุขศึกษาและพัฒนาพฤติกรรมสุขภาพ'
  }
];

export const initialTasks: Task[] = [];
export const initialKPIs: KPI[] = [];
export const initialCalendarEvents: CalendarEvent[] = [];
export const initialNotifications: NotificationItem[] = [];
export const initialProjects: Project[] = [];
