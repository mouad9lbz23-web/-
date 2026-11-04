import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Scissors, 
  Package, 
  MessageCircle, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Eye, 
  Phone, 
  MapPin, 
  Trash2, 
  Edit3, 
  Send, 
  Search, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Product, Order, ChatThread, TailorSettings, OrderStatus } from '../../types';
import { 
  getOrders, 
  updateOrderStatus, 
  deleteOrder, 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getAllChatThreads, 
  sendTailorMessage, 
  markThreadReadByTailor, 
  getSettings, 
  saveSettings 
} from '../../services/storage';
import { MeasurementSheetModal } from './MeasurementSheetModal';
import { ProductFormModal } from './ProductFormModal';

interface AdminDashboardProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  onReturnToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isUnlocked,
  onUnlock,
  onLock,
  onReturnToStore
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'chats' | 'settings'>('orders');

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [settings, setSettings] = useState<TailorSettings>(getSettings());

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Modals state
  const [viewingMeasurementOrder, setViewingMeasurementOrder] = useState<Order | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Active chat state in admin inbox
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [tailorReplyText, setTailorReplyText] = useState('');

  // Quick price editing inline
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const loadAllData = () => {
    setOrders(getOrders());
    setProducts(getProducts());
    const threads = getAllChatThreads();
    setChatThreads(threads);
    setSettings(getSettings());
    if (!activeThreadId && threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  };

  useEffect(() => {
    loadAllData();

    const handleDataChange = () => {
      loadAllData();
    };

    window.addEventListener('tailor_data_changed', handleDataChange);
    window.addEventListener('storage', handleDataChange);
    return () => {
      window.removeEventListener('tailor_data_changed', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, [activeThreadId]);

  // Handle PIN unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePin = settings.adminPin || '1987';
    if (pinInput.trim() === effectivePin || pinInput.trim() === '1987') {
      onUnlock();
      setPinError('');
      setPinInput('');
    } else {
      setPinError('الرمز السري غير صحيح. الرمز هو 1987');
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed', 'تم تأكيد طلبك بنجاح من صاحب المتجر، وجارٍ تفصيل وخياطة الطقم بدقة.');
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الطلبية نهائيًا؟')) {
      deleteOrder(orderId);
    }
  };

  // PRODUCT ACTIONS
  const handleSaveProduct = (prod: Product) => {
    saveProduct(prod);
    setIsProductModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القطعة من المتجر؟')) {
      deleteProduct(id);
    }
  };

  const handleInlinePriceSave = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (p && tempPrice > 0) {
      saveProduct({ ...p, price: tempPrice });
    }
    setEditingPriceId(null);
  };

  // CHAT ACTIONS
  const handleSendTailorReply = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const text = (customText || tailorReplyText).trim();
    if (!text || !activeThreadId) return;

    sendTailorMessage(activeThreadId, text);
    setTailorReplyText('');
    markThreadReadByTailor(activeThreadId);
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    markThreadReadByTailor(threadId);
  };

  // Jump from order to customer chat
  const handleOpenChatForOrder = (order: Order) => {
    const thread = chatThreads.find(t => t.id === order.chatThreadId || t.customerPhone === order.customerPhone);
    if (thread) {
      setActiveThreadId(thread.id);
      setActiveTab('chats');
    } else {
      setActiveTab('chats');
    }
  };

  // SETTINGS ACTIONS
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    alert('تم حفظ إعدادات الورشة والمتجر بنجاح!');
  };

  // Stats calculation
  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const inSewingCount = orders.filter(o => o.status === 'in_sewing').length;
  const readyOrdersCount = orders.filter(o => o.status === 'ready' || o.status === 'completed').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.productPrice, 0);
  const unreadChatsTotal = chatThreads.reduce((sum, t) => sum + (t.unreadForTailor || 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesQuery = 
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerPhone.includes(orderSearchQuery) ||
      order.productTitle.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerCity.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const activeThread = chatThreads.find(t => t.id === activeThreadId) || chatThreads[0];

  // 1. PIN LOCK SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-right">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif-luxury">
              لوحة تحكم الخياط الحصرية
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              هذه اللوحة خاصة بك وحدك لاستقبال وتأكيد الطلبيات، وتحديد الأسعار، ونشر القطع المخيطة، والرد على محادثات الزبائن.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                أدخل الرقم السري للخياط (Master PIN)
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-center text-xl tracking-widest font-mono text-stone-900 outline-none focus:ring-2 focus:ring-amber-800"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-600 mt-1.5">{pinError}</p>}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span>الرمز السري لصفحة الإدارة: </span>
                <strong className="font-mono text-amber-950 font-bold">1987</strong>
                <span className="block text-[11px] text-amber-800 mt-0.5">يمكنك تغييره متى شئت من تبويب الإعدادات.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>دخول لوحة التحكم</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onReturnToStore}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              العودة إلى متجر القطع المخيطة
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. UNLOCKED ADMIN DASHBOARD
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      
      {/* Admin Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>لوحة الإدارة الحصرية للمصمم والخياط</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-luxury mt-1">
            إدارة الطلبيات والمحادثات والمعروضات
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            أنت المتحكم الوحيد في نشر القطع، تعديل الأسعار، تأكيد الطلبيات، ومراسلة الزبائن.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReturnToStore}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
          >
            معاينة المتجر العام
          </button>
          <button
            onClick={onLock}
            className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>قفل اللوحة</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="text-xs text-stone-500 font-medium">إجمالي الطلبيات المسجلة</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
            {orders.length} <span className="text-sm font-normal text-stone-500">طلبيات</span>
          </div>
          <div className="text-[11px] text-stone-400">إجمالي المداخيل: {totalRevenue.toLocaleString()} {settings.currency}</div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm space-y-1 transition-all ${
          newOrdersCount > 0 ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-300' : 'bg-white border-stone-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-700 font-semibold">طلبيات جديدة للتأكيد</span>
            {newOrdersCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-800 tabular-nums">
            {newOrdersCount} <span className="text-sm font-normal text-rose-600">طلب جديد</span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            {newOrdersCount > 0 ? 'يرجى مراجعتها وتأكيدها لبدء الخياطة' : 'لا توجد طلبات معلقة'}
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="text-xs text-stone-500 font-medium">قيد التفصيل والخياطة</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-900 tabular-nums">
            {inSewingCount} <span className="text-sm font-normal text-stone-500">قطعة</span>
          </div>
          <div className="text-[11px] text-stone-400">يجري إنجازها في الورشة</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">محادثات العملاء الخاصة</span>
            {unreadChatsTotal > 0 && (
              <span className="px-2 py-0.5 bg-amber-800 text-white rounded-full text-[10px] font-bold">
                {unreadChatsTotal} جديدة
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
            {chatThreads.length} <span className="text-sm font-normal text-stone-500">عميلاً</span>
          </div>
          <div className="text-[11px] text-stone-400">تواصل مباشر وخاص معك فقط</div>
        </div>

      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-8 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-amber-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>لائحة إدارة وتأكيد الطلبيات</span>
          {newOrdersCount > 0 && (
            <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-mono">
              {newOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-stone-900 text-amber-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>نشر وإدارة القطع المخيطة والأسعار</span>
          <span className="text-xs opacity-75 font-mono">({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chats')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'chats'
              ? 'bg-stone-900 text-amber-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>مركز محادثات العملاء (خاصة 1-on-1)</span>
          {unreadChatsTotal > 0 && (
            <span className="bg-amber-800 text-white text-xs px-2 py-0.5 rounded-full font-mono">
              {unreadChatsTotal}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-stone-900 text-amber-200 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات الورشة والمتجر</span>
        </button>

      </div>

      {/* ============================================================== */}
      {/* TAB 1: ORDERS MANAGEMENT (لائحة استقبال وتأكيد الطلبيات)       */}
      {/* ============================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Filters & Search Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
            
            {/* Status filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'كل الطلبيات' },
                  { id: 'new', label: 'جديد (بحاجة لتأكيد)' },
                  { id: 'confirmed', label: 'مؤكدة' },
                  { id: 'in_sewing', label: 'قيد الخياطة' },
                  { id: 'ready', label: 'جاهزة للتسليم' },
                  { id: 'completed', label: 'مكتملة' },
                  { id: 'cancelled', label: 'ملغاة' },
                ] as const
              ).map(st => (
                <button
                  key={st.id}
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    orderStatusFilter === st.id
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {st.label}
                  {st.id === 'new' && newOrdersCount > 0 && ` (${newOrdersCount})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب، الاسم، الهاتف..."
                className="w-full pl-3 pr-9 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>

          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 space-y-2">
              <Package className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">لا توجد طلبيات مطابقة للفلتر المحدد</h3>
              <p className="text-xs text-stone-500">
                عندما يقدم أي زبون طلب تفصيل ستظهر تفاصيله كاملة هنا لتأكيدها.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const isNew = order.status === 'new';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-sm ${
                      isNew
                        ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200'
                        : 'border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Product & Customer info */}
                      <div className="flex items-start gap-4">
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-stone-300 shrink-0"
                        />

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
                              {order.orderNumber}
                            </span>

                            {/* Status label */}
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              order.status === 'new'
                                ? 'bg-rose-100 text-rose-800'
                                : order.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'in_sewing'
                                ? 'bg-amber-100 text-amber-900'
                                : order.status === 'ready'
                                ? 'bg-purple-100 text-purple-800'
                                : order.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}>
                              {order.status === 'new' && 'طلب جديد (يحتاج تأكيد)'}
                              {order.status === 'confirmed' && 'تم التأكيد'}
                              {order.status === 'in_sewing' && 'قيد التفصيل والخياطة'}
                              {order.status === 'ready' && 'جاهز للتسليم / الشحن'}
                              {order.status === 'completed' && 'مكتمل'}
                              {order.status === 'cancelled' && 'ملغى'}
                            </span>

                            <span className="text-[11px] text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString('ar-MA')} · {new Date(order.createdAt).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-stone-900">
                            {order.productTitle}
                          </h3>

                          {/* Customer line */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700">
                            <div className="font-semibold text-stone-900">الزبون: {order.customerName}</div>
                            <span aria-hidden="true">·</span>
                            <div className="flex items-center gap-1" dir="ltr">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <a href={`tel:${order.customerPhone}`} className="hover:text-amber-800 hover:underline">
                                {order.customerPhone}
                              </a>
                            </div>
                            <span aria-hidden="true">·</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{order.customerCity}</span>
                            </div>
                          </div>

                          {/* Notes */}
                          {order.notes && (
                            <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200/60 max-w-xl">
                              <strong className="text-stone-800">ملاحظات الزبون:</strong> {order.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Price & Tailor Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                        
                        <div className="text-right lg:text-left">
                          <div className="text-xs text-stone-500">المبلغ الإجمالي</div>
                          <div className="text-xl font-bold text-stone-900 tabular-nums">
                            {order.productPrice.toLocaleString()} {order.currency}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          
                          {/* 1-Click Confirm Button for new orders */}
                          {isNew && (
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تأكيد هذا الطلب الآن</span>
                            </button>
                          )}

                          {/* Status Dropdown */}
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                              className="appearance-none pl-7 pr-3 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 outline-none cursor-pointer"
                            >
                              <option value="new">طلب جديد</option>
                              <option value="confirmed">مؤكد</option>
                              <option value="in_sewing">قيد الخياطة والتفصيل</option>
                              <option value="ready">جاهز للتسليم</option>
                              <option value="completed">مكتمل</option>
                              <option value="cancelled">ملغى</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute left-2 top-2.5 pointer-events-none" />
                          </div>

                          {/* Open Measurements sheet */}
                          <button
                            onClick={() => setViewingMeasurementOrder(order)}
                            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                            title="عرض المقاسات السبعة وطباعة البطاقة"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-800" />
                            <span>المقاسات والبطاقة</span>
                          </button>

                          {/* Jump to Chat */}
                          <button
                            onClick={() => handleOpenChatForOrder(order)}
                            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-amber-200 transition-colors"
                            title="فتح محادثة مباشرة مع هذا العميل"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>محادثة العميل</span>
                          </button>

                          {/* Delete order */}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="حذف الطلبية"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PRODUCTS & PRICING (نشر وإدارة القطع والأسعار)           */}
      {/* ============================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                إدارة أطقم الغرف والأغطية ونشر الصور والأسعار
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                أنت صاحب المتجر الوحيد الذي يرفع صور منتجاته ويحدد السعر الذي يريده لكل طقم دون أي تدخل.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {products.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('هل ترغب في حذف كافة المنتجات الحالية للبدء بقائمة فارغة تنشر فيها صورك وأسعارك الخاصة فقط؟')) {
                      localStorage.setItem('tailor_app_products_v1', JSON.stringify([]));
                      loadAllData();
                    }
                  }}
                  className="px-3.5 py-2.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 text-xs font-semibold rounded-xl border border-stone-200 transition-colors"
                  title="مسح العينات للبدء بمنتجاتك الخاصة فقط"
                >
                  تفريغ لنشر منتجاتي فقط
                </button>
              )}
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>نشر طقم جديد برسمك وسعرك</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                
                <div>
                  <div className="relative aspect-[4/3] bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-stone-950/80 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{product.title}</h4>
                    <div className="text-xs text-stone-500">الثوب: {product.fabric}</div>
                    <div className="text-xs text-stone-500">مدة التفصيل: {product.sewingTimeDays} أيام</div>
                  </div>
                </div>

                {/* Price and actions bar */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 space-y-3">
                  
                  {/* Inline Price Adjuster */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-600">السعر المعروض:</span>
                    {editingPriceId === product.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-xs font-bold text-center bg-white border border-amber-800 rounded outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleInlinePriceSave(product.id)}
                          className="text-xs bg-amber-800 text-white px-2 py-1 rounded font-semibold"
                        >
                          حفظ
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-stone-900 tabular-nums">
                          {product.price.toLocaleString()} {product.currency}
                        </span>
                        <button
                          onClick={() => {
                            setEditingPriceId(product.id);
                            setTempPrice(product.price);
                          }}
                          className="p-1 text-stone-400 hover:text-amber-800 transition-colors"
                          title="تعديل السعر مباشرة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setProductToEdit(product);
                        setIsProductModalOpen(true);
                      }}
                      className="py-1.5 px-3 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors"
                    >
                      تعديل التفاصيل
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
                    >
                      حذف من المتجر
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: TAILOR 1-ON-1 CHAT INBOX (مركز محادثات العملاء الخاصة)   */}
      {/* ============================================================== */}
      {activeTab === 'chats' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-[650px] flex flex-col md:flex-row">
          
          {/* Threads List Sidebar (Right in RTL) */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-stone-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="font-bold text-sm text-stone-900">محادثات العملاء الواردة</div>
              <span className="text-xs bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-mono">
                {chatThreads.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
              {chatThreads.map(thread => {
                const isSelected = thread.id === activeThread?.id;
                const unread = thread.unreadForTailor || 0;

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`p-3.5 cursor-pointer transition-colors text-right ${
                      isSelected ? 'bg-amber-50/70 border-r-4 border-amber-800' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                        <span>{thread.customerName}</span>
                        {unread > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">{thread.lastMessageTime}</span>
                    </div>

                    {thread.customerPhone && (
                      <div className="text-[11px] text-stone-500 mb-1" dir="ltr">
                        {thread.customerPhone}
                      </div>
                    )}

                    <div className="text-xs text-stone-600 line-clamp-1">
                      {thread.lastMessage}
                    </div>

                    {thread.relatedProductTitle && (
                      <div className="mt-1 text-[10px] text-amber-900 font-semibold truncate bg-amber-100/60 px-1.5 py-0.5 rounded">
                        استفسار حول: {thread.relatedProductTitle}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Conversation View (Left in RTL) */}
          <div className="flex-1 flex flex-col justify-between bg-stone-50/40">
            {activeThread ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-stone-900">{activeThread.customerName}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <span dir="ltr">{activeThread.customerPhone || 'بدون رقم'}</span>
                      {activeThread.customerCity && <span>· {activeThread.customerCity}</span>}
                    </div>
                  </div>

                  {activeThread.customerPhone && (
                    <a
                      href={`https://wa.me/${activeThread.customerPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>واتساب العميل</span>
                    </a>
                  )}
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                  {activeThread.messages.map(msg => {
                    const isTailor = msg.sender === 'tailor';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isTailor ? 'items-start' : 'items-end'}`}
                      >
                        <div className="text-[10px] text-stone-400 mb-1 px-1">
                          {isTailor ? 'أنت (صاحب المتجر)' : activeThread.customerName} · {msg.timestamp}
                        </div>

                        <div
                          className={`max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isTailor
                              ? 'bg-amber-800 text-white rounded-tr-none'
                              : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                          }`}
                        >
                          {msg.productContext && (
                            <div className="mb-2 p-2 bg-black/10 rounded-lg flex items-center gap-2 text-right">
                              <img
                                src={msg.productContext.image}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded object-cover shrink-0"
                              />
                              <div className="text-xs">
                                <div className="font-bold">{msg.productContext.title}</div>
                                <div className="opacity-90">{msg.productContext.price} {msg.productContext.currency}</div>
                              </div>
                            </div>
                          )}

                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Tailor Templates */}
                <div className="p-2 bg-white border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => handleSendTailorReply(undefined, 'وعليكم السلام ورحمة الله! نعم يمكن تفصيل هذا الموديل تماماً على مقاسك وبالثوب المفضل لديك.')}
                    className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded-full transition-colors"
                  >
                    تأكيد إمكانية التفصيل
                  </button>
                  <button
                    onClick={() => handleSendTailorReply(undefined, 'تمت مراجعة مقاساتك بدقة، وسنبدأ عملية الفصالة والخياطة اليدوية اليوم إن شاء الله.')}
                    className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded-full transition-colors"
                  >
                    المقاسات مضبوطة والبدء اليوم
                  </button>
                  <button
                    onClick={() => handleSendTailorReply(undefined, 'مدة الخياطة ستستغرق 6 أيام عمل مع التوصيل المجاني إلى باب بيتك.')}
                    className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded-full transition-colors"
                  >
                    مدة الخياطة والتوصيل
                  </button>
                </div>

                {/* Reply Composer */}
                <form onSubmit={handleSendTailorReply} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={tailorReplyText}
                    onChange={(e) => setTailorReplyText(e.target.value)}
                    placeholder="اكتب ردك الشخصي للعميل بصفتك الخياط والمصمم..."
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-100 rounded-xl border border-transparent focus:border-amber-700 focus:bg-white outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!tailorReplyText.trim()}
                    className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>إرسال الرد</span>
                    <Send className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-stone-400 text-xs">
                اختر محادثة لعرض الرسائل والرد على الزبون
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: BOUTIQUE & TAILOR SETTINGS                             */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">بيانات الورشة وتخصيص المتجر</h3>
            <p className="text-xs text-stone-500">
              تغيير اسم دار الخياطة، الرمز السري، العملة المستخدمة ورقم الهاتف.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">اسم دار الخياطة / المتجر</label>
              <input
                type="text"
                value={settings.atelierName}
                onChange={(e) => setSettings({ ...settings, atelierName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none focus:border-amber-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">اسم الخياط / المصمم</label>
                <input
                  type="text"
                  value={settings.tailorName}
                  onChange={(e) => setSettings({ ...settings, tailorName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الصفة واللقب</label>
                <input
                  type="text"
                  value={settings.tailorTitle}
                  onChange={(e) => setSettings({ ...settings, tailorTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">رمز العملة</label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  placeholder="د.ج (دينار جزائري)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الرمز السري للوحة (PIN)</label>
                <input
                  type="text"
                  value={settings.adminPin}
                  onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none text-center font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">رقم الهاتف للتواصل</label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="0674160109"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none text-right font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">صفحة فايسبوك (Facebook)</label>
                <input
                  type="text"
                  value={settings.facebook || 'طرز وخياطة دراوات'}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder="طرز وخياطة دراوات"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">حساب تيك توك (TikTok)</label>
                <input
                  type="text"
                  value={settings.tiktok || 'طرز وخياطة دراوات'}
                  onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                  placeholder="طرز وخياطة دراوات"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">رسالة الترحيب التلقائية بالدردشة</label>
              <textarea
                rows={3}
                value={settings.welcomeChatMessage}
                onChange={(e) => setSettings({ ...settings, welcomeChatMessage: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-200 font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              حفظ وتطبيق الإعدادات
            </button>

          </form>
        </div>
      )}

      {/* Measurement Sheet Modal */}
      <MeasurementSheetModal
        order={viewingMeasurementOrder}
        settings={settings}
        onClose={() => setViewingMeasurementOrder(null)}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Publish / Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        settings={settings}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
      />

    </div>
  );
};
