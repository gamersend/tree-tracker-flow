
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RecentEntriesProps {
  entries: string[];
  onUseEntry: (entry: string) => void;
}

export const RecentEntries = ({ entries, onUseEntry }: RecentEntriesProps) => {
  if (entries.length === 0) return null;
  
  return (
    <div className="pt-4 border-t border-slate-800 mt-6">
      <Label className="text-sm text-slate-400 mb-2 block">Recent Entries:</Label>
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left text-xs py-1 px-3 h-auto border border-slate-800/50 hover:bg-slate-800/50"
            onClick={() => onUseEntry(entry)}
          >
            {entry.length > 60 ? entry.substring(0, 60) + "..." : entry}
          </Button>
        ))}
      </div>
    </div>
  );
};
