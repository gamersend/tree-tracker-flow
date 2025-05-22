
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Database } from "lucide-react";
import { motion } from "framer-motion";
import { useExportData } from "@/hooks/useExportData";
import { ImportDataType } from "./types";

const ExportDataTab: React.FC = () => {
  const { handleExportCSV, handleExportData } = useExportData();
  
  const exportTypes: { type: ImportDataType; title: string }[] = [
    { type: "sales", title: "Sales Data" },
    { type: "customers", title: "Customer Data" },
    { type: "inventory", title: "Inventory Data" },
    { type: "ticks", title: "Tick Ledger Data" },
    { type: "business-supplies", title: "Business Supplies Data" },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>
          Export your data to CSV files for backup or analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exportTypes.map((item) => (
            <motion.div
              key={item.type}
              className="rounded-lg border border-slate-800 p-4 hover:border-tree-green transition-colors"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-tree-green/10 p-2">
                  <FileText className="h-5 w-5 text-tree-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Export all {item.title.toLowerCase()} to CSV format
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => handleExportCSV(item.type)}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export {item.title.split(" ")[0]}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Export Complete Dataset</h3>
          <p className="text-muted-foreground mb-4">
            Export all your data as a single JSON file that contains all information from your app.
            This is useful for backups or transferring data to another device.
          </p>
          <Button onClick={handleExportData} className="w-full sm:w-auto">
            <Database className="mr-2 h-4 w-4" /> Export All Data to JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportDataTab;
