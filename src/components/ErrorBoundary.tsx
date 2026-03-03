"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  isDark?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { isDark = true } = this.props;

      return (
        <div className={`p-4 rounded-lg border text-center ${
          isDark
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : "bg-red-50 border-red-200 text-red-600"
        }`}>
          <p className="font-medium">加载失败</p>
          <p className="text-sm mt-1 opacity-80">
            {this.state.error?.message || "请刷新页面重试"}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
