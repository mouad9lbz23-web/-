import { Product, Order, ChatThread, ChatMessage, TailorSettings, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CHAT_THREADS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'tailor_app_products_v3',
  ORDERS: 'tailor_app_orders_v2',
  CHATS: 'tailor_app_chats_v2',
  SETTINGS: 'tailor_app_settings_v2',
  CLIENT_ID: 'tailor_current_client_id_v2',
  CLIENT_NAME: 'tailor_current_client_name_v2',
  CLIENT_PHONE: 'tailor_current_client_phone_v2',
};

const notifySubscribers = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tailor_data_changed'));
  }
};

// Client Session Helper (guarantees 1-on-1 private messaging isolation)
export const getClientSession = (): { id: string; name: string; phone: string } => {
  if (typeof window === 'undefined') {
    return { id: 'temp_client', name: 'عميل زائر', phone: '' };
  }
  let id = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
  if (!id) {
    id = 'client_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(STORAGE_KEYS.CLIENT_ID, id);
  }
  const name = localStorage.getItem(STORAGE_KEYS.CLIENT_NAME) || 'عميل زائر';
  const phone = localStorage.getItem(STORAGE_KEYS.CLIENT_PHONE) || '';
  return { id, name, phone };
};

export const setClientSessionInfo = (name: string, phone: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CLIENT_NAME, name);
    localStorage.setItem(STORAGE_KEYS.CLIENT_PHONE, phone);
  }
};

// PRODUCTS
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveProduct = (product: Product): Product[] => {
  const current = getProducts();
  const existingIdx = current.findIndex(p => p.id === product.id);
  let updated: Product[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = product;
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  notifySubscribers();
  return updated;
};

export const deleteProduct = (id: string): Product[] => {
  const current = getProducts();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  notifySubscribers();
  return updated;
};

// ORDERS
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
};

export const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
  const orders = getOrders();
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newOrder: Order = {
    ...orderData,
    id: 'ord_' + Date.now(),
    orderNumber: `ORD-${randomNum}`,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  const updated = [newOrder, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  notifySubscribers();
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus, tailorNotes?: string): Order[] => {
  const orders = getOrders();
  const updated = orders.map(ord => {
    if (ord.id === orderId) {
      return {
        ...ord,
        status,
        tailorNotes: tailorNotes !== undefined ? tailorNotes : ord.tailorNotes
      };
    }
    return ord;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  notifySubscribers();
  return updated;
};

export const deleteOrder = (orderId: string): Order[] => {
  const orders = getOrders();
  const updated = orders.filter(ord => ord.id !== orderId);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  notifySubscribers();
  return updated;
};

// CHATS & 1-ON-1 MESSAGING
export const getAllChatThreads = (): ChatThread[] => {
  if (typeof window === 'undefined') return INITIAL_CHAT_THREADS;
  const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_CHAT_THREADS));
    return INITIAL_CHAT_THREADS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHAT_THREADS;
  }
};

const saveChatThreads = (threads: ChatThread[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(threads));
    notifySubscribers();
  }
};

// Customer retrieves ONLY their private 1-on-1 thread with the Tailor
export const getCustomerThread = (customerId: string, customerName = 'عميل'): ChatThread => {
  const threads = getAllChatThreads();
  const existing = threads.find(t => t.customerId === customerId);
  if (existing) return existing;

  // Initialize fresh thread with welcoming message from the Tailor
  const settings = getSettings();
  const newThread: ChatThread = {
    id: 'thread_' + customerId,
    customerId,
    customerName,
    lastMessage: settings.welcomeChatMessage,
    lastMessageTime: 'الآن',
    unreadForTailor: 0,
    unreadForCustomer: 1,
    messages: [
      {
        id: 'msg_welcome_' + Date.now(),
        sender: 'tailor',
        senderName: settings.atelierName,
        text: settings.welcomeChatMessage,
        timestamp: new Intl.DateTimeFormat('ar-MA', { hour: '2-digit', minute: '2-digit' }).format(new Date())
      }
    ]
  };

  saveChatThreads([newThread, ...threads]);
  return newThread;
};

// Customer sends message to Tailor
export const sendCustomerMessage = (
  customerId: string,
  customerName: string,
  text: string,
  productContext?: ChatMessage['productContext'],
  customerPhone?: string
): ChatThread => {
  const threads = getAllChatThreads();
  let threadIndex = threads.findIndex(t => t.customerId === customerId);
  let thread: ChatThread;

  const nowTime = new Intl.DateTimeFormat('ar-DZ', { hour: '2-digit', minute: '2-digit' }).format(new Date());

  const newMsg: ChatMessage = {
    id: 'msg_' + Date.now(),
    sender: 'customer',
    senderName: customerName,
    text,
    timestamp: nowTime,
    productContext
  };

  if (threadIndex >= 0) {
    thread = {
      ...threads[threadIndex],
      customerName: customerName || threads[threadIndex].customerName,
      customerPhone: customerPhone || threads[threadIndex].customerPhone,
      lastMessage: text,
      lastMessageTime: nowTime,
      unreadForTailor: threads[threadIndex].unreadForTailor + 1,
      relatedProductId: productContext?.id || threads[threadIndex].relatedProductId,
      relatedProductTitle: productContext?.title || threads[threadIndex].relatedProductTitle,
      messages: [...threads[threadIndex].messages, newMsg]
    };
    threads.splice(threadIndex, 1);
    threads.unshift(thread);
  } else {
    thread = {
      id: 'thread_' + customerId,
      customerId,
      customerName,
      customerPhone,
      lastMessage: text,
      lastMessageTime: nowTime,
      unreadForTailor: 1,
      unreadForCustomer: 0,
      relatedProductId: productContext?.id,
      relatedProductTitle: productContext?.title,
      messages: [newMsg]
    };
    threads.unshift(thread);
  }

  saveChatThreads(threads);
  return thread;
};

// Tailor sends message to Customer
export const sendTailorMessage = (threadId: string, text: string): ChatThread | null => {
  const threads = getAllChatThreads();
  const threadIndex = threads.findIndex(t => t.id === threadId);
  if (threadIndex < 0) return null;

  const settings = getSettings();
  const nowTime = new Intl.DateTimeFormat('ar-DZ', { hour: '2-digit', minute: '2-digit' }).format(new Date());

  const newMsg: ChatMessage = {
    id: 'msg_' + Date.now(),
    sender: 'tailor',
    senderName: settings.atelierName,
    text,
    timestamp: nowTime
  };

  const updatedThread: ChatThread = {
    ...threads[threadIndex],
    lastMessage: text,
    lastMessageTime: nowTime,
    unreadForCustomer: (threads[threadIndex].unreadForCustomer || 0) + 1,
    messages: [...threads[threadIndex].messages, newMsg]
  };

  threads[threadIndex] = updatedThread;
  saveChatThreads(threads);
  return updatedThread;
};

export const markThreadReadByTailor = (threadId: string) => {
  const threads = getAllChatThreads();
  const updated = threads.map(t => {
    if (t.id === threadId) {
      return { ...t, unreadForTailor: 0 };
    }
    return t;
  });
  saveChatThreads(updated);
};

export const markThreadReadByCustomer = (customerId: string) => {
  const threads = getAllChatThreads();
  const updated = threads.map(t => {
    if (t.customerId === customerId) {
      return { ...t, unreadForCustomer: 0 };
    }
    return t;
  });
  saveChatThreads(updated);
};

// SETTINGS
export const getSettings = (): TailorSettings => {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try {
    const parsed = JSON.parse(raw);
    let changed = false;
    if (parsed.adminPin === '1234') {
      parsed.adminPin = '1987';
      changed = true;
    }
    if (parsed.currency === 'د.م' || !parsed.currency) {
      parsed.currency = 'د.ج';
      changed = true;
    }
    if (parsed.city && (parsed.city.includes('الدار البيضاء') || parsed.city.includes('فاس'))) {
      parsed.city = 'الجزائر العاصمة (التوصيل متوفر لـ 58 ولاية)';
      changed = true;
    }
    if (parsed.phone && (parsed.phone.includes('+212') || parsed.phone.includes('0550 12 34 56') || !parsed.phone)) {
      parsed.phone = '0674160109';
      changed = true;
    }
    if (!parsed.facebook) {
      parsed.facebook = 'طرز وخياطة دراوات';
      changed = true;
    }
    if (!parsed.tiktok) {
      parsed.tiktok = 'طرز وخياطة دراوات';
      changed = true;
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return { 
      ...INITIAL_SETTINGS, 
      ...parsed, 
      phone: parsed.phone || '0674160109',
      facebook: parsed.facebook || 'طرز وخياطة دراوات',
      tiktok: parsed.tiktok || 'طرز وخياطة دراوات',
      currency: parsed.currency || 'د.ج', 
      adminPin: parsed.adminPin || '1987' 
    };
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (settings: TailorSettings): TailorSettings => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  notifySubscribers();
  return settings;
};
