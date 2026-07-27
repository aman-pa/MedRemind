import { Component } from "react";
import Button from "./Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[var(--background)] px-6 text-center">
          <h1 className="text-xl font-semibold text-[var(--text)]">Something went wrong</h1>
          <p className="max-w-sm text-sm text-[var(--text-muted)]">
            An unexpected error occurred. Try reloading the page — if the problem continues, please
            contact support.
          </p>
          <Button onClick={this.handleReload} className="w-auto px-6">
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}