
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
            {parsedSale.date instanceof Date 
              ? parsedSale.date.toLocaleDateString()
              : parsedSale.date || "—"}
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.date} />}
          </TableCell>
          <TableCell>
            {parsedSale.quantity}g
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.quantity} />}
          </TableCell>
          <TableCell>
            ${parsedSale.salePrice.toFixed(2)}
            {parsedSale.confidence && <ConfidenceIndicator score={parsedSale.confidence.salePrice} />}
          </TableCell>
          <TableCell>
            ${parsedSale.profit.toFixed(2)}
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
