
import React, { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DatabaseBackup, Info } from "lucide-react";
import { useBackupRestore } from "@/hooks/useBackupRestore";

const BackupRestoreTab: React.FC = () => {
  const { handleCreateBackup, handleImportBackup } = useBackupRestore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>
          Create backups of your data or restore from previous backups
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-lg border border-slate-800 p-6">
          <h3 className="text-lg font-medium">Create Backup</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            This will create a backup of all your current data and save it as a file on your device.
            You can use this file to restore your data later if needed.
          </p>
          <Button onClick={handleCreateBackup}>
            <DatabaseBackup className="mr-2 h-4 w-4" /> Create & Download Backup
          </Button>
        </div>
        
        <div className="rounded-lg border border-slate-800 p-6">
          <h3 className="text-lg font-medium">Restore From Backup</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            <strong className="text-tree-red">Warning:</strong> This will replace your current data with the selected backup.
            Make sure to create a backup of your current data first if needed.
          </p>
          <div className="grid gap-4">
            <Label htmlFor="backupFile">Select Backup File</Label>
            <Input
              id="backupFile"
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Select a Cannabis Army Tracker backup file (.json) to restore
            </p>
          </div>
        </div>
        
        <Alert className="bg-yellow-900/20 border-yellow-800 text-yellow-300">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription className="text-yellow-200/80">
            <ul className="list-disc pl-5 space-y-1">
              <li>Your data is stored in your browser's localStorage</li>
              <li>Data may be lost if you clear your browser cache/data</li>
              <li>Create regular backups and store them safely</li>
              <li>There is no cloud backup - you are responsible for your data</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default BackupRestoreTab;
