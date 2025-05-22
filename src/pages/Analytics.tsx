
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUpRight, TrendingUp, DollarSign, PercentCircle } from "lucide-react";

// Mock data for charts
const dailyProfitData = [
  { date: "Mon", profit: 70 },
  { date: "Tue", profit: 85 },
  { date: "Wed", profit: 120 },
  { date: "Thu", profit: 95 },
  { date: "Fri", profit: 145 },
  { date: "Sat", profit: 160 },
  { date: "Sun", profit: 125 },
];

const topStrainsData = [
  { name: "OG Kush", sales: 64, revenue: 640, profit: 320 },
  { name: "Blue Dream", sales: 42, revenue: 420, profit: 210 },
  { name: "Sour Diesel", sales: 38, revenue: 342, profit: 152 },
  { name: "Purple Haze", sales: 28, revenue: 280, profit: 112 },
  { name: "White Widow", sales: 18, revenue: 198, profit: 81 },
];

const topCustomersData = [
  { name: "John Doe", orders: 8, spending: 740, profit: 320 },
  { name: "Jane Smith", orders: 12, revenue: 980, profit: 430 },
  { name: "Alex Johnson", orders: 2, spending: 180, profit: 70 },
  { name: "Sam Williams", orders: 5, spending: 390, profit: 160 },
];

const monthlySalesData = [
  { month: "Jan", sales: 420, profit: 180 },
  { month: "Feb", sales: 520, profit: 220 },
  { month: "Mar", sales: 650, profit: 280 },
  { month: "Apr", sales: 800, profit: 350 },
  { month: "May", sales: 710, profit: 300 },
  { month: "Jun", sales: 950, profit: 400 },
];

const salesByStrainData = [
  { name: "OG Kush", value: 640 },
  { name: "Blue Dream", value: 420 },
  { name: "Sour Diesel", value: 342 },
  { name: "Purple Haze", value: 280 },
  { name: "Others", value: 318 },
];

// Custom colors for charts
const STRAIN_COLORS = ["#8A33FD", "#4CAF50", "#FFD700", "#FF6B6B", "#2196F3"];
const CUSTOMER_COLORS = ["#4CAF50", "#8A33FD", "#FFD700", "#FF6B6B", "#2196F3"];

const Analytics = () => {
  // Summary stats
  const totalSales = 52;
  const totalRevenue = 2000;
  const totalProfit = 800;
  const profitMargin = (totalProfit / totalRevenue) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your business performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{totalSales}</span>
              <div className="h-8 w-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-tree-green" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Transactions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${totalRevenue}</span>
              <div className="h-8 w-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-tree-gold" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">From all sales</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${totalProfit}</span>
              <div className="h-8 w-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-tree-purple" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Net earnings</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{profitMargin.toFixed(1)}%</span>
              <div className="h-8 w-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                <PercentCircle className="h-4 w-4 text-tree-green" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Overall margin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Profit</CardTitle>
          <CardDescription>Profit trend over the last week</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="7days">
            <TabsList className="mb-6">
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="90days">90 Days</TabsTrigger>
            </TabsList>
            <TabsContent value="7days">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyProfitData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Profit ($)"
                      stroke="#4CAF50"
                      strokeWidth={3}
                      dot={{ fill: "#4CAF50", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="30days">
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                Connect to backend for 30-day analytics
              </div>
            </TabsContent>
            <TabsContent value="90days">
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                Connect to backend for 90-day analytics
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Strains</CardTitle>
            <CardDescription>Performance metrics by strain</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sales">
              <TabsList className="mb-6">
                <TabsTrigger value="sales">By Sales</TabsTrigger>
                <TabsTrigger value="revenue">By Revenue</TabsTrigger>
                <TabsTrigger value="profit">By Profit</TabsTrigger>
              </TabsList>
              <TabsContent value="sales">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topStrainsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Sales (g)" fill="#8A33FD" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="revenue">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topStrainsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue ($)" fill="#FFD700" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="profit">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topStrainsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="profit" name="Profit ($)" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
            <CardDescription>Revenue breakdown by strain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByStrainData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByStrainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STRAIN_COLORS[index % STRAIN_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend formatter={(value) => <span style={{ color: "#F9FAFB" }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Sales and profit trends by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySalesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Revenue ($)" fill="#FFD700" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit ($)" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Performance metrics by customer</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profit">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">By Orders</TabsTrigger>
                <TabsTrigger value="spending">By Spending</TabsTrigger>
                <TabsTrigger value="profit">By Profit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topCustomersData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="orders" name="Order Count" fill="#8A33FD" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="spending">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topCustomersData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                        }}
                        formatter={(value) => [`$${value}`, "Spending"]}
                      />
                      <Legend />
                      <Bar dataKey="spending" name="Total Spent ($)" fill="#FFD700" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="profit">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topCustomersData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                        }}
                        formatter={(value) => [`$${value}`, "Profit"]}
                      />
                      <Legend />
                      <Bar dataKey="profit" name="Profit ($)" fill="#4CAF50" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
