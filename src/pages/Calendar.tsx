
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import { useNotes } from "@/contexts/NotesContext";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'appointment' | 'reminder' | 'note';
  color?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { notes } = useNotes();

  // Mock events for demonstration
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Restock Blue Dream',
      date: new Date(2024, 2, 15),
      type: 'reminder'
    },
    {
      id: '2',
      title: 'Customer pickup - John',
      date: new Date(2024, 2, 18),
      type: 'appointment'
    },
    {
      id: '3',
      title: 'Inventory check',
      date: new Date(2024, 2, 25),
      type: 'reminder'
    }
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return isSameDay(noteDate, date);
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateNotes = selectedDate ? getNotesForDate(selectedDate) : [];

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
            <CalendarIcon className="mr-2 inline" size={32} />
            Calendar
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Schedule and track your cannabis business events
          </motion.p>
        </div>
        <Button className="bg-tree-green hover:bg-tree-green/80">
          <Plus className="mr-2" size={16} />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-slate-950 to-slate-900 border-tree-green/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDate(day);
                const dayNotes = getNotesForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      p-2 min-h-[60px] border border-slate-700 rounded-md cursor-pointer
                      transition-all duration-200 hover:bg-slate-800
                      ${isSelected ? 'bg-tree-green/20 border-tree-green' : ''}
                      ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                      ${isToday(day) ? 'bg-tree-purple/20 border-tree-purple' : ''}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-sm font-medium">
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="text-xs bg-tree-green/20 text-tree-green px-1 py-0.5 rounded truncate"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayNotes.slice(0, 1).map(note => (
                        <div
                          key={note.id}
                          className="text-xs bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded truncate"
                        >
                          📝 {note.title}
                        </div>
                      ))}
                      {dayEvents.length + dayNotes.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{dayEvents.length + dayNotes.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {selectedDate && (
            <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-tree-purple/30">
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length + selectedDateNotes.length} items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-3 bg-tree-green/10 border border-tree-green/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="border-tree-green text-tree-green">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {selectedDateNotes.map(note => (
                  <div key={note.id} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">📝 {note.title}</h4>
                      <Badge variant="outline" className="border-amber-500 text-amber-400">
                        note
                      </Badge>
                    </div>
                    {note.content && (
                      <p className="text-sm text-gray-400 truncate">{note.content}</p>
                    )}
                  </div>
                ))}
                
                {selectedDateEvents.length === 0 && selectedDateNotes.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No events or notes for this date</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <div>
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-gray-400">{format(event.date, 'MMM d')}</div>
                  </div>
                  <Badge variant="outline" size="sm">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
