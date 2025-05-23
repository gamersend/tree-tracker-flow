
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface SalesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  setIsDialogOpen,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div>
        <motion.h1 
          className="text-3xl font-bold text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="mr-2">💰</span> Sales Logging
        </motion.h1>
        <motion.p 
          className="text-gray-400"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Track your cannabis sales and profits
        </motion.p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            className="whitespace-nowrap bg-tree-green hover:bg-tree-green/80 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Sale
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
