
import React from "react";
import { Search, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className={`pl-8 bg-slate-800 border-slate-700 ${isMobile ? 'w-[120px]' : 'w-[200px] lg:w-[300px]'}`}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {!isMobile && (
          <div className="flex items-center gap-1 text-sm bg-slate-800 px-3 py-1.5 rounded-md text-amber-400">
            <Cloud size={14} />
            <span>Cloud Ready</span>
          </div>
        )}
        
        <NotificationsDropdown />
        
        <div className="h-8 w-8 rounded-full bg-tree-purple flex items-center justify-center text-white font-medium">
          U
        </div>

        {children}
      </div>
    </header>
  );
};

export default Header;
