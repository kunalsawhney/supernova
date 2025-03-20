import * as React from 'react';

export type ToastActionElement = React.ReactElement<{
  onClick: () => void;
}>;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
}; 