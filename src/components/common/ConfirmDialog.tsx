import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const variantStyles = {
    danger: {
      icon: 'text-red-500',
      iconBg: 'bg-red-50',
      btn: 'btn-danger',
    },
    warning: {
      icon: 'text-amber-500',
      iconBg: 'bg-amber-50',
      btn: 'bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-3 font-semibold',
    },
    info: {
      icon: 'text-blue-500',
      iconBg: 'bg-blue-50',
      btn: 'btn-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="liquid-glass-strong w-full max-w-md p-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 btn-icon"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-5`}>
              <AlertTriangle className={styles.icon} size={26} />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">{message}</p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="btn-secondary"
                disabled={isLoading}
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={styles.btn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" color="white" />
                    Processing...
                  </span>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
