import React from 'react';
import hospitalLogoImg from '../../assets/images/phon_na_kaeo_hospital_logo_1788232686227.jpg';

interface HospitalLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  variant?: 'full' | 'icon' | 'badge';
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textColor = 'text-slate-900',
  subtextColor = 'text-slate-500',
  variant = 'icon',
}) => {
  const sizeMap: Record<string, { img: string; text: string; sub: string }> = {
    xs: { img: 'w-6 h-6', text: 'text-xs', sub: 'text-[9px]' },
    sm: { img: 'w-8 h-8', text: 'text-sm', sub: 'text-[10px]' },
    md: { img: 'w-10 h-10', text: 'text-base', sub: 'text-xs' },
    lg: { img: 'w-14 h-14', text: 'text-lg', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-xl', sub: 'text-sm' },
    '2xl': { img: 'w-28 h-28', text: 'text-2xl', sub: 'text-base' },
  };

  const currentSize = typeof size === 'string' ? sizeMap[size] || sizeMap.md : {
    img: `w-[${size}px] h-[${size}px]`,
    text: 'text-base',
    sub: 'text-xs'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Hospital Seal Emblem Image */}
      <div className={`relative shrink-0 ${typeof size === 'number' ? '' : currentSize.img} rounded-full p-0.5 bg-white shadow-sm ring-1 ring-emerald-600/30 overflow-hidden flex items-center justify-center`}>
        <img
          src={hospitalLogoImg || '/hospital_logo.jpg'}
          alt="ตราโรงพยาบาลโพนนาแก้ว กระทรวงสาธารณสุข"
          className="w-full h-full object-cover rounded-full select-none"
          loading="eager"
          onError={(e) => {
            // Fallback to public asset if needed
            (e.target as HTMLImageElement).src = '/hospital_logo.jpg';
          }}
        />
      </div>

      {/* Optional Branding Text beside logo */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-tight ${textColor} ${typeof size === 'string' ? currentSize.text : 'text-sm'}`}>
            โรงพยาบาลโพนนาแก้ว
          </span>
          <span className={`font-medium ${subtextColor} ${typeof size === 'string' ? currentSize.sub : 'text-[10px]'}`}>
            กลุ่มงานบริการด้านปฐมภูมิและองค์รวม
          </span>
        </div>
      )}
    </div>
  );
};
