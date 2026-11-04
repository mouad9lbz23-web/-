import React, { useState, useMemo } from 'react';
import { Ruler, MessageCircle, Eye, Search, Sparkles, Plus, Trash2, Edit3, Upload } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ProductCatalogProps {
  products: Product[];
  isOwnerAuthenticated: boolean;
  onSelectProduct: (product: Product) => void;
  onOrderProduct: (product: Product) => void;
  onChatAboutProduct: (product: Product) => void;
  onAddNewProductClick: () => void;
  onDeleteProduct?: (id: string) => void;
  onUpdateProductPrice?: (id: string, newPrice: number) => void;
}

const CATEGORIES: (ProductCategory | 'الكل')[] = [
  'الكل',
  'أطقم دراوات عرايسي',
  'أطقم دراوات قطنية للغرف',
  'كوفريات وأغطية سرير فاخرة',
  'أطقم غرف نوم كاملة',
  'أغطية وسائد ومخاد الغرف',
  'أطقم أغطية سرير للأطفال والرضع'
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  isOwnerAuthenticated,
  onSelectProduct,
  onOrderProduct,
  onChatAboutProduct,
  onAddNewProductClick,
  onDeleteProduct,
  onUpdateProductPrice
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'الكل'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handlePriceSave = (id: string) => {
    if (onUpdateProductPrice && tempPrice > 0) {
      onUpdateProductPrice(id, tempPrice);
    }
    setEditingPriceId(null);
  };

  return (
    <section id="catalog-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
        <div className="text-right space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            كتالوج أطقم وموديلات الدراوات
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-luxury">
            أطقم الغرف والمفروشات المطرزة
          </h2>
          <p className="text-sm text-stone-600 max-w-xl">
            كل طقم يتم تفصيله يدويًا حسب مقاس سريرك (كينغ، نفرين، سرير فردي أو سرير أطفال) مع اختيارك للون القماش ونقشة التطريز.
          </p>
        </div>

        {/* Search input & Quick Add button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الأطقم، القماش، الطرز..."
              className="w-full pl-4 pr-10 py-2.5 text-sm rounded-lg bg-white border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 transition-colors"
            />
          </div>

          <button
            onClick={onAddNewProductClick}
            className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="إضافة صورة وسعر طقم جديد"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة طقم (+)</span>
          </button>
        </div>
      </div>

      {/* Category Segmented Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === category
                ? 'bg-stone-900 text-amber-200 shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* The prominent '+' card for the owner to upload product images and set price directly! */}
        <div
          onClick={onAddNewProductClick}
          className="aspect-[4/3] rounded-2xl border-2 border-dashed border-amber-600/60 hover:border-amber-800 bg-amber-50/40 hover:bg-amber-50/80 flex flex-col items-center justify-center p-6 text-center cursor-pointer group transition-all duration-300 shadow-xs hover:shadow-md"
        >
          <div className="w-16 h-16 rounded-full bg-amber-800 group-hover:bg-amber-900 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-3">
            <Plus className="w-8 h-8 stroke-[3]" />
          </div>
          <span className="text-base font-bold text-stone-900 font-serif-luxury">
            إضافة طقم دراوات جديد (+)
          </span>
          <span className="text-xs text-stone-600 mt-1 max-w-[220px] leading-relaxed">
            اضغط هنا لرفع صورة طقم الغرفة من جهازك وتحديد السعر بنفسك
          </span>
          <span className="mt-3 px-3 py-1 bg-white border border-amber-300/80 text-amber-950 text-[11px] font-bold rounded-full group-hover:bg-amber-800 group-hover:text-white transition-colors">
            تحميل صورة وتحديد السعر
          </span>
        </div>

        {/* Existing Products */}
        {filteredProducts.map(product => (
          <article
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-right relative"
          >
            
            {/* Owner badge and quick controls on the card */}
            {isOwnerAuthenticated && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-sm p-1 rounded-lg">
                <button
                  onClick={() => {
                    setEditingPriceId(product.id);
                    setTempPrice(product.price);
                  }}
                  className="p-1 text-amber-300 hover:text-white rounded hover:bg-stone-800 transition-colors"
                  title="تعديل السعر"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {onDeleteProduct && (
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف ${product.title} من المتجر؟`)) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    className="p-1 text-rose-400 hover:text-rose-200 rounded hover:bg-stone-800 transition-colors"
                    title="حذف هذا المنتج"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Product Visual */}
            <div 
              className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" 
              onClick={() => onSelectProduct(product)}
            >
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-sm text-stone-100 text-xs px-2.5 py-1 rounded-md font-medium">
                {product.category}
              </div>
              {product.piecesCount && (
                <div className="absolute bottom-3 right-3 bg-amber-900/85 backdrop-blur-sm text-amber-100 text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>{product.piecesCount}</span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                  <span>القماش: {product.fabric}</span>
                  <span>{product.sewingTimeDays} أيام خياطة وطرز</span>
                </div>

                <h3
                  onClick={() => onSelectProduct(product)}
                  className="text-base sm:text-lg font-bold text-stone-900 leading-snug hover:text-amber-900 cursor-pointer transition-colors"
                >
                  {product.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price and Actions */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">السعر المحدد:</span>
                  
                  {editingPriceId === product.id ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs font-bold text-center bg-white border-2 border-amber-800 rounded outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handlePriceSave(product.id)}
                        className="text-xs bg-amber-800 text-white px-2 py-1 rounded font-semibold"
                      >
                        حفظ
                      </button>
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-stone-900 tabular-nums">
                      {product.price.toLocaleString()} <span className="text-sm font-semibold text-amber-800">{product.currency}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOrderProduct(product)}
                    className="w-full py-2.5 px-3 bg-amber-800 text-white text-xs font-semibold rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>طلب التفصيل بمقاسك</span>
                  </button>
                  <button
                    onClick={() => onChatAboutProduct(product)}
                    className="w-full py-2.5 px-3 bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
                    title="استفسار مباشر بالدردشة حول هذا الطقم"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-amber-800" />
                    <span>استفسار بالدردشة</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectProduct(product)}
                  className="w-full text-center text-xs text-stone-500 hover:text-stone-900 font-medium py-1 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>معاينة تفاصيل الطقم</span>
                </button>
              </div>

            </div>
          </article>
        ))}

      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-8 text-center py-12 bg-white rounded-2xl border border-stone-200 space-y-3">
          <Sparkles className="w-8 h-8 text-amber-800 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">لا توجد أطقم مطابقة حالياً</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            اضغط على علامة (+) أعلاه لتحميل صورة طقم جديد وتحديد السعر الذي تريده فوراً.
          </p>
        </div>
      )}

    </section>
  );
};
