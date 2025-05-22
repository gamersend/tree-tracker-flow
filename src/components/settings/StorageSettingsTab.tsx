
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Database, HardDrive, FileText, ArrowRightLeft } from "lucide-react";
import { useStorageConfig } from "@/hooks/useStorageConfig";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const StorageSettingsTab: React.FC = () => {
  const {
    config,
    isLoading,
    isTestingConnection,
    updateStorageType,
    updatePostgresConfig,
    updateFileConfig,
    saveConfig,
    testConnection,
    migrateStorage
  } = useStorageConfig();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Storage Configuration</CardTitle>
          <CardDescription>
            Configure where and how your data is stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Storage Method</h3>
            <p className="text-sm text-muted-foreground">
              Select where you want to store your application data
            </p>
            
            <RadioGroup 
              value={config.storageType} 
              onValueChange={(value) => updateStorageType(value as 'local' | 'postgres' | 'file')}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className={`flex flex-col items-start space-y-2 rounded-md border p-4 cursor-pointer transition-colors
                ${config.storageType === 'local' ? 'border-tree-purple bg-tree-purple/10' : 'border-slate-800'}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="local" id="local-storage" />
                  <Label htmlFor="local-storage" className="cursor-pointer">Local Storage</Label>
                </div>
                <div className="pl-6">
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Stores data in your browser
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Simple and works offline, but data is tied to this browser and device.
                  </p>
                </div>
              </div>
              
              <div className={`flex flex-col items-start space-y-2 rounded-md border p-4 cursor-pointer transition-colors
                ${config.storageType === 'postgres' ? 'border-tree-purple bg-tree-purple/10' : 'border-slate-800'}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="postgres" id="postgres-storage" />
                  <Label htmlFor="postgres-storage" className="cursor-pointer">PostgreSQL Database</Label>
                </div>
                <div className="pl-6">
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Database className="h-4 w-4 mr-2" />
                    Stores data in a PostgreSQL database
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Professional solution for multi-device access and data security.
                  </p>
                </div>
              </div>
              
              <div className={`flex flex-col items-start space-y-2 rounded-md border p-4 cursor-pointer transition-colors
                ${config.storageType === 'file' ? 'border-tree-purple bg-tree-purple/10' : 'border-slate-800'}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-storage" />
                  <Label htmlFor="file-storage" className="cursor-pointer">File Storage</Label>
                </div>
                <div className="pl-6">
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Stores data in local JSON files
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Balanced option - data persists in files you can backup easily.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* PostgreSQL Configuration */}
          {config.storageType === 'postgres' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">PostgreSQL Database Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your PostgreSQL database connection details
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Host</Label>
                  <Input 
                    id="db-host" 
                    placeholder="localhost or db.example.com" 
                    value={config.postgres?.host || ''}
                    onChange={(e) => updatePostgresConfig({ host: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="db-port">Port</Label>
                  <Input 
                    id="db-port" 
                    type="number" 
                    placeholder="5432" 
                    value={config.postgres?.port || 5432}
                    onChange={(e) => updatePostgresConfig({ port: parseInt(e.target.value) || 5432 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="db-name">Database Name</Label>
                  <Input 
                    id="db-name" 
                    placeholder="mydatabase" 
                    value={config.postgres?.database || ''}
                    onChange={(e) => updatePostgresConfig({ database: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="db-username">Username</Label>
                  <Input 
                    id="db-username" 
                    placeholder="dbuser" 
                    value={config.postgres?.username || ''}
                    onChange={(e) => updatePostgresConfig({ username: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="db-password">Password</Label>
                  <Input 
                    id="db-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={config.postgres?.password || ''}
                    onChange={(e) => updatePostgresConfig({ password: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-8">
                  <Switch 
                    id="ssl-enabled" 
                    checked={config.postgres?.ssl || false}
                    onCheckedChange={(checked) => updatePostgresConfig({ ssl: checked })}
                  />
                  <Label htmlFor="ssl-enabled">Enable SSL</Label>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-2">
                <Button 
                  variant="outline" 
                  onClick={testConnection} 
                  disabled={isTestingConnection}
                >
                  {isTestingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </div>
          )}
          
          {/* File Storage Configuration */}
          {config.storageType === 'file' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">File Storage Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure where to store your data files
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-path">Storage Directory</Label>
                  <Input 
                    id="file-path" 
                    placeholder="/path/to/storage or C:\Data\TreeTracker" 
                    value={config.file?.path || ''}
                    onChange={(e) => updateFileConfig({ path: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Full path to directory where data files will be stored
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-interval">Auto-Backup Interval (minutes)</Label>
                  <Input 
                    id="backup-interval" 
                    type="number" 
                    min={5}
                    placeholder="60" 
                    value={config.file?.backupInterval || 60}
                    onChange={(e) => updateFileConfig({ backupInterval: parseInt(e.target.value) || 60 })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How often to automatically backup your data (minimum 5 minutes)
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Local Storage Configuration */}
          {config.storageType === 'local' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Local Storage Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your data is stored directly in this browser
              </p>
              
              <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-400">⚠️</div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-400">Important</h4>
                    <ul className="mt-2 text-sm text-amber-300/90 space-y-1 list-disc pl-4">
                      <li>Data is stored only in this browser</li>
                      <li>Clearing browser data will erase your information</li>
                      <li>Cannot access your data from other devices</li>
                      <li>Use the Export/Backup features regularly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Data Migration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Migration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Move your existing data to your selected storage method
            </p>
            
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center">
                <ArrowRightLeft className="h-5 w-5 mr-3 text-tree-green" />
                <div>
                  <h4 className="font-medium">Migrate Existing Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Transfer your data to the selected storage type
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => migrateStorage(config.storageType)} 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Migrating...' : 'Migrate Data'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveConfig} 
          disabled={isLoading}
          className="bg-tree-purple hover:bg-tree-purple/80"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving...' : 'Save Storage Settings'}
        </Button>
      </div>
    </div>
  );
};

export default StorageSettingsTab;
