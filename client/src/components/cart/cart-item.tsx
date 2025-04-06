import { useState } from "react";
import { Link } from "wouter";
import { TrashIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";

interface CartItemProps {
  item: {
    id: number;
    productId: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      discount?: number;
      image?: string;
      stock: number;
    };
    variant?: {
      id: number;
      name: string;
      value: string;
      priceModifier: number;
    };
  };
  onClose?: () => void;
}

export function CartItem({ item, onClose }: CartItemProps) {
  const { updateCartItemQuantity, removeCartItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Calculate item price considering discount and variant
  const basePrice = item.product.discount 
    ? item.product.price - item.product.discount 
    : item.product.price;
    
  const variantModifier = item.variant?.priceModifier || 0;
  const itemPrice = basePrice + variantModifier;
  const totalPrice = itemPrice * item.quantity;
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;
    
    setIsUpdating(true);
    updateCartItemQuantity(item.id, newQuantity)
      .finally(() => setIsUpdating(false));
  };
  
  const handleRemove = () => {
    removeCartItem(item.id);
  };
  
  return (
    <div className="flex gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700">
      <Link 
        href={`/products/${item.product.id}`} 
        onClick={onClose}
        className="flex-shrink-0"
      >
        <img 
          src={item.product.image || "https://placehold.co/600x400?text=Imagen+no+disponible"} 
          alt={item.product.name} 
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.product.id}`} onClick={onClose}>
          <h4 className="font-medium text-neutral-800 dark:text-neutral-100">
            {item.product.name}
          </h4>
        </Link>
        
        {item.variant && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {item.variant.name}: {item.variant.value}
          </div>
        )}
        
        <div className="flex items-center mt-2 text-sm text-neutral-500">
          <span className="mr-2">Cantidad:</span>
          <div className="flex border border-neutral-200 dark:border-neutral-600 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              disabled={item.quantity <= 1 || isUpdating}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="h-8 w-8 p-0"
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <Input
              type="text"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) handleQuantityChange(value);
              }}
              className="w-10 h-8 text-center p-0 border-0"
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={item.quantity >= item.product.stock || isUpdating}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="h-8 w-8 p-0"
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium text-neutral-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-neutral-500 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
