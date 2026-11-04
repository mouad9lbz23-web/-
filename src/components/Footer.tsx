import React from 'react';
import { Sparkles, Lock, MessageCircle, Phone, MapPin, Ruler } from 'lucide-react';
import { TailorSettings } from '../types';

interface FooterProps {
  settings: TailorSettings;
  onNavigate: (view: 'catalog' | 'admin' | 'about') => void;
  onOpenChat: () => void;
  onOpenCustomOrder: () => void;
  isOwnerAuthenticated: boolean;
  onOpenOwnerLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenChat,
  onOpenCustomOrder,
  isOwnerAuthenticated,
  onOpenOwnerLogin
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 text-right border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800">
          
          {/* Col 1: Brand & Craft */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-serif-luxury">
                {settings.atelierName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              ورشة متخصصة في خياطة وطرز الدراوات الفاخرة وأطقم السرير العرائسية والمفروشات باليد، حسب مقاس سريرك وعلو المرتبة.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              أقسام المتجر والخدمات
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-200 transition-colors"
                >
                  أطقم الدراوات المعروضة
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomOrder}
                  className="hover:text-amber-200 transition-colors"
                >
                  طلب تفصيل بمقاس سريرك
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-200 transition-colors"
                >
                  عن الحرفة وجودة الأقمشة
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenChat}
                  className="hover:text-amber-200 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>استفسار مباشر بالدردشة</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Phone & Social Media Channels */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              التواصل وحساباتنا الرسمية
            </h4>

            <div className="space-y-2.5 text-xs">
              {/* Phone */}
              <a
                href={`tel:${settings.phone || '0674160109'}`}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/50 hover:border-amber-800 text-stone-300 hover:text-white transition-all group"
                title="اتصال مباشر بالهاتف"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 text-right">
                  <div className="text-[10px] text-stone-400">رقم الهاتف / اتصال مباشر</div>
                  <span dir="ltr" className="font-mono font-bold text-sm tracking-wider text-amber-300 group-hover:text-amber-200">
                    {settings.phone || '0674160109'}
                  </span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/50 hover:border-blue-700 text-stone-300 hover:text-white transition-all group"
                title="صفحة الفايسبوك الرسمية"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-[10px] text-stone-400">فايسبوك (Facebook)</div>
                  <span className="font-bold text-xs text-stone-100 group-hover:text-amber-200">
                    {settings.facebook || 'طرز وخياطة دراوات'}
                  </span>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/50 hover:border-pink-700 text-stone-300 hover:text-white transition-all group"
                title="حساب التيك توك الرسمي"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:bg-[#000000] group-hover:text-white border group-hover:border-stone-600 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.04-.04.08-.09.11-.14V11.2a8.16 8.16 0 0 0 5.62 2.24V10a4.84 4.84 0 0 1-3.77-1.31h.01V6.69z"/>
                  </svg>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-[10px] text-stone-400">تيك توك (TikTok)</div>
                  <span className="font-bold text-xs text-stone-100 group-hover:text-amber-200">
                    {settings.tiktok || 'طرز وخياطة دراوات'}
                  </span>
                </div>
              </a>

              {/* Delivery info */}
              <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>الجزائر · التوصيل متوفر لجميع الولايات (58 ولاية)</span>
              </div>
            </div>

            {/* Discreet Owner Access Link (Appears in quiet styling, prompts for PIN) */}
            <div className="pt-2">
              <button
                onClick={onOpenOwnerLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-amber-200 text-[11px] font-medium transition-colors"
                title="خاص بصاحب الصفحة فقط"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{isOwnerAuthenticated ? 'فتح لوحة صاحب الصفحة (متصل)' : 'دخول صاحب الصفحة 🔒'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {settings.atelierName}. جميع حقوق الخياطة والتطريز محفوظة.
          </div>
          <div className="text-[11px] text-stone-500">
            طرز متقن · قطن وساتان طبيعي · تواصل مباشر وخاص مع الخياطة
          </div>
        </div>

      </div>
    </footer>
  );
};
