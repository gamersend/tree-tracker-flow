
import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import MatesRatesWidget from "@/components/mates-rates/MatesRatesWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MatesRatesCalculator = () => {
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-tree-purple bg-gradient-to-b from-background to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                <span className="text-2xl">🤙</span>
                <span>Mates Rates Calculator</span>
                <span className="text-2xl">🤙</span>
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Figure out your dodgy discounts with scientific precision!
              </p>
            </CardHeader>
            <CardContent>
              <MatesRatesWidget />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MatesRatesCalculator;
