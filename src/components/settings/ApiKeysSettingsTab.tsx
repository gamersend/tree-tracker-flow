
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
import { Key, AlertTriangle } from "lucide-react";

const ApiKeysSettingsTab: React.FC = () => {
  return (
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
  );
};

export default ApiKeysSettingsTab;
