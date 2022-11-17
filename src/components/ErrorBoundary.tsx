import { Component, ErrorInfo, ReactNode } from "react";

import { ErrorFallback } from "./ErrorFallback";

export interface ErrorBoundaryProps {
  children?: ReactNode;
  /** Fallback UI when an error occurs. */
  errorFallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.errorFallback ?? <ErrorFallback height="100vh" />;
    }

    return this.props.children;
  }
}
