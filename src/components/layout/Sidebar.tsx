import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
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
  SidebarSection,
  SidebarItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { isMobile } = useMobile();
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
      <SidebarSection>
        <SidebarItem
          icon={<HomeIcon />}
          label="Home"
          onClick={() => navigateTo("/")}
          active={isActive("/")}
        />
        <SidebarItem
          icon={<LayoutDashboardIcon />}
          label="Dashboard"
          onClick={() => navigateTo("/dashboard")}
          active={isActive("/dashboard")}
        />
        <SidebarItem
          icon={<PackageIcon />}
          label="Inventory"
          onClick={() => navigateTo("/inventory")}
          active={isActive("/inventory")}
        />
        <SidebarItem
          icon={<DollarSignIcon />}
          label="Sales"
          onClick={() => navigateTo("/sales")}
          active={isActive("/sales")}
        />
        <SidebarItem
          icon={<Brain />}
          label="Quick Sale"
          onClick={() => navigateTo("/quick-sale")}
          active={isActive("/quick-sale")}
        />
        <SidebarItem
          icon={<UsersIcon />}
          label="Customers"
          onClick={() => navigateTo("/customers")}
          active={isActive("/customers")}
        />
        <SidebarItem
          icon={<BoxIcon />}
          label="Stock"
          onClick={() => navigateTo("/stock")}
          active={isActive("/stock")}
        />
        <SidebarItem
          icon={<TrendingUpIcon />}
          label="Analytics"
          onClick={() => navigateTo("/analytics")}
          active={isActive("/analytics")}
        />
        <SidebarItem
          icon={<CalendarIcon />}
          label="Calendar"
          onClick={() => navigateTo("/calendar")}
          active={isActive("/calendar")}
        />
        <SidebarItem
          icon={<FileUpIcon />}
          label="Import"
          onClick={() => navigateTo("/import")}
          active={isActive("/import")}
        />
        <SidebarItem
          icon={<ClipboardListIcon />}
          label="Tick Ledger"
          onClick={() => navigateTo("/tick-ledger")}
          active={isActive("/tick-ledger")}
        />
        <SidebarItem
          icon={<ShoppingBagIcon />}
          label="Business Supplies"
          onClick={() => navigateTo("/business-supplies")}
          active={isActive("/business-supplies")}
        />
        <SidebarItem
          icon={<SettingsIcon />}
          label="Settings"
          onClick={() => navigateTo("/settings")}
          active={isActive("/settings")}
        />
      </SidebarSection>
    </SidebarComponent>
  );
};

export default Sidebar;
