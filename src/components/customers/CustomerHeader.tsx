
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import CustomerFilters from "./CustomerFilters";

interface CustomerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTrusted: boolean | null;
  setFilterTrusted: (value: boolean | null) => void;
  sortBy: "name" | "spent" | "orders";
  setSortBy: (value: "name" | "spent" | "orders") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  onAddCustomer: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filterTrusted,
  setFilterTrusted,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onAddCustomer,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span className="bg-tree-purple text-white p-1 rounded">👥</span> Customer Address Book
        </h1>
        <p className="text-gray-400">Manage your customers and their purchase history</p>
      </div>
      
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-full transition-all duration-300 focus:ring-2 focus:ring-tree-purple/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Filter component */}
          <CustomerFilters 
            filterTrusted={filterTrusted}
            setFilterTrusted={setFilterTrusted}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          
          {/* Add customer button */}
          <Button 
            className="whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={onAddCustomer}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHeader;
