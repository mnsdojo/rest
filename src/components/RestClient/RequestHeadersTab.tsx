"use client";
import { RequestHeader } from "@/types/api";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";

interface RequestHeadersTabProps {
  headers: RequestHeader[];
  setHeaders: (headers: RequestHeader[]) => void;
}
function RequestHeadersTab({ headers, setHeaders }: RequestHeadersTabProps) {
  const addHeader = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setHeaders([...headers, { key: "", value: "", id: crypto.randomUUID() }]);
  };

  const removeHeader = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, field: "key" | "value", value: string) => {
    setHeaders(
      headers.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };
  return (
    <div className="space-y-4">
      {headers.map((header) => (
        <div key={header.id} className="flex gap-2">
          <Input
            placeholder="Header"
            value={header.key}
            onChange={(e) => updateHeader(header.id, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={header.value}
            onChange={(e) => updateHeader(header.id, "value", e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => removeHeader(e, header.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addHeader}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Header
      </Button>
    </div>
  );
}

export default RequestHeadersTab;
