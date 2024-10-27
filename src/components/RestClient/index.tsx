"use client";
import {
  ALLOWED_METHODS,
  ApiResponse,
  Auth,
  HttpMethod,
  QueryParam,
  RequestHeader,
  RequestHistory,
  ResponseMeta,
} from "@/types/api";
import React, { useEffect, useState } from "react";
import { buildUrl, getAuthHeaders, formatBytes, isValidUrl } from "@/lib/api";
import HistorySidebar from "./HistorySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { History, Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import QueryParamsTab from "./QueryParamsTab";
import RequestHeadersTab from "./RequestHeadersTab";
import AuthTab from "./AuthTab";
import { Alert, AlertDescription } from "../ui/alert";

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
  const [error, setError] = useState<string | null>(null);
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
    if (!url) {
      setError("Please add the url");
      return;
    }
    const newHistory = [
      { id: crypto.randomUUID(), method, url, timestamp: Date.now() },
      ...requestHistory.slice(0, 19),
    ];
    setRequestHistory(newHistory);
    localStorage.setItem("reqHistory", JSON.stringify(newHistory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("please Enter a URL");
      return;
    }
    setError(null);
    setLoading(true);
    setResponse(null);
    setResponseMeta({
      statusCode: null,
      headers: null,
      timing: null,
      size: null,
    });

    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setError("Request timeout after 10 seconds");
      setLoading(false);
    }, 10000);
    try {
      const finalUrl = buildUrl(url, queryParams);
      const requestHeaders: Record<string, string> = {
        ...headers.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
        ...getAuthHeaders(auth),
      };
      const res = await fetch(finalUrl, {
        method,
        headers: requestHeaders,
        body: method !== "GET" ? requestBody : null,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const endTime = performance.now();
      const responseData = await res.json();
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => (responseHeaders[key] = value));
      const responseSize = new TextEncoder().encode(
        JSON.stringify(responseData)
      ).length;
      setResponse({ data: responseData });
      setResponseMeta({
        statusCode: res.status,
        headers: responseHeaders,
        timing: Math.round(endTime - startTime),
        size: responseSize,
      });

      addHistory(method, finalUrl);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("Request timeout after 10 seconds");
        } else {
          setError(`Error : ${error.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const loadFromHistory = (request: RequestHistory) => {
    setMethod(request.method);
    setUrl(request.url);
    setShowHistory(false);
  };
  return (
    <div className="h-screen flex ">
      {showHistory && (
        <HistorySidebar
          history={requestHistory}
          onSelectRequest={loadFromHistory}
        />
      )}
      <div className="flex-1 p-4 overscroll-auto">
        <Card className="flex flex-col flex-1 h-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Rest-Api Client</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button className="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <Select
                  value={method}
                  onValueChange={(value) => setMethod(value as HttpMethod)}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue>{method}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ALLOWED_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter API URL"
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs
                value={activeRequestTab}
                onValueChange={setActiveRequestTab}
              >
                <TabsList>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="params">Query Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="auth">Authorization</TabsTrigger>
                </TabsList>
                <TabsContent value="body" className="space-y-4">
                  <Textarea
                    placeholder="Request body (JSON)"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={8}
                  />
                </TabsContent>
                <TabsContent value="params">
                  <QueryParamsTab
                    params={queryParams}
                    setParams={setQueryParams}
                  />
                </TabsContent>
                <TabsContent value="headers">
                  <RequestHeadersTab
                    headers={headers}
                    setHeaders={setHeaders}
                  />
                </TabsContent>
                <TabsContent value="auth">
                  <AuthTab auth={auth} setAuth={setAuth} />
                </TabsContent>
              </Tabs>

              {response && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    {responseMeta.statusCode && (
                      <div>
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            responseMeta.statusCode < 400
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {responseMeta.statusCode}
                        </span>
                      </div>
                    )}
                    {responseMeta.timing && (
                      <div>
                        Time:{" "}
                        <span className="font-medium">
                          {responseMeta.timing}ms
                        </span>
                      </div>
                    )}
                    {responseMeta.size && (
                      <div>
                        Size:{" "}
                        <span className="font-medium">
                          {formatBytes(responseMeta.size)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Tabs
                    value={activeResponseTab}
                    onValueChange={setActiveResponseTab}
                  >
                    <TabsList>
                      <TabsTrigger value="response">Response</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="response">
                      <pre className="bg-muted p-4 rounded-md overflow-auto">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </TabsContent>
                    <TabsContent value="headers">
                      <div className="space-y-2">
                        {responseMeta.headers &&
                          Object.entries(responseMeta.headers).map(
                            ([key, value]) => (
                              <div key={key} className="flex gap-2 text-sm">
                                <span className="font-medium">{key}:</span>
                                <span>{value}</span>
                              </div>
                            )
                          )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RestClient;
