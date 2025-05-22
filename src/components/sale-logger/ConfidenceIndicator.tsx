
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ConfidenceIndicatorProps {
  score: number;
}

export const ConfidenceIndicator = ({ score }: ConfidenceIndicatorProps) => {
  if (score >= 0.8) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-green-500 ml-1">
              <CheckCircle2 className="inline h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>High confidence (auto-detected)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (score >= 0.5) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-yellow-500 ml-1">
              <CheckCircle2 className="inline h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Medium confidence (please verify)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-red-500 ml-1">
              <AlertCircle className="inline h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Low confidence (please check this field)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};
