import React from 'react';
import { Sparkles, Ruler, MessageCircle, Clock } from 'lucide-react';
import { TailorSettings } from '../types';

interface HeroSectionProps {
  settings: TailorSettings;
  onBrowse: () => void;
  onCustomOrder: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onBrowse,
  onCustomOrder,
  onOpenChat
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Content Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 tracking-wide">
              <span>{settings.atelierName}</span>
              <span aria-hidden="true">·</span>
              <span>خياطة وتطريز أطقم السرير باليد</span>
              <span aria-hidden="true">·</span>
              <span>{settings.city}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-[1.25] tracking-tight [text-wrap:balance] font-serif-luxury">
              أطقم دراوات فاخرة مطرزة بإتقان على مقاس سريرك
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
              مرحبًا بكم في متجر ورشتنا المتخصص في خياطة وطرز الدراوات وأغطية السرير العرائسية واليومية ودراوات المواليد. نختار لكم أرقى أقمشة القطن والساتان الطبيعي مع تطريز يدوي متقن يدوم طويلاً، ونفصل الشراشف والدرا أوس حسب مقاس وعلو مرتبتك بدقة تامة.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onBrowse}
                className="px-6 py-3.5 bg-stone-900 text-amber-200 font-semibold text-sm rounded-lg hover:bg-stone-800 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-stone-900"
              >
                تصفح أطقم الدراوات والأسعار
              </button>
              <button
                onClick={onCustomOrder}
                className="px-6 py-3.5 bg-amber-800 text-white font-semibold text-sm rounded-lg hover:bg-amber-900 transition-colors shadow-sm flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-800"
              >
                <Ruler className="w-4 h-4" />
                <span>طلب تفصيل درا بمقاسك</span>
              </button>
              <button
                onClick={onOpenChat}
                className="px-5 py-3.5 bg-white text-stone-800 font-medium text-sm rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-amber-800" />
                <span>استفسار مباشر بالدردشة</span>
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-8 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-stone-700">
              <div className="space-y-1">
                <div className="text-xs text-stone-500">جودة القماش</div>
                <div className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <span>قطن وساتان طبيعي 100%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-stone-500">حسب مقاس سريرك</div>
                <div className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-amber-800" />
                  <span>تفصيل دقيق مع علو الماتلا</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-stone-500">مدة الإنجاز</div>
                <div className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>4 - 8 أيام عمل</span>
                </div>
              </div>
            </div>

          </div>

          {/* Media Column (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-stone-200 border border-stone-300/70 group">
              <img
                src="/src/assets/images/draouat_hero_bedding_1793814695149.jpg"
                alt="طقم دراوات مطرزة فاخرة"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[440px] lg:h-[480px] object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white text-right">
                <div className="text-xs font-semibold text-amber-300">من إبداعات الورشة</div>
                <div className="text-lg font-bold font-serif-luxury mt-1">طرز وخياطة دراوات متقنة</div>
                <p className="text-xs text-stone-200 mt-1 max-w-sm">
                  أطقم دراوات عرائسية ويومية تعطي لغرفة نومك لمسة من الفخامة والراحة الدافئة.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
