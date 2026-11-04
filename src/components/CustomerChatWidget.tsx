import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, User, ShieldCheck, CheckCheck } from 'lucide-react';
import { ChatThread, ChatMessage, Product, Order, TailorSettings } from '../types';
import { 
  getClientSession, 
  setClientSessionInfo, 
  getCustomerThread, 
  sendCustomerMessage, 
  markThreadReadByCustomer 
} from '../services/storage';

interface CustomerChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  settings: TailorSettings;
  attachedProduct?: Product | null;
  attachedOrder?: Order | null;
  onClearAttachment?: () => void;
}

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  settings,
  attachedProduct,
  attachedOrder,
  onClearAttachment
}) => {
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadThread = () => {
    const session = getClientSession();
    setClientName(session.name);
    setClientPhone(session.phone);
    const th = getCustomerThread(session.id, session.name);
    setThread(th);
    if (isOpen) {
      markThreadReadByCustomer(session.id);
    }
  };

  useEffect(() => {
    loadThread();

    const handleStorageChange = () => {
      loadThread();
    };

    window.addEventListener('tailor_data_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('tailor_data_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const session = getClientSession();
      markThreadReadByCustomer(session.id);
    }
  }, [isOpen, thread?.messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const session = getClientSession();
    const effectiveName = clientName.trim() || 'عميل مهتم';
    setClientSessionInfo(effectiveName, clientPhone.trim());

    let productContext: ChatMessage['productContext'] | undefined = undefined;
    if (attachedProduct) {
      productContext = {
        id: attachedProduct.id,
        title: attachedProduct.title,
        price: attachedProduct.price,
        currency: attachedProduct.currency,
        image: attachedProduct.image
      };
    } else if (attachedOrder) {
      productContext = {
        id: attachedOrder.productId,
        title: `${attachedOrder.productTitle} (طلب #${attachedOrder.orderNumber})`,
        price: attachedOrder.productPrice,
        currency: attachedOrder.currency,
        image: attachedOrder.productImage
      };
    }

    const updated = sendCustomerMessage(
      session.id,
      effectiveName,
      text,
      productContext,
      clientPhone.trim()
    );

    setThread(updated);
    setInputText('');
    if (onClearAttachment) onClearAttachment();
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  const unreadCount = thread?.unreadForCustomer || 0;

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 left-6 z-40 p-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-amber-500/30 group"
          title="محادثة مباشرة مع الخياط"
          aria-label="محادثة مباشرة مع الخياط"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold pl-1 hidden sm:inline">
            تحدث مع الخياط مباشرة
          </span>
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-slide-up text-right">
          
          {/* Header */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center font-bold text-base shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-stone-900 rounded-full"></span>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold flex items-center gap-1.5">
                  <span>{settings.atelierName}</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  محادثة خاصة ومباشرة بينك وبين صاحب المتجر فقط
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                aria-label="إغلاق الدردشة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Privacy & Session Bar */}
          <div className="px-4 py-2 bg-stone-100 border-b border-stone-200/80 text-[11px] text-stone-600 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>محادثة مشفرة وخاصة (لا يراها غيرك والخياط)</span>
            </div>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-amber-800 hover:underline font-semibold"
            >
              {clientName && clientName !== 'عميل زائر' ? clientName : 'أدخل اسمك'}
            </button>
          </div>

          {/* Optional Client Info Edit Drawer */}
          {isEditingInfo && (
            <div className="p-3 bg-amber-50/80 border-b border-amber-200 text-xs space-y-2">
              <div className="font-semibold text-stone-800">بياناتك ليتمكن الخياط من مناداتك والتواصل معك:</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="اسمك الكامل"
                  className="px-2.5 py-1.5 bg-white rounded border border-stone-300 outline-none"
                />
                <input
                  type="tel"
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  className="px-2.5 py-1.5 bg-white rounded border border-stone-300 outline-none text-right"
                />
              </div>
              <button
                onClick={() => {
                  setClientSessionInfo(clientName, clientPhone);
                  setIsEditingInfo(false);
                }}
                className="w-full py-1 bg-amber-800 text-white rounded text-xs font-semibold"
              >
                حفظ
              </button>
            </div>
          )}

          {/* Attached Product Context Banner if open */}
          {(attachedProduct || attachedOrder) && (
            <div className="p-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={attachedProduct?.image || attachedOrder?.productImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded object-cover border border-stone-300 shrink-0"
                />
                <div className="leading-tight">
                  <div className="text-stone-500 text-[10px]">تستفسر حول:</div>
                  <div className="font-bold text-stone-900 line-clamp-1">
                    {attachedProduct?.title || attachedOrder?.productTitle}
                  </div>
                  <div className="font-semibold text-amber-800 text-[11px]">
                    {attachedProduct?.price || attachedOrder?.productPrice} {settings.currency}
                  </div>
                </div>
              </div>
              {onClearAttachment && (
                <button
                  onClick={onClearAttachment}
                  className="text-stone-400 hover:text-stone-700 p-1"
                  title="إلغاء إرفاق القطعة"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50">
            {thread?.messages.map((msg) => {
              const isMe = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] text-stone-400 mb-1 px-1">
                    {isMe ? 'أنت' : 'صاحب المتجر'} · {msg.timestamp}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-amber-800 text-white rounded-tr-none'
                        : 'bg-white text-stone-900 border border-stone-200/90 rounded-tl-none'
                    }`}
                  >
                    {/* Attached product card preview in message if present */}
                    {msg.productContext && (
                      <div className="mb-2 p-2 bg-black/10 rounded-lg flex items-center gap-2 text-right">
                        <img
                          src={msg.productContext.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded object-cover shrink-0"
                        />
                        <div className="text-[11px] leading-tight">
                          <div className="font-bold line-clamp-1">{msg.productContext.title}</div>
                          <div className="opacity-90">{msg.productContext.price} {msg.productContext.currency}</div>
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-1.5 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleQuickQuestion('هل يمكنني تفصيل هذا الموديل بلون أو ثوب آخر؟')}
              className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full transition-colors"
            >
              هل متوفر بلون آخر؟
            </button>
            <button
              onClick={() => handleQuickQuestion('كم تستغرق مدة الخياطة والتوصيل؟')}
              className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full transition-colors"
            >
              مدة الخياطة؟
            </button>
            <button
              onClick={() => handleQuickQuestion('كيف أقوم بأخذ المقاسات بدقة؟')}
              className="text-[11px] whitespace-nowrap bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full transition-colors"
            >
              إرشادات المقاسات
            </button>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استفسارك أو طلبك للخياط..."
              className="flex-1 px-3.5 py-2.5 bg-stone-100 text-xs sm:text-sm rounded-xl border border-transparent focus:border-amber-700 focus:bg-white outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm shrink-0"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
