
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAnalytics } from "@/hooks/useSupabaseAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";

const Analytics = () => {
  const { user, loading: authLoading } = useAuth();
  const { summary, loading } = useSupabaseAnalytics();

  // Show loading state while checking authentication
  if (authLoading || loading) {
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
        <div className="text-gray-400">Please sign in to access analytics data.</div>
      </div>
    );
  }

  if (!summary) {
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
              <span className="mr-2">📊</span> Analytics
            </motion.h1>
            <motion.p
              className="text-gray-400"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Insights and performance metrics
            </motion.p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              Add some sales and inventory data to see analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Start by adding inventory items and recording sales to generate meaningful analytics.</p>
          </CardContent>
        </Card>
      </motion.div>
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
            <span className="mr-2">📊</span> Analytics
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Insights and performance metrics
          </motion.p>
        </div>
      </div>

      <AnalyticsMetrics summary={summary} />
      <AnalyticsCharts summary={summary} />
    </motion.div>
  );
};

export default Analytics;
