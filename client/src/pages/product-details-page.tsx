import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layouts/main-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { Rating } from "@/components/common/rating";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  RefreshCcwIcon,
  MinusIcon,
  PlusIcon
} from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  
  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });
  
  // Fetch product variants
  const { data: variants = [] } = useQuery({
    queryKey: ['/api/products', id, 'variants'],
    enabled: !!id,
  });
  
  // Fetch product reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/products', id, 'reviews'],
    enabled: !!id,
  });
  
  // Calculate average rating from reviews
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length
    : 0;
  
  if (productLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
                <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="mb-6">El producto que buscas no existe o no está disponible.</p>
          <Button onClick={() => navigate("/products")}>Ver otros productos</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Calculate final price considering discounts
  const finalPrice = product.discount 
    ? product.price - product.discount 
    : product.price;
    
  // Handle quantity changes
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
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
      quantity,
      variantId: selectedVariant || undefined 
    });
    
    toast({
      title: "Producto añadido",
      description: "Se ha añadido al carrito correctamente"
    });
  };
  
  // Setup breadcrumb items
  const breadcrumbItems = [
    { label: "Productos", href: "/products" },
    product.categoryName 
      ? { label: product.categoryName, href: `/products?category=${product.categoryId}` }
      : null,
    { label: product.name }
  ].filter(Boolean) as { label: string; href?: string }[];
  
  return (
    <MainLayout>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
            <img 
              src={product.image || "https://placehold.co/600x400?text=Imagen+no+disponible"} 
              alt={product.name} 
              className="w-full h-auto object-contain rounded-lg max-h-[500px]" 
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <Rating value={avgRating} reviews={reviews.length} size="md" />
              <Separator orientation="vertical" className="mx-3 h-5" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                SKU: {product.sku}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discount && (
                <span className="ml-3 text-lg text-neutral-500 dark:text-neutral-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              {product.discount && (
                <Badge variant="sale" className="ml-3">
                  -{Math.round((product.discount / product.price) * 100)}%
                </Badge>
              )}
            </div>
            
            {/* Stock status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-2"></div>
                  En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-medium flex items-center">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mr-2"></div>
                  Sin stock
                </span>
              )}
            </div>
            
            {/* Product description */}
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              {product.description || "Sin descripción disponible."}
            </p>
            
            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Variantes</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant: any) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedVariant(variant.id)}
                    >
                      {variant.name}: {variant.value}
                      {variant.priceModifier !== 0 && (
                        <span className="ml-1">
                          ({variant.priceModifier > 0 ? "+" : ""}${variant.priceModifier.toFixed(2)})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Cantidad</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  min="1" 
                  max={product.stock}
                  value={quantity} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= product.stock) {
                      setQuantity(value);
                    }
                  }}
                  className="w-16 mx-2 text-center" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 md:flex-none md:min-w-[200px]"
              >
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Añadir al Carrito
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 md:flex-none md:min-w-[200px]"
              >
                <HeartIcon className="mr-2 h-5 w-5" />
                Añadir a Favoritos
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg flex items-center">
                <TruckIcon className="h-5 w-5 mr-3 text-primary-600 dark:text-primary-400" />
                <div className="text-sm">
                  <div className="font-medium">Envío Rápido</div>
                  <div className="text-neutral-500 dark:text-neutral-400">24-48 horas</div>
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-3 text-primary-600 dark:text-primary-400" />
                <div className="text-sm">
                  <div className="font-medium">Garantía</div>
                  <div className="text-neutral-500 dark:text-neutral-400">2 años</div>
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg flex items-center">
                <RefreshCcwIcon className="h-5 w-5 mr-3 text-primary-600 dark:text-primary-400" />
                <div className="text-sm">
                  <div className="font-medium">Devoluciones</div>
                  <div className="text-neutral-500 dark:text-neutral-400">30 días</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs: Description and Reviews */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="reviews">Valoraciones</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-lg p-6">
              <TabsContent value="description">
                <h2 className="text-xl font-bold mb-4">Descripción del Producto</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>No hay descripción detallada disponible para este producto.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <h2 className="text-xl font-bold mb-4">Valoraciones de Clientes</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-neutral-200 dark:border-neutral-700 pb-6 last:border-0">
                        <div className="flex items-center mb-2">
                          <span className="font-medium mr-3">
                            {review.userFullName || review.username}
                          </span>
                          <Rating value={review.rating} showCount={false} size="sm" />
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-auto">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-300">
                          {review.comment || "Sin comentario."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No hay valoraciones disponibles para este producto.
                  </p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Related Products section would go here */}
      </div>
    </MainLayout>
  );
}
