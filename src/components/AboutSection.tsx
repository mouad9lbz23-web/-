import React from 'react';
import { Sparkles, Shield, HeartHandshake, Scissors } from 'lucide-react';
import { TailorSettings } from '../types';

interface AboutSectionProps {
  settings: TailorSettings;
  onCustomOrder: () => void;
  onOpenChat: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onCustomOrder,
  onOpenChat
}) => {
  return (
    <section className="py-16 bg-white border-b border-stone-200 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-800 tracking-wide uppercase">
              أصالة الحرفة وإتقان المفروشات
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-luxury leading-snug">
              ماركة «طرز وخياطة دراوات».. شغف الخياطة وتطريز أطقم السرير الراقية
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              نحن متخصصون في خياطة وطرز الدراوات بجميع أنواعها: من أطقم العرائس الفاخرة المطرزة بصقلي الذهب والحرير، إلى الدراوات القطنية اليومية الناعمة وأطقم سراير المواليد الجدد.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              تتميز أطقمنا بدقة القياس؛ فنحن لا نعتمد المقاسات العشوائية بل نفصل الشرشف والدرا أوس وفق أبعاد سريرك وسُمك المرتبة (الماتلا) لديك، لتستمتع بغطاء مشدود وأنيق لا ينزلق أثناء النوم.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onCustomOrder}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                طلب تفصيل طقم بمقاسك
              </button>
              <button
                onClick={onOpenChat}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors"
              >
                <span>استفسار مباشر بالدردشة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <Scissors className="w-6 h-6 text-amber-800" />
              <h4 className="text-sm font-bold text-stone-900">تفصيل دقيق للمرتبة</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                درا أوس بمطاط كامل وقوي يُفصل حسب علو المرتبة لديك دون انزلاق.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <Sparkles className="w-6 h-6 text-amber-800" />
              <h4 className="text-sm font-bold text-stone-900">تطريز حريري يدوم</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                خيوط حرير وصقلي أصلية مقاومة للغسيل المتكرر تحافظ على بريقها.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <Shield className="w-6 h-6 text-amber-800" />
              <h4 className="text-sm font-bold text-stone-900">أقمشة قطنية 100%</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                أقمشة صحية ناعمة باردة في الصيف ودافئة في الشتاء ضد التحسس.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <HeartHandshake className="w-6 h-6 text-amber-800" />
              <h4 className="text-sm font-bold text-stone-900">تواصل مباشر وخاص</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                دردشة مباشرة مع صاحبة الورشة للاتفاق على المقاسات والألوان.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
