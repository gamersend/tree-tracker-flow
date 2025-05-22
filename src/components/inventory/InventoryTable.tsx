
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import { safeFormatNumber } from "@/utils/inventory-utils";
import { safeFormatDate } from "@/lib/utils";

interface InventoryTableProps {
  inventoryItems: InventoryItem[];
  searchQuery: string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventoryItems, searchQuery }) => {
  return (
    <Card className="border-tree-purple/30 bg-gradient-to-br from-slate-950 to-slate-900">
      <CardHeader>
        <CardTitle>Inventory Purchases</CardTitle>
        <CardDescription>
          View and manage all your inventory purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Strain</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Total Cost ($)</TableHead>
              <TableHead className="text-right">$/g</TableHead>
              <TableHead className="text-right">$/oz</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.length > 0 ? (
              inventoryItems.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="w-10">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.strain} 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-tree-purple/20 flex items-center justify-center text-xs">
                        {item.strain.substring(0, 2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.strain}</TableCell>
                  <TableCell>{safeFormatDate(item.purchaseDate, "MMM d, yyyy")}</TableCell>
                  <TableCell>{item.quantityUnit}</TableCell>
                  <TableCell className="text-right">${safeFormatNumber(item.totalCost)}</TableCell>
                  <TableCell className="text-right">${safeFormatNumber(item.pricePerGram)}</TableCell>
                  <TableCell className="text-right">${safeFormatNumber(item.costPerOunce)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  {searchQuery 
                    ? "No inventory items match your search"
                    : "No inventory items added yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-slate-800/20 border-t border-slate-700/30 flex justify-center py-2">
        <Button 
          variant="link" 
          className="text-tree-green flex items-center gap-2" 
          asChild
        >
          <Link to="/stock">
            Go to Current Inventory <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InventoryTable;
