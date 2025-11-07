import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingBag, Flame, Leaf } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CartItem } from '../App';
import { toast } from 'sonner@2.0.3';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function Cart({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('S/', '').trim());
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.18; // 18% IGV
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    // Save order to localStorage
    const order = {
      id: crypto.randomUUID(),
      items: items,
      subtotal,
      tax,
      total,
      date: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

    toast.success('¡Pedido realizado exitosamente!');
    onClearCart();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Tu Pedido
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? 'No has agregado platillos'
              : `${items.length} ${items.length === 1 ? 'platillo' : 'platillos'} en tu pedido`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-2">Tu carrito está vacío</p>
              <p className="text-slate-500">Agrega platillos del menú para comenzar</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="text-slate-900 truncate">{item.name}</h4>
                          <div className="flex items-center gap-1 flex-wrap mt-1">
                            {item.spicy && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 gap-1 text-xs">
                                <Flame className="w-2.5 h-2.5" />
                                Picante
                              </Badge>
                            )}
                            {item.vegetarian && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 gap-1 text-xs">
                                <Leaf className="w-2.5 h-2.5" />
                                Vegetariano
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-orange-600">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IGV (18%)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-orange-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Realizar Pedido
                </Button>
                <Button
                  variant="outline"
                  onClick={onClearCart}
                  className="w-full"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
