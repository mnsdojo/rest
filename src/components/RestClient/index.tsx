"use client";
import {
  ApiResponse,
  Auth,
  HttpMethod,
  QueryParam,
  RequestHeader,
  RequestHistory,
  ResponseMeta,
} from "@/types/api";
import { useEffect, useState } from "react";

function RestClient() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [requestBody, setRequestBody] = useState("");
  const [headers, setHeaders] = useState<RequestHeader[]>([
    { key: "Content-Type", value: "application/json", id: crypto.randomUUID() },
  ]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [responseMeta, setResponseMeta] = useState<ResponseMeta>({
    statusCode: null,
    headers: null,
    timing: null,
    size: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRequestTab, setActiveRequestTab] = useState("body");
  const [activeResponseTab, setActiveResponseTab] = useState("response");
  const [showHistory, setShowHistory] = useState(false);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [auth, setAuth] = useState<Auth>({ type: "none" });
  useEffect(() => {
    const savedHistory = localStorage.getItem("reqHistory");
    if (savedHistory) {
      setRequestHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addHistory = (method: HttpMethod, url: string) => {
    const newHistory = [
      { id: crypto.randomUUID(), method, url, timestamp: Date.now() },
      ...requestHistory.slice(0, 19),
    ];
    setRequestHistory(newHistory);
    localStorage.setItem("reqHistory", JSON.stringify(newHistory));
  };


  

  return <div>RestClient</div>;
}

export default RestClient;
