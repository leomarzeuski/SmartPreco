import { getClerkInstance } from "@clerk/clerk-expo";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

interface FetchConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export const customInstance = async <T>(config: FetchConfig): Promise<T> => {
  const { url, method = "GET", data, params, headers = {} } = config;

  const clerkInstance = getClerkInstance();

  const urlObj = new URL(url, EXPO_PUBLIC_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.set(key, value.toString());
      }
    });
  }

  let authHeaders = {};
  try {
    if (clerkInstance.session) {
      const token = await clerkInstance.session.getToken({
        template: undefined,
      });
      if (token) {
        authHeaders = { Authorization: `Bearer ${token}` };
      }
    }
  } catch (error) {
    console.error("🚨 Erro ao buscar token:", error);
  }

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  };

  if (data && method !== "GET") {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(urlObj.toString(), requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error:", errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      return jsonData;
    }

    const textData = await response.text();
    return textData as T;
  } catch (error) {
    console.error("🚨 Fetch error completo:", error);
    throw error;
  }
};

export const axiosInstance = async <T>({
  url,
  method,
  params,
  data,
  headers,
}: {
  url: string;
  method: string;
  params?: any;
  data?: any;
  headers?: any;
}): Promise<T> => {
  return customInstance<T>({
    url,
    method: method.toUpperCase() as any,
    params,
    data,
    headers,
  });
};

export default customInstance;
