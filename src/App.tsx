import { ChakraProvider, CSSReset, Box, Spinner } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

import { theme } from "theme";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { NetworkBoundary } from "./components/NetworkBoundary";
import { queryClient } from "./queryClient";
import { router } from "./router";

const contentPaddingX = { base: 5, md: "60px" };
const contentPaddingTop = { base: 6, md: 12 };

export const App = () => (
  <NetworkBoundary>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Box position="fixed" right={3} top={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
        </Box>
        <Box as="main" paddingX={contentPaddingX} paddingTop={contentPaddingTop}>
          <RouterProvider
            router={router}
            fallbackElement={
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="pink.500"
                size="xl"
              />
            }
          />
        </Box>
      </ChakraProvider>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  </NetworkBoundary>
);
