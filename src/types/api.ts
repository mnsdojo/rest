export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export const ALLOWED_METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
];

export type AuthType = "none" | "basic" | "bearer";

export interface RequestHeader {
  key: string;
  value: string;
  id: string;
}

export interface QueryParam {
  key: string;
  value: string;
  id: string;
}

export interface RequestHistory {
  id: string;
  method: HttpMethod;
  url: string;
  timestamp: number;
}

export interface Auth {
  type: AuthType;
  username?: string;
  password?: string;
  token?: string;
}

export interface ApiResponse {
  data: any;
  message?: string;
}

export interface ResponseMeta {
  statusCode: number | null;
  headers: Record<string, string> | null;
  timing: number | null;
  size: number | null;
}

