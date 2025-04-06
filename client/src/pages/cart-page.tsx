import { useState } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layouts/main-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/context/cart-context";
import { 
  ShoppingCartIcon, 
  ArrowLeftIcon, 
  TrashIcon, 
  AlertTriangleIcon 
} from "lucide-react";

export default function CartPage() {
  const { 
    cartItems, 
    cartCount,
    isLoading, 
    subtotal, 
    taxes, 
    shipping, 
    total,
    clearCart
  } = useCart();
  
  const [clearingCart, setClearingCart] = useState(false);
  
  const handleClearCart = async () => {
    if (window.confirm("¿Estás seguro de querer vaciar el carrito?")) {
      setClearingCart(true);
      await clearCart();
      setClearingCart(false);
    }
  };
  
  // Breadcrumb setup
  const breadcrumbItems = [
    { label: "Carrito de Compras" }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          Carrito de Compras
        </h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-neutral-100 dark:bg-neutral-700 p-4">
                <ShoppingCartIcon className="h-8 w-8 text-neutral-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              Parece que aún no has añadido nada a tu carrito.
            </p>
            <Button asChild>
              <Link href="/products">Explorar productos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">
                    Productos ({cartCount})
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearCart}
                    disabled={clearingCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Vaciar Carrito
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <Button variant="outline" asChild className="flex items-center">
                    <Link href="/products">
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Continuar Comprando
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
                
                <CartSummary 
                  subtotal={subtotal}
                  taxes={taxes}
                  shipping={shipping}
                  total={total}
                />
                
                {shipping === 0 && (
                  <div className="flex items-center mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
                    <AlertTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Envío gratis en pedidos mayores a $100</span>
                  </div>
                )}
                
                <Button className="w-full mt-6" size="lg" asChild>
                  <Link href="/checkout">
                    Proceder al Pago
                  </Link>
                </Button>
                
                <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Precios incluyen impuestos donde sea aplicable.
                  <br />Los métodos de pago se seleccionarán en el siguiente paso.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
