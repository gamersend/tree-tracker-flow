
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { AddEventDialog } from "@/components/calendar/AddEventDialog";

const Calendar = () => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleEventAdded = () => {
    // Refresh calendar events here when implemented
    console.log("Event added, refreshing calendar...");
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
            <span className="mr-2">📅</span> Calendar
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Manage your events and schedule
          </motion.p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="whitespace-nowrap bg-tree-green hover:bg-tree-green/80 text-white"
              onClick={() => setIsAddEventOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Calendar placeholder - you can expand this with a proper calendar component */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-medium mb-2">Calendar View</h3>
            <p>Calendar implementation coming soon. You can add events using the button above.</p>
          </div>
        </div>
      </div>

      <AddEventDialog
        isOpen={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        selectedDate={selectedDate}
        onEventAdded={handleEventAdded}
      />
    </motion.div>
  );
};

export default Calendar;
