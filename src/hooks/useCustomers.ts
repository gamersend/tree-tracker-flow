
import { useState, useCallback, useMemo, useEffect } from 'react';
import { CustomerType, PurchaseType } from '@/types/customer';
import { useToast } from '@/hooks/use-toast';
import { loadFromStorage, saveToStorage } from '@/utils/inventory-utils';

// Mock data with added emojis and last purchase dates
const mockCustomers: CustomerType[] = [
  {
    id: "cust1",
    name: "John Doe",
    platform: "Signal",
    alias: "johnny_green",
    notes: "Prefers indicas, usually buys in bulk.",
    trustedBuyer: true,
    totalOrders: 8,
    totalSpent: 740,
    totalProfit: 320,
    lastPurchase: new Date(2023, 5, 15),
    emoji: "🌿",
  },
  {
    id: "cust2",
    name: "Jane Smith",
    platform: "Telegram",
    alias: "jane420",
    notes: "Always pays with exact change.",
    trustedBuyer: true,
    totalOrders: 12,
    totalSpent: 980,
    totalProfit: 430,
    lastPurchase: new Date(2023, 5, 20),
    emoji: "🔥",
  },
  {
    id: "cust3",
    name: "Alex Johnson",
    platform: "WhatsApp",
    alias: "alex_j",
    notes: "New customer, referred by Jane.",
    trustedBuyer: false,
    totalOrders: 2,
    totalSpent: 180,
    totalProfit: 70,
    lastPurchase: new Date(2023, 5, 18),
    emoji: "🌱",
  },
  {
    id: "cust4",
    name: "Sam Williams",
    platform: "Signal",
    alias: "sammy",
    notes: "",
    trustedBuyer: false,
    totalOrders: 5,
    totalSpent: 390,
    totalProfit: 160,
    lastPurchase: new Date(2023, 5, 10),
    emoji: "🍁",
  },
];

// Mock purchase history with ratings
const mockPurchases: PurchaseType[] = [
  {
    id: "pur1",
    customerId: "cust1",
    date: new Date(2023, 5, 5),
    strain: "OG Kush",
    quantity: 14,
    amount: 140,
    profit: 70,
    rating: 5,
  },
  {
    id: "pur2",
    customerId: "cust1",
    date: new Date(2023, 5, 15),
    strain: "Blue Dream",
    quantity: 7,
    amount: 70,
    profit: 35,
    rating: 4,
  },
  {
    id: "pur3",
    customerId: "cust2",
    date: new Date(2023, 5, 10),
    strain: "Sour Diesel",
    quantity: 28,
    amount: 252,
    profit: 112,
    rating: 5,
  },
  {
    id: "pur4",
    customerId: "cust3",
    date: new Date(2023, 5, 18),
    strain: "Purple Haze",
    quantity: 3.5,
    amount: 35,
    profit: 14,
    rating: 3,
  },
];

// Available platforms
export const platforms = ["Signal", "Telegram", "WhatsApp", "Other"];

// Customer emojis
export const customerEmojis = [
  "🌿", "🍁", "🌱", "🌲", "🔥", "💨", "🌴", "🌳", "🌺", "🌻", 
  "🌼", "🌹", "🌸", "🍄", "🍃", "🌵", "🌾", "⭐", "🌟", "✨"
];

export const useCustomers = () => {
  // Load customers from storage or use mock data if none exists
  const loadCustomers = () => {
    return loadFromStorage<CustomerType[]>('customers', mockCustomers);
  };

  const [customers, setCustomers] = useState<CustomerType[]>(loadCustomers);
  const [purchases, setPurchases] = useState<PurchaseType[]>(loadFromStorage<PurchaseType[]>('purchases', mockPurchases));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [customerDetailTab, setCustomerDetailTab] = useState("info");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "spent" | "orders">("name");
  const [filterTrusted, setFilterTrusted] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Ensure we persist customers to storage when they change
  useEffect(() => {
    saveToStorage('customers', customers);
  }, [customers]);

  // Ensure we persist purchases to storage when they change
  useEffect(() => {
    saveToStorage('purchases', purchases);
  }, [purchases]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => 
        (customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.alias && customer.alias.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (filterTrusted === null || customer.trustedBuyer === filterTrusted)
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else if (sortBy === "spent") {
          return sortOrder === "asc" 
            ? a.totalSpent - b.totalSpent 
            : b.totalSpent - a.totalSpent;
        } else {
          return sortOrder === "asc" 
            ? a.totalOrders - b.totalOrders 
            : b.totalOrders - a.totalOrders;
        }
      });
  }, [customers, searchQuery, filterTrusted, sortBy, sortOrder]);

  // Add customer
  const addCustomer = useCallback((newCustomer: Omit<CustomerType, 'id' | 'totalOrders' | 'totalSpent' | 'totalProfit'>) => {
    if (!newCustomer.name || !newCustomer.platform) {
      toast({
        title: "Error",
        description: "Customer name and platform are required",
        variant: "destructive",
      });
      return false;
    }
    
    const newCustomerEntry: CustomerType = {
      id: `cust${Date.now()}`,
      name: newCustomer.name,
      platform: newCustomer.platform,
      alias: newCustomer.alias || "",
      notes: newCustomer.notes || "",
      trustedBuyer: newCustomer.trustedBuyer || false,
      totalOrders: 0,
      totalSpent: 0,
      totalProfit: 0,
      emoji: newCustomer.emoji || customerEmojis[Math.floor(Math.random() * customerEmojis.length)],
      lastPurchase: undefined,
    };
    
    setCustomers(prev => [...prev, newCustomerEntry]);
    
    toast({
      title: "Success! 🎉",
      description: `${newCustomer.name} has been added to your customer list`,
    });
    
    return true;
  }, [toast]);

  // Update customer
  const updateCustomer = useCallback((customer: CustomerType) => {
    if (!customer.id) return false;
    
    setCustomers(prev => prev.map(c => 
      c.id === customer.id ? customer : c
    ));
    
    toast({
      title: "Updated! ✅",
      description: `${customer.name}'s information has been updated`,
    });
    
    return true;
  }, [toast]);

  // Delete customer
  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    setPurchases(prev => prev.filter(p => p.customerId !== customerId));
    
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer(null);
    }
    
    toast({
      title: "Deleted",
      description: "Customer has been removed from your list",
      variant: "destructive",
    });
    
    return true;
  }, [selectedCustomer, toast]);

  // Select customer for viewing
  const selectCustomer = useCallback((customer: CustomerType) => {
    setSelectedCustomer(customer);
    setCustomerDetailTab("info");
  }, []);

  return {
    customers,
    purchases,
    filteredCustomers,
    selectedCustomer,
    searchQuery,
    setSearchQuery,
    customerDetailTab,
    setCustomerDetailTab,
    sortOrder,
    setSortOrder,
    sortBy,
    setSortBy,
    filterTrusted,
    setFilterTrusted,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    selectCustomer,
    setSelectedCustomer
  };
};
