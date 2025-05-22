
import React, { useState } from "react";
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
import { format, isSameDay } from "date-fns";
import { Plus, Calendar as CalendarIcon, DollarSign, Clock } from "lucide-react";

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

// Mock events data
const mockEvents: Event[] = [
  {
    id: "event1",
    title: "Regular Sale",
    date: new Date(2023, 5, 15),
    type: "Sale",
    customer: "John Doe",
    strain: "OG Kush",
    quantity: 14,
    notes: "Regular customer",
    time: "14:30",
  },
  {
    id: "event2",
    title: "Meet New Supplier",
    date: new Date(2023, 5, 18),
    type: "Meeting",
    notes: "Discuss new strains",
    time: "10:00",
  },
  {
    id: "event3",
    title: "Restock Inventory",
    date: new Date(2023, 5, 20),
    type: "Reminder",
    notes: "Order more Purple Haze",
    time: "09:00",
  },
  {
    id: "event4",
    title: "Bulk Sale",
    date: new Date(2023, 5, 25),
    type: "Sale",
    customer: "Jane Smith",
    strain: "Blue Dream",
    quantity: 28,
    notes: "Monthly pickup",
    time: "16:00",
  },
];

// Mock sales data
const mockSales = [
  {
    id: "sale1",
    customer: "John Doe",
    strain: "OG Kush",
    quantity: 14,
    amount: 140,
    profit: 70,
  },
  {
    id: "sale2",
    customer: "Jane Smith",
    strain: "Blue Dream",
    quantity: 7,
    amount: 70,
    profit: 35,
  },
];

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

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  // New event form state
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    type: "Sale",
    date: new Date(),
    time: "",
  });
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(event.date, selectedDate));
  };
  
  // Get sales for the selected date
  const getSalesForSelectedDate = () => {
    if (!selectedDate) return [];
    return mockSales;
  };
  
  // Calculate total profit for the selected date
  const getTotalProfitForSelectedDate = () => {
    return getSalesForSelectedDate().reduce((sum, sale) => sum + sale.profit, 0);
  };
  
  // Handle adding a new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.type || !selectedDate) {
      alert("Please fill in all required fields");
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
          <p className="text-gray-400">Schedule and track events</p>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Calendar</CardTitle>
            <CardDescription>View and manage your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              components={{
                DayContent: ({ date }) => (
                  <div className="w-full h-full flex flex-col items-center">
                    <span>{format(date, "d")}</span>
                    {renderCalendarCellContent(date)}
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date())}
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
                <h3 className="font-medium text-lg">Events</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddEventOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              {getEventsForSelectedDate().length > 0 ? (
                <div className="space-y-3">
                  {getEventsForSelectedDate().map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-slate-800/50 border border-slate-700/50 rounded-md p-3"
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No events scheduled for this day
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Sales Summary</h3>
                <div className="flex items-center text-tree-green">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${getTotalProfitForSelectedDate()}
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
                        <TableCell className="text-right">${sale.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No sales recorded for this day
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
