import { QueryClient } from "@tanstack/react-query";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      suspense: true,
      staleTime: 5 * MINUTE,
    },
  },
});
