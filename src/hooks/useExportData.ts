
import { toast } from 'sonner';
import { ImportDataType } from '@/components/import/types';
import { convertToCSV, downloadAsFile } from '@/lib/utils';

export const useExportData = () => {
  // Export specific data type to CSV
  const handleExportCSV = (type: ImportDataType) => {
    try {
      let data: any[] = [];
      let filename = "";
      
      switch (type) {
        case "sales":
          data = JSON.parse(localStorage.getItem('sales') || '[]');
          filename = `sales-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "customers":
          data = JSON.parse(localStorage.getItem('customers') || '[]');
          filename = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "inventory":
          data = JSON.parse(localStorage.getItem('strains') || '[]').map((item: any) => ({
            strain: item.name,
            quantity: item.quantity,
            costPerGram: item.costPerGram,
            thcLevel: item.thcLevel || 0,
            cbdLevel: item.cbdLevel || 0,
            type: item.type || 'Unknown',
            effects: Array.isArray(item.effects) ? item.effects.join(';') : '',
            notes: item.notes || ''
          }));
          filename = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "ticks":
          data = JSON.parse(localStorage.getItem('ticks') || '[]');
          filename = `ticks-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case "business-supplies":
          data = JSON.parse(localStorage.getItem('businessSupplies') || '[]');
          filename = `supplies-export-${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }
      
      if (data.length === 0) {
        toast.info(`No ${type} data to export`);
        return;
      }
      
      const csv = convertToCSV(data);
      downloadAsFile(csv, filename, 'text/csv');
      
      toast.success(`${type} data exported to CSV successfully!`);
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error(`Failed to export ${type} data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Export all data as JSON
  const handleExportData = () => {
    try {
      const exportData: Record<string, any> = {};
      
      // Collect all data from localStorage
      const dataKeys = ['sales', 'customers', 'strains', 'ticks', 'businessSupplies'];
      
      dataKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          exportData[key] = JSON.parse(data);
        }
      });
      
      // Create and download JSON file
      downloadAsFile(
        JSON.stringify(exportData, null, 2), 
        `cannabis-army-backup-${new Date().toISOString().split('T')[0]}.json`, 
        'application/json'
      );
      
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Failed to export data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return {
    handleExportCSV,
    handleExportData
  };
};
