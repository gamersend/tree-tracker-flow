
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Import as ImportIcon, Download, DatabaseBackup } from "lucide-react";
import ImportDataTab from "./ImportDataTab";
import ExportDataTab from "./ExportDataTab";
import BackupRestoreTab from "./BackupRestoreTab";

type ActiveTabType = "import" | "export" | "backup";

interface ImportTabsProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
}

const ImportTabs: React.FC<ImportTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTabType)}>
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="import" className="flex items-center gap-2">
          <ImportIcon className="h-4 w-4" />
          <span>Import</span>
        </TabsTrigger>
        <TabsTrigger value="export" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </TabsTrigger>
        <TabsTrigger value="backup" className="flex items-center gap-2">
          <DatabaseBackup className="h-4 w-4" />
          <span>Backup & Restore</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="import">
        <ImportDataTab />
      </TabsContent>
      
      <TabsContent value="export">
        <ExportDataTab />
      </TabsContent>
      
      <TabsContent value="backup">
        <BackupRestoreTab />
      </TabsContent>
    </Tabs>
  );
};

export default ImportTabs;
