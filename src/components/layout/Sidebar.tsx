
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Layers, 
  PackageOpen, 
  DollarSign, 
  Users, 
  BarChart, 
  Calendar, 
  Upload, 
  Settings,
  Package 
} from "lucide-react";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
};

const NavItem = ({ icon: Icon, label, href, active }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
        active 
          ? "bg-tree-purple text-white" 
          : "text-gray-300 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "" : "text-gray-400 group-hover:text-white")} />
      <span className="font-medium">{label}</span>
      {active && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse-subtle"></div>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Layers, label: "Inventory", href: "/inventory" },
    { icon: PackageOpen, label: "Current Stock", href: "/stock" },
    { icon: Package, label: "Business Supplies", href: "/business-supplies" },
    { icon: DollarSign, label: "Sales", href: "/sales" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: BarChart, label: "Analytics", href: "/analytics" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Upload, label: "Import Data", href: "/import" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-tree-green rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path d="M12 1c-2.2 0-4 1.8-4 4 0 0-.2 1.4 1.4 3.2-2.4-.1-3 .6-3.9 1.5-1.2 1.2-1.5 2-1.5 2 0 2.2 1.8 4 4 4 4.4 0 5.3-1.8 5.8-2.8.2-.4.6-.6.8-1 .3.4.5.6.8 1 .5 1 1.4 2.8 5.8 2.8 2.2 0 4-1.8 4-4 0 0-.3-.8-1.5-2-1-1-1.5-1.6-4-1.5 1.6-1.8 1.4-3.2 1.4-3.2 0-2.2-1.8-4-4-4-1.8 0-2.8.8-3.3 1.6-.1.1-.3.4-.7 1.2-.3-.8-.5-1-.7-1.2C14.8 1.8 13.8 1 12 1z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center">
              Tree Tracker
              <span className="ml-1 text-xs bg-tree-gold text-black px-1 rounded">☁️</span>
            </h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-slate-800/60 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-tree-purple flex items-center justify-center text-white font-medium">
              U
            </div>
            <div>
              <p className="text-sm text-white">User Account</p>
              <p className="text-xs text-gray-400">Connect auth to login</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
