import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
}

export function ProductGrid({ 
  products, 
  isLoading = false,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange
}: ProductGridProps) {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Skeleton for loading state
  const renderSkeletons = () => {
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
  
  const getPaginationItems = () => {
    const items = [];
    const maxShownPages = 5;
    
    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            onPageChange(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <span className="px-4">...</span>
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let page = startPage; page <= endPage; page++) {
      if (page <= 1 || page >= totalPages) continue;
      
      items.push(
        <PaginationItem key={`page-${page}`}>
          <PaginationLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onPageChange(page);
            }}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <span className="px-4">...</span>
        </PaginationItem>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <div>
      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm">
        <div className="flex items-center mb-3 sm:mb-0">
          <span className="text-sm text-neutral-500 dark:text-neutral-400 mr-2">Ordenar por:</span>
          <Select onValueChange={onSortChange} defaultValue="newest">
            <SelectTrigger className="w-[180px] h-9 text-sm bg-neutral-100 dark:bg-neutral-700">
              <SelectValue placeholder="Relevancia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="best_rated">Mejor valorados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-neutral-500 dark:text-neutral-400 mr-2">Mostrar:</span>
          <div className="flex border border-neutral-200 dark:border-neutral-600 rounded-lg overflow-hidden">
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('grid')}
              className="h-8 px-3"
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('list')}
              className="h-8 px-3"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div 
        className={`grid gap-4 ${
          viewType === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}
      >
        {isLoading 
          ? renderSkeletons()
          : products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>
      
      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-lg mt-4">
          <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Intenta cambiar los filtros o la búsqueda para ver más resultados.
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
            />
            
            {getPaginationItems()}
            
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
