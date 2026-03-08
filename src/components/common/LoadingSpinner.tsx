import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'card';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-16 h-16',
};

const colorMap = {
  primary: 'border-renext-header border-t-transparent',
  white: 'border-white border-t-transparent',
  card: 'border-renext-card border-t-transparent',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  return (
    <motion.div
      className={clsx(
        'rounded-full border-2 animate-spin',
        sizeMap[size],
        colorMap[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
};

interface FullPageLoaderProps {
  message?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center texture-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="liquid-glass-strong px-12 py-10 flex flex-col items-center gap-5"
      >
        {/* Logo mark */}
        <div className="w-12 h-12 rounded-2xl bg-renext-header flex items-center justify-center shadow-card">
          <span className="text-white font-bold text-xl tracking-tight">R</span>
        </div>

        {/* Spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-renext-card/40" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-renext-header border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <p className="text-sm font-medium text-renext-header">{message}</p>
      </motion.div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  if (lines === 1) {
    return <div className={clsx('skeleton h-4', className)} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx('skeleton h-4', i === lines - 1 && 'w-3/4', className)}
        />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-renext-card/20">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-4">
              <div className={clsx('skeleton h-4', colIdx === 0 ? 'w-36' : 'w-24')} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
