import React from 'react';
import { CheckCircle2, MessageCircle, Ruler, FileText, ArrowLeft, Phone } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenChatWithOrder: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onOpenChatWithOrder
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in text-right">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-3 pb-6 border-b border-stone-100">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900">
            تم استلام طلبك بنجاح!
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            وصل طلبك إلى لوحة تحكم الخياط لمراجعته والتأكد من المقاسات وتأكيد بدء التفصيل.
          </p>
          <div className="inline-block px-3.5 py-1.5 bg-stone-100 rounded-lg text-xs font-mono font-bold text-stone-800">
            رقم الطلبية: {order.orderNumber}
          </div>
        </div>

        {/* Order Card Preview */}
        <div className="my-6 p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={order.productImage}
              alt={order.productTitle}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover border border-stone-300 shrink-0"
            />
            <div className="space-y-1">
              <div className="text-sm font-bold text-stone-900 line-clamp-1">{order.productTitle}</div>
              <div className="text-xs text-stone-500">القماش: {order.fabricChoice}</div>
              <div className="text-xs font-bold text-amber-900">
                السعر: {order.productPrice.toLocaleString()} {order.currency}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
            <div className="flex justify-between">
              <span>اسم العميل:</span>
              <span className="font-semibold text-stone-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>المدينة والتوصيل:</span>
              <span className="font-semibold text-stone-900">{order.customerCity}</span>
            </div>
            {order.measurements && (
              <div className="flex justify-between">
                <span>المقاسات:</span>
                <span className="font-semibold text-stone-900">مخصصة (مرفقة مع الطلب)</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => onOpenChatWithOrder(order)}
            className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>محادثة مباشرة لتأكيد تفاصيل الطلبية</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-lg transition-colors"
          >
            متابعة تصفح المعروضات
          </button>
        </div>

      </div>
    </div>
  );
};
