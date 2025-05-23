
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Pencil, CheckCircle2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditableSaleForm } from "./EditableSaleForm";
import { SalePreviewTable } from "./SalePreviewTable";

interface PreviewCardProps {
  parsedSale: any | null; // Using any type for simplicity
  editableSale: any | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleEditBeforeImport: () => void;
  handleAddToSales: () => void;
  getStrainSuggestions: () => string[];
  handleEditableChange: (field: string, value: any) => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  parsedSale,
  editableSale,
  isEditing,
  setIsEditing,
  handleEditBeforeImport,
  handleAddToSales,
  getStrainSuggestions,
  handleEditableChange,
}) => {
  const navigate = useNavigate();
  
  // Ensure parsedSale and editableSale are valid objects before rendering
  const isValidSale = parsedSale && typeof parsedSale === 'object';
  const isValidEditableSale = editableSale && typeof editableSale === 'object';

  return (
    <Card className="border-tree-green/20 bg-gradient-to-br from-slate-950 to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">🔍</span> Parsed Result
        </CardTitle>
        <CardDescription>
          {isValidSale ? 
            "Preview and edit before adding to your records" :
            "Preview of structured data extracted from your text"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isValidSale && isValidEditableSale ? (
            <motion.div
              key="parsed-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {isEditing ? (
                <EditableSaleForm 
                  editableSale={editableSale}
                  parsedSale={parsedSale}
                  onEditableChange={handleEditableChange}
                  getStrainSuggestions={getStrainSuggestions}
                />
              ) : (
                <SalePreviewTable parsedSale={parsedSale} />
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="w-full bg-slate-700 hover:bg-slate-600"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Cancel Editing
                    </Button>
                    <Button
                      onClick={handleAddToSales}
                      className="w-full bg-tree-green hover:bg-tree-green/80"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleEditBeforeImport}
                      className="w-full bg-slate-700 hover:bg-slate-600"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit Before Import
                    </Button>
                    <Button
                      onClick={handleAddToSales}
                      className="w-full bg-tree-green hover:bg-tree-green/80"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Add to Sales Tab
                    </Button>
                  </>
                )}
              </div>
              
              {parsedSale?.isTick && (
                <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-md p-3 text-sm">
                  <div className="font-medium text-yellow-500 mb-1">📝 Tick Sale Detected</div>
                  <p className="text-yellow-300/70">
                    This will be added to both Sales and Tick Ledger. 
                    {parsedSale.paidSoFar ? 
                      ` Initial payment of $${parsedSale.paidSoFar.toFixed(2)} recorded.` : 
                      ` No payment has been recorded yet.`}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[300px] text-center"
            >
              <div className="rounded-full bg-slate-800/50 p-6 mb-4">
                <Brain className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-300">
                🌿 Ready to blaze your data into CSV?
              </h3>
              <p className="text-slate-500 max-w-sm mt-2">
                Enter a description of your sale in natural language and 
                click "Convert Text" to see it transformed into structured data.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-800 pt-4">
        <Button 
          variant="link" 
          className="text-xs text-slate-500"
          onClick={() => navigate("/sales")}
        >
          View all entries in the Sales tab
        </Button>
      </CardFooter>
    </Card>
  );
};
