
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboardIcon,
  PackageIcon,
  DollarSignIcon,
  UsersIcon,
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
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { SydneyGreenLogo } from "@/components/theme/SydneyGreenTheme";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboardIcon className="mr-2" />,
      href: "/dashboard",
      colors: "from-green-500 to-green-600",
    },
    {
      title: "Inventory",
      icon: <PackageIcon className="mr-2" />,
      href: "/inventory",
      colors: "from-red-500 to-red-600",
    },
    {
      title: "Sales",
      icon: <DollarSignIcon className="mr-2" />,
      href: "/sales",
      colors: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Quick Sale",
      icon: <Brain className="mr-2" />,
      href: "/quick-sale",
      colors: "from-pink-500 to-pink-600",
    },
    {
      title: "Customers",
      icon: <UsersIcon className="mr-2" />,
      href: "/customers",
      colors: "from-purple-500 to-purple-600",
    },
    {
      title: "Analytics",
      icon: <TrendingUpIcon className="mr-2" />,
      href: "/analytics",
      colors: "from-blue-500 to-blue-600",
    },
    {
      title: "Calendar",
      icon: <CalendarIcon className="mr-2" />,
      href: "/calendar",
      colors: "from-red-500 to-red-600",
    },
    {
      title: "Import",
      icon: <FileUpIcon className="mr-2" />,
      href: "/import",
      colors: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Tick Ledger",
      icon: <ClipboardListIcon className="mr-2" />,
      href: "/tick-ledger",
      colors: "from-pink-500 to-pink-600",
    },
    {
      title: "Business Supplies",
      icon: <ShoppingBagIcon className="mr-2" />,
      href: "/business-supplies",
      colors: "from-purple-500 to-purple-600",
    },
    {
      title: "Mates Rates",
      icon: <Users2 className="h-5 w-5" />,
      href: "/mates-rates",
      colors: "from-amber-500 to-orange-600",
    },
    {
      title: "Notifications",
      icon: <Bell className="mr-2" />,
      href: "/notifications",
      colors: "from-green-500 to-teal-600",
    },
    {
      title: "Settings",
      icon: <SettingsIcon className="mr-2" />,
      href: "/settings",
      colors: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <SidebarComponent className="bg-sydney-dark border-sydney-green/30">
      <div className="p-4 border-b border-sydney-green/30">
        <SydneyGreenLogo />
      </div>
      <SidebarContent className="bg-sydney-dark">
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  onClick={() => navigateTo(item.href)}
                  tooltip={item.title}
                  isActive={isActive(item.href)}
                  className={cn(
                    "text-sydney-green/80 hover:text-sydney-green hover:bg-sydney-green/10 transition-all duration-200",
                    isActive(item.href) && "bg-sydney-green/20 text-sydney-green border-r-2 border-sydney-green"
                  )}
                >
                  {item.icon}
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* Theme switcher directly below the navigation! */}
        <div className="mt-6 flex justify-center">
          <ThemeSwitcher variant="default" />
        </div>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;

