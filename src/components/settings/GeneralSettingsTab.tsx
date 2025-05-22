
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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

interface GeneralSettingsTabProps {
  onSave: () => void;
}

const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ onSave }) => {
  return (
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
    </div>
  );
};

export default GeneralSettingsTab;
