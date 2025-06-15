// ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error occurred
    this.state = { hasError: false, error: null };
  }

  // Called when an error occurs during rendering
  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true, error };
  }

  // Called after an error is caught - perfect for logging
  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Send to error reporting service in production
    // errorReportingService.captureError(error, errorInfo);
  }

  render() {
    // If error occurred, show fallback UI
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
          <p>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
