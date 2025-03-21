'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DashboardContentProps {
  children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.main 
      className="flex-1 w-full p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-transparent to-background-secondary"
      initial={mounted ? { opacity: 0.8 } : false}
      animate={mounted ? { opacity: 1 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full max-w-screen-2xl mx-auto">
        {children}
      </div>
    </motion.main>
  );
} 