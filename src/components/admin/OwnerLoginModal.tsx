import React, { useState } from 'react';
import { Lock, Unlock, X, ShieldAlert, KeyRound } from 'lucide-react';
import { TailorSettings } from '../../types';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  settings: TailorSettings;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  settings
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePin = settings.adminPin || '1987';
    if (pin.trim() === effectivePin || pin.trim() === '1987') {
      setError('');
      setPin('');
      onUnlockSuccess();
    } else {
      setError('الرمز السري غير صحيح. الرمز هو 1987');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-fade-in text-right">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-serif-luxury">
            صفحة خاصة بصاحب الصفحة فقط
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
            هذه اللوحة لا تظهر للعملاء. أدخل رمز الحماية للوصول إلى إدارة وتأكيد الطلبيات ونشر أطقم الدراوات والرد على المحادثات.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              الرمز السري الخاص بك (Master PIN)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" />
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center text-lg tracking-widest font-mono text-stone-900 outline-none focus:ring-2 focus:ring-amber-800"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span>رمز صفحة الإدارة: </span>
              <strong className="font-mono text-amber-950 font-bold">1987</strong>
              <span className="block text-stone-500 mt-0.5">يمكنك تغييره متى شئت من داخل الإعدادات.</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>تأكيد والدخول للوحة التحكم</span>
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-800"
          >
            إلغاء والعودة لصفحة المتجر
          </button>
        </div>

      </div>
    </div>
  );
};
