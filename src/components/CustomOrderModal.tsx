import React, { useState, useEffect } from 'react';
import { X, Ruler, Sparkles, Check, HelpCircle, Phone, MapPin, User } from 'lucide-react';
import { Product, Order, Measurements } from '../types';
import { createOrder, getClientSession, setClientSessionInfo, sendCustomerMessage } from '../services/storage';

interface CustomOrderModalProps {
  initialProduct: Product | null;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

const BED_SIZE_PRESETS = [
  'سرير كينغ عريض (180×200 سم)',
  'سرير نفرين مزدوج (160×200 سم)',
  'سرير وسط (140×190 سم)',
  'سرير فردي (90×190 سم)',
  'سرير بيبي ومواليد (70×140 سم)',
  'مقاس خاص غير قياسي'
];

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  initialProduct,
  products,
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [fabricChoice, setFabricChoice] = useState('');
  
  // Bed & Draouat specifics
  const [selectedBedPreset, setSelectedBedPreset] = useState(BED_SIZE_PRESETS[1]);
  const [mattressHeight, setMattressHeight] = useState('25');
  const [pillowCount, setPillowCount] = useState('2 مخدات مستطيلة (50×70 سم)');
  const [embroideryColor, setEmbroideryColor] = useState('طرز ذهبي فاتح / شامبانيا');
  const [customBedDimensions, setCustomBedDimensions] = useState('');

  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setFabricChoice(initialProduct.fabric);
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
      setFabricChoice(products[0].fabric);
    }

    const session = getClientSession();
    if (session.name && session.name !== 'عميل زائر') setCustomerName(session.name);
    if (session.phone) setCustomerPhone(session.phone);
  }, [initialProduct, products]);

  if (!isOpen) return null;

  const currentProduct = selectedProduct || products[0];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = 'يرجى كتابة الاسم الكامل';
    if (!customerPhone.trim()) errs.phone = 'يرجى كتابة رقم الهاتف للتواصل';
    if (!customerCity.trim()) errs.city = 'يرجى كتابة المدينة للتوصيل';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !currentProduct) return;

    setIsSubmitting(true);
    const session = getClientSession();
    setClientSessionInfo(customerName, customerPhone);

    const bedSizeFinal = selectedBedPreset === 'مقاس خاص غير قياسي' && customBedDimensions.trim()
      ? customBedDimensions.trim()
      : selectedBedPreset;

    const measurementsData: Measurements = {
      bedSize: bedSizeFinal,
      mattressHeight: `${mattressHeight} سم`,
      pillowCountAndSize: pillowCount,
      embroideryColor: embroideryColor.trim() || 'حسب نقشة العرض',
      notes: notes.trim()
    };

    const createdOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity: customerCity.trim(),
      customerAddress: customerAddress.trim(),
      productId: currentProduct.id,
      productTitle: currentProduct.title,
      productImage: currentProduct.image,
      productPrice: currentProduct.price,
      currency: currentProduct.currency,
      fabricChoice: fabricChoice || currentProduct.fabric,
      chosenSize: bedSizeFinal,
      piecesCount: currentProduct.piecesCount,
      measurements: measurementsData,
      notes: notes.trim(),
      chatThreadId: 'thread_' + session.id,
      tailorNotes: `طلب دراوات جديد. مقاس السرير: ${bedSizeFinal}، علو الماتلا: ${mattressHeight} سم.`
    });

    // Auto-send order info in customer's isolated 1-on-1 private chat
    sendCustomerMessage(
      session.id,
      customerName.trim(),
      `السلام عليكم، قمت بتقديم طلب تفصيل طقم دراوات (#${createdOrder.orderNumber}) لموديل: ${currentProduct.title}. مقاس السرير: ${bedSizeFinal} وعلو الماتلا: ${mattressHeight} سم. المرجو تأكيد الطلب.`,
      {
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        currency: currentProduct.currency,
        image: currentProduct.image
      },
      customerPhone.trim()
    );

    setIsSubmitting(false);
    onOrderSuccess(createdOrder);
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
            <Ruler className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold">طلب تفصيل طقم دراوات بمقاس سريرك</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Product Card Banner */}
        {currentProduct && (
          <div className="p-4 bg-stone-100/90 border-b border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentProduct.image}
                alt={currentProduct.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-lg object-cover border border-stone-300 shrink-0"
              />
              <div>
                <div className="text-xs text-stone-500">{currentProduct.category}</div>
                <div className="text-sm font-bold text-stone-900 line-clamp-1">{currentProduct.title}</div>
                <div className="text-xs font-semibold text-amber-900 mt-0.5">
                  السعر: {currentProduct.price.toLocaleString()} {currentProduct.currency}
                </div>
              </div>
            </div>

            {/* Change product selector */}
            {products.length > 1 && (
              <select
                value={currentProduct.id}
                onChange={(e) => {
                  const found = products.find(p => p.id === e.target.value);
                  if (found) {
                    setSelectedProduct(found);
                    setFabricChoice(found.fabric);
                  }
                }}
                className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Customer Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <User className="w-4 h-4 text-amber-800" />
              <span>معلومات الاتصال والتوصيل</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  الاسم الكامل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أمينة، مريم، ياسمين..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  رقم الهاتف (موبيليس / جيزي / أوريدو) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05 / 06 / 07 12 34 56"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none text-right"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  الولاية والبلدية (التوصيل لـ 58 ولاية) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="مثال: الجزائر العاصمة، وهران، سطيف، قسنطينة، باتنة، عنابة..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none"
                />
                {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  عنوان التوصيل
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="الحي، الإقامة أو رقم المنزل..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Bed & Draouat Dimensions */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <Ruler className="w-4 h-4 text-amber-800" />
              <span>مقاس السرير والدراوات المطلوب تفصيلها</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                اختر مقاس السرير:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BED_SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedBedPreset(preset)}
                    className={`p-2.5 text-xs font-semibold rounded-lg text-right border transition-all ${
                      selectedBedPreset === preset
                        ? 'border-amber-800 bg-amber-50/80 text-amber-950 ring-1 ring-amber-800'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {selectedBedPreset === 'مقاس خاص غير قياسي' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  اكتب أبعاد سريرك المخصصة (العرض × الطول سم):
                </label>
                <input
                  type="text"
                  value={customBedDimensions}
                  onChange={(e) => setCustomBedDimensions(e.target.value)}
                  placeholder="مثلاً: 200×200 سم أو 120×190 سم"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 outline-none focus:border-amber-800"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  علو أو سمك المرتبة (الماتلا) بالسنتيمتر:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={mattressHeight}
                    onChange={(e) => setMattressHeight(e.target.value)}
                    className="w-24 px-3 py-1.5 text-sm bg-white rounded border border-stone-300 text-center font-mono tabular-nums outline-none focus:border-amber-800"
                  />
                  <span className="text-xs text-stone-500">سم (لنضمن تغطية الدرا أوس للماتلا بإحكام)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  عدد ومقاس المخدات والوسائد:
                </label>
                <select
                  value={pillowCount}
                  onChange={(e) => setPillowCount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white rounded border border-stone-300 outline-none"
                >
                  <option value="2 مخدات مستطيلة (50×70 سم)">2 مخدات مستطيلة (50×70 سم)</option>
                  <option value="4 مخدات (2 مستطيلة + 2 مربعة 70×70 سم)">4 مخدات (2 مستطيلة + 2 مربعة 70×70 سم)</option>
                  <option value="طقم 6 وسائد عرايسي كامل">طقم 6 وسائد عرايسي كامل</option>
                  <option value="مخدة واحدة سرير فردي (50×70 سم)">مخدة واحدة سرير فردي (50×70 سم)</option>
                  <option value="مخدة بيبي رضع صغيرة">مخدة بيبي رضع صغيرة</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Fabric & Embroidery Customization */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
              تخصيص القماش ونقشة الطرز
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نوع ولون القماش المفضل
              </label>
              <input
                type="text"
                value={fabricChoice}
                onChange={(e) => setFabricChoice(e.target.value)}
                placeholder="مثال: قطن نقي عاجي، أو ساتان حريري أبيض ناصع، أو بيج بودرة..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                لون ونقشة التطريز المرغوبة
              </label>
              <input
                type="text"
                value={embroideryColor}
                onChange={(e) => setEmbroideryColor(e.target.value)}
                placeholder="مثال: طرز ذهبي صقلي، طرز أزهار وردية ناعمة، طرز فضي..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ملاحظات خاصة (تطريز حروف العروسين، دانتيل، موعد زفاف...)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتبي أي تفصيل ترغبين به في تفصيل وخياطة الدراه..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-700/50 outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer & Submit */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-right">
              <span className="text-xs text-stone-500">المجموع المطلوب: </span>
              <span className="text-xl font-bold text-stone-900 tabular-nums">
                {currentProduct?.price.toLocaleString()} {currentProduct?.currency}
              </span>
              <div className="text-[11px] text-stone-500">الدفع عند استلام ومراجعة طقم الدراوات · التوصيل متوفر لجميع الولايات (58 ولاية).</div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 sm:w-auto px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب للخياطة'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
