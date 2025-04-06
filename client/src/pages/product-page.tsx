import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { ProductFilter } from "@/components/products/product-filter";
import { ProductGrid } from "@/components/products/product-grid";
import { Breadcrumb } from "@/components/navigation/breadcrumb";

export default function ProductPage() {
  const [location] = useLocation();
  
  // Parse URL params
  const params = new URLSearchParams(location.split('?')[1]);
  const initialCategory = params.get('category') ? parseInt(params.get('category')!) : undefined;
  const initialSearch = params.get('search') || '';
  
  // Component state
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<string>("newest");
  const [filters, setFilters] = useState({
    category: initialCategory,
    search: initialSearch,
    priceRange: [0, 1000] as [number, number],
    rating: undefined as number | undefined,
    availability: [] as string[]
  });
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  // Fetch products with filters
  const { data, isLoading } = useQuery({
    queryKey: ['/api/products', {
      page: currentPage,
      limit: 12,
      category: filters.category,
      search: filters.search,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      rating: filters.rating,
      sort,
      inStock: filters.availability.includes('instock'),
      onSale: filters.availability.includes('onsale'),
      freeShipping: filters.availability.includes('freeshipping')
    }],
    keepPreviousData: true,
  });
  
  // Fetch category details if a category is selected
  const { data: categoryData } = useQuery({
    queryKey: ['/api/categories', filters.category],
    enabled: !!filters.category,
  });
  
  // Update filters
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  // Reset filters
  const handleFilterReset = () => {
    setFilters({
      category: undefined,
      search: '',
      priceRange: [0, 1000],
      rating: undefined,
      availability: []
    });
  };
  
  // Setup breadcrumb items
  const breadcrumbItems = [
    { label: "Productos", href: "/products" }
  ];
  
  if (filters.category && categoryData) {
    breadcrumbItems.push({ label: categoryData.name, href: `/products?category=${categoryData.id}` });
  }
  
  if (filters.search) {
    breadcrumbItems.push({ label: `Búsqueda: "${filters.search}"` });
  }
  
  // Process products data for the ProductGrid component
  const processedProducts = data?.products?.map((product: any) => ({
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
  })) || [];
  
  return (
    <SidebarLayout
      sidebar={
        <ProductFilter
          initialFilters={filters}
          onFilterChange={handleFilterChange}
          onFilterReset={handleFilterReset}
        />
      }
    >
      <Breadcrumb items={breadcrumbItems} />
      
      <h1 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
        {filters.category && categoryData 
          ? categoryData.name 
          : filters.search 
            ? `Resultados para "${filters.search}"` 
            : "Todos los Productos"}
      </h1>
      
      <ProductGrid
        products={processedProducts}
        isLoading={isLoading}
        totalCount={data?.pagination?.total || 0}
        currentPage={currentPage}
        totalPages={data?.pagination?.pages || 1}
        onPageChange={setCurrentPage}
        onSortChange={setSort}
      />
    </SidebarLayout>
  );
}
