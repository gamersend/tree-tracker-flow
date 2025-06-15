
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { Download, Share, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PwaInstallButton: React.FC = () => {
  const { showPrompt, isIOS, handleInstall, handleDismiss } = usePwaInstall();

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-lg border border-border/50 text-sm animate-fade-in">
      {isIOS ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                 <Button size="sm" variant="ghost" className="text-foreground hover:bg-muted/50 pointer-events-none">
                  <Share className="mr-2 h-4 w-4" />
                  Install App
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tap "Share" then "Add to Home Screen".</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button onClick={handleInstall} size="sm" variant="ghost" className="text-foreground hover:bg-muted/50">
          <Download className="mr-2 h-4 w-4" />
          Install App
        </Button>
      )}
      <Button onClick={handleDismiss} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PwaInstallButton;
