import { ReactNode } from "react";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function SidebarLayout({ children, sidebar }: SidebarLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/4 xl:w-1/5">
            {sidebar}
          </aside>
          <main className="lg:w-3/4 xl:w-4/5">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
