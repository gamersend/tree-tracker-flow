
import { toast } from 'sonner';
import { loadFromStorage } from '@/utils/inventory-utils';
import { InventoryItem, StrainInfo } from '@/types/inventory';
import { CustomerType, PurchaseType } from '@/types/customer';
import { Note } from '@/types/note';
import { StorageConfig, loadStorageConfig } from '@/utils/storage-config';

// Define types for our API endpoints
export type ApiEndpoint = 
  | 'inventory'
  | 'strains'
  | 'customers'
  | 'purchases'
  | 'sales'
  | 'notes'
  | 'storage-config'
  | 'ticks'
  | 'business-supplies';

// Define the response structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Fetches data from the specified endpoint
 * @param endpoint The API endpoint to fetch data from
 * @returns A promise that resolves to an ApiResponse
 */
export const fetchData = async <T>(endpoint: ApiEndpoint): Promise<ApiResponse<T>> => {
  try {
    let data: any = null;
    
    // Load data based on endpoint
    switch (endpoint) {
      case 'inventory':
        data = loadFromStorage<InventoryItem[]>('inventory', []);
        break;
      case 'strains':
        data = loadFromStorage<StrainInfo[]>('strains', []);
        break;
      case 'customers':
        data = loadFromStorage<CustomerType[]>('customers', []);
        break;
      case 'purchases':
        data = loadFromStorage<PurchaseType[]>('purchases', []);
        break;
      case 'sales':
        data = loadFromStorage('sales', []);
        break;
      case 'notes':
        data = loadFromStorage('tree-tracker-notes', []);
        break;
      case 'storage-config':
        data = loadStorageConfig();
        break;
      case 'ticks':
        data = loadFromStorage('ticks', []);
        break;
      case 'business-supplies':
        data = loadFromStorage('businessSupplies', []);
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    return {
      success: true,
      data: data as T,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

/**
 * Updates data at the specified endpoint
 * @param endpoint The API endpoint to update
 * @param data The data to update
 * @returns A promise that resolves to an ApiResponse
 */
export const updateData = async <T>(endpoint: ApiEndpoint, data: T): Promise<ApiResponse<T>> => {
  try {
    // Check if we have permission to update based on storage config
    const storageConfig = loadStorageConfig();
    
    // If we're not using local storage, we shouldn't be updating via this API
    if (storageConfig.storageType !== 'local') {
      // Instead of throwing, we'll show a toast and return an error
      toast.error(`Cannot update data in ${storageConfig.storageType} storage via the API`);
      return {
        success: false,
        error: `Updates not available when using ${storageConfig.storageType} storage`,
        timestamp: Date.now()
      };
    }

    // Map endpoint to localStorage key
    let storageKey: string;
    switch (endpoint) {
      case 'inventory':
        storageKey = 'inventory';
        break;
      case 'strains':
        storageKey = 'strains';
        break;
      case 'customers':
        storageKey = 'customers';
        break;
      case 'purchases':
        storageKey = 'purchases';
        break;
      case 'sales':
        storageKey = 'sales';
        break;
      case 'notes':
        storageKey = 'tree-tracker-notes';
        break;
      case 'storage-config':
        // For storage config, use the specialized function
        const config = data as unknown as StorageConfig;
        const success = await import('./storage-config').then(
          module => module.saveStorageConfig(config)
        );
        if (!success) throw new Error('Failed to save storage configuration');
        return {
          success: true,
          data,
          timestamp: Date.now()
        };
      case 'ticks':
        storageKey = 'ticks';
        break;
      case 'business-supplies':
        storageKey = 'businessSupplies';
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    toast.success(`Successfully updated ${endpoint} data`);
    
    return {
      success: true,
      data,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    toast.error(`Failed to update ${endpoint} data`);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now()
    };
  }
};

/**
 * Helper function to use the API in React components
 * @param endpoint The API endpoint to fetch data from
 * @returns The data from the specified endpoint
 */
export const useApiData = <T>(endpoint: ApiEndpoint): {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
  update: (newData: T) => Promise<boolean>;
} => {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  const fetchDataFromEndpoint = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<T>(endpoint);
      if (response.success && response.data) {
        setData(response.data);
        setError(null);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);
  
  // Fetch data on mount
  React.useEffect(() => {
    fetchDataFromEndpoint();
  }, [fetchDataFromEndpoint]);
  
  // Update data function
  const update = async (newData: T): Promise<boolean> => {
    try {
      const response = await updateData(endpoint, newData);
      if (response.success) {
        setData(newData);
        return true;
      } else {
        setError(response.error || 'Unknown error occurred while updating');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    }
  };
  
  return {
    data,
    error,
    isLoading,
    refetch: fetchDataFromEndpoint,
    update
  };
};

// Import React at the top for the hook
import React from 'react';
