
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { StockTransaction } from "@/hooks/useSupabaseStock";

interface StockTransactionsTableProps {
  transactions: StockTransaction[];
}

const StockTransactionsTable: React.FC<StockTransactionsTableProps> = ({ transactions }) => {
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge className="bg-green-600 hover:bg-green-700">Purchase</Badge>;
      case 'sale':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Sale</Badge>;
      case 'adjustment':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Adjustment</Badge>;
      case 'waste':
        return <Badge className="bg-red-600 hover:bg-red-700">Waste</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-tree-purple" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Latest stock movements and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No transactions found</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getTransactionBadge(transaction.transaction_type)}
                    <span className="font-medium text-white">{transaction.strain_name}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()} • 
                    {transaction.quantity}{transaction.quantity_unit}
                    {transaction.total_value && ` • $${Number(transaction.total_value).toFixed(2)}`}
                  </div>
                  {transaction.notes && (
                    <div className="text-xs text-gray-500 mt-1">{transaction.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockTransactionsTable;
