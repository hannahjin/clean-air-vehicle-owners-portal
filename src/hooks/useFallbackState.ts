import { useEffect, useRef } from "react";

import { useBoolean } from "@chakra-ui/react";

export function useFallbackState(isFetching: boolean) {
  const [shouldShowFetchingFallback, { on, off }] = useBoolean(false);
  const fetchingFallbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFetching) {
      fetchingFallbackTimeout.current = setTimeout(on, 1000);
    } else {
      off();
    }

    return () => {
      if (fetchingFallbackTimeout.current) {
        clearTimeout(fetchingFallbackTimeout.current);
      }
    };
  }, [isFetching, off, on]);

  return [shouldShowFetchingFallback, { showFallback: on, hideFallback: off }];
}
