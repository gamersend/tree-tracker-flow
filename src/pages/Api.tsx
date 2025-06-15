
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApiExplorer from "@/components/api/ApiExplorer";

const Api = () => {
  const { user, loading: authLoading } = useAuth();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tree-green"></div>
      </div>
    );
  }

  // If not authenticated, the AuthGuard will handle the redirect
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Please sign in to access API features.</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="mr-2">🔌</span> API
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Access your data through the internal API
          </motion.p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use the internal API to access your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The internal API provides access to all data sections in your application. 
              You can use these endpoints to build custom interfaces or integrate with other tools.
            </p>
            
            <h3 className="text-lg font-medium">Available Endpoints</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>inventory - Access inventory items</li>
              <li>strains - Access strain information</li>
              <li>customers - Access customer data</li>
              <li>purchases - Access purchase history</li>
              <li>sales - Access sales records</li>
              <li>notes - Access notes</li>
              <li>storage-config - View current storage configuration</li>
              <li>ticks - Access tick ledger data</li>
              <li>business-supplies - Access business supplies inventory</li>
            </ul>
            
            <h3 className="text-lg font-medium">Usage Methods</h3>
            <p>There are two ways to use the API:</p>
            
            <div className="pl-5 space-y-3">
              <div>
                <h4 className="font-medium">1. Direct API calls</h4>
                <pre className="bg-slate-800 p-2 rounded-md text-sm mt-1">
                  {`import { fetchData } from '@/utils/api-service';

// Example: Fetch inventory data
const response = await fetchData('inventory');
if (response.success) {
  console.log(response.data);
}`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium">2. React hook (recommended for components)</h4>
                <pre className="bg-slate-800 p-2 rounded-md text-sm mt-1">
                  {`import { useApiData } from '@/utils/api-service';

// Inside your component:
const { data, error, isLoading } = useApiData('customers');

// Use the data in your UI
return isLoading ? <p>Loading...</p> : <div>{data?.length} customers</div>;`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApiExplorer />
    </motion.div>
  );
};

export default Api;
