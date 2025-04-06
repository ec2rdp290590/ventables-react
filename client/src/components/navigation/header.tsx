import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  User2Icon,
  MenuIcon,
  LogOutIcon,
  PackageIcon,
  MapPinIcon,
  LayoutGridIcon
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/search-bar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { useQuery } from "@tanstack/react-query";

export function Header() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { cartCount, openCart } = useCart();
  
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/");
  };

  return (
    <header className={`sticky top-0 z-50 bg-white dark:bg-neutral-800 w-full transition-shadow ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              <span className="flex items-center">
                <ShoppingCartIcon className="mr-2" />
                Ventables
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Favoritos"
            >
              <HeartIcon className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Carrito de compras"
              onClick={openCart}
              className="relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-secondary-600 text-white text-xs rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Perfil">
                  <User2Icon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      Hola, {user.username}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <User2Icon className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=orders" className="cursor-pointer">
                        <PackageIcon className="mr-2 h-4 w-4" />
                        Mis Pedidos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=addresses" className="cursor-pointer">
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        Mis Direcciones
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/auth" className="cursor-pointer">
                      <User2Icon className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Categories Navigation */}
        <nav className="py-2 border-t border-neutral-200 dark:border-neutral-700 overflow-x-auto pb-3">
          <ul className="flex space-x-6 min-w-max">
            <li>
              <Link href="/products" className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                <LayoutGridIcon className="mr-1 h-4 w-4" />
                Todas las Categorías
              </Link>
            </li>
            
            {categories.slice(0, 7).map((category: any) => (
              <li key={category.id}>
                <Link 
                  href={`/products?category=${category.id}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            
            {categories.length > 7 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="h-auto p-0">
                    Más
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.slice(7).map((category: any) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/products?category=${category.id}`}>
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </ul>
        </nav>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}
