declare module 'framer-motion' {
  export const motion: {
    [key: string]: any;
  };
  export const AnimatePresence: React.FC<{
    initial?: boolean;
    mode?: 'sync' | 'wait' | 'popLayout';
    onExitComplete?: () => void;
    children?: React.ReactNode;
  }>;
  export type Transition = {
    type?: string;
    stiffness?: number;
    damping?: number;
    mass?: number;
    duration?: number;
    delay?: number;
    ease?: string | number[];
  };
} 