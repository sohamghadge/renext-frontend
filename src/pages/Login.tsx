import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.username.trim()) {
    errors.username = 'Username is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }
  return errors;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
};

export const Login: React.FC = () => {
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
    if (error) clearError();
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { username: true, password: true };
    setTouched(allTouched);
    const fieldErrors = validate(form);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) return;

    try {
      await login({ username: form.username.trim(), password: form.password });
      navigate('/dashboard', { replace: true });
    } catch {
      // Error is handled by authStore and shown via `error` state
    }
  };

  return (
    <div className="min-h-screen texture-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(26,58,107,0.11) 0%, transparent 68%)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,179,155,0.28) 0%, transparent 68%)' }}
          animate={{ scale: [1, 1.10, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(26,58,107,0.06) 0%, transparent 70%)' }}
          animate={{ y: [-24, 24, -24], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className="liquid-glass-strong w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.1 }}
      >
        <div className="p-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo + Branding */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-renext-header flex items-center justify-center shadow-card mb-4">
                <Building2 size={30} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">ReNEXT</h1>
              <p className="text-sm text-gray-500 mt-1 text-center">
                AI-Native Real Estate Management Platform
              </p>
            </motion.div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <motion.div variants={itemVariants} className="mb-5">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  onBlur={() => handleBlur('username')}
                  className="form-input"
                  placeholder="Enter your username"
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  aria-invalid={Boolean(errors.username)}
                />
                <AnimatePresence>
                  {errors.username && touched.username && (
                    <motion.p
                      id="username-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="form-error"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-7">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className="form-input pr-12"
                    placeholder="Enter your password"
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && touched.password && (
                    <motion.p
                      id="password-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="form-error"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.p
              variants={itemVariants}
              className="text-center text-xs text-gray-400 mt-8"
            >
              ReNEXT &copy; {new Date().getFullYear()} &middot; All rights reserved
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
