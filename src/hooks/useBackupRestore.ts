
import { useState } from 'react';
import { toast } from 'sonner';
import { downloadAsFile } from '@/lib/utils';

export const useBackupRestore = () => {
  // Create backup of all data
  const handleCreateBackup = () => {
    try {
      const allData: Record<string, any> = {};
      
      // Collect all data from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              allData[key] = JSON.parse(value);
            }
          } catch (e) {
            // Skip non-JSON values
            console.warn(`Skipped non-JSON value for key: ${key}`);
          }
        }
      }
      
      // Create timestamp for backup
      const timestamp = new Date().toISOString();
      const backupKey = `cannabisArmyBackup_${timestamp}`;
      
      // Store backup in localStorage
      localStorage.setItem(backupKey, JSON.stringify({
        timestamp,
        data: allData
      }));
      
      toast.success("Backup created successfully!");
      
      // Also download a copy
      downloadAsFile(
        JSON.stringify(allData, null, 2),
        `cannabis-army-backup-${timestamp.split('T')[0]}.json`,
        'application/json'
      );
    } catch (error) {
      console.error("Backup error:", error);
      toast.error(`Failed to create backup: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Import from backup file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          toast.error("Failed to read backup file");
          return;
        }
        
        const backupData = JSON.parse(event.target.result.toString());
        
        // Verify backup data structure
        if (!backupData || typeof backupData !== 'object') {
          toast.error("Invalid backup file format");
          return;
        }
        
        // Show confirmation before overwriting
        if (window.confirm("This will replace your current data with the backup. Continue?")) {
          // Store each data type from backup
          Object.keys(backupData).forEach(key => {
            localStorage.setItem(key, JSON.stringify(backupData[key]));
          });
          
          toast.success("Backup restored successfully!");
          
          // Force page reload to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (error) {
        console.error("Backup import error:", error);
        toast.error(`Failed to import backup: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    reader.readAsText(file);
  };

  return {
    handleCreateBackup,
    handleImportBackup
  };
};
