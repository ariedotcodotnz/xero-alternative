import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body p-5 text-center">
                    <h1 className="display-4 text-danger mb-4">Oops!</h1>
                    <h2 className="h4 mb-3">Something went wrong</h2>
                    <p className="text-muted mb-4">
                      We're sorry for the inconvenience. An error occurred while processing your request.
                    </p>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                      <div className="alert alert-danger text-start mb-4">
                        <h5 className="alert-heading">Error Details:</h5>
                        <p className="mb-2">
                          <strong>Message:</strong> {this.state.error.message}
                        </p>
                        {this.state.errorInfo && (
                          <pre className="mb-0" style={{ fontSize: '0.875rem', maxHeight: '200px', overflow: 'auto' }}>
                            {this.state.errorInfo.componentStack}
                          </pre>
                        )}
                      </div>
                    )}

                    <div className="d-flex gap-3 justify-content-center">
                      <button className="btn btn-primary" onClick={this.handleReset}>
                        Go to Home
                      </button>
                      <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
                        Reload Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
