
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StorageSettingsTab from "@/components/settings/StorageSettingsTab";
import IntegrationsTab from "@/components/settings/IntegrationsTab";
import AISettingsTab from "@/components/settings/AISettingsTab";
import GeneralSettingsTab from "@/components/settings/GeneralSettingsTab";
import AccountsSettingsTab from "@/components/settings/AccountsSettingsTab";
import ApiKeysSettingsTab from "@/components/settings/ApiKeysSettingsTab";

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
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="storage">Data Storage</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai">
            <div className="flex items-center gap-1">
              <BrainCircuit className="h-4 w-4" />
              <span>AI</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettingsTab onSave={handleSaveSettings} />
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="storage">
          <StorageSettingsTab />
        </TabsContent>
        
        <TabsContent value="accounts">
          <AccountsSettingsTab />
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        
        <TabsContent value="ai">
          <AISettingsTab />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiKeysSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
