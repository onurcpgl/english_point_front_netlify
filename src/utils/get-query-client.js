import { QueryClient, isServer } from "@tanstack/react-query";

function makeqqueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
}

let browserQueryClient;

export function getQueryClient() {
  if (isServer) {
    // Server side: her çağrıda yeni QueryClient döndür
    return makeqqueryClient();
  } else {
    // Client side: Tek bir QueryClient yarat ve onu döndür
    if (!browserQueryClient) browserQueryClient = makeqqueryClient();
    return browserQueryClient;
  }
}
