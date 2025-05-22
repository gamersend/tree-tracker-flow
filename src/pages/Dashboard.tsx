
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Calendar, CheckSquare, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNotes } from "@/contexts/NotesContext";
import { NotesContainer } from "@/components/notes/NotesContainer";
import { motion } from "framer-motion";

// Mock data for charts and stats
const profitData = [
  { name: "Mon", value: 420 },
  { name: "Tue", value: 380 },
  { name: "Wed", value: 550 },
  { name: "Thu", value: 490 },
  { name: "Fri", value: 600 },
  { name: "Sat", value: 450 },
  { name: "Sun", value: 470 },
];

const todoItems = [
  { id: "t1", label: "Order new inventory", completed: false },
  { id: "t2", label: "Contact supplier about Purple Haze", completed: true },
  { id: "t3", label: "Update customer records", completed: false },
  { id: "t4", label: "Prepare for weekend sales", completed: false },
];

const Dashboard = () => {
  const [notes, setNotes] = React.useState("Meeting with supplier on Friday.\nCheck inventory of OG Kush.");
  const [todos, setTodos] = React.useState(todoItems);
  const [newTodo, setNewTodo] = React.useState("");
  
  // Get the notes context
  const { notes: stickyNotes, addNote, updateNote, deleteNote } = useNotes();

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: `t${Date.now()}`, 
        label: newTodo.trim(), 
        completed: false 
      }]);
      setNewTodo("");
    }
  };

  const handleAddNote = () => {
    addNote("New note", "yellow");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Track your cannabis business performance</p>
        </div>
        <div className="flex gap-4">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Today: {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-tree-purple/20 to-tree-purple/10 border-tree-purple/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Profit Yesterday</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-tree-purple mr-2" />
              <span className="text-2xl font-bold">$420</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">From 7 sales</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tree-green/20 to-tree-green/10 border-tree-green/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-tree-green mr-2" />
              <span className="text-2xl font-bold">$3,360</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tree-gold/20 to-tree-gold/10 border-tree-gold/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Last Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-tree-gold mr-2" />
              <span className="text-2xl font-bold">$12,480</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">+8% from previous month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">$18,740</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">10 strains in stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profit Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Tabs defaultValue="7days">
              <TabsList className="mb-4">
                <TabsTrigger value="7days">7 Days</TabsTrigger>
                <TabsTrigger value="30days">30 Days</TabsTrigger>
                <TabsTrigger value="90days">90 Days</TabsTrigger>
              </TabsList>
              <TabsContent value="7days" className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1F2937", 
                        borderColor: "#374151",
                        color: "#F9FAFB"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8A33FD" 
                      strokeWidth={2}
                      dot={{ fill: "#8A33FD", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="30days" className="h-[240px]">
                <div className="flex h-full items-center justify-center text-gray-400">
                  Connect to backend for 30-day analytics
                </div>
              </TabsContent>
              <TabsContent value="90days" className="h-[240px]">
                <div className="flex h-full items-center justify-center text-gray-400">
                  Connect to backend for 90-day analytics
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[120px] bg-slate-800 border-slate-700 resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here..."
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>To-Do List</CardTitle>
              <Button variant="outline" size="sm">Save</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id={todo.id} 
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={todo.id}
                      className={`text-sm ${
                        todo.completed ? "line-through text-gray-500" : "text-white"
                      }`}
                    >
                      {todo.label}
                    </label>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <input 
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new task"
                    className="rounded-md bg-slate-800 border-slate-700 p-2 text-sm flex-1"
                  />
                  <Button size="sm" onClick={addTodo}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add the Sticky Notes section */}
      <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📝</span> Sticky Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotesContainer
            notes={stickyNotes}
            onAddNote={handleAddNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            isMovable={true}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weather</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[120px]">
            <div className="text-center">
              <div className="text-gray-400 mb-2">API Ready for Weather Integration</div>
              <Button variant="outline">Connect Weather API</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Favorite Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {["Notes", "Sales", "Customers", "Calendar"].map((link) => (
                <Button key={link} variant="outline" className="justify-start">
                  {link}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
