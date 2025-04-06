import { useState, useEffect } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FilterProps {
  initialFilters: {
    category?: number;
    priceRange?: [number, number];
    rating?: number;
    availability?: string[];
  };
  onFilterChange: (filters: any) => void;
  onFilterReset: () => void;
}

export function ProductFilter({ initialFilters, onFilterChange, onFilterReset }: FilterProps) {
  // States for each filter type
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initialFilters.category
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters.priceRange || [0, 1000]
  );
  const [rating, setRating] = useState<number | undefined>(
    initialFilters.rating
  );
  const [availability, setAvailability] = useState<string[]>(
    initialFilters.availability || []
  );

  // Get categories from API
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      category: selectedCategory,
      priceRange,
      rating,
      availability
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 1000]);
    setRating(undefined);
    setAvailability([]);
    onFilterReset();
  };

  // Handle checkbox changes for availability
  const handleAvailabilityChange = (value: string, checked: boolean) => {
    if (checked) {
      setAvailability(prev => [...prev, value]);
    } else {
      setAvailability(prev => prev.filter(item => item !== value));
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 sticky top-24">
      <h3 className="font-medium text-lg mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700">
        Filtros
      </h3>
      
      {/* Categories Filter */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories" className="border-b border-neutral-200 dark:border-neutral-700">
          <AccordionTrigger className="text-base font-medium py-2">
            Categorías
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category: any) => (
                <div className="flex items-center space-x-2" key={category.id}>
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={selectedCategory === category.id}
                    onCheckedChange={(checked) => {
                      setSelectedCategory(checked ? category.id : undefined);
                    }}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Price Range Filter */}
      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price" className="border-b border-neutral-200 dark:border-neutral-700">
          <AccordionTrigger className="text-base font-medium py-2">
            Rango de Precio
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2">
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-6"
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Ratings Filter */}
      <Accordion type="single" collapsible defaultValue="ratings">
        <AccordionItem value="ratings" className="border-b border-neutral-200 dark:border-neutral-700">
          <AccordionTrigger className="text-base font-medium py-2">
            Valoraciones
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={rating?.toString()} onValueChange={(value) => setRating(Number(value))}>
              {[5, 4, 3, 2, 1].map((value) => (
                <div className="flex items-center space-x-2" key={`rating-${value}`}>
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`} className="flex items-center">
                    {Array.from({ length: value }).map((_, idx) => (
                      <StarIcon key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - value }).map((_, idx) => (
                      <StarIcon key={idx} className="h-4 w-4 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-sm">
                      ({value === 5 ? "5" : `${value}+`})
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Availability Filter */}
      <Accordion type="single" collapsible defaultValue="availability">
        <AccordionItem value="availability" className="border-b border-neutral-200 dark:border-neutral-700">
          <AccordionTrigger className="text-base font-medium py-2">
            Disponibilidad
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="instock" 
                  checked={availability.includes('instock')}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange('instock', checked as boolean)
                  }
                />
                <Label htmlFor="instock" className="text-sm cursor-pointer">
                  En stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="onsale" 
                  checked={availability.includes('onsale')}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange('onsale', checked as boolean)
                  }
                />
                <Label htmlFor="onsale" className="text-sm cursor-pointer">
                  Oferta
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="freeshipping" 
                  checked={availability.includes('freeshipping')}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange('freeshipping', checked as boolean)
                  }
                />
                <Label htmlFor="freeshipping" className="text-sm cursor-pointer">
                  Envío gratis
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Filter Buttons */}
      <div className="flex gap-2 mt-6">
        <Button 
          className="w-full" 
          onClick={applyFilters}
        >
          Aplicar
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={resetFilters}
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
}
