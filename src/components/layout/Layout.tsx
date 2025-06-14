
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageBackground } from "@/components/theme/SydneyGreenTheme";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerComponent }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Map routes to specific background images
  const getBackgroundIndex = () => {
    switch (location.pathname) {
      case '/dashboard': return 0; // Sydney harbor sunset
      case '/settings': return 2; // Neon Sydney night
      case '/inventory': return 5; // Farm/greenhouse
      case '/sales': return 3; // Education lab
      case '/analytics': return 6; // Space theme
      case '/customers': return 1; // Lakeside cabin
      default: return Math.floor(Math.random() * 10); // Random for other pages
    }
  };
  
  return (
    <SidebarProvider>
      <PageBackground imageIndex={getBackgroundIndex()} />
      <div className="flex min-h-screen w-full bg-sydney-dark/95 backdrop-blur-sm">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {headerComponent || <Header />}
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-sydney-dark/80 via-sydney-purple/10 to-sydney-dark/80 backdrop-blur-sm">
            <div className="w-full max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
          <footer className="py-2 sm:py-3 px-3 sm:px-6 text-[10px] sm:text-xs text-sydney-green/80 text-center border-t border-sydney-green/30 bg-sydney-dark/90 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <span>🦘</span>
              <span>Cannabis Army Tracker - CAT</span>
              <span>🌿</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
