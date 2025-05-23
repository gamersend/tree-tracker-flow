
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
import { StonerToggle } from "@/components/ui/stoner-toggle";
import { Badge } from "@/components/ui/badge";
import { useStrings } from "@/components/theme/StringProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface GeneralSettingsTabProps {
  onSave: () => void;
}

const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ onSave }) => {
  const { getString, isStonerMode, toggleStonerMode, stonerModeWithIcon } = useStrings();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getString("settings.title")}</CardTitle>
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
              <Label htmlFor="currency">{getString("settings.currency")}</Label>
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
              <Label htmlFor="timezone">{getString("settings.timezone")}</Label>
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
          
          {/* Language and Text Settings */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-medium mb-4">Language & Text</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stoner-mode" className="block mb-1">
                    {stonerModeWithIcon}
                  </Label>
                  <p className="text-sm text-gray-400">{getString("settings.stoner_description")}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <StonerToggle 
                          id="stoner-mode" 
                          checked={isStonerMode} 
                          onCheckedChange={toggleStonerMode}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>For legends only 💨😎</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Show a preview of stoner mode */}
              {isStonerMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/30 p-3 rounded-md border border-purple-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="stoner">Active</Badge>
                    <span className="text-sm text-gray-300">Stoner mode engaged</span>
                  </div>
                  <p className="text-sm italic text-gray-400">
                    App labels, buttons and text are now in stoner slang mode
                  </p>
                </motion.div>
              )}
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
                  <Label htmlFor="low-inventory" className="block mb-1">{getString("settings.low_inventory")}</Label>
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
                <Label htmlFor="default-quantity">{getString("settings.default_quantity")}</Label>
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
