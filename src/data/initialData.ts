import { Product, Order, ChatThread, TailorSettings } from '../types';

export const INITIAL_SETTINGS: TailorSettings = {
  atelierName: 'طرز وخياطة دراوات',
  tailorName: 'صاحب المتجر',
  tailorTitle: 'خياطة وتطريز أغطية وأطقم الغرف والدراوات',
  phone: '0674160109',
  facebook: 'طرز وخياطة دراوات',
  tiktok: 'طرز وخياطة دراوات',
  address: 'الورشة الحرفية لتفصيل وخياطة المفروشات والدراوات',
  city: 'الجزائر (التوصيل متوفر لـ 58 ولاية)',
  currency: 'د.ج',
  adminPin: '1987',
  welcomeChatMessage: 'مرحبًا بك في متجر "طرز وخياطة دراوات" بالجزائر! يسعدنا استقبال استفساراتك حول مقاسات السرير، أقمشة القطن والساتان، وتطريز أطقم العرايس مع التوصيل لجميع ولايات الوطن.',
  deliveryDaysNotice: 'يتم تفصيل وخياطة وطرز كل طقم بعناية فائقة وإتقان يدوي خلال 4 إلى 8 أيام عمل مع التوصيل لكل الولايات.'
};

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-drap-101',
    orderNumber: 'ORD-501',
    createdAt: '2026-11-03T15:20:00Z',
    customerName: 'أمينة بلقاسم',
    customerPhone: '0555123456',
    customerCity: 'سطيف',
    customerAddress: 'حي الهضاب، عمارة ب 4',
    productId: 'prod-drap-1',
    productTitle: 'طقم دراوات عرايسي ملكي مطرز بالحرير والفتلة',
    productImage: '/src/assets/images/draouat_bridal_set_1793814696139.jpg',
    productPrice: 12500,
    currency: 'د.ج',
    fabricChoice: 'ساتان قطني عاجي لؤلؤي',
    chosenSize: 'سرير 180×200 سم',
    piecesCount: 'طقم 6 قطع عرايسي',
    measurements: {
      bedSize: '180×200 سم',
      drapPlatSize: '240×260 سم',
      drapHousseSize: '180×200 سم',
      mattressHeight: '30 سم (مرتبة سميكة)',
      pillowCountAndSize: '4 مخدات مستطيلة 50×70 سم + 2 وسائد مربعة',
      embroideryColor: 'طرز بالفتلة الذهبية الناعمة ولمسة وردي بودرة',
      notes: 'تصديرة عروس، المرجو إنهاؤه قبل موعد العرس.'
    },
    notes: 'أرجو تدعيم لاستيك الدرا أوس ليتناسب مع مرتبة سمك 30 سم.',
    status: 'new', // طلب جديد بانتظار تأكيد صاحب الصفحة
    tailorNotes: 'مقاسات سرير كينغ واضحة، الماتلا 30 سم تتطلب زيادة 5 سم في حافة الدرا أوس. جاهز للتأكيد.',
    chatThreadId: 'thread_client_amina',
    estimatedCompletionDate: '2026-11-12'
  }
];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread_client_amina',
    customerId: 'client_amina',
    customerName: 'أمينة بلقاسم',
    customerPhone: '0555123456',
    customerCity: 'سطيف',
    lastMessage: 'تمام، راني قدمت الطلب وكتبت لك مقاس السرير 180×200 والماتلا 30 سم للتوصيل لسطيف',
    lastMessageTime: 'منذ 15 دقيقة',
    unreadForTailor: 1,
    unreadForCustomer: 0,
    relatedProductId: 'prod-drap-1',
    relatedProductTitle: 'طقم دراوات عرايسي ملكي',
    messages: [
      {
        id: 'msg-h1',
        sender: 'customer',
        senderName: 'أمينة بلقاسم',
        text: 'السلام عليكم، ما شاء الله على خدمتك في الدراوات. واش كاين إمكانية نفصل هاد الطقم العرايسي لسرير 180×200 سم والماتلا عندي طالعة بـ 30 سم مع التوصيل لسطيف؟',
        timestamp: '15:05',
        productContext: {
          id: 'prod-drap-1',
          title: 'طقم دراوات عرايسي ملكي مطرز بالحرير والفتلة',
          price: 12500,
          currency: 'د.ج',
          image: '/src/assets/images/draouat_bridal_set_1793814696139.jpg'
        }
      },
      {
        id: 'msg-h2',
        sender: 'tailor',
        senderName: 'طرز وخياطة دراوات (صاحب المتجر)',
        text: 'وعليكم السلام ورحمة الله أختي أمينة وألف مبروك! نعم بالتأكيد، نحن نخيط كل طقم دراوات على مقاس سريرك والماتلا بدقة، والتوصيل متوفر حتى لباب المنزل في سطيف وكل الولايات.',
        timestamp: '15:10'
      },
      {
        id: 'msg-h3',
        sender: 'customer',
        senderName: 'أمينة بلقاسم',
        text: 'تمام، راني قدمت الطلب وكتبت لك مقاس السرير 180×200 والماتلا 30 سم للتوصيل لسطيف',
        timestamp: '15:22'
      }
    ]
  }
];
