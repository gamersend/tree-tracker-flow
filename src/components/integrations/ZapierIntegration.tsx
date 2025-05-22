
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const ZapierIntegration: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>(localStorage.getItem('zapier_webhook_url') || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastTested, setLastTested] = useState<string | null>(localStorage.getItem('zapier_last_tested'));
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customPayload, setCustomPayload] = useState<string>(localStorage.getItem('zapier_custom_payload') || JSON.stringify({
    app: "Cannabis Army Tracker",
    event: "test_trigger",
    timestamp: new Date().toISOString()
  }, null, 2));

  const saveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('zapier_webhook_url', url);
  };

  const saveCustomPayload = (payload: string) => {
    setCustomPayload(payload);
    localStorage.setItem('zapier_custom_payload', payload);
  };

  const handleTriggerZap = async () => {
    if (!webhookUrl) {
      toast.error("Please enter your Zapier webhook URL");
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", webhookUrl);

    try {
      // Validate custom payload if provided
      let payload = {};
      try {
        payload = customPayload ? JSON.parse(customPayload) : {
          app: "Cannabis Army Tracker",
          event: "manual_trigger",
          timestamp: new Date().toISOString()
        };
      } catch (err) {
        toast.error("Invalid JSON payload. Please check your format.");
        setIsLoading(false);
        return;
      }

      // Send the webhook request
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS for external calls
        body: JSON.stringify(payload)
      });

      // Update last tested time
      const now = new Date().toLocaleString();
      setLastTested(now);
      localStorage.setItem('zapier_last_tested', now);

      toast.success("Zap triggered successfully!");
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast.error("Failed to trigger Zap. Check your webhook URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          Zapier Integration
        </CardTitle>
        <CardDescription>
          Connect your Cannabis Army Tracker with 3,000+ apps using Zapier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={webhookUrl}
            onChange={(e) => saveWebhookUrl(e.target.value)}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Create a Zap with "Webhooks by Zapier" as the trigger, and paste the webhook URL here
          </p>
        </div>

        {lastTested && (
          <div className="text-xs text-muted-foreground">
            Last tested: {lastTested}
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            size="sm"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>

          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pt-4 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="custom-payload">Custom Payload (JSON)</Label>
                <textarea
                  id="custom-payload"
                  className="w-full h-32 p-2 font-mono text-xs bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none resize-none"
                  value={customPayload}
                  onChange={(e) => saveCustomPayload(e.target.value)}
                  placeholder='{
  "app": "Cannabis Army Tracker",
  "event": "custom_trigger",
  "data": {}
}'
                />
                <p className="text-xs text-muted-foreground">
                  Customize the JSON payload sent to your webhook
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="pt-4">
          <Button
            onClick={handleTriggerZap}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Test Zapier Integration"}
          </Button>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="text-sm font-medium text-amber-400 mb-2">Setting Up Zapier</h4>
          <ol className="text-xs text-gray-300 space-y-2 list-decimal pl-4">
            <li>Login to your Zapier account and create a new Zap</li>
            <li>Choose "Webhook by Zapier" as the trigger app</li>
            <li>Select "Catch Hook" as the trigger event</li>
            <li>Copy the provided webhook URL and paste it above</li>
            <li>Test the integration by clicking the "Test Zapier Integration" button</li>
            <li>Set up your desired actions in Zapier to handle the data</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZapierIntegration;
