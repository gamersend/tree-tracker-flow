
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Layout from "@/components/layout/Layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NotesProvider } from "@/contexts/NotesContext";

// Import pages
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
import Notes from "@/pages/Notes";
import NaturalLanguageLogger from "@/pages/NaturalLanguageLogger";
import Api from "@/pages/Api";

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
              <Route path="/sales" element={<Layout><Sales /></Layout>} />
              <Route path="/customers" element={<Layout><Customers /></Layout>} />
              <Route path="/stock" element={<Layout><Stock /></Layout>} />
              <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
              <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
              <Route path="/import" element={<Layout><Import /></Layout>} />
              <Route path="/tick-ledger" element={<Layout><TickLedger /></Layout>} />
              <Route path="/business-supplies" element={<Layout><BusinessSupplies /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/notes" element={<Layout><Notes /></Layout>} />
              <Route path="/quick-sale" element={<Layout><NaturalLanguageLogger /></Layout>} />
              <Route path="/api" element={<Layout><Api /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
        <Toaster />
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
