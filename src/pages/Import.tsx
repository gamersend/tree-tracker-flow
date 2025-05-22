
import React, { useState } from "react";
import ImportTabs from "@/components/import/ImportTabs";
import AIInstructionsCard from "@/components/import/AIInstructionsCard";
import NaturalLanguageCard from "@/components/import/NaturalLanguageCard";
import { useImportData } from "@/hooks/useImportData";

const Import = () => {
  const [activeTab, setActiveTab] = useState<"import" | "export" | "backup">("import");
  const { formatExamples } = useImportData("sales", ""); // Just to get formatExamples

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Data Management</h1>
          <p className="text-gray-400">Import, export, and backup your cannabis business data</p>
        </div>
      </div>

      <ImportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AIInstructionsCard formatExamples={formatExamples} />
      
      <NaturalLanguageCard />
    </div>
  );
};

export default Import;
