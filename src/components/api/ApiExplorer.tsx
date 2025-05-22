
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiEndpoint, fetchData, updateData } from '@/utils/api-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export const ApiExplorer = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>('inventory');
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('response');
  
  const endpoints: ApiEndpoint[] = [
    'inventory',
    'strains',
    'customers',
    'purchases',
    'sales',
    'notes',
    'storage-config',
    'ticks',
    'business-supplies'
  ];
  
  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(selectedEndpoint);
      setResponseData(response);
      setActiveTab('response');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data from API');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatJsonForDisplay = (data: any) => {
    return JSON.stringify(data, null, 2);
  };
  
  const copyToClipboard = () => {
    if (!responseData) return;
    
    navigator.clipboard.writeText(formatJsonForDisplay(responseData))
      .then(() => toast.success('Copied to clipboard!'))
      .catch(err => toast.error('Failed to copy: ' + err.message));
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>API Explorer</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            disabled={!responseData}
          >
            Copy Response
          </Button>
        </CardTitle>
        <CardDescription>
          Test the internal API endpoints to retrieve data from each section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedEndpoint}
              onValueChange={(value) => setSelectedEndpoint(value as ApiEndpoint)}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select endpoint" />
              </SelectTrigger>
              <SelectContent>
                {endpoints.map((endpoint) => (
                  <SelectItem key={endpoint} value={endpoint}>
                    {endpoint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleFetch} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Fetch Data'}
            </Button>
          </div>
          
          {responseData && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-2">
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="usage">Usage Example</TabsTrigger>
              </TabsList>
              <TabsContent value="response">
                <ScrollArea className="h-[400px] rounded-md border border-slate-700 p-4 bg-slate-900">
                  <pre className="text-sm text-white font-mono overflow-auto">
                    {formatJsonForDisplay(responseData)}
                  </pre>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="usage">
                <ScrollArea className="h-[400px] rounded-md border border-slate-700 p-4 bg-slate-900">
                  <pre className="text-sm text-white font-mono">
{`// React component example using the API
import React from 'react';
import { useApiData } from '@/utils/api-service';

const ${selectedEndpoint.charAt(0).toUpperCase() + selectedEndpoint.slice(1)}Component = () => {
  const { 
    data, 
    error, 
    isLoading, 
    refetch, 
    update 
  } = useApiData('${selectedEndpoint}');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>${selectedEndpoint.charAt(0).toUpperCase() + selectedEndpoint.slice(1)} Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refresh Data</button>
      
      {/* Update example (for local storage only) */}
      <button onClick={() => update(/* your updated data */)}>
        Update Data
      </button>
    </div>
  );
};

export default ${selectedEndpoint.charAt(0).toUpperCase() + selectedEndpoint.slice(1)}Component;`}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-slate-400">
          <p>Note: This API allows read access to all data sections.</p>
          <p>Write access is only available when using local storage.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiExplorer;
