'use client';

import { Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ShellProvider } from '@/contexts/ShellContext';
import { Spinner } from '@/components/ui/spinner';

// LoadingFallback for Suspense
function LoadingFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// Error Boundary component
function ErrorBoundary({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="rounded-lg border bg-card p-8 shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-destructive mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {error && (
            <div className="bg-muted p-4 rounded-md overflow-auto mb-4">
              <p className="font-mono text-xs">{error.message}</p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RoleProvider>
          <ShellProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense fallback={<LoadingFallback />}>
                {children}
              </Suspense>
            </ThemeProvider>
          </ShellProvider>
        </RoleProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 