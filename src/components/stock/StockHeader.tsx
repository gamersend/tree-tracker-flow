
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface StockHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddTransaction: () => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onAddTransaction
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span>📦</span> Stock Management
        </h1>
        <p className="text-gray-400">Track and manage your current stock levels</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search stock..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <Button 
          onClick={onAddTransaction}
          className="bg-tree-green hover:bg-tree-green/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
};

export default StockHeader;
