'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  delay?: number;
}

export function AnimatedDiv({
  children,
  className,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
  delay = 0,
}: AnimatedDivProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ ...transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
