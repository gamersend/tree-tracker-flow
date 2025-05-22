
import { toast } from 'sonner';

// Types of storage available in the application
export type StorageType = 'local' | 'postgres' | 'file';

// Configuration for storage
export interface StorageConfig {
  storageType: StorageType;
  postgres?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
  };
  file?: {
    path: string;
    backupInterval: number; // in minutes
  };
}

// Default storage configuration
export const defaultStorageConfig: StorageConfig = {
  storageType: 'local',
  postgres: {
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl: true
  },
  file: {
    path: '',
    backupInterval: 60
  }
};

// Load storage configuration from localStorage
export const loadStorageConfig = (): StorageConfig => {
  try {
    const storedConfig = localStorage.getItem('storageConfig');
    return storedConfig ? JSON.parse(storedConfig) : defaultStorageConfig;
  } catch (error) {
    console.error('Error loading storage configuration:', error);
    return defaultStorageConfig;
  }
};

// Save storage configuration to localStorage
export const saveStorageConfig = (config: StorageConfig): boolean => {
  try {
    localStorage.setItem('storageConfig', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving storage configuration:', error);
    return false;
  }
};

// Test database connection
export const testDatabaseConnection = async (config: StorageConfig['postgres']): Promise<boolean> => {
  if (!config) return false;
  
  // This is a mock function - in a real implementation, you would connect to the database
  // and return true if the connection is successful
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success if all fields are filled in
      const isValid = !!(config.host && config.database && config.username && config.password);
      resolve(isValid);
    }, 1000);
  });
};

// Test file path
export const testFilePath = async (path: string): Promise<boolean> => {
  // This is a mock function - in a real implementation, you would check if the path exists
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success if path is not empty
      resolve(!!path);
    }, 500);
  });
};

// Migrate data between storage types
export const migrateData = async (from: StorageType, to: StorageType): Promise<boolean> => {
  // This would implement actual migration logic in a real application
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`Data successfully migrated from ${from} to ${to} storage`);
      resolve(true);
    }, 1500);
  });
};
