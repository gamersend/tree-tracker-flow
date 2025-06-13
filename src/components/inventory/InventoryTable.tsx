
import React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { InventoryItem } from "@/types/inventory";
import { safeFormatNumber } from "@/utils/inventory-utils";
import { safeFormatDate } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";

interface InventoryTableProps {
  inventoryItems: InventoryItem[];
  searchQuery: string;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  inventoryItems, 
  searchQuery, 
  onEditItem, 
  onDeleteItem 
}) => {
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
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{item.quantity}g</TableCell>
                  <TableCell className="text-right">${safeFormatNumber(item.totalCost)}</TableCell>
                  <TableCell className="text-right">${safeFormatNumber(item.pricePerGram)}</TableCell>
                  <TableCell className="text-right">${safeFormatNumber(item.costPerOunce)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditItem(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this inventory item for {item.strain}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteItem(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  {searchQuery 
                    ? "No inventory items match your search"
                    : "No inventory items added yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
