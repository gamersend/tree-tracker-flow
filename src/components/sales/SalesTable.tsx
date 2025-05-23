
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { SaleItem, CustomerInfo } from "./types";
import { formatDateSafe, getLoyaltyTagColor } from "./utils";

interface SalesTableProps {
  sales: SaleItem[];
  customers: CustomerInfo[];
  sortColumn: keyof SaleItem | null;
  sortDirection: "asc" | "desc";
  handleSort: (column: keyof SaleItem) => void;
  handleDeleteSale: (id: string) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  customers,
  sortColumn,
  sortDirection,
  handleSort,
  handleDeleteSale,
}) => {
  // Find customer loyalty tag
  const getCustomerLoyaltyTag = (customerName: string) => {
    const customerInfo = customers.find(c => c.name === customerName);
    return customerInfo?.loyaltyTag || "🆕 New";
  };

  return (
    <Card className="border-tree-green/20 bg-gradient-to-br from-slate-950 to-slate-900">
      <CardHeader>
        <CardTitle>Sales Transactions</CardTitle>
        <CardDescription>
          View and manage all your sales records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium"
                  onClick={() => handleSort("strain")}
                >
                  Strain
                  {sortColumn === "strain" && (
                    <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortColumn === "date" && (
                    <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity (g)
                  {sortColumn === "quantity" && (
                    <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium"
                  onClick={() => handleSort("customer")}
                >
                  Customer
                  {sortColumn === "customer" && (
                    <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium"
                  onClick={() => handleSort("salePrice")}
                >
                  Sale ($)
                  {sortColumn === "salePrice" && (
                    <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Cost ($)</TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto font-medium"
                  onClick={() => handleSort("profit")}
                >
                  Profit ($)
                  {sortColumn === "profit" && (
                    <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow 
                  key={sale.id}
                  className="group transition-colors duration-150 hover:bg-slate-800/50"
                >
                  <TableCell className="w-10">
                    {sale.image ? (
                      <img 
                        src={sale.image} 
                        alt={sale.strain} 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-tree-purple/20 flex items-center justify-center text-xs">
                        {sale.strain?.substring(0, 2) || ""}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{sale.strain}</TableCell>
                  <TableCell>{formatDateSafe(sale.date)}</TableCell>
                  <TableCell className="text-right">{sale.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{sale.customer}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getLoyaltyTagColor(getCustomerLoyaltyTag(sale.customer))}`}>
                        {getCustomerLoyaltyTag(sale.customer)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${sale.salePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(sale.quantity * sale.costPerGram).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium text-tree-green">${sale.profit.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSale(sale.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No sales recorded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
