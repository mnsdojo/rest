import { Auth, QueryParam } from "@/types/api";

export const getAuthHeaders = (auth: Auth): Record<string, string> => {
  switch (auth.type) {
    case "basic":
      if (auth.username && auth.password) {
        return {
          Authorization: `Basic ${btoa(`${auth.username}: ${auth.password}`)}`,
        };
      }
      break;
    case "bearer":
      if (auth.token) {
        return {
          Authorization: `Bearer ${auth.token}`,
        };
      }
      break;
  }
  return {};
};

export const buildUrl = (baseUrl: string, params: QueryParam[]): string => {
  const url = new URL(baseUrl);
  params.forEach((param) => {
    if (param.key && param.value) {
      url.searchParams.append(param.key, param.value);
    }
  });
  return url.toString();
};

export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
