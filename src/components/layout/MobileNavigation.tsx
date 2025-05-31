
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HomeIcon,
  LayoutDashboardIcon,
  PackageIcon,
  DollarSignIcon,
  UsersIcon,
  BoxIcon,
  TrendingUpIcon,
  CalendarIcon,
  FileUpIcon,
  ClipboardListIcon,
  ShoppingBagIcon,
  SettingsIcon,
  Brain,
  Users2,
  Bell,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      title: "Home",
      icon: <HomeIcon className="h-5 w-5" />,
      href: "/",
    },
    {
      title: "Dashboard",
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Inventory",
      icon: <PackageIcon className="h-5 w-5" />,
      href: "/inventory",
    },
    {
      title: "Sales",
      icon: <DollarSignIcon className="h-5 w-5" />,
      href: "/sales",
    },
    {
      title: "Quick Sale",
      icon: <Brain className="h-5 w-5" />,
      href: "/quick-sale",
    },
    {
      title: "Customers",
      icon: <UsersIcon className="h-5 w-5" />,
      href: "/customers",
    },
    {
      title: "Stock",
      icon: <BoxIcon className="h-5 w-5" />,
      href: "/stock",
    },
    {
      title: "Analytics",
      icon: <TrendingUpIcon className="h-5 w-5" />,
      href: "/analytics",
    },
    {
      title: "Calendar",
      icon: <CalendarIcon className="h-5 w-5" />,
      href: "/calendar",
    },
    {
      title: "Import",
      icon: <FileUpIcon className="h-5 w-5" />,
      href: "/import",
    },
    {
      title: "Tick Ledger",
      icon: <ClipboardListIcon className="h-5 w-5" />,
      href: "/tick-ledger",
    },
    {
      title: "Business Supplies",
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      href: "/business-supplies",
    },
    {
      title: "Mates Rates",
      icon: <Users2 className="h-5 w-5" />,
      href: "/mates-rates",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      href: "/notifications",
    },
    {
      title: "Settings",
      icon: <SettingsIcon className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation Menu</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "outline"}
                className="h-16 flex flex-col gap-2 justify-center items-center text-xs"
                onClick={() => handleNavigation(item.href)}
              >
                {item.icon}
                <span className="text-center leading-tight">{item.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavigation;
