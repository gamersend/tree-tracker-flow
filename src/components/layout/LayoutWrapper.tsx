
import React from "react";
import Layout from "./Layout";
import HeaderWrapper from "./HeaderWrapper";
import { motion } from "framer-motion";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  // Override the Header component in Layout with our HeaderWrapper
  return (
    <Layout headerComponent={<HeaderWrapper />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Layout>
  );
};

export default LayoutWrapper;
