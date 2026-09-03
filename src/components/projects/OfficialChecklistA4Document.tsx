import React from 'react';
import { ProjectChecklistItems } from '../../types';

export interface OfficialChecklistA4DocumentProps {
  fundName: string;
  agencyName: string;
  projectTitle: string;
  year: string;
  activities: string[];
  totalBudget: number;
  spentBudget: number;
  remainingBudget: number;
  returnItemsDescription?: string;
  items: ProjectChecklistItems;
  reviewResult: 'pass' | 'amend' | 'pending';
  notes?: string;
  reviewerName: string;
  reviewerPosition: string;
  reviewDate: string;
  approverName?: string;
  approverPosition?: string;
  approvalDate?: string;
  containerId?: string;
}

const formatThaiDate = (dateStr: string) => {
  if (!dateStr) return '........ / ........ / ................';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '........ / ........ / ................';
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const OfficialChecklistA4Document: React.FC<OfficialChecklistA4DocumentProps> = ({
  fundName,
  agencyName,
  projectTitle,
  year,
  activities,
  totalBudget,
  spentBudget,
  remainingBudget,
  returnItemsDescription,
  items,
  reviewResult,
  notes,
  reviewerName,
  reviewerPosition,
  reviewDate,
  approverName = 'นายตฤณพงศ์  ธีรพงศ์ธนสุข',
  approverPosition = 'ผู้อำนวยการโรงพยาบาลโพนนาแก้ว',
  approvalDate,
  containerId
}) => {
  const renderCheck = (checked: boolean) => {
    return checked ? (
      <span className="font-bold text-black text-sm inline-block">✓</span>
    ) : null;
  };

  return (
    <div 
      id={containerId} 
      className="bg-white text-black leading-tight text-[13px] font-sans antialiased w-full max-w-[210mm] mx-auto box-border"
      style={{
        fontFamily: "'Sarabun', 'TH Sarabun New', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Document Header */}
      <div className="text-center mb-3">
        <h1 className="text-[17px] font-bold text-black tracking-normal leading-snug">
          ตรวจเอกสารแนบโครงการ{fundName || 'กองทุนหลักประกันสุขภาพเทศบาลตำบลนาแก้ว'} ปี {year || '2568'}
        </h1>
        <p className="text-[14px] font-bold text-black mt-0.5">
          (กรณี ส่วนราชการ/หน่วยงานราชการ)
        </p>
      </div>

      {/* Project General Information */}
      <div className="border border-black p-2.5 mb-3 text-[12.5px] leading-relaxed space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-bold shrink-0">หน่วยงาน:</span>
          <span className="border-b border-dotted border-black flex-1 min-w-[200px]">
            {agencyName || 'โรงพยาบาลโพนนาแก้ว'}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-bold shrink-0">ชื่อโครงการ:</span>
          <span className="border-b border-dotted border-black flex-1 min-w-[250px] font-semibold">
            {projectTitle || '-'}
          </span>
        </div>

        <div>
          <span className="font-bold">รายการกิจกรรม:</span>
          <div className="pl-4 space-y-0.5 mt-0.5">
            {activities && activities.filter(a => a && a.trim().length > 0).length > 0 ? (
              activities.filter(a => a && a.trim().length > 0).map((act, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="shrink-0 font-medium">{i + 1}.</span>
                  <span className="border-b border-dotted border-black flex-1">{act}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">1. {projectTitle || 'กิจกรรมตามที่ระบุในโครงการ'}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-black/30 mt-1">
          <div>
            <span className="font-bold">งบประมาณทั้งสิ้น: </span>
            <span className="font-bold underline decoration-dotted">
              {Number(totalBudget || 0).toLocaleString()}
            </span> บาท
          </div>
          <div>
            <span className="font-bold">งบประมาณที่ใช้: </span>
            <span className="font-bold underline decoration-dotted">
              {Number(spentBudget || 0).toLocaleString()}
            </span> บาท
          </div>
          <div>
            <span className="font-bold">งบประมาณคงเหลือ/ส่งคืน: </span>
            <span className="font-bold underline decoration-dotted text-red-950">
              {Number(remainingBudget || 0).toLocaleString()}
            </span> บาท
          </div>
        </div>

        {remainingBudget > 0 && (
          <div className="flex items-baseline gap-2 pt-0.5 text-xs text-red-950">
            <span className="font-bold shrink-0">รายการส่งคืน:</span>
            <span className="border-b border-dotted border-black flex-1">
              {returnItemsDescription || 'ส่งคืนกองทุนหลักประกันสุขภาพเทศบาลตำบลนาแก้ว'}
            </span>
          </div>
        )}
      </div>

      {/* Main Checklist Table */}
      <table className="w-full border-collapse border border-black text-[12px] official-table mb-3">
        <thead>
          <tr className="bg-gray-100 font-bold text-center">
            <th className="border border-black py-1.5 px-2 w-[45px]">ที่</th>
            <th className="border border-black py-1.5 px-3 text-left">รายการเอกสารที่ต้องแนบ</th>
            <th className="border border-black py-1.5 px-1 w-[40px] text-center">มี</th>
            <th className="border border-black py-1.5 px-1 w-[40px] text-center">ไม่มี</th>
            <th className="border border-black py-1.5 px-2 w-[110px] text-center">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {/* Section 1 */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center font-bold align-top py-1">1</td>
            <td className="border border-black px-2 py-1 align-top">
              <span className="font-bold">แบบรายงานผลการดำเนินแผนงาน/โครงการ/กิจกรรม (กปท.10)</span>
              <div className="text-[11px] text-gray-700">
                (หัวหน้า/ผู้บริหารสูงสุด ของ หน่วยงาน/องค์กร/กลุ่มประชาชน เป็นผู้รายงาน)
              </div>
            </td>
            <td className="border border-black text-center align-middle">{renderCheck(items.kpt10_report)}</td>
            <td className="border border-black text-center align-middle">{renderCheck(!items.kpt10_report)}</td>
            <td className="border border-black px-1.5 py-1 text-[11px] align-top text-gray-600">กปท.10</td>
          </tr>

          {/* Section 2 Header */}
          <tr className="bg-gray-50 page-break-inside-avoid">
            <td className="border border-black text-center font-bold align-top py-1">2</td>
            <td colSpan={4} className="border border-black px-2 py-1 font-bold">
              รายงานผลการดำเนินโครงการ พร้อมสำเนาเอกสารทางการเงิน
            </td>
          </tr>

          {/* 2.1 ซื้อ/จ้าง ร้านค้า Header */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center align-top py-0.5"></td>
            <td colSpan={4} className="border border-black px-3 py-0.5 font-bold text-[11.5px] bg-gray-50/50">
              2.1 กรณี ซื้อ/จ้าง ร้านค้า (15 รายการ)
            </td>
          </tr>

          {/* 2.1 Items (1-15) */}
          {[
            { id: 1, key: 'shop_receipt', title: 'ใบเสร็จ/บิลเงินสด โดยเจ้าของร้านค้าเป็นผู้รับเงิน' },
            { id: 2, key: 'shop_id_card', title: 'สำเนาบัตรประชาชนเจ้าของร้านค้า' },
            { id: 3, key: 'shop_inspection_cert', title: 'ใบตรวจรับ / บันทึกการตรวจรับ' },
            { id: 4, key: 'shop_delivery_note', title: 'ใบส่งของ / ใบแจ้งหนี้ / ใบส่งมอบงาน / ใบส่งมอบพัสดุ แล้วแต่กรณี' },
            { id: 5, key: 'shop_commercial_reg', title: 'ใบจดทะเบียนพาณิชย์ / เอกสารจดทะเบียนร้านค้า' },
            { id: 6, key: 'shop_po_agreement', title: 'ใบสั่งซื้อสั่งจ้าง / บันทึกข้อตกลงซื้อจ้าง' },
            { id: 7, key: 'shop_winner_announcement', title: 'ประกาศผู้ชนะการเสนอราคา' },
            { id: 8, key: 'shop_approval_report', title: 'รายงานผลการพิจารณาและอนุมัติสั่งซื้อสั่งจ้าง' },
            { id: 9, key: 'shop_price_agreement', title: 'บันทึกการตกลงราคา' },
            { id: 10, key: 'shop_quotation', title: 'ใบเสนอราคา' },
            { id: 11, key: 'shop_committee_appointment', title: 'สำเนาคำสั่งแต่งตั้งผู้ตรวจรับ / คณะกรรมการตรวจรับพัสดุ (ถ้ามี)' },
            { id: 12, key: 'shop_egp_report', title: 'รายงานขอซื้อขอจ้าง (จากระบบ e-GP)' },
            { id: 13, key: 'shop_tor_note', title: 'บันทึกข้อความ ขอความเห็นชอบรายละเอียดคุณลักษณะฯ (TOR)' },
            { id: 14, key: 'shop_tor_draft', title: 'การจัดทำร่างกำหนดคุณลักษณะเฉพาะของพัสดุ' },
            { id: 15, key: 'shop_tor_appointment', title: 'คำสั่งแต่งตั้งผู้กำหนดคุณลักษณะ / คณะกรรมการกำหนดคุณลักษณะ (TOR)' }
          ].map(row => {
            const checked = !!items[row.key as keyof ProjectChecklistItems];
            return (
              <tr key={row.key} className="page-break-inside-avoid">
                <td className="border border-black text-center text-[11px] align-middle py-0.5"></td>
                <td className="border border-black pl-6 pr-2 py-0.5 text-[11.5px] align-top">
                  {row.id}) {row.title}
                </td>
                <td className="border border-black text-center align-middle">{renderCheck(checked)}</td>
                <td className="border border-black text-center align-middle">{renderCheck(!checked)}</td>
                <td className="border border-black px-1 py-0.5 text-[10px] text-gray-500"></td>
              </tr>
            );
          })}

          {/* 2.2 กรณี จ้างประกอบอาหาร อาหารว่าง Header */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center align-top py-0.5"></td>
            <td colSpan={4} className="border border-black px-3 py-0.5 font-bold text-[11.5px] bg-gray-50/50">
              2.2 กรณี จ้างประกอบอาหาร อาหารว่าง (มิใช่ซื้อจ้างร้านค้า) (3 รายการ)
            </td>
          </tr>

          {/* 2.2 Items (1-3) */}
          {[
            { id: 1, key: 'food_receipt', title: 'ใบเสร็จ / บิลเงินสด / ใบสำคัญรับเงิน' },
            { id: 2, key: 'food_id_card', title: 'สำเนาบัตรประชาชนของผู้ประกอบอาหาร อาหารว่าง' },
            { id: 3, key: 'food_inspection_cert', title: 'ใบตรวจรับ / บันทึกการตรวจรับ' }
          ].map(row => {
            const checked = !!items[row.key as keyof ProjectChecklistItems];
            return (
              <tr key={row.key} className="page-break-inside-avoid">
                <td className="border border-black text-center text-[11px] align-middle py-0.5"></td>
                <td className="border border-black pl-6 pr-2 py-0.5 text-[11.5px] align-top">
                  {row.id}) {row.title}
                </td>
                <td className="border border-black text-center align-middle">{renderCheck(checked)}</td>
                <td className="border border-black text-center align-middle">{renderCheck(!checked)}</td>
                <td className="border border-black px-1 py-0.5 text-[10px] text-gray-500"></td>
              </tr>
            );
          })}

          {/* 2.3 กรณี ค่าสมนาคุณวิทยากร Header */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center align-top py-0.5"></td>
            <td colSpan={4} className="border border-black px-3 py-0.5 font-bold text-[11.5px] bg-gray-50/50">
              2.3 กรณี ค่าสมนาคุณวิทยากร (5 รายการ)
            </td>
          </tr>

          {/* 2.3 Items (1-5) */}
          {[
            { id: 1, key: 'speaker_receipt', title: 'ใบสำคัญรับเงิน' },
            { id: 2, key: 'speaker_id_card', title: 'สำเนาบัตรประชาชนของวิทยากร' },
            { id: 3, key: 'speaker_acceptance', title: 'ใบตอบรับการเป็นวิทยากร' },
            { id: 4, key: 'speaker_invitation_letter', title: 'หนังสือขอความอนุเคราะห์เป็นวิทยากร' },
            { id: 5, key: 'speaker_inspection_cert', title: 'ใบตรวจรับ / บันทึกการตรวจรับ' }
          ].map(row => {
            const checked = !!items[row.key as keyof ProjectChecklistItems];
            return (
              <tr key={row.key} className="page-break-inside-avoid">
                <td className="border border-black text-center text-[11px] align-middle py-0.5"></td>
                <td className="border border-black pl-6 pr-2 py-0.5 text-[11.5px] align-top">
                  {row.id}) {row.title}
                </td>
                <td className="border border-black text-center align-middle">{renderCheck(checked)}</td>
                <td className="border border-black text-center align-middle">{renderCheck(!checked)}</td>
                <td className="border border-black px-1 py-0.5 text-[10px] text-gray-500"></td>
              </tr>
            );
          })}

          {/* Section 3 */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center font-bold align-top py-1">3</td>
            <td className="border border-black px-2 py-1 align-top font-bold">
              รูปถ่ายกิจกรรมตามโครงการและรูปป้ายโครงการ
            </td>
            <td className="border border-black text-center align-middle">{renderCheck(items.activity_photos)}</td>
            <td className="border border-black text-center align-middle">{renderCheck(!items.activity_photos)}</td>
            <td className="border border-black px-1.5 py-1 text-[11px] align-top text-gray-600">อย่างน้อย 4-6 ภาพ</td>
          </tr>

          {/* Section 4 */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center font-bold align-top py-1">4</td>
            <td className="border border-black px-2 py-1 align-top font-bold">
              รายชื่อผู้เข้าร่วมโครงการ พร้อมเลขบัตรประชาชนผู้เข้าร่วมโครงการ
            </td>
            <td className="border border-black text-center align-middle">{renderCheck(items.attendance_with_id)}</td>
            <td className="border border-black text-center align-middle">{renderCheck(!items.attendance_with_id)}</td>
            <td className="border border-black px-1.5 py-1 text-[11px] align-top text-gray-600">มีลายมือชื่อผู้ร่วม</td>
          </tr>

          {/* Section 5 */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center font-bold align-top py-1">5</td>
            <td className="border border-black px-2 py-1 align-top font-bold">
              สำเนาโครงการและกำหนดการ
            </td>
            <td className="border border-black text-center align-middle">{renderCheck(items.project_copy_schedule)}</td>
            <td className="border border-black text-center align-middle">{renderCheck(!items.project_copy_schedule)}</td>
            <td className="border border-black px-1.5 py-1 text-[11px] align-top text-gray-600">ฉบับอนุมัติ</td>
          </tr>

          {/* Section 6 */}
          <tr className="page-break-inside-avoid">
            <td className="border border-black text-center font-bold align-top py-1">6</td>
            <td className="border border-black px-2 py-1 align-top font-bold">
              บันทึกข้อความขออนุมัติจัดทำโครงการ
            </td>
            <td className="border border-black text-center align-middle">{renderCheck(items.approval_memo)}</td>
            <td className="border border-black text-center align-middle">{renderCheck(!items.approval_memo)}</td>
            <td className="border border-black px-1.5 py-1 text-[11px] align-top text-gray-600">บันทึกข้อความ รพ.</td>
          </tr>
        </tbody>
      </table>

      {/* Review Results & Remarks */}
      <div className="border border-black p-2.5 mb-4 text-[12.5px] space-y-1.5 page-break-inside-avoid">
        <div className="flex items-center gap-6">
          <span className="font-bold">สรุปผลการตรวจสอบเอกสาร:</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 border border-black text-center leading-3 font-bold text-xs">
              {reviewResult === 'pass' ? '✓' : ''}
            </span>
            <span className="font-semibold">ครบถ้วนถูกต้อง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-4 border border-black text-center leading-3 font-bold text-xs">
              {reviewResult === 'amend' ? '✓' : ''}
            </span>
            <span className="font-semibold">มีเอกสารต้องแก้ไข / ส่งเพิ่มเติม</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-bold shrink-0">ข้อสังเกต / สิ่งที่ต้องแก้ไขเพิ่มเติม:</span>
          <span className="border-b border-dotted border-black flex-1 min-h-[20px]">
            {notes || (reviewResult === 'pass' ? 'เอกสารถูกต้องครบถ้วนตามระเบียบกองทุนฯ สามารถดำเนินการเบิกจ่ายและปิดโครงการได้' : '....................................................................................................................................................')}
          </span>
        </div>
      </div>

      {/* Official Signatures Block - 2 Balanced Columns */}
      <div className="grid grid-cols-2 gap-8 text-[12.5px] pt-2 signature-block page-break-inside-avoid">
        {/* Reviewer Signature (Left) */}
        <div className="text-center space-y-1">
          <p>ลงชื่อ .......................................................................... ผู้ตรวจเอกสาร</p>
          <p className="font-semibold">( {reviewerName || '..........................................................................'} )</p>
          <p className="text-gray-800">ตำแหน่ง {reviewerPosition || 'เจ้าหน้าที่ผู้รับผิดชอบงานโครงการ'}</p>
          <p className="text-gray-700">วันที่ {formatThaiDate(reviewDate)}</p>
        </div>

        {/* Approver / Director Signature (Right) - Updated to นายตฤณพงศ์ ธีรพงศ์ธนสุข */}
        <div className="text-center space-y-1">
          <p>ลงชื่อ .......................................................................... ผู้รับรอง / ผู้เห็นชอบ</p>
          <p className="font-bold text-black">( {approverName} )</p>
          <p className="font-semibold text-black">ตำแหน่ง {approverPosition}</p>
          <p className="text-gray-700">วันที่ {formatThaiDate(approvalDate || reviewDate)}</p>
        </div>
      </div>
    </div>
  );
};
