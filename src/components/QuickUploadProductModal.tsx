import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Product, ProductCategory, TailorSettings } from '../types';

interface QuickUploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  settings: TailorSettings;
}

export const QuickUploadProductModal: React.FC<QuickUploadProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  settings
}) => {
  const [image, setImage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState<ProductCategory>('أطقم دراوات عرايسي');
  const [fabric, setFabric] = useState('قطن وساتان طبيعي 100%');
  const [piecesCount, setPiecesCount] = useState('طقم 4 قطع (درا + درا أوس + 2 مخاد)');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Automatically prompt file picker if no image selected yet
      if (!image) {
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 150);
      }
    } else {
      setImage('');
      setTitle('');
      setPrice('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          setError('');
          if (!title) {
            // Suggest clean name based on file or default
            setTitle('طقم دراوات مطرز فاخر');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('يرجى اختيار صورة للمنتج أولاً');
      return;
    }
    if (!title.trim()) {
      setError('يرجى كتابة اسم الطقم أو الغطاء');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('يرجى تحديد السعر الذي تريده للمنتج');
      return;
    }

    const newProd: Product = {
      id: 'prod_' + Date.now(),
      title: title.trim(),
      category,
      price: Number(price),
      currency: settings.currency,
      image,
      fabric: fabric.trim() || 'قطن فاخر',
      piecesCount: piecesCount.trim(),
      sewingTimeDays: 5,
      description: description.trim() || 'طقم دراوات وأغطية سرير فاخرة مطرزة بدقة حسب المقاس.',
      availableSizes: ['سرير 160×200 سم', 'سرير 180×200 سم', 'تفصيل حسب مقاس سريرك'],
      requiresCustomMeasurements: true,
      createdAt: new Date().toISOString()
    };

    onSaveProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-fade-in text-right">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-base sm:text-lg font-bold">
              إضافة صورة وسعر طقم جديد للمتجر
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* File Picker trigger */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Image Upload Box */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2">
              صورة المنتج من جهازك أو هاتفك <span className="text-rose-600">*</span>
            </label>

            {image ? (
              <div className="relative aspect-[16/10] bg-stone-100 rounded-xl overflow-hidden border-2 border-amber-800 group">
                <img
                  src={image}
                  alt="معاينة المنتج"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white text-stone-900 text-xs font-bold rounded-lg shadow-md hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>تغيير الصورة</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[16/9] rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-800 bg-stone-50 hover:bg-amber-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-stone-800">اضغط هنا لاختيار صورة من جهازك / هاتفك</div>
                <div className="text-xs text-stone-500 mt-1">يدعم صور الكاميرا ومعرض الصور (JPG, PNG)</div>
              </div>
            )}
          </div>

          {/* Title & Price Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                اسم الموديل أو الغطاء <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: طقم دراوات عرايسي مطرز"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                حدد السعر ({settings.currency}) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="مثال: 8500"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none font-bold text-center font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Category & Fabric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none bg-white font-medium"
              >
                <option value="أطقم دراوات عرايسي">أطقم دراوات عرايسي</option>
                <option value="أطقم دراوات قطنية للغرف">أطقم دراوات قطنية للغرف</option>
                <option value="كوفريات وأغطية سرير فاخرة">كوفريات وأغطية سرير فاخرة</option>
                <option value="أطقم غرف نوم كاملة">أطقم غرف نوم كاملة</option>
                <option value="أغطية وسائد ومخاد الغرف">أغطية وسائد ومخاد الغرف</option>
                <option value="أطقم أغطية سرير للأطفال والرضع">أطقم أغطية سرير للأطفال والرضع</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نوع القماش
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="مثال: قطن 100%، ساتان تركي..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              وصف مختصر أو عدد القطع (اختياري)
            </label>
            <input
              type="text"
              value={piecesCount}
              onChange={(e) => setPiecesCount(e.target.value)}
              placeholder="مثال: طقم 4 قطع (درا + درا أوس + 2 مخاد)"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer & Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>نشر في المتجر وتثبيت السعر</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
