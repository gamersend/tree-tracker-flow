
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Stock from "./pages/Stock";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import CalendarView from "./pages/Calendar";
import Import from "./pages/Import";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import BusinessSupplies from "./pages/BusinessSupplies";
import TickLedger from "./pages/TickLedger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
            <Route path="/inventory" element={<LayoutWrapper><Inventory /></LayoutWrapper>} />
            <Route path="/stock" element={<LayoutWrapper><Stock /></LayoutWrapper>} />
            <Route path="/sales" element={<LayoutWrapper><Sales /></LayoutWrapper>} />
            <Route path="/customers" element={<LayoutWrapper><Customers /></LayoutWrapper>} />
            <Route path="/analytics" element={<LayoutWrapper><Analytics /></LayoutWrapper>} />
            <Route path="/calendar" element={<LayoutWrapper><CalendarView /></LayoutWrapper>} />
            <Route path="/import" element={<LayoutWrapper><Import /></LayoutWrapper>} />
            <Route path="/settings" element={<LayoutWrapper><Settings /></LayoutWrapper>} />
            <Route path="/business-supplies" element={<LayoutWrapper><BusinessSupplies /></LayoutWrapper>} />
            <Route path="/tick-ledger" element={<LayoutWrapper><TickLedger /></LayoutWrapper>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
