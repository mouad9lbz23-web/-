import React from 'react';
import { X, Ruler, MessageCircle, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOrder: (product: Product) => void;
  onChat: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOrder,
  onChat
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 shadow-sm transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-stone-100 min-h-[300px]">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-sm text-amber-200 text-xs px-3 py-1.5 rounded-lg font-medium">
              {product.category}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-amber-800 tracking-wide uppercase">
                  تفصيل يدوي حصري
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 leading-snug">
                  {product.title}
                </h2>
              </div>

              {/* Price */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
                <span className="text-xs text-stone-600 font-medium">سعر الخياطة والتفصيل:</span>
                <div className="text-2xl font-extrabold text-stone-900 tabular-nums">
                  {product.price.toLocaleString()} <span className="text-sm font-semibold text-amber-800">{product.currency}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">نوع الثوب والقماش: </span>
                    <span>{product.fabric}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">مدة التفصيل والإنجاز: </span>
                    <span>{product.sewingTimeDays} أيام عمل من تاريخ تأكيد المقاسات</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Ruler className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">المقاسات المتوفرة: </span>
                    <span>{product.availableSizes.join(' ، ')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-semibold text-stone-900 uppercase">وصف القطعة والتطريز:</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                <span>يتم قص القطعة وتفصيلها خصيصاً على مقاسك لضمان أعلى مستويات الراحة والأناقة.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  onClose();
                  onOrder(product);
                }}
                className="w-full py-3 px-4 bg-amber-800 text-white font-semibold text-sm rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Ruler className="w-4 h-4" />
                <span>طلب تفصيل هذه القطعة وإرسال المقاسات</span>
              </button>
              
              <button
                onClick={() => {
                  onClose();
                  onChat(product);
                }}
                className="w-full py-2.5 px-4 bg-stone-100 text-stone-800 font-semibold text-sm rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-amber-800" />
                <span>استفسار مباشر بالدردشة حول هذا الطقم</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
