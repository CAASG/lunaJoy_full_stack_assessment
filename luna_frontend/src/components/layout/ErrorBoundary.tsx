/**
 * @module ErrorBoundary
 * @description React error boundary that catches rendering errors in child
 * components. Displays a friendly fallback UI instead of crashing the app.
 * Uses class component because error boundaries require getDerivedStateFromError.
 */

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Use around sections that might fail (charts, forms, etc.) to prevent
 * a single broken component from crashing the entire page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Intentionally empty: React runtime logs errors automatically.
    // We suppress the unused parameter warning with underscore prefix.
    void _error;
    void _info;
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-xl bg-white border border-luna-cream-dark p-6 text-center">
          <p className="text-luna-dark font-medium mb-2">
            Something went wrong
          </p>
          <p className="text-luna-warm-gray text-sm mb-4">
            Don&apos;t worry — your data is safe. Try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-luna-blue text-white rounded-lg text-sm hover:bg-luna-blue-dark transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
