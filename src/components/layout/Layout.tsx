
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerComponent }) => {
  return (
    <div className="flex min-h-screen w-full cannabis-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {headerComponent || <Header />}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
        <footer className="py-3 px-6 text-xs text-gray-500 text-center border-t border-slate-800">
          Tree Tracker - Cloud Cannabis Management System
        </footer>
      </div>
    </div>
  );
};

export default Layout;
