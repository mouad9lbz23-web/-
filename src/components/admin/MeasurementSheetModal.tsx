import React from 'react';
import { X, Printer, Ruler, Phone, MapPin, User, Scissors } from 'lucide-react';
import { Order, TailorSettings } from '../../types';

interface MeasurementSheetModalProps {
  order: Order | null;
  settings: TailorSettings;
  onClose: () => void;
  onConfirmOrder?: (orderId: string) => void;
}

export const MeasurementSheetModal: React.FC<MeasurementSheetModalProps> = ({
  order,
  settings,
  onClose,
  onConfirmOrder
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in text-right">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Controls - Hidden during print */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between no-print border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-bold">بطاقة تفصيل وطرز الدراوات #{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors print-include"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة بطاقة الورشة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Draouat Tailoring Sheet Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          
          {/* Header of the sheet */}
          <div className="flex items-center justify-between border-b-2 border-stone-900 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif-luxury">{settings.atelierName}</h2>
              <div className="text-xs text-stone-600">إشراف: {settings.tailorName} ({settings.phone})</div>
              <div className="text-xs text-stone-500">{settings.city} · {settings.address}</div>
            </div>
            <div className="text-left font-mono">
              <div className="text-base font-bold text-stone-900">بطاقة تفصيل أطقم دراوات</div>
              <div className="text-xs font-semibold text-amber-900">رقم: {order.orderNumber}</div>
              <div className="text-[11px] text-stone-500">
                {new Date(order.createdAt).toLocaleDateString('ar-MA')}
              </div>
            </div>
          </div>

          {/* Customer & Garment Split */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-800" />
                <span>بيانات الزبونة:</span>
              </div>
              <div className="text-sm font-semibold text-stone-900">{order.customerName}</div>
              <div className="text-xs text-stone-600" dir="ltr">{order.customerPhone}</div>
              <div className="text-xs text-stone-600">{order.customerCity} {order.customerAddress ? `· ${order.customerAddress}` : ''}</div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-800" />
                <span>طقم الدراوات المطلوب:</span>
              </div>
              <div className="text-sm font-semibold text-stone-900 line-clamp-1">{order.productTitle}</div>
              <div className="text-xs text-stone-600">القماش: {order.fabricChoice || 'حسب العرض الأصلي'}</div>
              <div className="text-xs font-bold text-amber-900">
                السعر: {order.productPrice.toLocaleString()} {order.currency}
              </div>
            </div>
          </div>

          {/* Measurements Table for Bed & Draouat */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-800" />
                <span>أبعاد السرير ومواصفات خياطة الدراوات:</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-100 rounded-lg text-center">
                <div className="text-[11px] text-stone-500">مقاس السرير المطلوب</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  {order.measurements?.bedSize || order.chosenSize || 'سرير 160×200 سم'}
                </div>
              </div>

              <div className="p-3 bg-stone-100 rounded-lg text-center">
                <div className="text-[11px] text-stone-500">علو الماتلا / المرتبة</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  {order.measurements?.mattressHeight || '25 سم'}
                </div>
              </div>

              <div className="p-3 bg-stone-100 rounded-lg text-center">
                <div className="text-[11px] text-stone-500">المخدات والوسائد</div>
                <div className="text-xs font-bold text-stone-900 mt-0.5">
                  {order.measurements?.pillowCountAndSize || '2 مخدات'}
                </div>
              </div>

              <div className="p-3 bg-stone-100 rounded-lg text-center col-span-2 sm:col-span-3">
                <div className="text-[11px] text-stone-500">لون ونقشة الطرز المرغوبة</div>
                <div className="text-sm font-bold text-amber-950 mt-0.5">
                  {order.measurements?.embroideryColor || 'طرز الورد الفاسي الذهبي'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Special Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60 text-xs space-y-1">
              <span className="font-bold text-amber-950">ملاحظات وطلبات الزبونة:</span>
              <p className="text-stone-700">{order.notes || 'لا توجد ملاحظات إضافية'}</p>
            </div>

            <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-stone-900">ملاحظات ورشة الخياطة:</span>
              <p className="text-stone-700">{order.tailorNotes || 'جاهز للقص وتجهيز خيوط الطرز'}</p>
            </div>
          </div>

          {/* Status and Action in footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between no-print">
            <div className="text-xs">
              <span className="text-stone-500">حالة الطلب الحالية: </span>
              <span className="font-bold text-stone-900">
                {order.status === 'new' ? 'طلب جديد بحاجة لتأكيد' : order.status}
              </span>
            </div>

            {order.status === 'new' && onConfirmOrder && (
              <button
                onClick={() => {
                  onConfirmOrder(order.id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                تأكيد هذا الطلب وبدء الخياطة
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
