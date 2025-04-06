import { Link } from "wouter";
import { ShoppingBagIcon, LayoutGridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary-700 to-primary-900 dark:from-primary-900 dark:to-neutral-900 text-white py-12 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Descubre Productos Excepcionales
            </h1>
            <p className="text-lg mb-6 opacity-90">
              Tu destino de confianza para encontrar los mejores productos con envío 
              garantizado y atención personalizada.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                asChild 
                className="bg-secondary-700 hover:bg-secondary-800 text-white"
              >
                <Link href="/products" className="flex items-center">
                  <ShoppingBagIcon className="mr-2 h-5 w-5" /> Ver Productos
                </Link>
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                asChild 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
              >
                <Link href="/products" className="flex items-center">
                  <LayoutGridIcon className="mr-2 h-5 w-5" /> Explorar Categorías
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Productos Ventables" 
              className="rounded-lg shadow-lg w-full h-[300px] object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
