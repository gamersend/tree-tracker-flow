
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Lock, AlertTriangle } from "lucide-react";

const AccountsSettingsTab: React.FC = () => {
  return (
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
  );
};

export default AccountsSettingsTab;
