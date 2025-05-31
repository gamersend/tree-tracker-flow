
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Star } from "lucide-react";
import { CustomerType } from "@/types/customer";

interface CustomerListProps {
  customers: CustomerType[];
  onViewCustomer: (customer: CustomerType) => void;
  onEditCustomer: (customer: CustomerType) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  // Random fade-in animation for list items
  useEffect(() => {
    const listItems = document.querySelectorAll('.customer-item');
    listItems.forEach((item, index) => {
      (item as HTMLElement).style.animationDelay = `${index * 0.05}s`;
    });
  }, [customers]);

  console.log('CustomerList received customers:', customers);

  return (
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="space-y-2">
        {customers && customers.length > 0 ? (
          customers.map((customer) => {
            console.log('Rendering customer:', customer);
            return (
              <div 
                key={customer.id} 
                className="customer-item flex items-center gap-3 p-3 rounded-md hover:bg-slate-800/80 cursor-pointer group transition-all duration-300 hover:scale-[1.02] animate-fade-in opacity-0"
                onClick={() => onViewCustomer(customer)}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${
                  customer.trustedBuyer ? "from-tree-green to-green-700" : "from-slate-600 to-slate-800"
                } transition-transform duration-300 group-hover:rotate-12`}>
                  <span className="text-lg">{customer.emoji || "🌿"}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-white flex items-center gap-2">
                    {customer.name}
                    {customer.trustedBuyer && (
                      <Star className="h-3 w-3 text-tree-gold fill-tree-gold animate-pulse-subtle" />
                    )}
                  </h3>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <span>{customer.platform}</span>
                    {customer.alias && (
                      <>
                        <span>•</span>
                        <span>{customer.alias}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCustomer(customer);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomer(customer.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-muted-foreground animate-fade-in">
            No customers match your search
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CustomerList;
