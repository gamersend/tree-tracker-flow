
import React from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStrings } from "@/components/theme/StringProvider";

type InventoryHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openAddInventoryDialog: () => void;
};

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  openAddInventoryDialog
}) => {
  const { getString } = useStrings();
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div>
        <motion.h1 
          className="text-3xl font-bold text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="mr-2">📦</span> Inventory Cost Tracker
        </motion.h1>
        <motion.p 
          className="text-gray-400"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manage your cannabis inventory purchases
        </motion.p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${getString("inventory.strain").toLowerCase()}...`}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="whitespace-nowrap bg-tree-purple hover:bg-tree-purple/80"
          onClick={openAddInventoryDialog}
        >
          <Plus className="mr-2 h-4 w-4" /> {getString("inventory.add")}
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;
