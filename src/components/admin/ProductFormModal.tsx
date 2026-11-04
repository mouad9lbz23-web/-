import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { Product, ProductCategory, TailorSettings } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  settings: TailorSettings;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const PRESET_DRAOUAT_IMAGES = [
  {
    name: 'طقم دراوات عرايسي ملكي',
    url: '/src/assets/images/draouat_bridal_set_1793814696139.jpg'
  },
  {
    name: 'طقم دراوات قطن للغرف',
    url: '/src/assets/images/draouat_cotton_daily_1793814697230.jpg'
  },
  {
    name: 'أغطية سرير ودراوات أطفال',
    url: '/src/assets/images/draouat_baby_nursery_1793814697047.jpg'
  },
  {
    name: 'كوفري وغطاء سرير فندقي',
    url: '/src/assets/images/draouat_hero_bedding_1793814695149.jpg'
  }
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  productToEdit,
  settings,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('أطقم دراوات عرايسي');
  const [price, setPrice] = useState<number>(850);
  const [fabric, setFabric] = useState('');
  const [piecesCount, setPiecesCount] = useState('طقم 4 قطع (درا + درا أوس + 2 مخاد)');
  const [sewingTimeDays, setSewingTimeDays] = useState<number>(5);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setFabric(productToEdit.fabric);
      setPiecesCount(productToEdit.piecesCount || 'طقم 4 قطع');
      setSewingTimeDays(productToEdit.sewingTimeDays);
      setImage(productToEdit.image);
      setDescription(productToEdit.description);
    } else {
      setTitle('');
      setCategory('أطقم دراوات عرايسي');
      setPrice(850);
      setFabric('ساتان قطني ناعم 100%');
      setPiecesCount('طقم 6 قطع (درا + درا أوس + 4 مخاد)');
      setSewingTimeDays(5);
      setImage(PRESET_DRAOUAT_IMAGES[0].url);
      setDescription('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle uploading image from phone or computer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'يرجى كتابة اسم طقم الغرفة أو الغطاء';
    if (!price || price <= 0) errs.price = 'يرجى تحديد السعر الذي تريده';
    if (!image.trim()) errs.image = 'يرجى رفع أو اختيار صورة للمنتج';
    if (!fabric.trim()) errs.fabric = 'يرجى توضيح نوع القماش';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const saved: Product = {
      id: productToEdit ? productToEdit.id : 'prod_' + Date.now(),
      title: title.trim(),
      category,
      price: Number(price),
      currency: settings.currency,
      image,
      fabric: fabric.trim(),
      piecesCount: piecesCount.trim(),
      sewingTimeDays: Number(sewingTimeDays) || 5,
      description: description.trim(),
      availableSizes: ['سرير 160×200 سم', 'سرير 180×200 سم', 'تفصيل حسب مقاس سريرك'],
      requiresCustomMeasurements: true,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString()
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in text-right">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold">
              {productToEdit ? 'تعديل صورة وسعر طقم الغرفة' : 'نشر طقم غرفة أو غطاء جديد وتحديد السعر'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              اسم الطقم أو الغطاء <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: طقم غطاء سرير ودراوات قطن ساتان مطرز"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none"
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                حدد السعر بنفسك ({settings.currency}) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="مثال: 9500"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none font-mono tabular-nums text-center font-bold"
              />
              {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                تصنيف أطقم الغرف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none bg-white font-medium"
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
                مدة الخياطة والطرز (أيام)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={sewingTimeDays}
                onChange={(e) => setSewingTimeDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none font-mono tabular-nums text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نوع القماش المستخدم <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="مثال: قطن 100%، ساتان تركي، ميكروفايبر ناعم..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none"
              />
              {errors.fabric && <p className="text-xs text-rose-600 mt-1">{errors.fabric}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                عدد القطع في الطقم
              </label>
              <input
                type="text"
                value={piecesCount}
                onChange={(e) => setPiecesCount(e.target.value)}
                placeholder="مثال: طقم 6 قطع (درا + درا أوس + 4 مخاد)"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none"
              />
            </div>
          </div>

          {/* Image Upload & Selection Section */}
          <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-900">
                صورة المنتج (ارفع صورتك الخاصة أو اختر صورة) <span className="text-rose-600">*</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة من جهازك / هاتفك</span>
              </button>
            </div>

            {/* Current Image Preview */}
            {image && (
              <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-stone-200">
                <img
                  src={image}
                  alt="معاينة"
                  referrerPolicy="no-referrer"
                  className="w-20 h-16 rounded object-cover border border-stone-300 shrink-0"
                />
                <div className="text-xs text-stone-600 truncate flex-1">
                  <div className="font-semibold text-stone-900">تم اختيار الصورة بنجاح</div>
                  <span className="text-[10px] text-stone-400">ستظهر هذه الصورة للزبائن في المتجر</span>
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="text-[11px] text-stone-500 pt-1">أو اختر من صور الأطقم الجاهزة:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_DRAOUAT_IMAGES.map((preset) => (
                <div
                  key={preset.url}
                  onClick={() => setImage(preset.url)}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden p-1 transition-all ${
                    image === preset.url ? 'border-amber-800 bg-amber-50' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 object-cover rounded"
                  />
                  <div className="text-[10px] font-medium text-stone-800 line-clamp-1 mt-1 text-center">
                    {preset.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <label className="block text-[11px] font-medium text-stone-600 mb-1">أو ضع رابط صورة مباشر:</label>
              <input
                type="text"
                dir="ltr"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... أو /src/assets/..."
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 outline-none font-mono"
              />
            </div>
            {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              وصف الموديل، دقة الطرز، وحواشي القماش
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل الطقم ونوع الخيط والمقاسات التي توفرها لزبائنك..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'حفظ التعديلات' : 'نشر الطقم وتثبيت السعر'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
