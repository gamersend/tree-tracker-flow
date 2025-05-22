
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
  const isMobile = useIsMobile();
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
                onClick={() => navigateTo("/")}
                tooltip="Home"
                isActive={isActive("/")}
              >
                <HomeIcon className="mr-2" />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/dashboard")}
                tooltip="Dashboard"
                isActive={isActive("/dashboard")}
              >
                <LayoutDashboardIcon className="mr-2" />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/inventory")}
                tooltip="Inventory"
                isActive={isActive("/inventory")}
              >
                <PackageIcon className="mr-2" />
                Inventory
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/sales")}
                tooltip="Sales"
                isActive={isActive("/sales")}
              >
                <DollarSignIcon className="mr-2" />
                Sales
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/quick-sale")}
                tooltip="Quick Sale"
                isActive={isActive("/quick-sale")}
              >
                <Brain className="mr-2" />
                Quick Sale
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/customers")}
                tooltip="Customers"
                isActive={isActive("/customers")}
              >
                <UsersIcon className="mr-2" />
                Customers
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/stock")}
                tooltip="Stock"
                isActive={isActive("/stock")}
              >
                <BoxIcon className="mr-2" />
                Stock
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/analytics")}
                tooltip="Analytics"
                isActive={isActive("/analytics")}
              >
                <TrendingUpIcon className="mr-2" />
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/calendar")}
                tooltip="Calendar"
                isActive={isActive("/calendar")}
              >
                <CalendarIcon className="mr-2" />
                Calendar
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/import")}
                tooltip="Import"
                isActive={isActive("/import")}
              >
                <FileUpIcon className="mr-2" />
                Import
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/tick-ledger")}
                tooltip="Tick Ledger"
                isActive={isActive("/tick-ledger")}
              >
                <ClipboardListIcon className="mr-2" />
                Tick Ledger
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/business-supplies")}
                tooltip="Business Supplies"
                isActive={isActive("/business-supplies")}
              >
                <ShoppingBagIcon className="mr-2" />
                Business Supplies
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigateTo("/settings")}
                tooltip="Settings"
                isActive={isActive("/settings")}
              >
                <SettingsIcon className="mr-2" />
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
