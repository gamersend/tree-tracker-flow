
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameWeek } from "date-fns";
import { Plus, Calendar as CalendarIcon, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Event types
type EventType = "Sale" | "Meeting" | "Reminder";

type Event = {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  customer?: string;
  strain?: string;
  quantity?: number;
  notes?: string;
  time?: string;
};

type Sale = {
  id: string;
  strain: string;
  date: Date;
  quantity: number;
  customer: string;
  salePrice: number;
  costPerGram: number;
  profit: number;
};

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [profitData, setProfitData] = useState<{[key: string]: number}>({});
  const [maxProfit, setMaxProfit] = useState(100);
  const [isChangingMonth, setIsChangingMonth] = useState(false);
  
  // New event form state
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    type: "Sale",
    date: new Date(),
    time: "",
  });
  
  // Mock customers for select dropdown
  const mockCustomers = [
    "John Doe",
    "Jane Smith",
    "Alex Johnson",
    "Sam Williams",
  ];

  // Mock strains for select dropdown
  const mockStrains = [
    "OG Kush",
    "Blue Dream",
    "Sour Diesel",
    "Purple Haze",
    "White Widow",
  ];

  // Load data from localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          // Convert date strings back to Date objects
          const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
            ...event,
            date: new Date(event.date)
          }));
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    const loadSales = () => {
      try {
        const storedSales = localStorage.getItem('sales');
        if (storedSales) {
          // Convert date strings back to Date objects
          const parsedSales = JSON.parse(storedSales).map((sale: any) => ({
            ...sale,
            date: new Date(sale.date)
          }));
          setSales(parsedSales);
        }
      } catch (error) {
        console.error("Error loading sales:", error);
      }
    };

    loadEvents();
    loadSales();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Calculate profit data for calendar heatmap
  useEffect(() => {
    const calculateProfitData = () => {
      const profitByDate: {[key: string]: number} = {};
      let highestProfit = 0;
      
      sales.forEach(sale => {
        const dateKey = sale.date.toISOString().split('T')[0];
        if (!profitByDate[dateKey]) {
          profitByDate[dateKey] = 0;
        }
        profitByDate[dateKey] += sale.profit;
        
        if (profitByDate[dateKey] > highestProfit) {
          highestProfit = profitByDate[dateKey];
        }
      });
      
      setProfitData(profitByDate);
      setMaxProfit(highestProfit > 0 ? highestProfit : 100);
    };
    
    calculateProfitData();
  }, [sales]);
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(event.date, selectedDate));
  };
  
  // Get sales for the selected date
  const getSalesForSelectedDate = () => {
    if (!selectedDate) return [];
    return sales.filter(sale => isSameDay(sale.date, selectedDate));
  };
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };
  
  // Get upcoming 7 days of events
  const getUpcomingEvents = () => {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    
    return next7Days.map(date => ({
      date,
      events: getEventsForDate(date),
      sales: sales.filter(sale => isSameDay(sale.date, date)),
      profit: sales
        .filter(sale => isSameDay(sale.date, date))
        .reduce((sum, sale) => sum + sale.profit, 0)
    }));
  };
  
  // Calculate total profit for the selected date
  const getTotalProfitForSelectedDate = () => {
    return getSalesForSelectedDate().reduce((sum, sale) => sum + sale.profit, 0);
  };
  
  // Handle adding a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.type || !selectedDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const eventToAdd: Event = {
      id: `event${Date.now()}`,
      title: newEvent.title || "",
      date: selectedDate,
      type: newEvent.type as EventType,
      customer: newEvent.customer,
      strain: newEvent.strain,
      quantity: newEvent.quantity,
      notes: newEvent.notes,
      time: newEvent.time,
    };
    
    setEvents([...events, eventToAdd]);
    
    toast.success("Event added successfully");
    
    // Reset form
    setNewEvent({
      title: "",
      type: "Sale",
      date: selectedDate,
      time: "",
    });
    
    setIsAddEventOpen(false);
  };
  
  // Get badge color based on event type
  const getEventBadgeColor = (type: EventType) => {
    switch(type) {
      case "Sale": return "bg-tree-green text-white";
      case "Meeting": return "bg-tree-purple text-white";
      case "Reminder": return "bg-tree-gold text-black";
      default: return "bg-slate-600 text-white";
    }
  };
  
  // Render badge for calendar day cell
  const renderCalendarCellContent = (date: Date) => {
    const eventsOnDate = events.filter(event => isSameDay(event.date, date));
    
    if (eventsOnDate.length === 0) return null;
    
    const eventTypes = [...new Set(eventsOnDate.map(event => event.type))];
    
    return (
      <div className="flex flex-wrap gap-1 mt-1 justify-center">
        {eventTypes.map((type, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${
              type === "Sale" ? "bg-tree-green" :
              type === "Meeting" ? "bg-tree-purple" :
              "bg-tree-gold"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="mr-2">📆</span> Calendar
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Schedule events and track profit by day
          </motion.p>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-tree-green hover:bg-tree-green/80 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event on {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Customer Meeting"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              
              {newEvent.type === "Sale" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select 
                      value={newEvent.customer} 
                      onValueChange={(value) => setNewEvent({ ...newEvent, customer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="strain">Strain</Label>
                      <Select 
                        value={newEvent.strain} 
                        onValueChange={(value) => setNewEvent({ ...newEvent, strain: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select strain" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockStrains.map((strain) => (
                            <SelectItem key={strain} value={strain}>{strain}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity (g)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newEvent.quantity?.toString() || ""}
                        onChange={(e) => setNewEvent({ 
                          ...newEvent, 
                          quantity: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        placeholder="e.g., 7"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEvent.notes || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-tree-green/30 bg-gradient-to-br from-slate-950 to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">🗓️</span> Profit Heatmap Calendar
              </CardTitle>
              <CardDescription>See your daily profits at a glance with color coding</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                key={selectedDate?.getMonth()} 
                initial={{ opacity: isChangingMonth ? 0 : 1 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-400 rounded-sm"></div>
                    <span className="text-xs">$0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                    <span className="text-xs">~${(maxProfit/2).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                    <span className="text-xs">${maxProfit.toFixed(0)}+</span>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full bg-card"
                  profitData={profitData}
                  maxProfit={maxProfit}
                  onMonthChange={() => {
                    setIsChangingMonth(true);
                    setTimeout(() => setIsChangingMonth(false), 500);
                  }}
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-tree-purple/30 bg-gradient-to-br from-slate-950 to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">📋</span>
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className="hover:bg-tree-purple/20"
                >
                  Today
                </Button>
              </CardTitle>
              <CardDescription>
                Events and sales for selected day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg flex items-center">
                    <span className="mr-2">📝</span> Events
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsAddEventOpen(true)}
                    className="hover:bg-tree-purple/20"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                
                {getEventsForSelectedDate().length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForSelectedDate().map((event) => (
                      <motion.div 
                        key={event.id} 
                        className="bg-slate-800/50 border border-slate-700/50 rounded-md p-3 hover:border-tree-purple/50 transition-colors duration-200"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getEventBadgeColor(event.type)}>
                            {event.type}
                          </Badge>
                          {event.time && (
                            <div className="text-sm text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        
                        {event.customer && (
                          <div className="text-sm text-gray-300 mb-1">
                            <span className="text-gray-400">Customer:</span> {event.customer}
                          </div>
                        )}
                        
                        {event.strain && (
                          <div className="text-sm text-gray-300 mb-1">
                            <span className="text-gray-400">Strain:</span> {event.strain}
                            {event.quantity && ` (${event.quantity}g)`}
                          </div>
                        )}
                        
                        {event.notes && (
                          <div className="text-sm text-gray-400 mt-2">
                            {event.notes}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground bg-slate-800/20 rounded-md">
                    No events scheduled for this day
                  </div>
                )}
              </div>
              
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg flex items-center">
                    <span className="mr-2">💰</span> Sales Summary
                  </h3>
                  <div className="flex items-center text-tree-green">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${getTotalProfitForSelectedDate().toFixed(2)}
                  </div>
                </div>
                
                {getSalesForSelectedDate().length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Strain</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSalesForSelectedDate().map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.strain}</TableCell>
                          <TableCell className="text-right">${sale.salePrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground bg-slate-800/20 rounded-md">
                    No sales recorded for this day
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming 7 Days Events Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card className="border-tree-gold/30 bg-gradient-to-br from-slate-950 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🗓️</span> Upcoming 7 Days
            </CardTitle>
            <CardDescription>Preview of events and sales for the next week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getUpcomingEvents().map((day) => (
                <motion.div
                  key={day.date.toISOString()}
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-md p-4 hover:border-tree-gold/50 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">
                      {format(day.date, "EEE, MMM d")}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDate(day.date);
                        // Scroll to the calendar section
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="text-xs px-2 py-0 h-6 hover:bg-tree-gold/20"
                    >
                      View
                    </Button>
                  </div>
                  
                  {/* Profit indication */}
                  {day.profit > 0 && (
                    <div className="mb-2">
                      <Badge variant="outline" className="bg-tree-green/10 text-tree-green border-tree-green/30">
                        ${day.profit.toFixed(2)} profit
                      </Badge>
                    </div>
                  )}
                  
                  {/* Events summary */}
                  {day.events.length > 0 ? (
                    <div className="space-y-2">
                      {day.events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-sm flex items-center space-x-2 bg-slate-700/20 rounded p-2"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            event.type === "Sale" ? "bg-tree-green" :
                            event.type === "Meeting" ? "bg-tree-purple" :
                            "bg-tree-gold"
                          }`}></div>
                          <div className="truncate flex-1">{event.title}</div>
                          {event.time && <div className="text-gray-400 text-xs">{event.time}</div>}
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <div className="text-xs text-center text-gray-400">
                          +{day.events.length - 3} more events
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-2">
                      No events scheduled
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CalendarView;
