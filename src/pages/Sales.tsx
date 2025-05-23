
import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { SalesHeader } from "@/components/sales/SalesHeader";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesSummary } from "@/components/sales/SalesSummary";
import { AddSaleDialog } from "@/components/sales/AddSaleDialog";
import { PriceCalculator } from "@/components/sales/PriceCalculator";
import { SaleItem, CustomerInfo, StrainInfo } from "@/components/sales/types";
import { loadFromStorage } from "@/components/sales/utils";

const Sales = () => {
  // Load initial data from localStorage or use defaults
  const [sales, setSales] = useState<SaleItem[]>(loadFromStorage('sales', []));
  const [availableStrains, setAvailableStrains] = useState<StrainInfo[]>(loadFromStorage('strains', [
    { name: "OG Kush", costPerGram: 5 },
    { name: "Blue Dream", costPerGram: 5 },
    { name: "Sour Diesel", costPerGram: 4 },
    { name: "Purple Haze", costPerGram: 6 },
    { name: "White Widow", costPerGram: 5.5 },
  ]));
  
  // Customer data with loyalty
  const [customers, setCustomers] = useState<CustomerInfo[]>(loadFromStorage('customers', []));
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof SaleItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [targetMargin, setTargetMargin] = useState(70);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('strains', JSON.stringify(availableStrains));
  }, [availableStrains]);
  
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);
  
  // Load user preference for target margin
  useEffect(() => {
    const storedMargin = localStorage.getItem('targetMargin');
    if (storedMargin) {
      setTargetMargin(parseInt(storedMargin));
    }
  }, []);
  
  // Update customer loyalty data
  useEffect(() => {
    const updateCustomerLoyalty = () => {
      const customerMap: Record<string, CustomerInfo> = {};
      
      // Initialize customer data
      customers.forEach(c => {
        customerMap[c.name] = {
          ...c,
          orderCount: 0,
          lastOrderDate: null,
          totalSpent: 0
        };
      });
      
      // Update with sales data
      sales.forEach(sale => {
        if (!customerMap[sale.customer]) {
          customerMap[sale.customer] = {
            name: sale.customer,
            orderCount: 0,
            lastOrderDate: null,
            totalSpent: 0,
            loyaltyTag: "🆕 New"
          };
        }
        
        customerMap[sale.customer].orderCount += 1;
        
        if (!customerMap[sale.customer].lastOrderDate || 
            new Date(sale.date) > new Date(customerMap[sale.customer].lastOrderDate!)) {
          customerMap[sale.customer].lastOrderDate = new Date(sale.date);
        }
        
        customerMap[sale.customer].totalSpent += sale.salePrice;
      });
      
      // Calculate loyalty tags
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const updatedCustomers = Object.values(customerMap).map(customer => {
        // Determine loyalty tag
        if (customer.orderCount === 0) {
          customer.loyaltyTag = "🆕 New";
        } else if (customer.orderCount >= 6) {
          // Check if ghosted
          if (customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo) {
            customer.loyaltyTag = "👻 Ghosted";
          } else {
            customer.loyaltyTag = "🔥 VIP";
          }
        } else if (customer.orderCount >= 2) {
          // Check if ghosted
          if (customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo) {
            customer.loyaltyTag = "👻 Ghosted";
          } else {
            customer.loyaltyTag = "🌀 Regular";
          }
        } else {
          // Check if ghosted for New (1 order) customers
          if (customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo) {
            customer.loyaltyTag = "👻 Ghosted";
          } else {
            customer.loyaltyTag = "🆕 New";
          }
        }
        
        return customer;
      });
      
      setCustomers(updatedCustomers);
    };
    
    updateCustomerLoyalty();
  }, [sales]);
  
  // Sort function
  const handleSort = (column: keyof SaleItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Sort and filter sales
  const sortedAndFilteredSales = [...sales]
    .filter(sale => 
      (sale.strain?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (sale.customer?.toLowerCase() || "").includes((searchQuery || "").toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  
  // Handle sale deletion
  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id));
  };
  
  // Add new sale
  const addSale = (sale: SaleItem) => {
    setSales([...sales, sale]);
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SalesHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsDialogOpen={setIsDialogOpen}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AddSaleDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          availableStrains={availableStrains}
          customers={customers}
          addSale={addSale}
          targetMargin={targetMargin}
          setTargetMargin={setTargetMargin}
        />
      </Dialog>

      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <PriceCalculator
          isCalculatorOpen={isCalculatorOpen}
          setIsCalculatorOpen={setIsCalculatorOpen}
          targetMargin={targetMargin}
          setTargetMargin={setTargetMargin}
        />
      </Dialog>

      <SalesTable 
        sales={sortedAndFilteredSales}
        customers={customers}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleDeleteSale={handleDeleteSale}
      />
      
      <SalesSummary sales={sales} />
    </motion.div>
  );
};

export default Sales;
