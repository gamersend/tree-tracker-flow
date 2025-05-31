
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Calendar, CheckSquare, DollarSign, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNotes } from "@/contexts/NotesContext";
import { NotesContainer } from "@/components/notes/NotesContainer";
import { motion } from "framer-motion";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import TodoItem from "@/components/dashboard/TodoItem";
import { Input } from "@/components/ui/input";
import { useSupabaseSales } from "@/hooks/useSupabaseSales";
import { useSupabaseInventory } from "@/hooks/useSupabaseInventory";
import { useSupabaseBusinessSupplies } from "@/hooks/useSupabaseBusinessSupplies";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const { sales } = useSupabaseSales();
  const { strains, inventory } = useSupabaseInventory();
  const { supplies, lowStockSupplies } = useSupabaseBusinessSupplies();
  
  const [notes, setNotes] = React.useState("Meeting with supplier on Friday.\nCheck inventory of OG Kush.");
  const [todos, setTodos] = React.useState([
    { id: "t1", label: "Order new inventory", completed: false },
    { id: "t2", label: "Contact supplier about Purple Haze", completed: true },
    { id: "t3", label: "Update customer records", completed: false },
    { id: "t4", label: "Prepare for weekend sales", completed: false },
  ]);
  const [newTodo, setNewTodo] = React.useState("");
  
  // Get the notes context
  const { notes: stickyNotes, addNote, updateNote, deleteNote } = useNotes();
  
  // Get the notifications context
  const { addNotification } = useNotificationsContext();

  // Calculate real data metrics
  const calculateMetrics = () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const yesterdaySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.toDateString() === yesterday.toDateString();
    });

    const lastWeekSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= lastWeek;
    });

    const lastMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= lastMonth;
    });

    const totalInventoryValue = inventory.reduce((sum, item) => sum + item.total_cost, 0);
    const totalBusinessSuppliesValue = supplies.reduce((sum, supply) => sum + (supply.cost_per_unit * supply.quantity), 0);

    return {
      yesterdayProfit: yesterdaySales.reduce((sum, sale) => sum + sale.profit, 0),
      yesterdaySalesCount: yesterdaySales.length,
      lastWeekProfit: lastWeekSales.reduce((sum, sale) => sum + sale.profit, 0),
      lastMonthProfit: lastMonthSales.reduce((sum, sale) => sum + sale.profit, 0),
      totalInventoryValue,
      totalBusinessSuppliesValue,
      totalValue: totalInventoryValue + totalBusinessSuppliesValue
    };
  };

  // Generate chart data from real sales
  const generateChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.toDateString() === date.toDateString();
      });
      
      const profit = daySales.reduce((sum, sale) => sum + sale.profit, 0);
      
      last7Days.push({
        name: dateStr,
        value: profit
      });
    }
    return last7Days;
  };

  const metrics = calculateMetrics();
  const profitData = generateChartData();

  // Stock levels for strains
  const strainStockLevels = strains.map(strain => {
    const strainInventory = inventory.filter(item => item.strain_id === strain.id);
    const totalStock = strainInventory.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      id: strain.id,
      name: strain.name,
      currentStock: totalStock,
      lowStockThreshold: 56 // 2oz threshold
    };
  });

  const lowStockStrains = strainStockLevels.filter(strain => 
    strain.currentStock > 0 && strain.currentStock <= strain.lowStockThreshold
  );

  // Add notifications for low stock
  useEffect(() => {
    if (!user) return;
    
    const notificationsShown = sessionStorage.getItem("stock-notifications-shown");
    
    if (!notificationsShown && (lowStockStrains.length > 0 || lowStockSupplies.length > 0)) {
      setTimeout(() => {
        if (lowStockStrains.length > 0) {
          addNotification({
            title: "Low Strain Stock Alert",
            message: `${lowStockStrains.length} strain(s) running low: ${lowStockStrains.map(s => s.name).join(', ')}`,
            priority: "high",
            type: "alert",
            link: "/inventory"
          });
        }
        
        if (lowStockSupplies.length > 0) {
          setTimeout(() => {
            addNotification({
              title: "Low Business Supplies Alert",
              message: `${lowStockSupplies.length} business supply item(s) running low`,
              priority: "medium",
              type: "alert",
              link: "/business-supplies"
            });
          }, 2000);
        }
      }, 1000);
      
      sessionStorage.setItem("stock-notifications-shown", "true");
    }
  }, [addNotification, user, lowStockStrains.length, lowStockSupplies.length]);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    
    const completedTodo = todos.find(todo => todo.id === id);
    if (completedTodo && !completedTodo.completed) {
      addNotification({
        title: "Task Completed",
        message: `You've completed: ${completedTodo.label}`,
        priority: "low",
        type: "info"
      });
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = { 
        id: `t${Date.now()}`, 
        label: newTodo.trim(), 
        completed: false 
      };
      
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
      
      addNotification({
        title: "New Task Added",
        message: `Added task: ${newTodo.trim()}`,
        priority: "low",
        type: "info"
      });
    }
  };
  
  const editTodo = (id: string, newLabel: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, label: newLabel } : todo
    ));
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddNote = () => {
    const newNote = addNote("New note", "yellow");
    
    addNotification({
      title: "New Note Created",
      message: "You created a new note",
      priority: "low",
      type: "info",
      link: "/notes"
    });
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
              <span className="text-2xl font-bold">${metrics.yesterdayProfit.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">From {metrics.yesterdaySalesCount} sales</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tree-green/20 to-tree-green/10 border-tree-green/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-tree-green mr-2" />
              <span className="text-2xl font-bold">${metrics.lastWeekProfit.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Total profit</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-tree-gold/20 to-tree-gold/10 border-tree-gold/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Last Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-tree-gold mr-2" />
              <span className="text-2xl font-bold">${metrics.lastMonthProfit.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Total profit</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">${metrics.totalValue.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{strains.length} strains + {supplies.length} supplies</p>
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
                  <TodoItem
                    key={todo.id}
                    id={todo.id}
                    label={todo.label}
                    completed={todo.completed}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                  />
                ))}
                <div className="flex gap-2 mt-4">
                  <Input 
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new task"
                    className="rounded-md bg-slate-800 border-slate-700 p-2 text-sm flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTodo.trim()) {
                        addTodo();
                      }
                    }}
                  />
                  <Button size="sm" onClick={addTodo}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stock Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-tree-green" />
              Strain Stock Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockStrains.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Low Stock Alert</span>
                </div>
                <div className="space-y-1">
                  {lowStockStrains.map((strain) => (
                    <div key={strain.id} className="text-sm text-yellow-300">
                      {strain.name}: {strain.currentStock}g
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              {strainStockLevels.slice(0, 5).map((strain) => (
                <div key={strain.id} className="flex justify-between items-center">
                  <span className="text-sm">{strain.name}</span>
                  <span className={`text-sm font-medium ${
                    strain.currentStock === 0 ? 'text-red-400' :
                    strain.currentStock <= strain.lowStockThreshold ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {strain.currentStock}g
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-500" />
              Business Supplies Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockSupplies.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Low Stock Alert</span>
                </div>
                <div className="space-y-1">
                  {lowStockSupplies.map((supply) => (
                    <div key={supply.id} className="text-sm text-yellow-300">
                      {supply.name}: {supply.quantity} units
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              {supplies.slice(0, 5).map((supply) => (
                <div key={supply.id} className="flex justify-between items-center">
                  <span className="text-sm">{supply.name}</span>
                  <span className={`text-sm font-medium ${
                    supply.quantity === 0 ? 'text-red-400' :
                    supply.low_stock_threshold && supply.quantity <= supply.low_stock_threshold ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {supply.quantity}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
