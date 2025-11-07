import { useState } from 'react';
import { ReservationForm } from './components/ReservationForm';
import { ReservationHistory } from './components/ReservationHistory';
import { MenuSection } from './components/MenuSection';
import { Cart } from './components/Cart';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { UtensilsCrossed, History, Menu, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  location: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  status: 'en proceso' | 'concluido';
  createdAt: string;
  orderType: 'pre-order' | 'order-at-venue';
  preOrderItems?: CartItem[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
  spicy?: boolean;
  vegetarian?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  id: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('reservation');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1, id: crypto.randomUUID() }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759419038843-29749ac4cd2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2MjM0NzA0NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Restaurante elegante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-white mb-2">La Mesa Perfecta</h1>
            <p className="text-white/90">Sistema de Reservas</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-slate-900">La Mesa Perfecta</h2>
              </div>
            </div>

            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white">
            <TabsTrigger value="reservation" className="gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Reservar
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-2">
              <Menu className="w-4 h-4" />
              Menú
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservation">
            <ReservationForm onSuccess={() => setActiveTab('history')} />
          </TabsContent>

          <TabsContent value="menu">
            <MenuSection onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="history">
            <ReservationHistory />
          </TabsContent>
        </Tabs>
      </main>

      {/* Cart Drawer */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </div>
  );
}

export default App;
