import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Layout from "@/components/layout/Layout";

// Import pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Sales from "@/pages/Sales";
import Customers from "@/pages/Customers";
import Stock from "@/pages/Stock";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Import from "@/pages/Import";
import TickLedger from "@/pages/TickLedger";
import BusinessSupplies from "@/pages/BusinessSupplies";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

// Import our new NaturalLanguageLogger page
import NaturalLanguageLogger from "@/pages/NaturalLanguageLogger";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="stock" element={<Stock />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="import" element={<Import />} />
            <Route path="tick-ledger" element={<TickLedger />} />
            <Route path="business-supplies" element={<BusinessSupplies />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Add our new Natural Language Logger route */}
            <Route path="quick-sale" element={<NaturalLanguageLogger />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
