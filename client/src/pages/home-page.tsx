import { MainLayout } from "@/components/layouts/main-layout";
import { HeroSection } from "@/components/home/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturesSection } from "@/components/home/features-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['/api/products', { featured: true, limit: 8 }],
  });

  // Render product skeletons when loading
  const renderProductSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm animate-pulse">
        <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-700"></div>
        <div className="p-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-2/3"></div>
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="flex justify-between mt-4">
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      
      {/* Featured Products Section */}
      <section id="productos-destacados" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          Productos Destacados
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading 
            ? renderProductSkeletons()
            : featuredProducts?.products?.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    image: product.image,
                    categoryName: product.categoryName,
                    rating: 4.5, // Placeholder until we have real ratings
                    reviewCount: 128, // Placeholder
                    isNew: new Date(product.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000),
                    isOnSale: !!product.discount,
                    stock: product.stock
                  }} 
                />
              ))
          }
        </div>
      </section>
      
      <FeaturesSection />
      <NewsletterSection />
    </MainLayout>
  );
}
