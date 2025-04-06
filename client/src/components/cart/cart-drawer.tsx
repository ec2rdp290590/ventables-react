import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCartIcon, XIcon } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/context/cart-context";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    cartCount, 
    isLoading, 
    subtotal, 
    taxes, 
    shipping, 
    total 
  } = useCart();
  
  const closeRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);
  
  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center">
              <ShoppingCartIcon className="mr-2 h-5 w-5" />
              Carrito ({cartCount})
            </SheetTitle>
            <SheetClose ref={closeRef} asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Cerrar carrito"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-neutral-100 dark:bg-neutral-700 p-3 mb-4">
              <ShoppingCartIcon className="h-6 w-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Parece que aún no has añadido nada a tu carrito.
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/products">Explorar productos</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItem 
                    key={item.id} 
                    item={item}
                    onClose={() => closeRef.current?.click()}
                  />
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
              <CartSummary 
                subtotal={subtotal}
                taxes={taxes}
                shipping={shipping}
                total={total}
              />
              
              <div className="mt-6 space-y-3">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/checkout">
                      Finalizar Compra
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Seguir Comprando
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
