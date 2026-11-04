import React, { useState, useEffect } from 'react';
import { Product, Order, TailorSettings } from './types';
import { getProducts, getOrders, getAllChatThreads, getSettings, saveProduct, deleteProduct } from './services/storage';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CustomerChatWidget } from './components/CustomerChatWidget';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OwnerLoginModal } from './components/admin/OwnerLoginModal';
import { QuickUploadProductModal } from './components/QuickUploadProductModal';

export default function App() {
  const [settings, setSettings] = useState<TailorSettings>(getSettings());
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [activeView, setActiveView] = useState<'catalog' | 'admin' | 'about'>('catalog');
  
  // Owner Authentication (False by default for regular customers)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tailor_admin_session_unlocked') === 'true';
  });
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);
  const [isQuickUploadOpen, setIsQuickUploadOpen] = useState(false);
  const [pendingUploadAfterLogin, setPendingUploadAfterLogin] = useState(false);

  // Modals state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Customer Chat State (Strictly 1-on-1 between customer and owner)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatAttachedProduct, setChatAttachedProduct] = useState<Product | null>(null);
  const [chatAttachedOrder, setChatAttachedOrder] = useState<Order | null>(null);

  // Sync data whenever changed
  const refreshData = () => {
    setProducts(getProducts());
    setOrders(getOrders());
    setSettings(getSettings());
  };

  useEffect(() => {
    refreshData();
    const handleDataChange = () => {
      refreshData();
    };

    window.addEventListener('tailor_data_changed', handleDataChange);
    window.addEventListener('storage', handleDataChange);
    return () => {
      window.removeEventListener('tailor_data_changed', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  const handleUnlockOwner = () => {
    setIsOwnerAuthenticated(true);
    sessionStorage.setItem('tailor_admin_session_unlocked', 'true');
    setIsOwnerLoginModalOpen(false);
    if (pendingUploadAfterLogin) {
      setPendingUploadAfterLogin(false);
      setIsQuickUploadOpen(true);
    } else {
      setActiveView('admin');
    }
  };

  const handleLockOwner = () => {
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem('tailor_admin_session_unlocked');
    setActiveView('catalog');
  };

  const handleOpenOwnerLogin = () => {
    if (isOwnerAuthenticated) {
      setActiveView('admin');
    } else {
      setPendingUploadAfterLogin(false);
      setIsOwnerLoginModalOpen(true);
    }
  };

  const handleAddNewProductClick = () => {
    if (isOwnerAuthenticated) {
      setIsQuickUploadOpen(true);
    } else {
      setPendingUploadAfterLogin(true);
      setIsOwnerLoginModalOpen(true);
    }
  };

  // Chat openers with context
  const handleOpenChatAboutProduct = (product: Product) => {
    setChatAttachedProduct(product);
    setChatAttachedOrder(null);
    setIsChatOpen(true);
  };

  const handleOpenChatWithOrder = (order: Order) => {
    setChatAttachedOrder(order);
    setChatAttachedProduct(null);
    setConfirmedOrder(null);
    setIsChatOpen(true);
  };

  const handleOpenCustomOrder = (product?: Product) => {
    if (product) {
      setOrderProduct(product);
    } else if (products.length > 0) {
      setOrderProduct(products[0]);
    }
    setIsCustomOrderOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCustomOrderOpen(false);
    setConfirmedOrder(order);
  };

  // Metrics
  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Universal Top Bar */}
      <Header
        settings={settings}
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'admin' && !isOwnerAuthenticated) {
            setPendingUploadAfterLogin(false);
            setIsOwnerLoginModalOpen(true);
            return;
          }
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCustomOrder={() => handleOpenCustomOrder()}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenOwnerLogin={handleOpenOwnerLogin}
        newOrdersCount={newOrdersCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* VIEW 1: OWNER CONTROL PAGE (Accessible ONLY to the authenticated owner) */}
        {activeView === 'admin' && isOwnerAuthenticated ? (
          <AdminDashboard
            isUnlocked={isOwnerAuthenticated}
            onUnlock={() => {}}
            onLock={handleLockOwner}
            onReturnToStore={() => setActiveView('catalog')}
          />
        ) : activeView === 'about' ? (
          /* VIEW 2: ABOUT & CRAFTSMANSHIP */
          <div className="space-y-12">
            <AboutSection
              settings={settings}
              onCustomOrder={() => handleOpenCustomOrder()}
              onOpenChat={() => setIsChatOpen(true)}
            />
            <ProductCatalog
              products={products}
              isOwnerAuthenticated={isOwnerAuthenticated}
              onSelectProduct={(p) => setDetailProduct(p)}
              onOrderProduct={(p) => handleOpenCustomOrder(p)}
              onChatAboutProduct={(p) => handleOpenChatAboutProduct(p)}
              onAddNewProductClick={handleAddNewProductClick}
              onDeleteProduct={(id) => {
                deleteProduct(id);
                refreshData();
              }}
              onUpdateProductPrice={(id, newPrice) => {
                const p = products.find(i => i.id === id);
                if (p) {
                  saveProduct({ ...p, price: newPrice });
                  refreshData();
                }
              }}
            />
          </div>
        ) : (
          /* VIEW 3: STOREFRONT & CATALOG (For customers & visitors) */
          <>
            <HeroSection
              settings={settings}
              onBrowse={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onCustomOrder={() => handleOpenCustomOrder()}
              onOpenChat={() => setIsChatOpen(true)}
            />

            <ProductCatalog
              products={products}
              isOwnerAuthenticated={isOwnerAuthenticated}
              onSelectProduct={(p) => setDetailProduct(p)}
              onOrderProduct={(p) => handleOpenCustomOrder(p)}
              onChatAboutProduct={(p) => handleOpenChatAboutProduct(p)}
              onAddNewProductClick={handleAddNewProductClick}
              onDeleteProduct={(id) => {
                deleteProduct(id);
                refreshData();
              }}
              onUpdateProductPrice={(id, newPrice) => {
                const p = products.find(i => i.id === id);
                if (p) {
                  saveProduct({ ...p, price: newPrice });
                  refreshData();
                }
              }}
            />

            <AboutSection
              settings={settings}
              onCustomOrder={() => handleOpenCustomOrder()}
              onOpenChat={() => setIsChatOpen(true)}
            />
          </>
        )}

      </main>

      {/* Universal Footer with discreet owner login */}
      <Footer
        settings={settings}
        onNavigate={(view) => {
          if (view === 'admin' && !isOwnerAuthenticated) {
            setPendingUploadAfterLogin(false);
            setIsOwnerLoginModalOpen(true);
            return;
          }
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCustomOrder={() => handleOpenCustomOrder()}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenOwnerLogin={handleOpenOwnerLogin}
      />

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* 1. Quick Upload Product Modal (Triggered by the '+' card) */}
      <QuickUploadProductModal
        isOpen={isQuickUploadOpen}
        onClose={() => setIsQuickUploadOpen(false)}
        onSaveProduct={(newProd) => {
          saveProduct(newProd);
          refreshData();
        }}
        settings={settings}
      />

      {/* 2. Owner Login Modal (PIN check) */}
      <OwnerLoginModal
        isOpen={isOwnerLoginModalOpen}
        onClose={() => setIsOwnerLoginModalOpen(false)}
        onUnlockSuccess={handleUnlockOwner}
        settings={settings}
      />

      {/* 3. Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onOrder={(p) => handleOpenCustomOrder(p)}
        onChat={(p) => handleOpenChatAboutProduct(p)}
      />

      {/* 4. Custom Bedding & Draouat Order Modal */}
      <CustomOrderModal
        initialProduct={orderProduct}
        products={products}
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 5. Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onOpenChatWithOrder={handleOpenChatWithOrder}
      />

      {/* 6. Private 1-on-1 Customer Chat Widget */}
      <CustomerChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        settings={settings}
        attachedProduct={chatAttachedProduct}
        attachedOrder={chatAttachedOrder}
        onClearAttachment={() => {
          setChatAttachedProduct(null);
          setChatAttachedOrder(null);
        }}
      />

    </div>
  );
}
