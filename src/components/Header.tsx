import React from 'react';
import { Sparkles, MessageCircle, Ruler, ShieldCheck } from 'lucide-react';
import { TailorSettings } from '../types';

interface HeaderProps {
  settings: TailorSettings;
  activeView: 'catalog' | 'admin' | 'about';
  onNavigate: (view: 'catalog' | 'admin' | 'about') => void;
  onOpenChat: () => void;
  onOpenCustomOrder: () => void;
  isOwnerAuthenticated: boolean;
  onOpenOwnerLogin: () => void;
  newOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeView,
  onNavigate,
  onOpenChat,
  onOpenCustomOrder,
  isOwnerAuthenticated,
  onOpenOwnerLogin,
  newOrdersCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element brand wordmark */}
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-3 text-right group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded-md"
          >
            <div className="w-10 h-10 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 font-serif-luxury">
              {settings.atelierName}
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links for customers */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button
              onClick={() => onNavigate('catalog')}
              className={`hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeView === 'catalog' ? 'border-amber-800 text-stone-950 font-semibold' : 'border-transparent text-stone-600'
              }`}
            >
              أطقم الدراوات المطرزة
            </button>

            <button
              onClick={onOpenCustomOrder}
              className="hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 py-1 text-stone-600 hover:text-stone-950 flex items-center gap-1.5"
            >
              <Ruler className="w-4 h-4 text-amber-800" />
              <span>طلب تفصيل بمقاس سريرك</span>
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeView === 'about' ? 'border-amber-800 text-stone-950 font-semibold' : 'border-transparent text-stone-600'
              }`}
            >
              عن حرفة الطرز والخياطة
            </button>

            <button
              onClick={onOpenChat}
              className="hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 py-1 text-stone-600 flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-amber-800" />
              <span>استفسار مباشر بالدردشة</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* If the Owner is currently logged in, show their private dashboard shortcut */}
            {isOwnerAuthenticated ? (
              <button
                onClick={() => onNavigate('admin')}
                className={`relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm ${
                  activeView === 'admin'
                    ? 'bg-amber-900 text-amber-100 ring-2 ring-amber-600/40'
                    : 'bg-stone-900 text-amber-200 hover:bg-stone-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>صفحة الإدارة (أنت متصل)</span>
                {newOrdersCount > 0 && (
                  <span className="flex items-center justify-center bg-rose-600 text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full">
                    {newOrdersCount}
                  </span>
                )}
              </button>
            ) : (
              /* Public Customer Primary Action (NO admin button shown to customers!) */
              <button
                onClick={onOpenCustomOrder}
                className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Ruler className="w-4 h-4" />
                <span>تفصيل درا حسب مقاسك</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
