
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BrainCircuit, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StorageSettingsTab from "@/components/settings/StorageSettingsTab";
import IntegrationsTab from "@/components/settings/IntegrationsTab";
import AISettingsTab from "@/components/settings/AISettingsTab";
import GeneralSettingsTab from "@/components/settings/GeneralSettingsTab";
import AccountsSettingsTab from "@/components/settings/AccountsSettingsTab";
import ApiKeysSettingsTab from "@/components/settings/ApiKeysSettingsTab";
import ThemeChooser from "@/components/settings/ThemeChooser";
import { useI18n } from "@/hooks/useI18n";
import { motion } from "framer-motion";

const Settings = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  
  // Mock save settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced header with background accent */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sydney-green/10 to-transparent rounded-lg blur-xl" />
        <div className="relative flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-6 bg-sydney-dark/60 backdrop-blur-sm rounded-lg border border-sydney-green/30">
          <div>
            <h1 className="text-3xl font-bold text-sydney-green sydney-glow">
              {t("settings.title")} 🛠️
            </h1>
            <p className="text-sydney-green/70 mt-2">Configure your Sydney Green CAT application</p>
          </div>
          <div className="text-4xl opacity-60">⚙️</div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="mb-6 flex flex-wrap bg-sydney-dark/80 border border-sydney-green/30">
          <TabsTrigger value="general" className="data-[state=active]:bg-sydney-green data-[state=active]:text-sydney-dark">General</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-sydney-green data-[state=active]:text-sydney-dark">
            <div className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="storage" className="data-[state=active]:bg-sydney-green data-[state=active]:text-sydney-dark">Data Storage</TabsTrigger>
          <TabsTrigger value="accounts" className="data-[state=active]:bg-sydney-green data-[state=active]:text-sydney-dark">Accounts</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-sydney-green data-[state=active]:text-sydney-dark">Integrations</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-sydney-green data-[state=state]:text-sydney-dark">
            <div className="flex items-center gap-1">
              <BrainCircuit className="h-4 w-4" />
              <span>AI</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-sydney-green data-[state=active]:text-sydney-dark">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GeneralSettingsTab onSave={handleSaveSettings} />
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveSettings} className="bg-sydney-green text-sydney-dark hover:bg-sydney-green/90">
                {t("settings.save")} ✨
              </Button>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <motion.div 
            className="grid gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative p-6 bg-sydney-dark/60 backdrop-blur-sm rounded-lg border border-sydney-green/30">
              <div className="absolute top-4 right-4 text-2xl">🎨</div>
              <h2 className="text-2xl font-bold text-sydney-green sydney-glow">Appearance</h2>
              <p className="text-sydney-green/70 mt-2">
                Customize the look and feel of your Sydney Green application
              </p>
            </div>
            
            <ThemeChooser />
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => toast({
                  title: "Theme saved 🎉",
                  description: "Your theme preferences have been saved automatically"
                })}
                className="bg-sydney-green text-sydney-dark hover:bg-sydney-green/90"
              >
                Apply Changes 🚀
              </Button>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="storage">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StorageSettingsTab />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="accounts">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AccountsSettingsTab />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="integrations">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IntegrationsTab />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="ai">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AISettingsTab />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="api">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ApiKeysSettingsTab />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
