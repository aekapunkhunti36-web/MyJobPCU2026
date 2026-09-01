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

export const initialTasks: Task[] = [
  {
    id: 'tsk-001',
    taskCode: 'PNK-67-001',
    title: 'โครงการเยี่ยมบ้านผู้ป่วยติดเตียงและ Palliative Care ไตรมาส 3',
    description: 'ลงพื้นที่เยี่ยมบ้านผู้ป่วยติดเตียงระยะยาว (LTC) และผู้ป่วยดูแลแบบประคับประคอง ร่วมกับทีม 3 หมอ และ อสม. ในเขต ต.โพนนาแก้ว 15 ราย',
    workgroupId: 'wg-02',
    subActivity: 'Home Visit (การเยี่ยมบ้าน)',
    mainAssigneeId: 'usr-02',
    coAssigneeIds: ['usr-11', 'usr-01'],
    startDate: '2026-08-01',
    dueDate: '2026-08-30',
    priority: 'urgent',
    status: 'in_progress',
    progress: 75,
    kpiId: 'kpi-002',
    targetValue: 'เยี่ยมบ้านครบ 15 ราย (100%)',
    notes: 'ดำเนินการเยี่ยมแล้ว 12 ราย เหลืออีก 3 รายใน ม.4 และ ม.7',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-28T14:20:00Z',
    subtasks: [
      { id: 'st-1', title: 'สำรวจและจัดลำดับความเร่งด่วนผู้ป่วย 15 ราย', completed: true },
      { id: 'st-2', title: 'ประสานงาน อสม. และ รพ.สต. ในพื้นที่', completed: true },
      { id: 'st-3', title: 'ลงพื้นที่ตรวจประเมินและส่งมอบเวชภัณฑ์', completed: true },
      { id: 'st-4', title: 'สรุปรายงานผลการเยี่ยมบ้านลงระบบ COC', completed: false }
    ],
    timeline: [
      { id: 'tl-1', step: 'สร้างงานและอนุมัติแผน', status: 'not_started', timestamp: '2026-08-01 09:00', updatedBy: 'พว.กาญจนา ศรีประเสริฐ', notes: 'อนุมัติแผนปฏิบัติการประจำเดือน' },
      { id: 'tl-2', step: 'มอบหมายทีมลงพื้นที่', status: 'in_progress', timestamp: '2026-08-05 10:30', updatedBy: 'พว.กาญจนา ศรีประเสริฐ', notes: 'มอบหมาย พว.อารียา และทีม 3 หมอ' },
      { id: 'tl-3', step: 'รายงานความก้าวหน้าครั้งที่ 1', status: 'in_progress', timestamp: '2026-08-18 16:00', updatedBy: 'พว.อารียา นามบุตร', notes: 'เยี่ยมแล้ว 8 ราย ผู้ป่วยอาการทรงตัว' },
      { id: 'tl-4', step: 'รายงานความก้าวหน้าครั้งที่ 2', status: 'in_progress', timestamp: '2026-08-28 14:00', updatedBy: 'พว.กาญจนา ศรีประเสริฐ', notes: 'เยี่ยมเพิ่มอีก 4 ราย รวม 12 ราย' }
    ],
    comments: [
      { id: 'cm-1', userId: 'usr-02', userName: 'พว.กาญจนา ศรีประเสริฐ', userPosition: 'พยาบาลวิชาชีพชำนาญการพิเศษ', content: 'จัดเตรียมยาและแผ่นรองซับสำหรับผู้ป่วยรายที่ 5-8 เรียบร้อยแล้ว', createdAt: '2026-08-15 11:20' },
      { id: 'cm-2', userId: 'usr-11', userName: 'พว.อารียา นามบุตร', userPosition: 'พยาบาลวิชาชีพปฏิบัติการ (Case Manager)', content: 'ลงพื้นที่เยี่ยมบ้านแล้ว 12 ราย ผู้ป่วยและญาติให้ความร่วมมือดีมาก มี 1 รายต้องส่งต่อพบแพทย์เรื่องแผลกดทับ', createdAt: '2026-08-28 14:20' }
    ],
    attachments: [
      { id: 'att-1', name: 'รายงานสรุปผลการเยี่ยมบ้าน_สิงหาคม2569.pdf', fileType: 'pdf', fileSize: '2.4 MB', uploadedBy: 'พว.กาญจนา ศรีประเสริฐ', uploadedAt: '2026-08-28 14:30', docType: 'รายงานผลการดำเนินงาน' },
      { id: 'att-2', name: 'ภาพถ่ายกิจกรรมเยี่ยมบ้าน_ม4_ม7.jpg', fileType: 'image', fileSize: '4.8 MB', uploadedBy: 'พว.อารียา นามบุตร', uploadedAt: '2026-08-28 14:35', docType: 'ภาพถ่ายกิจกรรม' }
    ]
  },
  {
    id: 'tsk-002',
    taskCode: 'PNK-67-002',
    title: 'โครงการคัดกรองเบาหวานและความดันโลหิตสูงเชิงรุกในชุมชน',
    description: 'จัดกิจกรรมคัดกรองความเสี่ยงโรคเบาหวานและความดันโลหิตสูงกลุ่มเป้าหมายอายุ 35 ปีขึ้นไป ใน 8 หมู่บ้านเป้าหมาย',
    workgroupId: 'wg-04',
    subActivity: 'NCD - เบาหวานและความดันโลหิตสูง',
    mainAssigneeId: 'usr-04',
    coAssigneeIds: ['usr-12', 'usr-05'],
    startDate: '2026-08-05',
    dueDate: '2026-08-25',
    priority: 'high',
    status: 'overdue',
    progress: 85,
    kpiId: 'kpi-004',
    targetValue: 'คัดกรองได้ไม่น้อยกว่าร้อยละ 90 ของประชากรเป้าหมาย',
    notes: 'ยังคงเหลือผลการคัดกรองจาก รพ.สต.บ้านนาแก้ว ที่ยังส่งข้อมูลไม่ครบ',
    fiscalYear: 2569,
    createdAt: '2026-08-05T09:00:00Z',
    updatedAt: '2026-08-26T10:00:00Z',
    subtasks: [
      { id: 'st-21', title: 'จัดสรรเครื่องตรวจน้ำตาลปลายนิ้วและแถบตรวจ', completed: true },
      { id: 'st-22', title: 'จัดอบรม อสม. ฟื้นฟูทักษะการวัดความดัน', completed: true },
      { id: 'st-23', title: 'รวบรวมข้อมูลบันทึกเข้าสู่ระบบ HDC', completed: false }
    ],
    timeline: [
      { id: 'tl-21', step: 'เริ่มต้นโครงการ', status: 'in_progress', timestamp: '2026-08-05 09:00', updatedBy: 'นายธนกฤต แสนสุข' },
      { id: 'tl-22', step: 'ลงพื้นที่ตรวจคัดกรอง', status: 'in_progress', timestamp: '2026-08-15 17:00', updatedBy: 'นายธนกฤต แสนสุข', notes: 'คัดกรองแล้ว 1,240 ราย' },
      { id: 'tl-23', step: 'เลยกำหนดส่งข้อมูลสรุป', status: 'overdue', timestamp: '2026-08-26 09:00', updatedBy: 'ระบบอัตโนมัติ', notes: 'เกินกำหนดส่งรายงาน 1 วัน' }
    ],
    comments: [
      { id: 'cm-21', userId: 'usr-04', userName: 'นายธนกฤต แสนสุข', content: 'กำลังเร่งติดตามข้อมูลตกค้างจาก รพ.สต. เครือข่าย คาดว่าจะเสร็จสิ้นภายใน 2 วัน', createdAt: '2026-08-26 10:15' }
    ],
    attachments: [
      { id: 'att-21', name: 'แบบสรุปผลการคัดกรองNCD_รายหมู่บ้าน.xlsx', fileType: 'excel', fileSize: '1.2 MB', uploadedBy: 'นายธนกฤต แสนสุข', uploadedAt: '2026-08-25 16:45', docType: 'แบบฟอร์มข้อมูล' }
    ]
  },
  {
    id: 'tsk-003',
    taskCode: 'PNK-67-003',
    title: 'เตรียมการรับการประเมินมาตรฐานบริการสุขภาพปฐมภูมิ (รพ.สต.ติดดาว)',
    description: 'เตรียมเอกสารหลักฐาน SAR ผลการดำเนินงาน 5 หมวด และสุ่มตรวจซ้อมรับการประเมิน ณ รพ.สต.โพนนาแก้ว',
    workgroupId: 'wg-07',
    subActivity: 'การประเมินและรับรอง รพ.สต.ติดดาว 5 ดาว 5 ดี',
    mainAssigneeId: 'usr-01',
    coAssigneeIds: ['usr-09', 'usr-02', 'usr-06'],
    startDate: '2026-08-10',
    dueDate: '2026-09-15',
    priority: 'urgent',
    status: 'in_progress',
    progress: 60,
    kpiId: 'kpi-007',
    targetValue: 'ผ่านเกณฑ์ระดับ 5 ดาว 5 ดี ทุกแห่ง',
    notes: 'นัดประชุมคณะทำงานประเมินตนเองวันที่ 2 กันยายน 2569',
    fiscalYear: 2569,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-29T11:00:00Z',
    subtasks: [
      { id: 'st-31', title: 'รวบรวมเอกสารหมวดที่ 1-3', completed: true },
      { id: 'st-32', title: 'รวบรวมเอกสารหมวดที่ 4-5 นวัตกรรม', completed: false },
      { id: 'st-33', title: 'จัดทำรูปเล่มและแฟ้มหลักฐาน', completed: false }
    ],
    timeline: [
      { id: 'tl-31', step: 'ประชุมชี้แจงเกณฑ์มาตรฐาน', status: 'in_progress', timestamp: '2026-08-10 13:30', updatedBy: 'นพ.วิศรุต วงศ์พิริยะ' }
    ],
    comments: [
      { id: 'cm-31', userId: 'usr-01', userName: 'นพ.วิศรุต วงศ์พิริยะ', content: 'ขอให้ทุกกลุ่มงานส่งสรุปผลงานนวัตกรรมเด่นเข้ามารวมที่งานคุณภาพภายในสิ้นเดือนนี้ครับ', createdAt: '2026-08-20 09:30' }
    ],
    attachments: [
      { id: 'att-31', name: 'คู่มือเกณฑ์ประเมินรพสตติดดาว_2569.pdf', fileType: 'pdf', fileSize: '5.6 MB', uploadedBy: 'นพ.วิศรุต วงศ์พิริยะ', uploadedAt: '2026-08-10 11:00', docType: 'คู่มือเกณฑ์มาตรฐาน' }
    ]
  },
  {
    id: 'tsk-004',
    taskCode: 'PNK-67-004',
    title: 'โครงการรณรงค์ตรวจคัดกรองสารเคมีตกค้างในเลือดกลุ่มเกษตรกร',
    description: 'ให้บริการเจาะเลือดตรวจคัดกรองสารเคมีกำจัดศัตรูพืชตกค้าง (Cholinesterase) แก่เกษตรกรกลุ่มปลูกผักปลอดภัยและทำนา',
    workgroupId: 'wg-05',
    subActivity: 'คลินิกสุขภาพเกษตรกร (ตรวจสารเคมีตกค้าง)',
    mainAssigneeId: 'usr-05',
    coAssigneeIds: ['usr-06'],
    startDate: '2026-08-12',
    dueDate: '2026-09-05',
    priority: 'normal',
    status: 'in_progress',
    progress: 50,
    kpiId: 'kpi-005',
    targetValue: 'เกษตรกรกลุ่มเสี่ยงได้รับการตรวจ 200 ราย',
    notes: 'นัดตรวจ ณ ศาลาประชาคมบ้านนาแก้ว วันที่ 3 ก.ย.',
    fiscalYear: 2569,
    createdAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z',
    subtasks: [
      { id: 'st-41', title: 'เตรียมชุดตรวจ Reactive Paper', completed: true },
      { id: 'st-42', title: 'ประสานผู้นำชุมชนและเกษตรอำเภอ', completed: true },
      { id: 'st-43', title: 'ตรวจคัดกรองและให้คำแนะนำปรับพฤติกรรม', completed: false }
    ],
    timeline: [
      { id: 'tl-41', step: 'ประสานงานชุมชน', status: 'in_progress', timestamp: '2026-08-12 10:00', updatedBy: 'นางกมลชนก ภูมิภาค' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-005',
    taskCode: 'PNK-67-005',
    title: 'ตรวจสุขภาพและฉีดวัคซีน HPV ป้องกันมะเร็งปากมดลูกในโรงเรียน',
    description: 'ตรวจสุขภาพนักเรียนชั้น ป.1 - ม.3 และฉีดวัคซีนป้องกันมะเร็งปากมดลูก (HPV) นักเรียนหญิงชั้น ป.5 ในเขตอำเภอโพนนาแก้ว',
    workgroupId: 'wg-08',
    subActivity: 'บริการตรวจสุขภาพและอนามัยโรงเรียน',
    mainAssigneeId: 'usr-07',
    coAssigneeIds: ['usr-03'],
    startDate: '2026-07-01',
    dueDate: '2026-08-15',
    priority: 'high',
    status: 'completed',
    progress: 100,
    kpiId: 'kpi-008',
    targetValue: 'นักเรียนหญิง ป.5 ได้รับวัคซีนครบ 100%',
    notes: 'ดำเนินการเสร็จสิ้นเรียบร้อย ครอบคลุม 12 โรงเรียน 185 ราย',
    fiscalYear: 2569,
    createdAt: '2026-07-01T08:30:00Z',
    updatedAt: '2026-08-15T15:30:00Z',
    subtasks: [
      { id: 'st-51', title: 'สำรวจจำนวนนักเรียนและขอใบยินยอมผู้ปกครอง', completed: true },
      { id: 'st-52', title: 'ออกหน่วยฉีดวัคซีนและตรวจสุขภาพฟัน', completed: true },
      { id: 'st-53', title: 'บันทึกประวัติการรับวัคซีนในระบบ MOPH-IC', completed: true }
    ],
    timeline: [
      { id: 'tl-51', step: 'เริ่มแผนงาน', status: 'not_started', timestamp: '2026-07-01 09:00', updatedBy: 'พว.สุดารัตน์ พลจันทร์' },
      { id: 'tl-52', step: 'ออกตรวจและฉีดวัคซีน', status: 'in_progress', timestamp: '2026-07-15 14:00', updatedBy: 'พว.สุดารัตน์ พลจันทร์' },
      { id: 'tl-53', step: 'ตรวจความสมบูรณ์และปิดงาน', status: 'completed', timestamp: '2026-08-15 15:30', updatedBy: 'พว.สุดารัตน์ พลจันทร์', notes: 'ฉีดวัคซีนได้ครบ 100%' }
    ],
    comments: [
      { id: 'cm-51', userId: 'usr-07', userName: 'พว.สุดารัตน์ พลจันทร์', content: 'นักเรียนได้รับวัคซีนครบตามเป้าหมาย ไม่มีภาวะไม่พึงประสงค์รุนแรง', createdAt: '2026-08-15 15:45' }
    ],
    attachments: [
      { id: 'att-51', name: 'รายงานผลการฉีดวัคซีนHPVโรงเรียน_2569.pdf', fileType: 'pdf', fileSize: '3.1 MB', uploadedBy: 'พว.สุดารัตน์ พลจันทร์', uploadedAt: '2026-08-15 15:50', docType: 'รายงานสรุปผล' }
    ]
  },
  {
    id: 'tsk-006',
    taskCode: 'PNK-67-006',
    title: 'โครงการคัดกรองภาวะซึมเศร้าและความเสี่ยงฆ่าตัวตาย (2Q/9Q/8Q)',
    description: 'รณรงค์คัดกรองสุขภาพจิตกลุ่มผู้ป่วยโรคเรื้อรัง ผู้สูงอายุ และญาติผู้ดูแล ในชุมชนและคลินิกผู้ป่วยนอก',
    workgroupId: 'wg-09',
    subActivity: 'คัดกรองและป้องกันปัญหาสุขภาพจิต / ภาวะซึมเศร้า',
    mainAssigneeId: 'usr-08',
    coAssigneeIds: ['usr-02', 'usr-11'],
    startDate: '2026-08-01',
    dueDate: '2026-08-31',
    priority: 'urgent',
    status: 'in_progress',
    progress: 80,
    kpiId: 'kpi-009',
    targetValue: 'คัดกรองผู้ป่วย NCD ร้อยละ 80 ขึ้นไป',
    notes: 'พบผู้มีภาวะเสี่ยง 9Q > 7 คะแนน จำนวน 8 ราย ส่งต่อพบแพทย์และจิตวิทยาเรียบร้อย',
    fiscalYear: 2569,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-27T16:00:00Z',
    subtasks: [
      { id: 'st-61', title: 'อบรมเจ้าหน้าที่และ อสม. ด้านการคัดกรอง 2Q/9Q', completed: true },
      { id: 'st-62', title: 'คัดกรองผู้ป่วย NCD ในคลินิกและชุมชน', completed: true },
      { id: 'st-63', title: 'ติดตามดูแลและให้คำปรึกษาผู้มีความเสี่ยง', completed: false }
    ],
    timeline: [
      { id: 'tl-61', step: 'เปิดระบบคัดกรอง', status: 'in_progress', timestamp: '2026-08-01 09:30', updatedBy: 'นางสาวพิมพา สุวรรณโคตร' }
    ],
    comments: [
      { id: 'cm-61', userId: 'usr-08', userName: 'นางสาวพิมพา สุวรรณโคตร', content: 'ประสานงานคลินิกจิตเวชรับดูแลต่อเรียบร้อย 2 ราย', createdAt: '2026-08-27 16:15' }
    ],
    attachments: [
      { id: 'att-61', name: 'สรุปผลการคัดกรอง2Q_9Q_สิงหาคม69.docx', fileType: 'word', fileSize: '850 KB', uploadedBy: 'นางสาวพิมพา สุวรรณโคตร', uploadedAt: '2026-08-27 16:30', docType: 'รายงานผลการคัดกรอง' }
    ]
  },
  {
    id: 'tsk-007',
    taskCode: 'PNK-67-007',
    title: 'ตรวจสอบคุณภาพข้อมูล 43 แฟ้ม และ HDC ประจำงวดเดือนกรกฎาคม',
    description: 'ตรวจสอบ Data Quality Audit ข้อมูลบริการปฐมภูมิ 43 แฟ้ม แก้ไข Error ส่งออกข้อมูลสู่ระบบ HDC สสจ.สกลนคร',
    workgroupId: 'wg-13',
    subActivity: 'การตรวจสอบความถูกต้องและสมบูรณ์ของข้อมูล (Data Quality)',
    mainAssigneeId: 'usr-09',
    coAssigneeIds: ['usr-10'],
    startDate: '2026-08-01',
    dueDate: '2026-08-10',
    priority: 'normal',
    status: 'completed',
    progress: 100,
    kpiId: 'kpi-013',
    targetValue: 'ผ่านเกณฑ์ Data Quality ร้อยละ 98 ขึ้นไป',
    notes: 'ผลการ Audit ข้อมูลผ่านเกณฑ์ 98.6% ไม่มี Error ตกค้าง',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-10T17:00:00Z',
    subtasks: [
      { id: 'st-71', title: 'รันสคริปต์ตรวจสอบ Error 43 แฟ้ม', completed: true },
      { id: 'st-72', title: 'แจ้งผู้รับผิดชอบงานแก้ไขข้อมูลผิดพลาด', completed: true },
      { id: 'st-73', title: 'ส่งออกข้อมูลขึ้น HDC', completed: true }
    ],
    timeline: [
      { id: 'tl-71', step: 'เริ่มกระบวนการ Audit', status: 'in_progress', timestamp: '2026-08-01 08:30', updatedBy: 'นายอดิศร วรราช' },
      { id: 'tl-72', step: 'เสร็จสิ้นและส่งออกข้อมูล', status: 'completed', timestamp: '2026-08-10 16:45', updatedBy: 'นายอดิศร วรราช' }
    ],
    comments: [],
    attachments: [
      { id: 'att-71', name: 'รายงานผลDataQualityAudit_กค69.xlsx', fileType: 'excel', fileSize: '1.8 MB', uploadedBy: 'นายอดิศร วรราช', uploadedAt: '2026-08-10 17:05', docType: 'รายงานการตรวจสอบ' }
    ]
  },
  {
    id: 'tsk-008',
    taskCode: 'PNK-67-008',
    title: 'ติดตามการเรียกเก็บชดเชยค่าบริการส่งเสริมป้องกันโรค (PP Fee Schedule)',
    description: 'รวบรวมและตรวจสอบรายการบริการส่งเสริมสุขภาพป้องกันโรค เพื่อส่งเบิก e-Claim และ Free Schedule ประจำงวด',
    workgroupId: 'wg-12',
    subActivity: 'การติดตามการชดเชยค่าบริการส่งเสริมป้องกัน (PP Fee Schedule)',
    mainAssigneeId: 'usr-10',
    coAssigneeIds: ['usr-09'],
    startDate: '2026-08-15',
    dueDate: '2026-08-31',
    priority: 'high',
    status: 'in_progress',
    progress: 70,
    kpiId: 'kpi-012',
    targetValue: 'ส่งเบิกครบถ้วนทันตามกำหนด 100%',
    notes: 'ส่งเบิกแล้ว 420 รายการ รอการตอบรับ Statement จาก สปสช.',
    fiscalYear: 2569,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-28T11:00:00Z',
    subtasks: [
      { id: 'st-81', title: 'ดึงข้อมูลบริการคัดกรองและวัคซีน', completed: true },
      { id: 'st-82', title: 'ตรวจสอบรหัสหัตถการ ICD-9/ICD-10-TM', completed: true },
      { id: 'st-83', title: 'บันทึกส่งเบิกผ่านระบบ e-Claim', completed: false }
    ],
    timeline: [
      { id: 'tl-81', step: 'เริ่มกระบวนการส่งเบิก', status: 'in_progress', timestamp: '2026-08-15 10:00', updatedBy: 'นางสุภาภรณ์ บุญเลิศ' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-009',
    taskCode: 'PNK-67-009',
    title: 'ตรวจสุขาภิบาลร้านอาหารและโรงอาหารโรงเรียนก่อนเปิดเทอม',
    description: 'ลงพื้นที่ตรวจประเมินสุขาภิบาลอาหารและสุขอนามัยผู้สัมผัสอาหาร (Clean Food Good Taste) และน้ำดื่ม',
    workgroupId: 'wg-06',
    subActivity: 'สุขาภิบาลอาหารและน้ำบริโภค ปลอดภัย',
    mainAssigneeId: 'usr-06',
    coAssigneeIds: ['usr-07'],
    startDate: '2026-08-20',
    dueDate: '2026-09-10',
    priority: 'normal',
    status: 'in_progress',
    progress: 40,
    kpiId: 'kpi-006',
    targetValue: 'ผ่านเกณฑ์มาตรฐาน Clean Food Good Taste ร้อยละ 85',
    notes: 'ตรวจโรงอาหารโรงเรียนแล้ว 5 แห่ง กำลังตรวจร้านอาหารรอบ รพ.',
    fiscalYear: 2569,
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-08-28T15:00:00Z',
    subtasks: [
      { id: 'st-91', title: 'จัดเตรียมชุดตรวจ SI-2 และโคลิฟอร์มแบคทีเรีย', completed: true },
      { id: 'st-92', title: 'ตรวจประเมินร้านอาหาร 20 ร้าน', completed: false },
      { id: 'st-93', title: 'มอบป้ายรับรอง Clean Food Good Taste', completed: false }
    ],
    timeline: [
      { id: 'tl-91', step: 'จัดทำแผนตรวจประเมิน', status: 'in_progress', timestamp: '2026-08-20 09:00', updatedBy: 'นายชัยยุทธ ทิพย์โสภา' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-010',
    taskCode: 'PNK-67-010',
    title: 'โครงการอบรม อสม. หมอคนที่ 1 และฟื้นฟูทักษะการใช้ Smart อสม.',
    description: 'จัดอบรมพัฒนาศักยภาพ อสม. ในการใช้แอปพลิเคชัน Smart อสม. และการคัดกรองสุขภาพผู้สูงอายุในชุมชน',
    workgroupId: 'wg-11',
    subActivity: 'การพัฒนาและสนับสนุนเครือข่ายชุมชน/อสม.',
    mainAssigneeId: 'usr-12',
    coAssigneeIds: ['usr-09', 'usr-04'],
    startDate: '2026-08-18',
    dueDate: '2026-09-02',
    priority: 'normal',
    status: 'in_progress',
    progress: 65,
    kpiId: 'kpi-011',
    targetValue: 'อสม. ผ่านการอบรมและส่งรายงานผ่านแอป 100%',
    notes: 'อบรมรุ่นที่ 1 เรียบร้อย 60 คน เหลือรุ่นที่ 2 วันที่ 1 ก.ย.',
    fiscalYear: 2569,
    createdAt: '2026-08-18T09:00:00Z',
    updatedAt: '2026-08-26T17:00:00Z',
    subtasks: [
      { id: 'st-101', title: 'จัดทำเอกสารและคลิปวิดีโอคู่มือ Smart อสม.', completed: true },
      { id: 'st-102', title: 'จัดการอบรมรุ่นที่ 1', completed: true },
      { id: 'st-103', title: 'จัดการอบรมรุ่นที่ 2 และประเมินผล', completed: false }
    ],
    timeline: [
      { id: 'tl-101', step: 'เริ่มโครงการอบรม', status: 'in_progress', timestamp: '2026-08-18 09:30', updatedBy: 'นายกิตติคุณ เมืองจันทร์' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-011',
    taskCode: 'PNK-67-011',
    title: 'รณรงค์ทำลายแหล่งเพาะพันธุ์ยุงลายป้องกันโรคไข้เลือดออกช่วงฤดูฝน',
    description: 'รณรงค์สำรวจค่าดัชนีลูกน้ำยุงลาย (HI/CI) พ่นหมอกควันกำจัดยุง และแจกทรายอะเบทในหมู่บ้านที่มีประวัติการระบาด',
    workgroupId: 'wg-04',
    subActivity: 'โรคติดต่อ - ไข้เลือดออกและยุงลาย',
    mainAssigneeId: 'usr-04',
    coAssigneeIds: ['usr-06', 'usr-12'],
    startDate: '2026-08-01',
    dueDate: '2026-08-20',
    priority: 'urgent',
    status: 'completed',
    progress: 100,
    kpiId: 'kpi-004',
    targetValue: 'ค่า HI ในชุมชนน้อยกว่าร้อยละ 5 และ CI เท่ากับ 0',
    notes: 'สำรวจครบ 12 หมู่บ้าน ดัชนี HI อยู่ที่ 3.2% ผ่านเกณฑ์มาตรฐาน',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-20T17:00:00Z',
    subtasks: [
      { id: 'st-111', title: 'จัดทีมพ่นหมอกควันเคมีกำจัดยุงตัวแก่', completed: true },
      { id: 'st-112', title: 'แจกจ่ายทรายทีมีฟอส (ทรายอะเบท)', completed: true },
      { id: 'st-113', title: 'ประเมินค่า HI/CI หลังรณรงค์', completed: true }
    ],
    timeline: [
      { id: 'tl-111', step: 'เริ่มมาตรการ 3 เก็บ 3 โรค', status: 'completed', timestamp: '2026-08-20 17:00', updatedBy: 'นายธนกฤต แสนสุข' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-012',
    taskCode: 'PNK-67-012',
    title: 'โครงการคัดกรองพัฒนาการเด็กปฐมวัย DSPM ช่วงอายุ 9, 18, 30, 42 เดือน',
    description: 'ติดตามประเมินพัฒนาการเด็กปฐมวัยตามคู่มือ DSPM ในศูนย์เด็กเล็กและคลินิก Well Baby Clinic',
    workgroupId: 'wg-03',
    subActivity: 'เด็กก่อนวัยเรียน (0-5 ปี)',
    mainAssigneeId: 'usr-03',
    coAssigneeIds: ['usr-07'],
    startDate: '2026-08-01',
    dueDate: '2026-08-31',
    priority: 'normal',
    status: 'in_progress',
    progress: 90,
    kpiId: 'kpi-003',
    targetValue: 'เด็กได้รับการคัดกรองพัฒนาการไม่น้อยกว่าร้อยละ 90',
    notes: 'คัดกรองแล้ว 115 ราย พบพัฒนาการสงสัยล่าช้า 4 ราย ส่งกระตุ้นพัฒนาการ',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-29T10:00:00Z',
    subtasks: [
      { id: 'st-121', title: 'คัดกรองพัฒนาการ DSPM', completed: true },
      { id: 'st-122', title: 'แนะนำคู่มือส่งเสริมพัฒนาการแก่ผู้ปกครอง', completed: true },
      { id: 'st-123', title: 'นัดติดตามซ้ำกรณีสงสัยล่าช้าใน 30 วัน', completed: false }
    ],
    timeline: [
      { id: 'tl-121', step: 'ดำเนินงานตามคลินิกเด็กดี', status: 'in_progress', timestamp: '2026-08-01 09:00', updatedBy: 'พว.นงลักษณ์ มงคลกุล' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-013',
    taskCode: 'PNK-67-013',
    title: 'จัดกิจกรรมกลุ่มบำบัดผู้ป่วยติดสุราและยาเสพติด (CBTx) ชุมชนบำบัด',
    description: 'จัดกระบวนการบำบัดฟื้นฟูผู้ติดยาเสพติดแบบสมัครใจผ่านโปรแกรม Matrix Program ชุมชนล้อมรักษ์',
    workgroupId: 'wg-10',
    subActivity: 'คลินิกบำบัดรักษาผู้ติดยาเสพติด (CBTx)',
    mainAssigneeId: 'usr-08',
    coAssigneeIds: ['usr-04', 'usr-01'],
    startDate: '2026-08-10',
    dueDate: '2026-09-20',
    priority: 'high',
    status: 'in_progress',
    progress: 55,
    kpiId: 'kpi-010',
    targetValue: 'ผู้เข้ารับการบำบัดผ่านการติดตามครบ 1 ปี ไม่น้อยกว่าร้อยละ 60',
    notes: 'ผู้เข้าร่วมกิจกรรม 12 ราย มีการตรวจสารเสพติดในปัสสาวะติดตามผล',
    fiscalYear: 2569,
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z',
    subtasks: [
      { id: 'st-131', title: 'ประเมินความพร้อมและคัดกรอง ASSIST', completed: true },
      { id: 'st-132', title: 'จัดกิจกรรมกลุ่มสัมพันธ์และเสริมพลัง', completed: true },
      { id: 'st-133', title: 'ติดตามหลังการบำบัดต่อเนื่อง', completed: false }
    ],
    timeline: [
      { id: 'tl-131', step: 'เปิดคลินิกชุมชนล้อมรักษ์', status: 'in_progress', timestamp: '2026-08-10 10:00', updatedBy: 'นางสาวพิมพา สุวรรณโคตร' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-014',
    taskCode: 'PNK-67-014',
    title: 'โครงการคัดกรองมะเร็งลำไส้ใหญ่ด้วยวิธี FIT Test ประจำปี',
    description: 'แจกจ่ายหลอดเก็บอุจจาระตรวจ FIT Test แก่ประชาชนกลุ่มเสี่ยงอายุ 50-70 ปี ในพื้นที่รับผิดชอบ',
    workgroupId: 'wg-04',
    subActivity: 'NCD - คัดกรองมะเร็งปากมดลูก/เต้านม/ลำไส้/ตับ-ท่อน้ำดี',
    mainAssigneeId: 'usr-04',
    coAssigneeIds: ['usr-12'],
    startDate: '2026-07-15',
    dueDate: '2026-08-25',
    priority: 'normal',
    status: 'pending',
    progress: 80,
    kpiId: 'kpi-004',
    targetValue: 'ตรวจ FIT Test ครบ 350 ราย',
    notes: 'รอผลการตรวจทางห้องปฏิบัติการ รพ.ศูนย์สกลนคร อีก 45 ราย',
    fiscalYear: 2569,
    createdAt: '2026-07-15T08:30:00Z',
    updatedAt: '2026-08-25T14:00:00Z',
    subtasks: [
      { id: 'st-141', title: 'จ่ายหลอด FIT Test ให้ อสม.', completed: true },
      { id: 'st-142', title: 'รับตัวอย่างส่งตรวจแล็บ', completed: true },
      { id: 'st-143', title: 'รอผลแล็บและส่งต่อ Colonoscopy หากผลบวก', completed: false }
    ],
    timeline: [
      { id: 'tl-141', step: 'ส่งตัวอย่างตรวจแล็บ', status: 'pending', timestamp: '2026-08-25 14:00', updatedBy: 'นายธนกฤต แสนสุข' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-015',
    taskCode: 'PNK-67-015',
    title: 'ขับเคลื่อนคณะกรรมการพัฒนาคุณภาพชีวิตระดับอำเภอ (พชอ.)',
    description: 'จัดประชุมคณะกรรมการ พชอ. โพนนาแก้ว ติดตามประเด็นอุบัติเหตุจราจร และการดูแลผู้สูงอายุเปราะบาง',
    workgroupId: 'wg-07',
    subActivity: 'คณะกรรมการพัฒนาคุณภาพชีวิตระดับอำเภอ (พชอ.)',
    mainAssigneeId: 'usr-01',
    coAssigneeIds: ['usr-04', 'usr-02'],
    startDate: '2026-08-20',
    dueDate: '2026-09-10',
    priority: 'normal',
    status: 'in_progress',
    progress: 50,
    kpiId: 'kpi-007',
    targetValue: 'จัดประชุม พชอ. ขับเคลื่อนครบ 2 ประเด็นหลัก',
    notes: 'จัดประชุมวันที่ 4 ก.ย. ณ ห้องประชุมที่ว่าการอำเภอโพนนาแก้ว',
    fiscalYear: 2569,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-26T11:00:00Z',
    subtasks: [
      { id: 'st-151', title: 'ทำหนังสือเชิญคณะกรรมการ พชอ.', completed: true },
      { id: 'st-152', title: 'จัดทำเอกสารประกอบการประชุม', completed: true },
      { id: 'st-153', title: 'สรุปมติที่ประชุมและติดตามแผนงาน', completed: false }
    ],
    timeline: [
      { id: 'tl-151', step: 'ส่งหนังสือเชิญประชุม', status: 'in_progress', timestamp: '2026-08-20 11:00', updatedBy: 'นพ.วิศรุต วงศ์พิริยะ' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-016',
    taskCode: 'PNK-67-016',
    title: 'โครงการอบรมผู้ประกอบการร้านอาหารและแผงลอยจำหน่ายอาหาร',
    description: 'อบรมหลักสูตรสุขาภิบาลอาหารสำหรับผู้ประกอบการและผู้สัมผัสอาหารตามกฎกระทรวงสุขาภิบาลอาหาร',
    workgroupId: 'wg-06',
    subActivity: 'การบังคับใช้กฎหมายการสาธารณสุขและ พ.ร.บ.',
    mainAssigneeId: 'usr-06',
    coAssigneeIds: ['usr-12'],
    startDate: '2026-09-01',
    dueDate: '2026-09-25',
    priority: 'normal',
    status: 'not_started',
    progress: 0,
    kpiId: 'kpi-006',
    targetValue: 'ผู้สัมผัสอาหารผ่านการอบรม 50 คน',
    notes: 'กำลังเปิดรับสมัครผู้ประกอบการในพื้นที่',
    fiscalYear: 2569,
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-25T08:00:00Z',
    subtasks: [
      { id: 'st-161', title: 'ประชาสัมพันธ์รับสมัคร', completed: false },
      { id: 'st-162', title: 'จัดอบรม ภาคทฤษฎีและปฏิบัติ', completed: false },
      { id: 'st-163', title: 'มอบวุฒิบัตรและบัตรผู้สัมผัสอาหาร', completed: false }
    ],
    timeline: [
      { id: 'tl-161', step: 'กำหนดแผนงาน', status: 'not_started', timestamp: '2026-08-25 08:30', updatedBy: 'นายชัยยุทธ ทิพย์โสภา' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-017',
    taskCode: 'PNK-67-017',
    title: 'พัฒนานวัตกรรมระบบสารสนเทศติดตามเวชปฏิบัติครอบครัว (Smart PCU)',
    description: 'ออกแบบและพัฒนาระบบบันทึกข้อมูลการเยี่ยมบ้านและการติดตาม KPI ปฐมภูมิแบบ Real-time',
    workgroupId: 'wg-01',
    subActivity: 'งานวิชาการ วิจัย และนวัตกรรม',
    mainAssigneeId: 'usr-09',
    coAssigneeIds: ['usr-01'],
    startDate: '2026-08-01',
    dueDate: '2026-09-30',
    priority: 'high',
    status: 'in_progress',
    progress: 70,
    kpiId: 'kpi-001',
    targetValue: 'มีระบบพร้อมใช้งานในไตรมาส 4',
    notes: 'กำลังทดสอบเชื่อมโยงกับฐานข้อมูลโรงพยาบาล',
    fiscalYear: 2569,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-29T17:00:00Z',
    subtasks: [
      { id: 'st-171', title: 'วิเคราะห์ Requirement และ Workflow', completed: true },
      { id: 'st-172', title: 'พัฒนา Prototype และหน้าจอ UI', completed: true },
      { id: 'st-173', title: 'ทดสอบระบบกับเจ้าหน้าที่ผู้ใช้งานจริง', completed: false }
    ],
    timeline: [
      { id: 'tl-171', step: 'เริ่มพัฒนา Prototype', status: 'in_progress', timestamp: '2026-08-01 09:30', updatedBy: 'นายอดิศร วรราช' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-018',
    taskCode: 'PNK-67-018',
    title: 'โครงการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA Self-Sampling',
    description: 'รณรงค์ตรวจคัดกรองมะเร็งปากมดลูกแบบเก็บสิ่งส่งตรวจด้วยตนเองในสตรีอายุ 30-59 ปี',
    workgroupId: 'wg-04',
    subActivity: 'NCD - คัดกรองมะเร็งปากมดลูก/เต้านม/ลำไส้/ตับ-ท่อน้ำดี',
    mainAssigneeId: 'usr-04',
    coAssigneeIds: ['usr-03'],
    startDate: '2026-08-10',
    dueDate: '2026-09-15',
    priority: 'normal',
    status: 'in_progress',
    progress: 60,
    kpiId: 'kpi-004',
    targetValue: 'สตรีกลุ่มเป้าหมายได้รับการตรวจ 300 ราย',
    notes: 'แจกจ่ายชุดตรวจแล้ว 220 ชุด รับกลับส่งแล็บแล้ว 180 ชุด',
    fiscalYear: 2569,
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
    subtasks: [
      { id: 'st-181', title: 'เบิกชุดตรวจ HPV Self-Sampling', completed: true },
      { id: 'st-182', title: 'สาธิตและแจกจ่ายชุดตรวจ', completed: true },
      { id: 'st-183', title: 'ส่งตรวจแล็บศูนย์วิทยาศาสตร์การแพทย์', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-019',
    taskCode: 'PNK-67-019',
    title: 'การประเมินมาตรฐานโรงพยาบาลที่เป็นมิตรกับสิ่งแวดล้อม (GREEN & CLEAN Hospital)',
    description: 'ประเมินตนเองตามเกณฑ์ Green & Clean Hospital Plus ในหมวดการจัดการของเสีย พลังงาน และภูมิทัศน์',
    workgroupId: 'wg-01',
    subActivity: 'GREEN & CLEAN Hospital',
    mainAssigneeId: 'usr-06',
    coAssigneeIds: ['usr-01'],
    startDate: '2026-08-01',
    dueDate: '2026-08-28',
    priority: 'normal',
    status: 'completed',
    progress: 100,
    kpiId: 'kpi-001',
    targetValue: 'ผ่านเกณฑ์ระดับดีเยี่ยม (Gold Level)',
    notes: 'ประเมินตนเองได้คะแนน 94.2% ส่งรายงาน สสจ. เรียบร้อย',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z',
    subtasks: [
      { id: 'st-191', title: 'สำรวจระบบบำบัดน้ำเสียและถังขยะติดเชื้อ', completed: true },
      { id: 'st-192', title: 'รวบรวมหลักฐานและภาพถ่าย', completed: true },
      { id: 'st-193', title: 'ส่งแบบประเมินผ่านระบบออนไลน์', completed: true }
    ],
    timeline: [
      { id: 'tl-191', step: 'ส่งแบบประเมินเรียบร้อย', status: 'completed', timestamp: '2026-08-28 16:00', updatedBy: 'นายชัยยุทธ ทิพย์โสภา' }
    ],
    comments: [],
    attachments: [
      { id: 'att-191', name: 'รายงานสรุปGreen_and_Clean_2569.pdf', fileType: 'pdf', fileSize: '4.2 MB', uploadedBy: 'นายชัยยุทธ ทิพย์โสภา', uploadedAt: '2026-08-28 16:15', docType: 'แบบประเมินตนเอง' }
    ]
  },
  {
    id: 'tsk-020',
    taskCode: 'PNK-67-020',
    title: 'โครงการดูแลสุขภาพพระภิกษุและสามเณร (Health Station วัดต้นแบบ)',
    description: 'ตรวจคัดกรองสุขภาพและถวายความรู้ด้านโภชนาการแด่พระภิกษุสงฆ์ในเขตอำเภอโพนนาแก้ว 25 วัด',
    workgroupId: 'wg-03',
    subActivity: 'พระภิกษุและสามเณร',
    mainAssigneeId: 'usr-03',
    coAssigneeIds: ['usr-12', 'usr-05'],
    startDate: '2026-08-15',
    dueDate: '2026-09-15',
    priority: 'normal',
    status: 'in_progress',
    progress: 45,
    kpiId: 'kpi-003',
    targetValue: 'พระสงฆ์ได้รับการตรวจสุขภาพ 100 รูป',
    notes: 'ตรวจสุขภาพแล้ว 10 วัด พระสงฆ์ 48 รูป',
    fiscalYear: 2569,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-27T15:00:00Z',
    subtasks: [
      { id: 'st-201', title: 'จัดเตรียมหน่วยแพทย์เคลื่อนที่', completed: true },
      { id: 'st-202', title: 'ลงพื้นที่ตรวจสุขภาพวัดสายธรรมยุติและมหานิกาย', completed: false },
      { id: 'st-203', title: 'จัดทำสมุดประจำตัวสุขภาพพระสงฆ์', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-021',
    taskCode: 'PNK-67-021',
    title: 'จัดทำรายงานผลการดำเนินงานกลุ่มงานปฐมภูมิรอบ 9 เดือน',
    description: 'รวบรวมสรุปผลงานตามยุทธศาสตร์และตัวชี้วัดรายไตรมาสเพื่อนำเสนอต่อคณะกรรมการบริหารโรงพยาบาล',
    workgroupId: 'wg-13',
    subActivity: 'การจัดทำรายงานสถิติสุขภาพและสารสนเทศประจำงวด',
    mainAssigneeId: 'usr-09',
    coAssigneeIds: ['usr-01'],
    startDate: '2026-08-20',
    dueDate: '2026-09-05',
    priority: 'high',
    status: 'in_progress',
    progress: 70,
    kpiId: 'kpi-013',
    targetValue: 'จัดทำเล่มรายงานสมบูรณ์ 1 เล่ม',
    notes: 'อยู่ระหว่างรอสรุปผลงานกลุ่มงานเวชกรรมสังคม',
    fiscalYear: 2569,
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-08-29T14:00:00Z',
    subtasks: [
      { id: 'st-211', title: 'รวบรวมข้อมูลจาก 13 กลุ่มงาน', completed: true },
      { id: 'st-212', title: 'วิเคราะห์ผลสำเร็จ KPI และปัญหาอุปสรรค', completed: true },
      { id: 'st-213', title: 'จัดทำสไลด์นำเสนอผู้บริหาร', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-022',
    taskCode: 'PNK-67-022',
    title: 'โครงการพัฒนาทักษะการให้คำปรึกษา (Health Counseling) แก่บุคลากร',
    description: 'จัดอบรมเชิงปฏิบัติการเทคนิคการสื่อสารและการให้คำปรึกษาด้านสุขภาพแก่พยาบาลและนักวิชาการ',
    workgroupId: 'wg-11',
    subActivity: 'การให้คำปรึกษาทางสุขภาพ (Health Counseling)',
    mainAssigneeId: 'usr-12',
    coAssigneeIds: ['usr-08'],
    startDate: '2026-09-05',
    dueDate: '2026-09-28',
    priority: 'low',
    status: 'not_started',
    progress: 0,
    kpiId: 'kpi-011',
    targetValue: 'บุคลากรผ่านการอบรม 25 คน',
    notes: 'เชิญวิทยากรจากโรงพยาบาลจิตเวชนครพนมราชนครินทร์',
    fiscalYear: 2569,
    createdAt: '2026-08-25T09:00:00Z',
    updatedAt: '2026-08-25T09:00:00Z',
    subtasks: [
      { id: 'st-221', title: 'ทำหนังสือเชิญวิทยากร', completed: false },
      { id: 'st-222', title: 'จัดทำหลักสูตรฝึกอบรม', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-023',
    taskCode: 'PNK-67-023',
    title: 'สอบสวนโรคไข้เลือดออกและควบคุมโรคในพื้นที่ระบาด ม.3 ต.นาแก้ว',
    description: 'ทีม SRRT ลงพื้นที่สอบสวนโรคผู้ป่วยไข้เลือดออก 1 ราย พ่นสารเคมีรัศมี 100 เมตร และค้นหาผู้ป่วยเพิ่มเติม',
    workgroupId: 'wg-04',
    subActivity: 'สาธารณภัย / EOC / ทีม SRRT ระบาดวิทยา',
    mainAssigneeId: 'usr-04',
    coAssigneeIds: ['usr-06'],
    startDate: '2026-08-24',
    dueDate: '2026-08-27',
    priority: 'urgent',
    status: 'completed',
    progress: 100,
    kpiId: 'kpi-004',
    targetValue: 'ควบคุมโรคได้ภายใน 3 ชั่วโมงและไม่พบผู้ป่วยรายที่สอง',
    notes: 'ควบคุมโรคเรียบร้อย ไม่พบผู้ป่วยเพิ่มเติมในรอบ 14 วัน',
    fiscalYear: 2569,
    createdAt: '2026-08-24T10:00:00Z',
    updatedAt: '2026-08-27T17:00:00Z',
    subtasks: [
      { id: 'st-231', title: 'ลงพื้นที่สอบสวนประวัติการสัมผัสโรค', completed: true },
      { id: 'st-232', title: 'พ่นสารเคมีควบคุมยุงลายภายใน 24 ชม.', completed: true },
      { id: 'st-233', title: 'รายงานระบบแจ้งเตือนโรค 506', completed: true }
    ],
    timeline: [
      { id: 'tl-231', step: 'เปิดปฏิบัติการ SRRT', status: 'completed', timestamp: '2026-08-24 10:30', updatedBy: 'นายธนกฤต แสนสุข' },
      { id: 'tl-232', step: 'ปิดเคสสอบสวนโรค', status: 'completed', timestamp: '2026-08-27 16:30', updatedBy: 'นายธนกฤต แสนสุข' }
    ],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-024',
    taskCode: 'PNK-67-024',
    title: 'คลินิก DPAC ปรับเปลี่ยนพฤติกรรมกลุ่มเสี่ยงโรคอ้วนลงพุง',
    description: 'จัดกิจกรรมกลุ่มลดน้ำหนัก ลดพุง ลดโรค ด้วยหลัก 3อ. 2ส. ตรวจวัดองค์ประกอบร่างกาย InBody และให้คำปรึกษาโภชนาการ',
    workgroupId: 'wg-05',
    subActivity: 'DPAC (คลินิกไร้พุง ปรับเปลี่ยนพฤติกรรม)',
    mainAssigneeId: 'usr-05',
    coAssigneeIds: ['usr-12'],
    startDate: '2026-08-01',
    dueDate: '2026-09-30',
    priority: 'normal',
    status: 'in_progress',
    progress: 55,
    kpiId: 'kpi-005',
    targetValue: 'ผู้เข้าร่วมโครงการลดรอบเอวได้ไม่น้อยกว่า 5 ซม. ร้อยละ 50',
    notes: 'ผู้เข้าร่วมโครงการ 35 ราย',
    fiscalYear: 2569,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
    subtasks: [
      { id: 'st-241', title: 'ตรวจวัดรอบเอว น้ำหนัก และไขมัน', completed: true },
      { id: 'st-242', title: 'จัดกิจกรรมออกกำลังกายกลุ่ม', completed: true },
      { id: 'st-243', title: 'ประเมินผลรอบ 2 เดือน', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-025',
    taskCode: 'PNK-67-025',
    title: 'โครงการเยี่ยมมารดาและทารกหลังคลอด 3 ครั้งตามเกณฑ์มาตรฐาน',
    description: 'ติดตามเยี่ยมมารดาหลังคลอดและทารกที่บ้าน ส่งเสริมการเลี้ยงลูกด้วยนมแม่ และตรวจภาวะซึมเศร้าหลังคลอด',
    workgroupId: 'wg-03',
    subActivity: 'มารดาและทารก',
    mainAssigneeId: 'usr-03',
    coAssigneeIds: ['usr-02'],
    startDate: '2026-08-01',
    dueDate: '2026-08-31',
    priority: 'normal',
    status: 'in_progress',
    progress: 85,
    kpiId: 'kpi-003',
    targetValue: 'มารดาหลังคลอดได้รับการดูแลครบ 3 ครั้ง ร้อยละ 85',
    notes: 'ดูแลแล้ว 18 ราย เยี่ยมครบตามเกณฑ์ 16 ราย',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-28T14:00:00Z',
    subtasks: [
      { id: 'st-251', title: 'ติดตามรายชื่อคลอดจากห้องคลอด', completed: true },
      { id: 'st-252', title: 'นัดหมายเยี่ยมบ้านร่วมกับ อสม.', completed: true },
      { id: 'st-253', title: 'บันทึกข้อมูลระบบ MCH', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-026',
    taskCode: 'PNK-67-026',
    title: 'เตรียมความพร้อมระบบส่งต่อฉุกเฉินและ Smart EMS ร่วมกับ อปท.',
    description: 'ประสานงาน อปท. 5 แห่ง ซ้อมแผนรับมืออุบัติเหตุหมู่และเชื่อมโยงระบบพิกัด Smart Ambulance',
    workgroupId: 'wg-01',
    subActivity: 'EMS & Smart Hospital',
    mainAssigneeId: 'usr-01',
    coAssigneeIds: ['usr-04', 'usr-09'],
    startDate: '2026-08-15',
    dueDate: '2026-09-15',
    priority: 'normal',
    status: 'in_progress',
    progress: 50,
    kpiId: 'kpi-001',
    targetValue: 'อปท. ทุกแห่งมีระบบพิกัด GPS พร้อมใช้งาน',
    notes: 'ซ้อมแผนวันที่ 8 กันยายน ณ แยกโพนนาแก้ว',
    fiscalYear: 2569,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-26T10:00:00Z',
    subtasks: [
      { id: 'st-261', title: 'ตรวจเช็คอุปกรณ์สื่อสารและ GPS', completed: true },
      { id: 'st-262', title: 'ประชุมเตรียมความพร้อมเจ้าหน้าที่กู้ชีพ', completed: true },
      { id: 'st-263', title: 'ซ้อมแผนปฏิบัติการเสมือนจริง', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-027',
    taskCode: 'PNK-67-027',
    title: 'โครงการคัดกรองวัณโรคเชิงรุกในกลุ่มเสี่ยงสูง (Active Case Finding)',
    description: 'เอกซเรย์ปอดเคลื่อนที่และตรวจเสมหะ GeneXpert กลุ่มผู้สัมผัสร่วมบ้านผู้ป่วย TB และผู้ต้องขัง',
    workgroupId: 'wg-04',
    subActivity: 'โรคติดต่อ - วัณโรค (TB)',
    mainAssigneeId: 'usr-04',
    coAssigneeIds: ['usr-02'],
    startDate: '2026-08-01',
    dueDate: '2026-08-30',
    priority: 'high',
    status: 'in_progress',
    progress: 80,
    kpiId: 'kpi-004',
    targetValue: 'คัดกรองกลุ่มสัมผัสร่วมบ้านครบ 100%',
    notes: 'คัดกรองแล้ว 85 ราย พบผู้ป่วยรายใหม่ 1 ราย เริ่มยารักษาทันที',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z',
    subtasks: [
      { id: 'st-271', title: 'ค้นหารายชื่อผู้สัมผัสร่วมบ้าน', completed: true },
      { id: 'st-272', title: 'ตรวจเอกซเรย์ปอดดิจิทัล', completed: true },
      { id: 'st-273', title: 'ติดตามกินยาแบบ DOTs โดย อสม.', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-028',
    taskCode: 'PNK-67-028',
    title: 'ประเมินศูนย์พัฒนาเด็กเล็กคุณภาพมาตรฐานสุขอนามัย',
    description: 'ตรวจประเมินศูนย์พัฒนาเด็กเล็ก 8 แห่ง ด้านสุขอนามัย น้ำดื่ม การป้องกันโรคมือเท้าปาก และสุขาภิบาล',
    workgroupId: 'wg-08',
    subActivity: 'ศูนย์พัฒนาเด็กเล็กคุณภาพ (ศพด.)',
    mainAssigneeId: 'usr-07',
    coAssigneeIds: ['usr-06', 'usr-03'],
    startDate: '2026-08-10',
    dueDate: '2026-09-08',
    priority: 'normal',
    status: 'in_progress',
    progress: 60,
    kpiId: 'kpi-008',
    targetValue: 'ผ่านเกณฑ์ ศพด. คุณภาพ 100%',
    notes: 'ประเมินแล้ว 5 แห่ง ผ่านเกณฑ์ 4 แห่ง กำลังปรับปรุง 1 แห่ง',
    fiscalYear: 2569,
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-27T11:00:00Z',
    subtasks: [
      { id: 'st-281', title: 'ตรวจอุปกรณ์และสุขอนามัยห้องนอน/ห้องน้ำ', completed: true },
      { id: 'st-282', title: 'ตรวจคัดกรองสุขภาพเด็กประจำวัน', completed: true },
      { id: 'st-283', title: 'สรุปผลและมอบเกียรติบัตร', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-029',
    taskCode: 'PNK-67-029',
    title: 'โครงการหมู่บ้านจัดการสุขภาพและส่งเสริมการใช้พืชสมุนไพร',
    description: 'ส่งเสริมการใช้ยาสมุนไพรในงานบริการปฐมภูมิ และจัดตั้งศูนย์เรียนรู้สุขภาพชุมชน',
    workgroupId: 'wg-11',
    subActivity: 'ศูนย์เรียนรู้สุขภาพชุมชน',
    mainAssigneeId: 'usr-12',
    coAssigneeIds: ['usr-05'],
    startDate: '2026-09-01',
    dueDate: '2026-09-30',
    priority: 'low',
    status: 'not_started',
    progress: 0,
    kpiId: 'kpi-011',
    targetValue: 'จัดตั้งศูนย์เรียนรู้สมุนไพรต้นแบบ 1 แห่ง',
    notes: 'คัดเลือกบ้านนาแก้วเป็นหมู่บ้านต้นแบบ',
    fiscalYear: 2569,
    createdAt: '2026-08-28T09:00:00Z',
    updatedAt: '2026-08-28T09:00:00Z',
    subtasks: [
      { id: 'st-291', title: 'สำรวจพื้นที่แปลงสมุนไพร', completed: false },
      { id: 'st-292', title: 'จัดอบรมการแปรรูปสมุนไพรเบื้องต้น', completed: false }
    ],
    timeline: [],
    comments: [],
    attachments: []
  },
  {
    id: 'tsk-030',
    taskCode: 'PNK-67-030',
    title: 'โครงการ Home Ward การดูแลผู้ป่วยกึ่งเฉียบพลันที่บ้าน',
    description: 'ให้บริการดูแลผู้ป่วยที่มีอาการคงที่ที่บ้าน เช่น ปอดบวมระยะฟื้นตัว หรือการให้ยาปฏิชีวนะทางหลอดเลือดดำที่บ้าน',
    workgroupId: 'wg-02',
    subActivity: 'Home Ward (หอผู้ป่วยที่บ้าน)',
    mainAssigneeId: 'usr-02',
    coAssigneeIds: ['usr-01', 'usr-11'],
    startDate: '2026-08-01',
    dueDate: '2026-08-31',
    priority: 'urgent',
    status: 'in_progress',
    progress: 80,
    kpiId: 'kpi-002',
    targetValue: 'รับผู้ป่วย Home Ward สะสม 20 รายต่อเดือน',
    notes: 'รับผู้ป่วยแล้ว 17 ราย ไม่มีภาวะแทรกซ้อนกลับมารักษาซ้ำ',
    fiscalYear: 2569,
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-29T15:00:00Z',
    subtasks: [
      { id: 'st-301', title: 'ประเมินเกณฑ์รับผู้ป่วยเข้า Home Ward', completed: true },
      { id: 'st-302', title: 'เยี่ยมตรวจผ่านระบบ Telemedicine และลงพื้นที่', completed: true },
      { id: 'st-303', title: 'สรุปการจำหน่ายผู้ป่วยเมื่อหายเป็นปกติ', completed: false }
    ],
    timeline: [
      { id: 'tl-301', step: 'เริ่มโครงการ Home Ward', status: 'in_progress', timestamp: '2026-08-01 09:00', updatedBy: 'พว.กาญจนา ศรีประเสริฐ' }
    ],
    comments: [
      { id: 'cm-301', userId: 'usr-02', userName: 'พว.กาญจนา ศรีประเสริฐ', content: 'ทีมแพทย์และพยาบาลตรวจเยี่ยมผ่านระบบ Telemedicine ทุกวันเวลา 10.00 น.', createdAt: '2026-08-20 10:30' }
    ],
    attachments: [
      { id: 'att-301', name: 'แนวทางการดูแลผู้ป่วยHomeWard_รพโพนนาแก้ว.pdf', fileType: 'pdf', fileSize: '2.8 MB', uploadedBy: 'พว.กาญจนา ศรีประเสริฐ', uploadedAt: '2026-08-01 10:00', docType: 'คู่มือแนวทางปฏิบัติ' }
    ]
  }
];

export const initialKPIs: KPI[] = [
  {
    id: 'kpi-001',
    code: 'KPI-PNK-01',
    name: 'ร้อยละของประชากรที่มีแพทย์ประจำครอบครัว (3 หมอ)',
    workgroupId: 'wg-01',
    target: 100,
    actual: 96.5,
    unit: '%',
    achievementRate: 96.5,
    fiscalYear: 2569,
    assigneeId: 'usr-01',
    status: 'achieved',
    description: 'ประชากรในพื้นที่ได้รับมอบหมายทีม 3 หมอดูแลประจำครอบครัว',
    updatedAt: '2026-08-25'
  },
  {
    id: 'kpi-002',
    code: 'KPI-PNK-02',
    name: 'ร้อยละของผู้ป่วยติดเตียงและ Palliative Care ได้รับการเยี่ยมบ้านตามเกณฑ์',
    workgroupId: 'wg-02',
    target: 90,
    actual: 92.4,
    unit: '%',
    achievementRate: 102.6,
    fiscalYear: 2569,
    assigneeId: 'usr-02',
    status: 'achieved',
    description: 'ผู้ป่วยติดเตียงและผู้ป่วยระยะท้ายได้รับการดูแลต่อเนื่องตามมาตรฐาน',
    updatedAt: '2026-08-28'
  },
  {
    id: 'kpi-003',
    code: 'KPI-PNK-03',
    name: 'ร้อยละของเด็กอายุ 0-5 ปี มีพัฒนาการสมวัย (DSPM)',
    workgroupId: 'wg-03',
    target: 85,
    actual: 88.2,
    unit: '%',
    achievementRate: 103.7,
    fiscalYear: 2569,
    assigneeId: 'usr-03',
    status: 'achieved',
    description: 'เด็กได้รับการตรวจคัดกรองและมีพัฒนาการสมวัยตามเกณฑ์',
    updatedAt: '2026-08-20'
  },
  {
    id: 'kpi-004',
    code: 'KPI-PNK-04',
    name: 'ร้อยละของประชากรอายุ 35 ปีขึ้นไป ได้รับการคัดกรองเบาหวานและความดันโลหิต',
    workgroupId: 'wg-04',
    target: 90,
    actual: 78.5,
    unit: '%',
    achievementRate: 87.2,
    fiscalYear: 2569,
    assigneeId: 'usr-04',
    status: 'nearly',
    description: 'ผลงานคัดกรองใกล้บรรลุเป้าหมาย อยู่ระหว่างเร่งเก็บตกพื้นที่รอบนอก',
    updatedAt: '2026-08-26'
  },
  {
    id: 'kpi-005',
    code: 'KPI-PNK-05',
    name: 'ร้อยละของเกษตรกรกลุ่มเสี่ยงได้รับการตรวจคัดกรองสารเคมีในเลือด',
    workgroupId: 'wg-05',
    target: 80,
    actual: 72.0,
    unit: '%',
    achievementRate: 90.0,
    fiscalYear: 2569,
    assigneeId: 'usr-05',
    status: 'nearly',
    description: 'เกษตรกรได้รับการตรวจ Reactive Paper และคำแนะนำ',
    updatedAt: '2026-08-25'
  },
  {
    id: 'kpi-006',
    code: 'KPI-PNK-06',
    name: 'ร้อยละของร้านอาหารและโรงอาหารผ่านเกณฑ์ Clean Food Good Taste',
    workgroupId: 'wg-06',
    target: 85,
    actual: 86.7,
    unit: '%',
    achievementRate: 102.0,
    fiscalYear: 2569,
    assigneeId: 'usr-06',
    status: 'achieved',
    description: 'ร้านอาหารผ่านเกณฑ์การตรวจสุขาภิบาลอาหารและน้ำ',
    updatedAt: '2026-08-28'
  },
  {
    id: 'kpi-007',
    code: 'KPI-PNK-07',
    name: 'ร้อยละของ รพ.สต. ในเครือข่ายผ่านเกณฑ์ รพ.สต.ติดดาว 5 ดาว 5 ดี',
    workgroupId: 'wg-07',
    target: 100,
    actual: 100,
    unit: '%',
    achievementRate: 100,
    fiscalYear: 2569,
    assigneeId: 'usr-01',
    status: 'achieved',
    description: 'รพ.สต. ทุกแห่งในเครือข่ายโพนนาแก้วได้รับการรับรอง',
    updatedAt: '2026-08-20'
  },
  {
    id: 'kpi-008',
    code: 'KPI-PNK-08',
    name: 'ร้อยละของนักเรียนหญิงชั้น ป.5 ได้รับวัคซีน HPV ครบตามเกณฑ์',
    workgroupId: 'wg-08',
    target: 95,
    actual: 98.4,
    unit: '%',
    achievementRate: 103.5,
    fiscalYear: 2569,
    assigneeId: 'usr-07',
    status: 'achieved',
    description: 'นักเรียนหญิง ป.5 ได้รับวัคซีนป้องกันมะเร็งปากมดลูก',
    updatedAt: '2026-08-15'
  },
  {
    id: 'kpi-009',
    code: 'KPI-PNK-09',
    name: 'ร้อยละของผู้ป่วยโรคเรื้อรัง (NCDs) ได้รับการคัดกรองภาวะซึมเศร้า (2Q)',
    workgroupId: 'wg-09',
    target: 80,
    actual: 84.1,
    unit: '%',
    achievementRate: 105.1,
    fiscalYear: 2569,
    assigneeId: 'usr-08',
    status: 'achieved',
    description: 'คัดกรองสุขภาพจิตและภาวะซึมเศร้าในกลุ่มผู้ป่วยเรื้อรัง',
    updatedAt: '2026-08-27'
  },
  {
    id: 'kpi-010',
    code: 'KPI-PNK-10',
    name: 'ร้อยละของผู้เข้ารับการบำบัดยาเสพติดผ่านการติดตามครบ 1 ปี (CBTx)',
    workgroupId: 'wg-10',
    target: 65,
    actual: 54.0,
    unit: '%',
    achievementRate: 83.0,
    fiscalYear: 2569,
    assigneeId: 'usr-08',
    status: 'nearly',
    description: 'การติดตามดูแลผู้ผ่านการบำบัดฟื้นฟูยาเสพติดในชุมชน',
    updatedAt: '2026-08-28'
  },
  {
    id: 'kpi-011',
    code: 'KPI-PNK-11',
    name: 'ร้อยละของ อสม. ส่งรายงานผลการปฏิบัติงานผ่านแอป Smart อสม.',
    workgroupId: 'wg-11',
    target: 95,
    actual: 96.8,
    unit: '%',
    achievementRate: 101.8,
    fiscalYear: 2569,
    assigneeId: 'usr-12',
    status: 'achieved',
    description: 'อสม. มีความเชี่ยวชาญด้านดิจิทัลและส่งรายงานประจำเดือน',
    updatedAt: '2026-08-26'
  },
  {
    id: 'kpi-012',
    code: 'KPI-PNK-12',
    name: 'อัตราความสำเร็จในการส่งเบิกชดเชยค่าบริการ PP Fee Schedule',
    workgroupId: 'wg-12',
    target: 95,
    actual: 92.5,
    unit: '%',
    achievementRate: 97.3,
    fiscalYear: 2569,
    assigneeId: 'usr-10',
    status: 'achieved',
    description: 'บันทึกส่งเบิกกองทุนหลักประกันสุขภาพถ้วนหน้าผ่านตามกำหนด',
    updatedAt: '2026-08-28'
  },
  {
    id: 'kpi-013',
    code: 'KPI-PNK-13',
    name: 'ร้อยละความถูกต้องสมบูรณ์ของข้อมูล 43 แฟ้ม (Data Quality Audit)',
    workgroupId: 'wg-13',
    target: 98,
    actual: 98.6,
    unit: '%',
    achievementRate: 100.6,
    fiscalYear: 2569,
    assigneeId: 'usr-09',
    status: 'achieved',
    description: 'ความถูกต้องของฐานข้อมูลสุขภาพปฐมภูมิ HDC',
    updatedAt: '2026-08-10'
  },
  {
    id: 'kpi-014',
    code: 'KPI-PNK-14',
    name: 'ร้อยละของผู้ป่วยเบาหวานที่ควบคุมระดับน้ำตาลในเลือดได้ดี (HbA1c < 7%)',
    workgroupId: 'wg-04',
    target: 40,
    actual: 32.5,
    unit: '%',
    achievementRate: 81.2,
    fiscalYear: 2569,
    assigneeId: 'usr-04',
    status: 'not_achieved',
    description: 'อัตราการควบคุมน้ำตาลในเลือดของผู้ป่วยเบาหวานยังต่ำกว่าเป้าหมาย',
    updatedAt: '2026-08-25'
  },
  {
    id: 'kpi-015',
    code: 'KPI-PNK-15',
    name: 'ร้อยละของผู้ป่วยความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี (<140/90)',
    workgroupId: 'wg-04',
    target: 50,
    actual: 53.2,
    unit: '%',
    achievementRate: 106.4,
    fiscalYear: 2569,
    assigneeId: 'usr-04',
    status: 'achieved',
    description: 'ผู้ป่วยความดันโลหิตสูงควบคุมระดับความดันได้ตามเกณฑ์',
    updatedAt: '2026-08-25'
  },
  {
    id: 'kpi-016',
    code: 'KPI-PNK-16',
    name: 'ร้อยละของหญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกก่อน 12 สัปดาห์ (Early ANC)',
    workgroupId: 'wg-03',
    target: 80,
    actual: 76.5,
    unit: '%',
    achievementRate: 95.6,
    fiscalYear: 2569,
    assigneeId: 'usr-03',
    status: 'nearly',
    description: 'หญิงตั้งครรภ์ได้รับการฝากครรภ์เร็วเพื่อประเมินความเสี่ยง',
    updatedAt: '2026-08-28'
  },
  {
    id: 'kpi-017',
    code: 'KPI-PNK-17',
    name: 'ร้อยละของทารกกินนมแม่อย่างเดียวอย่างน้อย 6 เดือน',
    workgroupId: 'wg-03',
    target: 50,
    actual: 54.2,
    unit: '%',
    achievementRate: 108.4,
    fiscalYear: 2569,
    assigneeId: 'usr-03',
    status: 'achieved',
    description: 'ส่งเสริมการเลี้ยงลูกด้วยนมแม่อย่างต่อเนื่อง',
    updatedAt: '2026-08-28'
  },
  {
    id: 'kpi-018',
    code: 'KPI-PNK-18',
    name: 'อัตราความสำเร็จในการรักษาผู้ป่วยวัณโรครายใหม่ (Cure & Completed Rate)',
    workgroupId: 'wg-04',
    target: 85,
    actual: 88.0,
    unit: '%',
    achievementRate: 103.5,
    fiscalYear: 2569,
    assigneeId: 'usr-04',
    status: 'achieved',
    description: 'ผู้ป่วยวัณโรคได้รับการดูแลกินยาครบจนหายขาดด้วยระบบ DOTs',
    updatedAt: '2026-08-20'
  },
  {
    id: 'kpi-019',
    code: 'KPI-PNK-19',
    name: 'ร้อยละของศูนย์พัฒนาเด็กเล็กผ่านเกณฑ์ ศพด. คุณภาพ',
    workgroupId: 'wg-08',
    target: 100,
    actual: 87.5,
    unit: '%',
    achievementRate: 87.5,
    fiscalYear: 2569,
    assigneeId: 'usr-07',
    status: 'nearly',
    description: 'ศูนย์พัฒนาเด็กเล็กในสังกัด อปท. ผ่านเกณฑ์มาตรฐานสุขอนามัย',
    updatedAt: '2026-08-27'
  },
  {
    id: 'kpi-020',
    code: 'KPI-PNK-20',
    name: 'ระดับคะแนนการประเมิน GREEN & CLEAN Hospital Plus',
    workgroupId: 'wg-01',
    target: 90,
    actual: 94.2,
    unit: 'คะแนน',
    achievementRate: 104.6,
    fiscalYear: 2569,
    assigneeId: 'usr-06',
    status: 'achieved',
    description: 'โรงพยาบาลผ่านเกณฑ์การประเมินมาตรฐานสิ่งแวดล้อมระดับทอง',
    updatedAt: '2026-08-28'
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-001',
    title: 'ลงพื้นที่เยี่ยมบ้านผู้ป่วย LTC และ Palliative Care ต.โพนนาแก้ว',
    eventType: 'home_visit',
    date: '2026-08-30',
    startTime: '09:00',
    endTime: '12:00',
    location: 'ม.4 และ ม.7 ต.โพนนาแก้ว',
    workgroupId: 'wg-02',
    attendees: ['พว.กาญจนา ศรีประเสริฐ', 'พว.อารียา นามบุตร', 'อสม.ประจำหมู่บ้าน'],
    taskId: 'tsk-001',
    notes: 'เยี่ยมผู้ป่วยติดเตียง 3 ราย พร้อมส่งมอบเวชภัณฑ์และให้กำลังใจญาติ'
  },
  {
    id: 'ev-002',
    title: 'ประชุมประจำเดือนกลุ่มงานบริการด้านปฐมภูมิและองค์รวม',
    eventType: 'meeting',
    date: '2026-09-01',
    startTime: '13:30',
    endTime: '16:30',
    location: 'ห้องประชุมแก้วมุกดา รพ.โพนนาแก้ว',
    workgroupId: 'wg-01',
    attendees: ['เจ้าหน้าที่กลุ่มงานปฐมภูมิทุกคน'],
    notes: 'ติดตามความก้าวหน้าภารกิจ 13 กลุ่มงาน และเตรียมรับการประเมิน รพ.สต.ติดดาว'
  },
  {
    id: 'ev-003',
    title: 'ประชุมคณะกรรมการพัฒนาคุณภาพชีวิตระดับอำเภอ (พชอ.)',
    eventType: 'meeting',
    date: '2026-09-04',
    startTime: '09:30',
    endTime: '12:00',
    location: 'ห้องประชุมที่ว่าการอำเภอโพนนาแก้ว',
    workgroupId: 'wg-07',
    attendees: ['นพ.วิศรุต วงศ์พิริยะ', 'นายธนกฤต แสนสุข', 'คณะกรรมการ พชอ.'],
    taskId: 'tsk-015',
    notes: 'นำเสนอผลการดำเนินงานป้องกันอุบัติเหตุจราจร และการดูแลผู้สูงอายุ'
  },
  {
    id: 'ev-004',
    title: 'ออกหน่วยตรวจคัดกรองสารเคมีในเลือดเกษตรกร บ้านนาแก้ว',
    eventType: 'campaign',
    date: '2026-09-03',
    startTime: '08:30',
    endTime: '12:00',
    location: 'ศาลาประชาคมบ้านนาแก้ว ม.2',
    workgroupId: 'wg-05',
    attendees: ['นางกมลชนก ภูมิภาค', 'นายชัยยุทธ ทิพย์โสภา'],
    taskId: 'tsk-004',
    notes: 'เป้าหมายเกษตรกร 60 ราย'
  },
  {
    id: 'ev-005',
    title: 'กำหนดส่งข้อมูล 43 แฟ้ม และ HDC ประจำงวด สสจ.สกลนคร',
    eventType: 'report_deadline',
    date: '2026-09-10',
    startTime: '16:30',
    endTime: '17:00',
    location: 'ระบบออนไลน์ HDC',
    workgroupId: 'wg-13',
    attendees: ['นายอดิศร วรราช'],
    notes: 'ตรวจสอบ Data Quality ก่อนส่งออกข้อมูล'
  },
  {
    id: 'ev-006',
    title: 'การนิเทศติดตามงาน รพ.สต.บ้านหนองผือ รอบที่ 2/2569',
    eventType: 'supervision',
    date: '2026-09-08',
    startTime: '09:00',
    endTime: '15:00',
    location: 'รพ.สต.บ้านหนองผือ',
    workgroupId: 'wg-07',
    attendees: ['นพ.วิศรุต วงศ์พิริยะ', 'พว.กาญจนา ศรีประเสริฐ', 'นายอดิศร วรราช'],
    notes: 'นิเทศงาน NCD, คลินิก ANC, และการบันทึกข้อมูล 43 แฟ้ม'
  },
  {
    id: 'ev-007',
    title: 'ซ้อมแผนรับมืออุบัติเหตุฉุกเฉินและระบบ Smart EMS',
    eventType: 'campaign',
    date: '2026-09-08',
    startTime: '13:00',
    endTime: '16:00',
    location: 'สี่แยกโพนนาแก้ว',
    workgroupId: 'wg-01',
    attendees: ['ทีมแพทย์ฉุกเฉิน EMS', 'อปท. ในพื้นที่', 'สภ.โพนนาแก้ว'],
    taskId: 'tsk-026',
    notes: 'ซ้อมแผนเสมือนจริง'
  },
  {
    id: 'ev-008',
    title: 'คลินิกเด็กดี (Well Baby Clinic) และตรวจพัฒนาการ DSPM',
    eventType: 'campaign',
    date: '2026-09-02',
    startTime: '08:30',
    endTime: '12:00',
    location: 'แผนกส่งเสริมสุขภาพ รพ.โพนนาแก้ว',
    workgroupId: 'wg-03',
    attendees: ['พว.นงลักษณ์ มงคลกุล', 'พว.สุดารัตน์ พลจันทร์'],
    taskId: 'tsk-012',
    notes: 'ฉีดวัคซีนตามวัยและตรวจคัดกรองพัฒนาการ'
  },
  {
    id: 'ev-009',
    title: 'อบรมพัฒนาศักยภาพ อสม. Smart อสม. รุ่นที่ 2',
    eventType: 'meeting',
    date: '2026-09-01',
    startTime: '09:00',
    endTime: '12:00',
    location: 'ห้องประชุมแก้วมุกดา รพ.โพนนาแก้ว',
    workgroupId: 'wg-11',
    attendees: ['นายกิตติคุณ เมืองจันทร์', 'อสม. 60 คน'],
    taskId: 'tsk-010',
    notes: 'ฝึกปฏิบัติการส่งรายงาน ภารกิจ อสม. ออนไลน์'
  },
  {
    id: 'ev-010',
    title: 'กิจกรรมกลุ่มบำบัดผู้ป่วยยาเสพติด Matrix Program สัปดาห์ที่ 3',
    eventType: 'campaign',
    date: '2026-09-07',
    startTime: '13:30',
    endTime: '15:30',
    location: 'กลุ่มงานสุขภาพจิต รพ.โพนนาแก้ว',
    workgroupId: 'wg-10',
    attendees: ['นางสาวพิมพา สุวรรณโคตร', 'กลุ่มผู้เข้ารับการบำบัด'],
    taskId: 'tsk-013',
    notes: 'หัวข้อการจัดการความอยากยาและเทคนิคปฏิเสธ'
  },
  {
    id: 'ev-011',
    title: 'ลงพื้นที่ตรวจประเมินสุขาภิบาลร้านอาหารรอบโรงพยาบาล',
    eventType: 'supervision',
    date: '2026-09-09',
    startTime: '09:30',
    endTime: '12:00',
    location: 'ร้านอาหารรอบ รพ.โพนนาแก้ว',
    workgroupId: 'wg-06',
    attendees: ['นายชัยยุทธ ทิพย์โสภา'],
    taskId: 'tsk-009',
    notes: 'ตรวจหาเชื้อโคลิฟอร์มแบคทีเรียในภาชนะและอาหาร'
  },
  {
    id: 'ev-012',
    title: 'กำหนดส่งเบิกข้อมูลชดเชยค่าบริการ e-Claim สปสช.',
    eventType: 'report_deadline',
    date: '2026-08-31',
    startTime: '16:30',
    endTime: '17:00',
    location: 'ระบบ e-Claim สปสช.',
    workgroupId: 'wg-12',
    attendees: ['นางสุภาภรณ์ บุญเลิศ'],
    taskId: 'tsk-008',
    notes: 'สรุปยอดส่งเบิก PP Fee Schedule ประจำงวด'
  },
  {
    id: 'ev-013',
    title: 'ตรวจสุขภาพและอนามัยนักเรียน ร.ร.บ้านโพนนาแก้ว',
    eventType: 'home_visit',
    date: '2026-09-11',
    startTime: '09:00',
    endTime: '12:00',
    location: 'โรงเรียนบ้านโพนนาแก้ว',
    workgroupId: 'wg-08',
    attendees: ['พว.สุดารัตน์ พลจันทร์', 'ทีมทันตสาธารณสุข'],
    notes: 'ตรวจสายตา สุขภาพฟัน และประเมินโภชนาการ'
  },
  {
    id: 'ev-014',
    title: 'คลินิก NCD Plus และตรวจภาวะแทรกซ้อนทางตา/เท้า เบาหวาน',
    eventType: 'campaign',
    date: '2026-09-15',
    startTime: '08:00',
    endTime: '12:00',
    location: 'คลินิก NCD รพ.โพนนาแก้ว',
    workgroupId: 'wg-04',
    attendees: ['นายธนกฤต แสนสุข', 'พว.กาญจนา ศรีประเสริฐ'],
    notes: 'ตรวจจอประสาทตาและตรวจเท้าผู้ป่วยเบาหวาน 80 ราย'
  },
  {
    id: 'ev-015',
    title: 'ซ้อมประเมินมาตรฐานบริการสุขภาพปฐมภูมิ (รพ.สต.ติดดาว)',
    eventType: 'supervision',
    date: '2026-09-15',
    startTime: '09:00',
    endTime: '16:00',
    location: 'รพ.สต.บ้านนาแก้ว',
    workgroupId: 'wg-07',
    attendees: ['คณะกรรมการพัฒนาคุณภาพปฐมภูมิ รพ.โพนนาแก้ว'],
    taskId: 'tsk-003',
    notes: 'ตรวจแฟ้มเอกสารและสัมภาษณ์ทีมงาน 5 หมวด'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'งานเกินกำหนดส่ง (Overdue)',
    message: 'โครงการคัดกรองเบาหวานและความดันโลหิตสูงเชิงรุกในชุมชน (PNK-67-002) เกินกำหนดส่งเมื่อ 25 ส.ค. 2569',
    type: 'overdue',
    timestamp: '2026-08-26 08:30',
    read: false,
    relatedTaskId: 'tsk-002'
  },
  {
    id: 'notif-002',
    title: 'งานใกล้ครบกำหนดส่ง',
    message: 'โครงการเยี่ยมบ้านผู้ป่วยติดเตียงและ Palliative Care ไตรมาส 3 (PNK-67-001) ครบกำหนดส่ง 30 ส.ค. 2569',
    type: 'due_soon',
    timestamp: '2026-08-28 09:00',
    read: false,
    relatedTaskId: 'tsk-001'
  },
  {
    id: 'notif-003',
    title: 'มีการอัปโหลดหลักฐานใหม่',
    message: 'พว.กาญจนา ได้แนบไฟล์ "รายงานสรุปผลการเยี่ยมบ้าน_สิงหาคม2569.pdf" ในงาน PNK-67-001',
    type: 'evidence_added',
    timestamp: '2026-08-28 14:30',
    read: false,
    relatedTaskId: 'tsk-001'
  },
  {
    id: 'notif-004',
    title: 'แจ้งเตือนตัวชี้วัด KPI',
    message: 'ตัวชี้วัด KPI-PNK-14 (ควบคุมระดับน้ำตาลในเลือด HbA1c < 7%) มีผลงาน 32.5% ต่ำกว่าเป้าหมาย 40%',
    type: 'kpi_alert',
    timestamp: '2026-08-25 15:00',
    read: true,
    relatedKpiId: 'kpi-014'
  },
  {
    id: 'notif-005',
    title: 'มอบหมายงานใหม่',
    message: 'นพ.วิศรุต ได้มอบหมายให้คุณเป็นผู้ร่วมรับผิดชอบใน "เตรียมการรับการประเมินมาตรฐานบริการสุขภาพปฐมภูมิ (รพ.สต.ติดดาว)"',
    type: 'assigned',
    timestamp: '2026-08-10 10:00',
    read: true,
    relatedTaskId: 'tsk-003'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'prj-001',
    projectCode: 'PRJ-PNK-69-001',
    title: 'โครงการพัฒนาระบบการดูแลผู้ป่วยเบาหวานและความดันโลหิตสูงเชิงรุกในชุมชนด้วยทีมหมอครอบครัว',
    type: 'primary_care',
    workgroupId: 'wg-01',
    coWorkgroupIds: ['wg-02', 'wg-07'],
    leaderId: 'usr-01',
    fiscalYear: 2569,
    status: 'in_progress',
    budgetRequested: 120000,
    budgetApproved: 120000,
    budgetSpent: 78500,
    fundingSource: 'งบสร้างเสริมสุขภาพและป้องกันโรค (PP Express สปสช.)',
    targetGroup: 'ผู้ป่วยโรคเบาหวานและความดันโลหิตสูงในเขตอำเภอโพนนาแก้ว',
    targetCount: 450,
    startDate: '2026-01-15',
    endDate: '2026-09-30',
    location: 'รพ.โพนนาแก้ว และ รพ.สต. ในเครือข่าย 8 แห่ง',
    objectives: [
      'เพื่อคัดกรองภาวะแทรกซ้อนทางไต ตา เท้า ในผู้ป่วยเบาหวานให้ครอบคลุมมากกว่าร้อยละ 80',
      'เพื่อเพิ่มอัตราการควบคุมระดับน้ำตาลในเลือด (HbA1c < 7%) และความดันโลหิตให้อยู่ในเกณฑ์มาตรฐาน',
      'เพื่อเสริมสร้างศักยภาพทีมหมอครอบครัว (3 หมอ) ในการเยี่ยมบ้านและติดตามผู้ป่วยรายกลุ่มเสี่ยง'
    ],
    expectedOutcomes: [
      'ผู้ป่วยเบาหวานได้รับการตรวจคัดกรองภาวะแทรกซ้อนครบถ้วนอย่างน้อย 380 ราย',
      'ลดอัตราการนอนโรงพยาบาลด้วยภาวะแทรกซ้อนฉุกเฉินจากโรคเบาหวาน (DKA/HHS)',
      'เกิดเครือข่ายชมรมเพื่อนช่วยเพื่อนและผู้จัดการดูแลผู้ป่วย (Care Manager) ในทุกตำบล'
    ],
    kpiIds: ['kpi-014', 'kpi-001'],
    linkedTaskIds: ['tsk-002', 'tsk-004'],
    progress: 65,
    files: [
      {
        id: 'pfile-001-1',
        fileName: 'แบบเสนอโครงการเบาหวานความดันเชิงรุก_2569.docx',
        fileType: 'docx',
        fileSize: '2.4 MB',
        docCategory: 'proposal',
        uploadedAt: '2026-01-10 09:30',
        uploadedBy: 'นพ.วิศรุต วงศ์พิริยะ',
        notes: 'ฉบับอนุมัติรอบแรกพร้อมรายละเอียดกิจกรรม 4 ไตรมาส'
      },
      {
        id: 'pfile-001-2',
        fileName: 'ใบอนุมัติโครงการและคำสั่งแต่งตั้งคณะทำงาน_PNK69-001.pdf',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        docCategory: 'approval',
        uploadedAt: '2026-01-14 14:15',
        uploadedBy: 'นพ.วิศรุต วงศ์พิริยะ',
        notes: 'ลงนามอนุมัติโดยผู้อำนวยการโรงพยาบาลโพนนาแก้ว'
      },
      {
        id: 'pfile-001-3',
        fileName: 'แผนประมาณการงบประมาณและตารางกิจกรรมคัดกรอง.pdf',
        fileType: 'pdf',
        fileSize: '3.1 MB',
        docCategory: 'budget_plan',
        uploadedAt: '2026-01-20 11:00',
        uploadedBy: 'พว.กาญจนา ศรีสมบัติ',
        notes: 'แจกแจงค่าวัสดุตรวจแล็บและค่าตอบแทนทีมสหวิชาชีพ'
      }
    ],
    notes: 'อยู่ระหว่างดำเนินการจัดอบรม อสม. และลงตรวจคัดกรองรอบที่ 2 ในตำบลนาแก้วและตำบลนาตงวัฒนา',
    createdAt: '2026-01-10 09:00',
    updatedAt: '2026-08-25 16:30'
  },
  {
    id: 'prj-002',
    projectCode: 'PRJ-PNK-69-002',
    title: 'โครงการส่งเสริมสุขภาพช่องปากผู้สูงอายุและเด็กปฐมวัยในศูนย์พัฒนาเด็กเล็ก',
    type: 'local_fund',
    workgroupId: 'wg-05',
    leaderId: 'usr-03',
    fiscalYear: 2569,
    status: 'in_progress',
    budgetRequested: 65000,
    budgetApproved: 65000,
    budgetSpent: 42000,
    fundingSource: 'กองทุนหลักประกันสุขภาพระดับท้องถิ่น (กปท.) อบต.บ้านนาแก้ว',
    targetGroup: 'เด็กปฐมวัยใน ศพด. และผู้สูงอายุในชมรมผู้สูงอายุ',
    targetCount: 220,
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    location: 'ศูนย์พัฒนาเด็กเล็ก 4 แห่ง และ รพ.สต.บ้านนาแก้ว',
    objectives: [
      'เพื่อตรวจสุขภาพช่องปากและทาฟลูออไรด์วานิชในเด็กอายุ 9 เดือน - 5 ปี',
      'เพื่อคัดกรองสภาวะฟันแท้ใช้งานได้ไม่น้อยกว่า 20 ซี่ ในผู้สูงอายุ 60 ปีขึ้นไป',
      'เพื่อให้ความรู้ผู้ปกครองและผู้ดูแลเด็กในการแปรงฟันด้วยยาสีฟันผสมฟลูออไรด์'
    ],
    expectedOutcomes: [
      'เด็กปฐมวัยได้รับการทาฟลูออไรด์วานิชร้อยละ 90 ขึ้นไป',
      'ผู้สูงอายุได้รับการตรวจและส่งต่อทำฟันเทียมพระราชทาน 35 ราย'
    ],
    kpiIds: ['kpi-005'],
    progress: 75,
    files: [
      {
        id: 'pfile-002-1',
        fileName: 'ข้อเสนอโครงการทันตสาธารณสุขชุมชน_กปท_นาแก้ว.doc',
        fileType: 'doc',
        fileSize: '1.5 MB',
        docCategory: 'proposal',
        uploadedAt: '2026-01-25 10:00',
        uploadedBy: 'ทพญ.ณัฐธิดา จิตต์มั่น',
        notes: 'ผ่านความเห็นชอบจากคณะกรรมการบริหารกองทุน กปท.'
      },
      {
        id: 'pfile-002-2',
        fileName: 'รายงานสรุปผลการตรวจช่องปากเด็กปฐมวัย_เทอม1_2569.pdf',
        fileType: 'pdf',
        fileSize: '4.2 MB',
        docCategory: 'summary_report',
        uploadedAt: '2026-06-15 15:30',
        uploadedBy: 'ทพญ.ณัฐธิดา จิตต์มั่น',
        notes: 'พร้อมภาพถ่ายการจัดกิจกรรมย้อมสีฟันและทาฟลูออไรด์'
      }
    ],
    notes: 'ดำเนินกิจกรรมใน ศพด. ครบทั้ง 4 แห่งแล้ว อยู่ระหว่างจัดกิจกรรมในชมรมผู้สูงอายุ',
    createdAt: '2026-01-25 09:30',
    updatedAt: '2026-08-20 11:20'
  },
  {
    id: 'prj-003',
    projectCode: 'PRJ-PNK-69-003',
    title: 'โครงการเยี่ยมบ้านและดูแลผู้ป่วยระยะประคับประคอง (Palliative Care) และผู้ป่วยติดเตียงไร้รอยต่อ',
    type: 'hospital_fund',
    workgroupId: 'wg-01',
    coWorkgroupIds: ['wg-04', 'wg-09'],
    leaderId: 'usr-02',
    fiscalYear: 2569,
    status: 'in_progress',
    budgetRequested: 85000,
    budgetApproved: 85000,
    budgetSpent: 59000,
    fundingSource: 'เงินบำรุงโรงพยาบาลโพนนาแก้ว',
    targetGroup: 'ผู้ป่วยระยะท้าย (Palliative Care), ผู้ป่วยติดเตียง (LTC) และผู้ดูแล (Caregiver)',
    targetCount: 110,
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    location: 'บ้านผู้ป่วยในเขต 8 ตำบล อำเภอโพนนาแก้ว',
    objectives: [
      'เพื่อให้ผู้ป่วยระยะสุดท้ายได้รับการดูแลแบบประคับประคองที่บ้านอย่างมีศักดิ์ศรีและลดความทรมาน',
      'เพื่อสนับสนุนยาแก้ปวดกลุ่มโอปิออยด์ อุปกรณ์ทางการแพทย์ และของใช้จำเป็นถึงบ้าน',
      'เพื่อประเมินและช่วยเหลือด้านจิตใจแก่ผู้ดูแลผู้ป่วย (Caregiver Burden)'
    ],
    expectedOutcomes: [
      'ผู้ป่วยระยะท้ายเข้าถึงบริการ Palliative Care ครอบคลุมร้อยละ 90',
      'อัตราการเสียชีวิตที่บ้านตามความประสงค์ของผู้ป่วยและครอบครัวมากกว่าร้อยละ 85',
      'ลดการมาห้องฉุกเฉินซ้ำซ้อนโดยไม่จำเป็น'
    ],
    linkedTaskIds: ['tsk-001'],
    progress: 80,
    files: [
      {
        id: 'pfile-003-1',
        fileName: 'โครงการพัฒนาระบบ Palliative_Care_รพ_โพนนาแก้ว_2569.docx',
        fileType: 'docx',
        fileSize: '3.3 MB',
        docCategory: 'proposal',
        uploadedAt: '2025-09-20 11:00',
        uploadedBy: 'พว.กาญจนา ศรีสมบัติ',
        notes: 'แผนงานบริการเยี่ยมบ้านและสนับสนุนอุปกรณ์การแพทย์ประจำปี'
      },
      {
        id: 'pfile-003-2',
        fileName: 'คู่มือแนวทางการดูแลผู้ป่วยระยะท้ายสำหรับทีมหมอครอบครัว.pdf',
        fileType: 'pdf',
        fileSize: '5.6 MB',
        docCategory: 'schedule',
        uploadedAt: '2025-10-05 13:45',
        uploadedBy: 'พว.กาญจนา ศรีสมบัติ',
        notes: 'แนวทาง Pain Management และ Advance Care Planning'
      }
    ],
    notes: 'ทีมสหวิชาชีพลงเยี่ยมบ้านสัปดาห์ละ 2 ครั้ง มีผู้ป่วยในระบบ 86 ราย',
    createdAt: '2025-09-20 10:30',
    updatedAt: '2026-08-28 17:00'
  },
  {
    id: 'prj-004',
    projectCode: 'PRJ-PNK-69-004',
    title: 'โครงการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA Test และมะเร็งลำไส้ใหญ่ด้วยวิธี FIT Test',
    type: 'nhso_pp',
    workgroupId: 'wg-02',
    leaderId: 'usr-04',
    fiscalYear: 2569,
    status: 'in_progress',
    budgetRequested: 150000,
    budgetApproved: 150000,
    budgetSpent: 112000,
    fundingSource: 'งบสร้างเสริมสุขภาพและป้องกันโรคเฉพาะด้าน สปสช. เขต 8 อุดรธานี',
    targetGroup: 'สตรีอายุ 30-59 ปี (HPV) และประชาชนอายุ 50-70 ปี (FIT Test)',
    targetCount: 600,
    startDate: '2026-01-01',
    endDate: '2026-08-31',
    location: 'คลินิกสุขภาพสตรี รพ.โพนนาแก้ว และ รพ.สต. ทุกแห่ง',
    objectives: [
      'เพื่อคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV Self-Sampling ในสตรีกลุ่มเป้าหมาย',
      'เพื่อตรวจคัดกรองมะเร็งลำไส้ใหญ่ด้วยชุดตรวจ FIT Test ในประชากรสูงวัย',
      'เพื่อส่งต่อผู้มีผลตรวจผิดปกติรับการส่องกล้อง Colposcopy และ Colonoscopy อย่างรวดเร็ว'
    ],
    expectedOutcomes: [
      'สตรีกลุ่มเป้าหมายได้รับการตรวจ HPV Test ไม่น้อยกว่า 450 ราย',
      'ตรวจ FIT Test ครบ 600 ชุด และส่งตรวจส่องกล้องในรายที่ผลบวก 100%'
    ],
    kpiIds: ['kpi-002'],
    progress: 88,
    files: [
      {
        id: 'pfile-004-1',
        fileName: 'ข้อเสนอโครงการคัดกรองมะเร็งสตรีและลำไส้ใหญ่_2569.doc',
        fileType: 'doc',
        fileSize: '1.9 MB',
        docCategory: 'proposal',
        uploadedAt: '2025-12-18 10:00',
        uploadedBy: 'พว.สุดารัตน์ พรมบุตร',
        notes: 'แผนยุทธศาสตร์มะเร็งครบวงจร กระทรวงสาธารณสุข'
      },
      {
        id: 'pfile-004-2',
        fileName: 'ประกาศรายชื่อหน่วยตรวจและขั้นตอนการเก็บตัวอย่างHPV.pdf',
        fileType: 'pdf',
        fileSize: '2.2 MB',
        docCategory: 'schedule',
        uploadedAt: '2026-01-05 09:15',
        uploadedBy: 'พว.สุดารัตน์ พรมบุตร',
        notes: 'แนวทางปฏิบัติสำหรับพยาบาลประจำ รพ.สต.'
      }
    ],
    notes: 'ผลการตรวจ HPV ครบ 480 ราย ส่งตรวจยืนยันที่ รพ.สกลนคร 8 ราย',
    createdAt: '2025-12-18 09:30',
    updatedAt: '2026-08-27 14:00'
  },
  {
    id: 'prj-005',
    projectCode: 'PRJ-PNK-69-005',
    title: 'โครงการพัฒนาศักยภาพ อสม. เชี่ยวชาญและแกนนำสุขภาพประจำครอบครัว (Care Giver Plus)',
    type: 'strategic',
    workgroupId: 'wg-07',
    leaderId: 'usr-05',
    fiscalYear: 2569,
    status: 'completed',
    budgetRequested: 95000,
    budgetApproved: 95000,
    budgetSpent: 93400,
    fundingSource: 'งบยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดสกลนคร',
    targetGroup: 'อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.) 8 ตำบล',
    targetCount: 160,
    startDate: '2025-11-01',
    endDate: '2026-05-31',
    location: 'หอประชุมอำเภอโพนนาแก้ว',
    objectives: [
      'เพื่อฟื้นฟูและยกระดับทักษะ อสม. ด้านการใช้แอปพลิเคชัน Smart อสม. และการตรวจสุขภาพเบื้องต้น',
      'เพื่อฝึกทักษะการช่วยฟื้นคืนชีพขั้นพื้นฐาน (CPR & AED) แก่แกนนำสุขภาพในชุมชน',
      'เพื่อเตรียมความพร้อมรับมือโรคไม่ติดต่อเรื้อรังและโรคอุบัติใหม่อุบัติซ้ำ'
    ],
    expectedOutcomes: [
      'อสม. ผ่านการอบรมและได้รับวุฒิบัตร อสม.เชี่ยวชาญ 160 คน',
      'เกิดจุดติดตั้งเครื่อง AED และทีมกู้ชีพชุมชนในทุกตำบล'
    ],
    progress: 100,
    files: [
      {
        id: 'pfile-005-1',
        fileName: 'เล่มหลักสูตรการอบรมอสมเชี่ยวชาญ_โพนนาแก้ว_2569.docx',
        fileType: 'docx',
        fileSize: '4.8 MB',
        docCategory: 'proposal',
        uploadedAt: '2025-10-28 14:00',
        uploadedBy: 'นายสมชาย บุญมี',
        notes: 'หลักสูตร 30 ชั่วโมง ทฤษฎีและปฏิบัติ'
      },
      {
        id: 'pfile-005-2',
        fileName: 'รายงานสรุปผลและภาพกิจกรรมการอบรมอสม_ฉบับสมบูรณ์.pdf',
        fileType: 'pdf',
        fileSize: '8.5 MB',
        docCategory: 'summary_report',
        uploadedAt: '2026-06-10 16:20',
        uploadedBy: 'นายสมชาย บุญมี',
        notes: 'รายงานผลการประเมินความพึงพอใจ 94.8% และผลสอบวัดความรู้'
      },
      {
        id: 'pfile-005-3',
        fileName: 'ทะเบียนรายชื่อและผลการทดสอบอสมเชี่ยวชาญ.pdf',
        fileType: 'pdf',
        fileSize: '1.7 MB',
        docCategory: 'attendance',
        uploadedAt: '2026-06-12 11:30',
        uploadedBy: 'นายสมชาย บุญมี',
        notes: 'รายชื่อผู้ผ่านเกณฑ์ 160 ท่าน'
      }
    ],
    notes: 'ดำเนินโครงการเสร็จสิ้นสมบูรณ์และส่งรายงาน สสจ.สกลนคร เรียบร้อยแล้ว',
    createdAt: '2025-10-28 13:30',
    updatedAt: '2026-06-15 10:00'
  },
  {
    id: 'prj-006',
    projectCode: 'PRJ-PNK-69-006',
    title: 'โครงการพัฒนาคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ (Primary Care Accreditation: PCA & รพ.สต.ติดดาว)',
    type: 'quality_improvement',
    workgroupId: 'wg-01',
    coWorkgroupIds: ['wg-07', 'wg-13'],
    leaderId: 'usr-01',
    fiscalYear: 2569,
    status: 'in_progress',
    budgetRequested: 70000,
    budgetApproved: 70000,
    budgetSpent: 35000,
    fundingSource: 'เงินบำรุงโรงพยาบาลโพนนาแก้ว',
    targetGroup: 'บุคลากรสาธารณสุข รพ.โพนนาแก้ว และ รพ.สต. 8 แห่ง',
    targetCount: 65,
    startDate: '2026-03-01',
    endDate: '2026-09-30',
    location: 'ห้องประชุม รพ.โพนนาแก้ว และ รพ.สต. ในเครือข่าย',
    objectives: [
      'เพื่อเตรียมความพร้อมรับการประเมินรับรองมาตรฐานบริการสุขภาพปฐมภูมิ 5 หมวด',
      'เพื่อพัฒนาแนวทางเวชปฏิบัติ คลินิกคู่ขนาน และระบบยาปลอดภัยในระดับปฐมภูมิ',
      'เพื่อขับเคลื่อนการทำงานแบบ One Team One Goal ระหว่างโรงพยาบาลและ รพ.สต.'
    ],
    expectedOutcomes: [
      'รพ.สต. ในเครือข่ายผ่านการรับรองมาตรฐานระดับ 5 ดาว ร้อยละ 100',
      'ลดข้อบกพร่องในระบบส่งต่อผู้ป่วยฉุกเฉินและระบบยา'
    ],
    linkedTaskIds: ['tsk-003'],
    progress: 50,
    files: [
      {
        id: 'pfile-006-1',
        fileName: 'คู่มือเกณฑ์ประเมินมาตรฐานปฐมภูมิ_PCA_2569.pdf',
        fileType: 'pdf',
        fileSize: '6.2 MB',
        docCategory: 'schedule',
        uploadedAt: '2026-02-20 10:30',
        uploadedBy: 'นพ.วิศรุต วงศ์พิริยะ',
        notes: 'เกณฑ์มาตรฐาน 5 หมวด ฉบับปรับปรุงใหม่'
      },
      {
        id: 'pfile-006-2',
        fileName: 'แผนการนิเทศและแบบฟอร์มการประเมินตนเอง_SAR.docx',
        fileType: 'docx',
        fileSize: '2.1 MB',
        docCategory: 'proposal',
        uploadedAt: '2026-02-25 14:00',
        uploadedBy: 'พว.กาญจนา ศรีสมบัติ',
        notes: 'สำหรับทีมประเมินภายใน (Internal Audit)'
      }
    ],
    notes: 'อยู่ระหว่างดำเนินการประเมินตนเอง (SAR) รอบที่ 1',
    createdAt: '2026-02-20 09:00',
    updatedAt: '2026-08-15 14:30'
  },
  {
    id: 'prj-007',
    projectCode: 'PRJ-PNK-69-007',
    title: 'โครงการส่งเสริมพัฒนาการเด็กปฐมวัยและการเลี้ยงลูกด้วยนมแม่ 6 เดือนแรก',
    type: 'nhso_pp',
    workgroupId: 'wg-02',
    leaderId: 'usr-04',
    fiscalYear: 2569,
    status: 'draft',
    budgetRequested: 45000,
    budgetApproved: 0,
    budgetSpent: 0,
    fundingSource: 'งบสร้างเสริมสุขภาพ สปสช. / เงินบำรุง รพ.',
    targetGroup: 'หญิงตั้งครรภ์ หญิงให้นมบุตร และเด็กแรกเกิด - 5 ปี',
    targetCount: 150,
    startDate: '2026-09-01',
    endDate: '2027-03-31',
    location: 'คลินิกเด็กดี (WCC) และชมรมสายใยรักแห่งครอบครัว',
    objectives: [
      'เพื่อเพิ่มอัตราการเลี้ยงลูกด้วยนมแม่อย่างเดียว 6 เดือนให้ได้มากกว่าร้อยละ 60',
      'เพื่อตรวจคัดกรองพัฒนาการเด็กด้วยคู่มือ DSPM ในช่วงอายุ 9, 18, 30, 42 เดือน',
      'เพื่อเสริมสร้างความรู้และทักษะพ่อแม่มือใหม่ในการกระตุ้นพัฒนาการ'
    ],
    expectedOutcomes: [
      'เด็กปฐมวัยได้รับการประเมินพัฒนาการ DSPM ครบ 100%',
      'เด็กที่มีพัฒนาการสงสัยล่าช้าได้รับการกระตุ้นซ้ำและส่งต่อฟื้นฟู'
    ],
    progress: 10,
    files: [
      {
        id: 'pfile-007-1',
        fileName: 'ร่างโครงการสายใยรักและคลินิกเด็กดี_2570.doc',
        fileType: 'doc',
        fileSize: '1.2 MB',
        docCategory: 'proposal',
        uploadedAt: '2026-08-20 10:00',
        uploadedBy: 'พว.สุดารัตน์ พรมบุตร',
        notes: 'ร่างโครงการเตรียมเสนอขออนุมัติปีงบประมาณ 2570'
      }
    ],
    notes: 'จัดทำร่างโครงการเสร็จแล้ว เตรียมเสนอหัวหน้ากลุ่มงานพิจารณา',
    createdAt: '2026-08-20 09:30',
    updatedAt: '2026-08-20 09:30'
  }
];
