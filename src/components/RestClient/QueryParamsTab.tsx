"use client";
import { QueryParam } from "@/types/api";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";

const QueryParamsTab = ({
  params,
  setParams,
}: {
  params: QueryParam[];
  setParams: (params: QueryParam[]) => void;
}) => {
  const addParam = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setParams([...params, { key: "", value: "", id: crypto.randomUUID() }]);
  };

  const removeParam = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent form submission
    setParams(params.filter((p) => p.id !== id));
  };

  const updateParam = (id: string, field: "key" | "value", value: string) => {
    setParams(params.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="space-y-4">
      {params.map((param) => (
        <div key={param.id} className="flex gap-2">
          <Input
            placeholder="Parameter"
            value={param.key}
            onChange={(e) => updateParam(param.id, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={param.value}
            onChange={(e) => updateParam(param.id, "value", e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => removeParam(e, param.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addParam}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Parameter
      </Button>
    </div>
  );
};

export default QueryParamsTab;
