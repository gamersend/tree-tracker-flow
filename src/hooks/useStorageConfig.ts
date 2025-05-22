
import { useState, useEffect } from 'react';
import { 
  StorageConfig, 
  StorageType,
  loadStorageConfig, 
  saveStorageConfig, 
  testDatabaseConnection,
  testFilePath,
  migrateData
} from '@/utils/storage-config';
import { toast } from 'sonner';

export const useStorageConfig = () => {
  const [config, setConfig] = useState<StorageConfig>(loadStorageConfig());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);

  // Load config on initial render
  useEffect(() => {
    setConfig(loadStorageConfig());
  }, []);

  // Update storage type
  const updateStorageType = (type: StorageType) => {
    setConfig(prev => ({
      ...prev,
      storageType: type
    }));
  };

  // Update Postgres configuration
  const updatePostgresConfig = (postgresConfig: Partial<StorageConfig['postgres']>) => {
    setConfig(prev => ({
      ...prev,
      postgres: {
        ...prev.postgres,
        ...postgresConfig
      } as StorageConfig['postgres']
    }));
  };

  // Update file storage configuration
  const updateFileConfig = (fileConfig: Partial<StorageConfig['file']>) => {
    setConfig(prev => ({
      ...prev,
      file: {
        ...prev.file,
        ...fileConfig
      } as StorageConfig['file']
    }));
  };

  // Save configuration
  const saveConfig = async () => {
    setIsLoading(true);
    try {
      // Perform validation based on selected storage type
      if (config.storageType === 'postgres' && config.postgres) {
        const isConnectionValid = await testDatabaseConnection(config.postgres);
        if (!isConnectionValid) {
          toast.error('Invalid database configuration. Please check your settings.');
          setIsLoading(false);
          return false;
        }
      } else if (config.storageType === 'file' && config.file) {
        const isPathValid = await testFilePath(config.file.path);
        if (!isPathValid) {
          toast.error('Invalid file path. Please check your settings.');
          setIsLoading(false);
          return false;
        }
      }

      const success = saveStorageConfig(config);
      if (success) {
        toast.success('Storage configuration saved successfully!');
        return true;
      } else {
        toast.error('Failed to save storage configuration.');
        return false;
      }
    } catch (error) {
      console.error('Error saving storage configuration:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Test database connection
  const testConnection = async () => {
    if (!config.postgres) return;
    
    setIsTestingConnection(true);
    try {
      const isValid = await testDatabaseConnection(config.postgres);
      if (isValid) {
        toast.success('Database connection successful!');
      } else {
        toast.error('Failed to connect to database. Please check your settings.');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Migrate data between storage types
  const migrateStorage = async (targetType: StorageType) => {
    if (targetType === config.storageType) {
      toast.info('Selected storage type is already active.');
      return;
    }

    setIsLoading(true);
    try {
      // Check configuration validity first
      if (targetType === 'postgres' && config.postgres) {
        const isValid = await testDatabaseConnection(config.postgres);
        if (!isValid) {
          toast.error('Invalid database configuration. Cannot migrate.');
          return;
        }
      } else if (targetType === 'file' && config.file) {
        const isValid = await testFilePath(config.file.path);
        if (!isValid) {
          toast.error('Invalid file path. Cannot migrate.');
          return;
        }
      }

      // Perform migration
      const success = await migrateData(config.storageType, targetType);
      if (success) {
        // Update active storage type
        setConfig(prev => ({
          ...prev,
          storageType: targetType
        }));
        saveStorageConfig({
          ...config,
          storageType: targetType
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    isLoading,
    isTestingConnection,
    updateStorageType,
    updatePostgresConfig,
    updateFileConfig,
    saveConfig,
    testConnection,
    migrateStorage
  };
};
