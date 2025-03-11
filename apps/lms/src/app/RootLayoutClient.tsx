'use client';

import { ThemeProvider } from "@/context/ThemeContext";
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <RoleProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </RoleProvider>
    </AuthProvider>
  );
} 