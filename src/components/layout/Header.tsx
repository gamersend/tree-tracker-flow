
import React from "react";
import { SydneyButton } from "@/components/ui/sydney-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sydney-green/30 bg-sydney-dark/95 backdrop-blur supports-[backdrop-filter]:bg-sydney-dark/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <SydneyButton variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </SydneyButton>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-sydney-dark border-sydney-green/30">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div className="flex-1" />
        
        {children}
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SydneyButton variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-sydney-green/30">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-sydney-green text-sydney-dark font-bold">
                    {getInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
              </SydneyButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-sydney-dark border-sydney-green/30" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sydney-green">{user.email}</p>
                  <p className="text-xs text-sydney-green/70">
                    {user.user_metadata?.first_name || 'User'}
                  </p>
                </div>
              </div>
              <DropdownMenuItem onClick={handleSignOut} className="text-sydney-green hover:bg-sydney-green/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
