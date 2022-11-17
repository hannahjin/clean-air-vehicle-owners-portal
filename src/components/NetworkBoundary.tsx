import { Suspense, SuspenseProps } from "react";

import { ErrorBoundary, ErrorBoundaryProps } from "./ErrorBoundary";

interface NetworkBoundaryProps extends ErrorBoundaryProps, SuspenseProps {}

export function NetworkBoundary({ errorFallback, fallback, children }: NetworkBoundaryProps) {
  return (
    <ErrorBoundary errorFallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
