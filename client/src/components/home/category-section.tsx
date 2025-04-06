import { Link } from "wouter";
import { 
  ComputerIcon, 
  SofaIcon, 
  ShirtIcon, 
  HomeIcon, 
  CornerUpRight, 
  GamepadIcon,
  ArrowRightIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Electrónica": <ComputerIcon className="h-6 w-6" />,
  "Muebles": <SofaIcon className="h-6 w-6" />,
  "Ropa": <ShirtIcon className="h-6 w-6" />,
  "Hogar": <HomeIcon className="h-6 w-6" />,
  "Deportes": <CornerUpRight className="h-6 w-6" />,
  "Juguetes": <GamepadIcon className="h-6 w-6" />
};

// Default icon for categories not found in the map
const DefaultIcon = <ComputerIcon className="h-6 w-6" />;

export function CategorySection() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query products for each category to get counts
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products", { limit: 100 }],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Calculate product count per category
  const getCategoryProductCount = (categoryId: number) => {
    return products.products?.filter((product: any) => product.categoryId === categoryId).length || 0;
  };
  
  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 p-4 animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-700 mb-3"></div>
        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto w-24 mb-2"></div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto w-16"></div>
      </div>
    ));
  };
  
  return (
    <section id="categorias" className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
        Categorías Destacadas
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading ? (
          renderSkeletons()
        ) : (
          categories.map((category: any) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col items-center p-4 group">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-3">
                  {categoryIcons[category.name] || DefaultIcon}
                </div>
                <h3 className="font-medium text-center text-neutral-700 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-1">
                  {getCategoryProductCount(category.id)} productos
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          href="/products" 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          Ver todas las categorías <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
