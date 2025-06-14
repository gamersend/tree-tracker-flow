
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerComponent }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sydney-dark">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {headerComponent || <Header />}
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-sydney-dark via-sydney-purple/20 to-sydney-dark">
            <div className="w-full max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
          <footer className="py-2 sm:py-3 px-3 sm:px-6 text-[10px] sm:text-xs text-sydney-green/70 text-center border-t border-sydney-green/30">
            Cannabis Army Tracker - CAT
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
