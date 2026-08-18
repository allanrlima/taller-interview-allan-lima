"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Catalog render failed", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div role="alert">This section could not be displayed. Refresh to try again.</div>;
    }
    return this.props.children;
  }
}
