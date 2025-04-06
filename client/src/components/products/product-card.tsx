import { useState } from "react";
import { Link } from "wouter";
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ScanBarcode
} from "lucide-react";
import { Rating } from "@/components/common/rating";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    discount?: number;
    image?: string;
    categoryName?: string;
    rating?: number;
    reviewCount?: number;
    isNew?: boolean;
    isOnSale?: boolean;
    isLimited?: boolean;
    stock: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast({
        title: "Producto sin stock",
        description: "Este producto no está disponible actualmente",
        variant: "destructive"
      });
      return;
    }
    
    addToCart({ 
      productId: product.id, 
      quantity: 1 
    });
    
    toast({
      title: "Producto añadido",
      description: "Se ha añadido al carrito correctamente"
    });
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: isFavorite 
        ? "El producto se ha eliminado de tu lista de deseos" 
        : "El producto se ha añadido a tu lista de deseos"
    });
  };
  
  // Calculate discounted price
  const finalPrice = product.discount 
    ? product.price - product.discount 
    : product.price;
  
  // Determine badges
  const getBadges = () => {
    const badges = [];
    
    if (product.isNew) {
      badges.push(<Badge key="new" variant="new">Nuevo</Badge>);
    }
    
    if (product.discount) {
      const discountPercent = Math.round((product.discount / product.price) * 100);
      badges.push(<Badge key="sale" variant="sale">-{discountPercent}%</Badge>);
    }
    
    if (product.isLimited) {
      badges.push(<Badge key="limited" variant="limited">Limitado</Badge>);
    }
    
    return badges;
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <img 
            src={product.image || "https://placehold.co/600x400/EEE/31343C"}
            alt={product.name} 
            className="w-full h-48 object-cover object-center"
          />
          
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={toggleFavorite}
              aria-label="Añadir a favoritos"
            >
              <HeartIcon 
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "text-red-500 fill-red-500" : "text-neutral-600 dark:text-neutral-400"
                )}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Comparar"
            >
              <ScanBarcode className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </Button>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {getBadges()}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-1">
            <span className="text-sm text-neutral-500 dark:text-neutral-400 mr-2">
              {product.categoryName || "Categoría"}
            </span>
            <Rating 
              value={product.rating || 0} 
              reviews={product.reviewCount || 0}
              size="sm"
            />
          </div>
          
          <h3 className="font-medium mb-1 text-neutral-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discount && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through ml-2">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex items-center text-sm"
            >
              <ShoppingCartIcon className="mr-1 h-4 w-4" /> Añadir
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Helper for class names
import { cn } from "@/lib/utils";
