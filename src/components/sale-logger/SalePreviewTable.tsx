
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

interface SalePreviewTableProps {
  parsedSale: any; // Using any type for simplicity
}

export const SalePreviewTable: React.FC<SalePreviewTableProps> = ({ parsedSale }) => {
  // Add safe formatting for dates
  const formatDate = (date: any): string => {
    if (!date) return "—";
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString();
      }
      return String(date);
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "—";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Strain</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Grams</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Profit</TableHead>
          <TableHead>Tick?</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            {parsedSale.customer || "—"} 
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.customer} />}
          </TableCell>
          <TableCell>
            {parsedSale.strain || "—"}
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.strain} />}
          </TableCell>
          <TableCell>
            {formatDate(parsedSale.date)}
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.date} />}
          </TableCell>
          <TableCell>
            {parsedSale.quantity}g
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.quantity} />}
          </TableCell>
          <TableCell>
            ${parsedSale.salePrice?.toFixed(2) || "0.00"}
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.salePrice} />}
          </TableCell>
          <TableCell>
            ${parsedSale.profit?.toFixed(2) || "0.00"}
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.profit} />}
          </TableCell>
          <TableCell>{parsedSale.isTick ? 
            <span className="text-yellow-400">Yes</span> : 
            <span className="text-green-400">No</span>}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
