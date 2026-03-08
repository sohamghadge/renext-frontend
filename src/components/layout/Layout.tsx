import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.3,
};

export const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumbs }) => {
  return (
    <div className="flex h-screen overflow-hidden texture-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Header */}
        <Header title={title} breadcrumbs={breadcrumbs} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="h-full"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
