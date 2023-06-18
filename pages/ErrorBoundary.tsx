import React, { ReactNode } from 'react';

type ErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * 
 * 예제 코드
 * <ErrorBoundary fallback={<Image src='/public/images/logo3.png' alt="profile" width={60} height={60} />}>
    <Suspense fallback={<p>loading...</p>}>
      <Image src='/public/images/dd.jpg' alt="profile" width={60} height={60} />
    </Suspense>
  </ErrorBoundary>
 * 
 */