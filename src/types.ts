export type ProductCategory = 
  | 'أطقم دراوات عرايسي' 
  | 'أطقم دراوات قطنية للغرف' 
  | 'كوفريات وأغطية سرير فاخرة' 
  | 'أطقم غرف نوم كاملة' 
  | 'أغطية وسائد ومخاد الغرف' 
  | 'أطقم أغطية سرير للأطفال والرضع';

export type OrderStatus = 
  | 'new'          // طلب جديد بحاجة لتأكيد
  | 'confirmed'    // تم التأكيد
  | 'in_sewing'    // قيد التفصيل والخياطة والطرز
  | 'ready'        // جاهز للتسليم
  | 'completed'    // مكتمل
  | 'cancelled';   // ملغى

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  currency: string;
  image: string;
  description: string;
  fabric: string;
  piecesCount?: string; // e.g. طقم 4 قطع، طقم 6 قطع...
  sewingTimeDays: number;
  availableSizes: string[];
  requiresCustomMeasurements: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface Measurements {
  bedSize?: string;             // مقاس السرير (مثلاً 160×200، 180×200، 90×190...)
  drapPlatSize?: string;        // مقاس الشرشف / الدراه الفوقاني (سم)
  drapHousseSize?: string;      // مقاس الدرا أوس المطاطي (سم)
  mattressHeight?: string;      // علو أو سمك الماتلا / المرتبة (سم)
  pillowCountAndSize?: string;  // عدد ومقاس المخدات والوسائد
  embroideryColor?: string;     // لون ونقشة الطرز
  notes?: string;               // تفاصيل إضافية
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress?: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  currency: string;
  fabricChoice?: string;
  chosenSize?: string;
  piecesCount?: string;
  measurements?: Measurements;
  notes?: string;
  status: OrderStatus;
  tailorNotes?: string;
  chatThreadId: string;
  estimatedCompletionDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'tailor';
  senderName: string;
  text: string;
  timestamp: string;
  productContext?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    image: string;
  };
}

export interface ChatThread {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerCity?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadForTailor: number;
  unreadForCustomer: number;
  relatedProductId?: string;
  relatedProductTitle?: string;
  messages: ChatMessage[];
}

export interface TailorSettings {
  atelierName: string;
  tailorName: string;
  tailorTitle: string;
  phone: string;
  facebook?: string;
  tiktok?: string;
  address: string;
  city: string;
  currency: string;
  adminPin: string;
  welcomeChatMessage: string;
  deliveryDaysNotice: string;
}
