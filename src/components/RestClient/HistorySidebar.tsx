import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { RequestHistory } from "@/types/api";
import { Button } from "../ui/button";

interface HistorySidebarProps {
  history: RequestHistory[];
  onSelectRequest: (request: RequestHistory) => void;
}
function HistorySidebar({ history, onSelectRequest }: HistorySidebarProps) {
  return (
    <div className="w-64 border-r p-4 space-y-2">
      <h3 className="font-medium mb-4">Request History</h3>
      <ScrollArea>
        {history.map((request) => (
          <Button
            onClick={() => onSelectRequest(request)}
            variant="ghost"
            key={request.id}
          >
            <div className="font-medium">
              {request.method}
              {/* {new URL(request.url).pathname} */}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(request.timestamp).toLocaleString()}
            </div>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}

export default HistorySidebar;
