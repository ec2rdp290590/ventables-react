import { ReactNode } from "react";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
