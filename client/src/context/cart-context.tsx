import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: any[];
  cartCount: number;
  addToCart: (item: { productId: number; quantity: number; variantId?: number }) => Promise<void>;
  updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Fetch cart data
  const { 
    data: cartData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['/api/cart'],
    refetchOnWindowFocus: false,
  });

  // Calculate cart totals
  const cartItems = cartData?.items || [];
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  
  const subtotal = cartItems.reduce((acc: number, item: any) => {
    const basePrice = item.product.discount 
      ? item.product.price - item.product.discount 
      : item.product.price;
    const variantModifier = item.variant?.priceModifier || 0;
    return acc + ((basePrice + variantModifier) * item.quantity);
  }, 0);
  
  // Simplified tax calculation (6% of subtotal)
  const taxes = subtotal * 0.06;
  
  // Shipping calculation (free for orders over $100, otherwise $9.99)
  const shipping = subtotal > 100 ? 0 : 9.99;
  
  const total = subtotal + taxes + shipping;

  // Cart mutations
  const addToCartMutation = useMutation({
    mutationFn: async (item: { productId: number; quantity: number; variantId?: number }) => {
      const res = await apiRequest("POST", "/api/cart/items", item);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al añadir al carrito",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/items/${itemId}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar el carrito",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeCartItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar del carrito",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cart actions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (item: { productId: number; quantity: number; variantId?: number }) => {
    await addToCartMutation.mutateAsync(item);
  };

  const updateCartItemQuantity = async (itemId: number, quantity: number) => {
    await updateCartItemMutation.mutateAsync({ itemId, quantity });
  };

  const removeCartItem = async (itemId: number) => {
    await removeCartItemMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    // This would be implemented on the server
    // For now, we'll remove each item individually
    for (const item of cartItems) {
      await removeCartItemMutation.mutateAsync(item.id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        cartCount,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        isLoading,
        subtotal,
        taxes,
        shipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
