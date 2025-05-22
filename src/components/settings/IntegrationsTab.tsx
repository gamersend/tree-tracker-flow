
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar, Cloud, Settings2 } from "lucide-react";
import ZapierIntegration from "../integrations/ZapierIntegration";

const IntegrationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <ZapierIntegration />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-rose-400" />
              Google Calendar
            </CardTitle>
            <CardDescription>
              Sync your events with Google Calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your Google Calendar to schedule events and get notifications for important dates.
              Coming soon in a future update.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-sky-400" />
              Weather API
            </CardTitle>
            <CardDescription>
              Get weather data for your grow operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect to OpenWeatherAPI to monitor weather conditions for optimal growing.
              Coming soon in a future update.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-green-400" />
              API Integration Settings
            </CardTitle>
            <CardDescription>
              Configure global settings for all integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Control how often data syncs, notification preferences, and connection settings.
              Additional options will be available as you connect integrations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationsTab;
