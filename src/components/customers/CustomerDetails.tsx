
import React from "react";
import { format } from "date-fns";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomerType, PurchaseType } from "@/types/customer";
import { 
  Edit, 
  Trash2, 
  User, 
  Star, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Award, 
  Calendar,
  PieChart,
  Plus
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomerDetailsProps {
  customer: CustomerType | null;
  purchases: PurchaseType[];
  onEditCustomer: (customer: CustomerType) => void;
  onDeleteCustomer: (customerId: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  purchases,
  onEditCustomer,
  onDeleteCustomer,
  activeTab,
  onTabChange,
}) => {
  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <div className="text-center animate-fade-in">
          <div className="rounded-full bg-slate-800 h-24 w-24 flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
            <span className="text-4xl">👤</span>
          </div>
          <h3 className="text-lg font-medium">Select a Customer</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            Choose a customer from the list to view details and purchase history
          </p>
          <Button 
            className="mt-4 transition-all duration-200 hover:scale-105"
            onClick={() => {}}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Customer
          </Button>
        </div>
      </div>
    );
  }

  const customerPurchases = purchases.filter(purchase => purchase.customerId === customer.id);

  return (
    <>
      <div className="relative">
        <div className="absolute top-0 right-0 h-32 w-32 opacity-10 pointer-events-none">
          <span className="text-[100px] absolute top-0 right-4">{customer.emoji}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className={`h-10 w-10 bg-gradient-to-br ${customer.trustedBuyer ? "from-tree-green to-green-700" : "from-slate-600 to-slate-800"}`}>
              <AvatarFallback className="text-lg">
                {customer.emoji}
              </AvatarFallback>
            </Avatar>
            <span>{customer.name}</span>
            {customer.trustedBuyer && (
              <Badge className="bg-tree-green text-white text-xs py-0.5 px-1.5 rounded-full flex items-center gap-1 animate-pulse-subtle">
                <Star className="h-3 w-3 fill-white" />
                Trusted
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-200 hover:bg-slate-700 hover:text-white"
              onClick={() => onEditCustomer(customer)}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-200 hover:bg-red-900/20 hover:text-destructive"
              onClick={() => onDeleteCustomer(customer.id)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="bg-slate-800/50 gap-1 flex items-center">
              {customer.platform === "Signal" && <MessageSquare className="h-3 w-3" />}
              {customer.platform === "Telegram" && <MessageSquare className="h-3 w-3" />}
              {customer.platform === "WhatsApp" && <PhoneCall className="h-3 w-3" />}
              {customer.platform}
            </Badge>
          </div>
          {customer.alias && (
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="bg-slate-800/50 gap-1 flex items-center">
                <User className="h-3 w-3" />
                {customer.alias}
              </Badge>
            </div>
          )}
          {customer.lastPurchase && (
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="bg-slate-800/50 gap-1 flex items-center">
                <Calendar className="h-3 w-3" />
                Last purchase: {format(customer.lastPurchase, "MMM d, yyyy")}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="mt-4">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="info" className="data-[state=active]:bg-tree-purple data-[state=active]:text-white transition-all duration-200">
            Info
          </TabsTrigger>
          <TabsTrigger value="purchases" className="data-[state=active]:bg-tree-purple data-[state=active]:text-white transition-all duration-200">
            Purchase History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:bg-slate-800/70">
              <h3 className="text-sm text-muted-foreground">Total Orders</h3>
              <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                {customer.totalOrders}
                <span className="text-lg">📦</span>
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:bg-slate-800/70">
              <h3 className="text-sm text-muted-foreground">Total Spent</h3>
              <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                ${customer.totalSpent}
                <span className="text-lg">💵</span>
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:bg-slate-800/70">
              <h3 className="text-sm text-muted-foreground">Total Profit</h3>
              <p className="text-2xl font-bold mt-1 text-tree-green flex items-center gap-2">
                ${customer.totalProfit}
                <span className="text-lg">💰</span>
              </p>
            </div>
          </div>
          
          {customer.notes && (
            <div className="bg-slate-800/50 rounded-lg p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                <span className="text-lg">📝</span> Notes
              </h3>
              <p className="text-gray-300">{customer.notes}</p>
            </div>
          )}
          
          <div className="flex gap-2 mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-green/10 hover:text-tree-green hover:border-tree-green">
              <PhoneCall className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              Call
            </Button>
            <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-purple/10 hover:text-tree-purple hover:border-tree-purple">
              <MessageSquare className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              Message
            </Button>
            <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-gold/10 hover:text-tree-gold hover:border-tree-gold">
              <Mail className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              Email
            </Button>
            <Button variant="outline" className="group transition-all duration-300 hover:bg-tree-purple/10 hover:text-tree-purple hover:border-tree-purple ml-auto">
              <Award className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              Reward
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="purchases" className="animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="text-lg">🛒</span> Purchase History
            </h3>
            <Button size="sm" variant="outline" className="transition-all duration-200 hover:bg-tree-purple/10 hover:text-tree-purple hover:border-tree-purple">
              <Plus className="mr-1 h-3 w-3" /> Add Purchase
            </Button>
          </div>
          
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Strain</TableHead>
                  <TableHead className="text-right">Amount (g)</TableHead>
                  <TableHead className="text-right">Price ($)</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-slate-900/30">
                {customerPurchases.length > 0 ? (
                  customerPurchases.map((purchase, index) => (
                    <TableRow key={purchase.id} className="hover:bg-slate-800/50 animate-fade-in border-slate-800" style={{ animationDelay: `${index * 0.05}s` }}>
                      <TableCell>{format(purchase.date, "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-medium">{purchase.strain}</TableCell>
                      <TableCell className="text-right">{purchase.quantity}g</TableCell>
                      <TableCell className="text-right">${purchase.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3.5 w-3.5 ${i < (purchase.rating || 0) ? "text-tree-gold fill-tree-gold" : "text-slate-600"}`} 
                            />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">📈</span>
                        <span>No purchase history available</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {customerPurchases.length > 0 && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <PieChart className="h-4 w-4" /> Purchase Analytics
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Average Order</div>
                  <div className="text-xl font-bold mt-1">
                    ${(customer.totalSpent / customer.totalOrders).toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Preferred Strain</div>
                  <div className="text-xl font-bold mt-1">
                    {customerPurchases[0]?.strain || "N/A"}
                  </div>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                  <div className="text-xl font-bold mt-1 flex items-center">
                    {customerPurchases.reduce((sum, purchase) => sum + (purchase.rating || 0), 0) / 
                      customerPurchases.length || 0}
                    <div className="ml-2 flex items-center">
                      <Star className="h-3.5 w-3.5 text-tree-gold fill-tree-gold" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CustomerDetails;
