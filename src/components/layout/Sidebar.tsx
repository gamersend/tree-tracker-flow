
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
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

const Sidebar = () => {
  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarComponent
      className={cn(
        "bg-sidebar border-r border-sidebar-border",
        isMobile ? "w-[80px]" : "w-[260px]"
      )}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<HomeIcon />}
                onClick={() => navigateTo("/")}
                tooltip="Home"
                isActive={isActive("/")}
              >
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<LayoutDashboardIcon />}
                onClick={() => navigateTo("/dashboard")}
                tooltip="Dashboard"
                isActive={isActive("/dashboard")}
              >
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<PackageIcon />}
                onClick={() => navigateTo("/inventory")}
                tooltip="Inventory"
                isActive={isActive("/inventory")}
              >
                Inventory
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<DollarSignIcon />}
                onClick={() => navigateTo("/sales")}
                tooltip="Sales"
                isActive={isActive("/sales")}
              >
                Sales
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<Brain />}
                onClick={() => navigateTo("/quick-sale")}
                tooltip="Quick Sale"
                isActive={isActive("/quick-sale")}
              >
                Quick Sale
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<UsersIcon />}
                onClick={() => navigateTo("/customers")}
                tooltip="Customers"
                isActive={isActive("/customers")}
              >
                Customers
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<BoxIcon />}
                onClick={() => navigateTo("/stock")}
                tooltip="Stock"
                isActive={isActive("/stock")}
              >
                Stock
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<TrendingUpIcon />}
                onClick={() => navigateTo("/analytics")}
                tooltip="Analytics"
                isActive={isActive("/analytics")}
              >
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<CalendarIcon />}
                onClick={() => navigateTo("/calendar")}
                tooltip="Calendar"
                isActive={isActive("/calendar")}
              >
                Calendar
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<FileUpIcon />}
                onClick={() => navigateTo("/import")}
                tooltip="Import"
                isActive={isActive("/import")}
              >
                Import
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<ClipboardListIcon />}
                onClick={() => navigateTo("/tick-ledger")}
                tooltip="Tick Ledger"
                isActive={isActive("/tick-ledger")}
              >
                Tick Ledger
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<ShoppingBagIcon />}
                onClick={() => navigateTo("/business-supplies")}
                tooltip="Business Supplies"
                isActive={isActive("/business-supplies")}
              >
                Business Supplies
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                icon={<SettingsIcon />}
                onClick={() => navigateTo("/settings")}
                tooltip="Settings"
                isActive={isActive("/settings")}
              >
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
