import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cloud, Lock, Settings2, User, Database, Key, AlertTriangle, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StorageSettingsTab from "@/components/settings/StorageSettingsTab";
import IntegrationsTab from "@/components/settings/IntegrationsTab";

const Settings = () => {
  const { toast } = useToast();
  
  // Mock save settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Configure your Tree Tracker application</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="storage">Data Storage</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure general application preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" defaultValue="Tree Tracker" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="cad">CAD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america/los_angeles">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/los_angeles">America/Los Angeles</SelectItem>
                        <SelectItem value="america/new_york">America/New York</SelectItem>
                        <SelectItem value="europe/london">Europe/London</SelectItem>
                        <SelectItem value="asia/tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-medium mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="block mb-1">Email Notifications</Label>
                        <p className="text-sm text-gray-400">Receive updates and alerts via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="calendar-reminders" className="block mb-1">Calendar Reminders</Label>
                        <p className="text-sm text-gray-400">Get notifications for upcoming events</p>
                      </div>
                      <Switch id="calendar-reminders" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="low-inventory" className="block mb-1">Low Inventory Alerts</Label>
                        <p className="text-sm text-gray-400">Be notified when inventory is running low</p>
                      </div>
                      <Switch id="low-inventory" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-medium mb-4">Inventory Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="low-stock-threshold">Low Stock Threshold (g)</Label>
                      <Input id="low-stock-threshold" type="number" defaultValue="28" />
                      <p className="text-xs text-gray-400 mt-1">When stock falls below this level, it will be highlighted</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-quantity">Default Purchase Quantity</Label>
                      <Select defaultValue="112g">
                        <SelectTrigger>
                          <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="112g">112g (4 oz)</SelectItem>
                          <SelectItem value="224g">224g (8 oz)</SelectItem>
                          <SelectItem value="448g">448g (16 oz)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="storage">
          <StorageSettingsTab />
        </TabsContent>
        
        <TabsContent value="accounts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-tree-purple flex items-center justify-center text-xl font-semibold text-white">
                    U
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">User Account</h3>
                    <p className="text-sm text-gray-400">Connect to authenticate and sync your data</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="gap-1 border-amber-500 text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      Not Connected
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/50 rounded-lg gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Authentication</h3>
                      <p className="text-sm text-gray-400">Set up user authentication</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Connect Auth
                  </Button>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/50 rounded-lg gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">User Profile</h3>
                      <p className="text-sm text-gray-400">Update your personal information</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                </div>
                
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor" className="block mb-1">Two-factor Authentication</Label>
                        <p className="text-sm text-gray-400">Additional security for your account</p>
                      </div>
                      <Switch id="two-factor" disabled />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="activity-log" className="block mb-1">Activity Log</Label>
                        <p className="text-sm text-gray-400">Track login and account activity</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        View Log
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        
        <TabsContent value="api">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="weather-api" className="block mb-2">OpenWeather API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="weather-api" 
                        type="password" 
                        placeholder="Enter API key"
                        className="flex-grow"
                      />
                      <Button variant="outline">Save</Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Required for weather dashboard integration</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="google-api" className="block mb-2">Google Calendar API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="google-api" 
                        type="password" 
                        placeholder="Enter API key"
                        className="flex-grow"
                      />
                      <Button variant="outline">Save</Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Required for calendar sync</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-medium mb-4">Application Keys</h3>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg mb-4">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">App API Key</h3>
                      <p className="text-sm text-gray-400">Used for API access to your data</p>
                    </div>
                    <Button variant="outline" disabled>
                      Generate Key
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <p className="text-sm text-amber-300">
                        API keys will be available when you connect to a cloud backend
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
