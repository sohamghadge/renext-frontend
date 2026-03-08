import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, AtSign, Lock, ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  UserType,
  UserStatus,
  PrimaryClassification,
  SecondaryClassification,
  USER_TYPE_LABELS,
  USER_TYPE_CLASSIFICATION,
  type User as UserData,
  type CreateUserPayload,
  type UpdateUserPayload,
} from '@/types';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';

interface UserFormProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  userType: UserType;
  editUser?: UserData;
  onClose: () => void;
}

interface FormValues {
  name: string;
  username: string;
  email: string;
  contactNumber: string;
  address: string;
  password: string;
  primaryClassification: PrimaryClassification;
  secondaryClassification: SecondaryClassification;
  status: UserStatus;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  password?: string;
}

function getDefaultClassification(userType: UserType) {
  return USER_TYPE_CLASSIFICATION[userType];
}

function buildInitialValues(userType: UserType, editUser?: UserData): FormValues {
  const defaults = getDefaultClassification(userType);
  if (editUser) {
    return {
      name: editUser.name,
      username: editUser.username,
      email: editUser.email,
      contactNumber: editUser.contactNumber,
      address: editUser.address,
      password: '',
      primaryClassification: editUser.primaryClassification,
      secondaryClassification: editUser.secondaryClassification,
      status: editUser.status,
    };
  }
  return {
    name: '',
    username: '',
    email: '',
    contactNumber: '',
    address: '',
    password: '',
    primaryClassification: defaults.primary,
    secondaryClassification: defaults.secondary,
    status: UserStatus.ACTIVE,
  };
}

function validate(values: FormValues, mode: 'add' | 'edit'): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = 'Full name is required';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (mode === 'add') {
    if (!values.username.trim()) errors.username = 'Username is required';
    else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(values.username.trim()))
      errors.username = 'Username must be 3–30 characters (letters, numbers, . _ -)';
  }

  if (!values.email.trim()) errors.email = 'Email address is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address';

  if (!values.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
  else if (!/^[+\d\s\-()]{7,15}$/.test(values.contactNumber.trim()))
    errors.contactNumber = 'Please enter a valid contact number';

  if (!values.address.trim()) errors.address = 'Address is required';
  else if (values.address.trim().length < 5) errors.address = 'Address must be at least 5 characters';

  if (mode === 'add') {
    if (!values.password) errors.password = 'Password is required';
    else if (values.password.length < 8)
      errors.password = 'Password must be at least 8 characters';
  }

  return errors;
}

// Custom Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label, disabled }) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={clsx(
          'form-input flex items-center justify-between gap-2 text-left',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className="truncate text-gray-800">{selectedOption?.label ?? 'Select...'}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1 left-0 right-0 liquid-glass-strong py-1.5 max-h-52 overflow-y-auto"
            role="listbox"
            aria-label={label}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={clsx(
                  'w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors',
                  option.value === value
                    ? 'bg-renext-header/10 text-renext-header font-medium'
                    : 'text-gray-700 hover:bg-white/50'
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && <Check size={14} className="flex-shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Field wrapper
interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, error, required, children }) => (
  <div>
    <label className="form-label">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          className="form-error"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const STATUS_OPTIONS: SelectOption[] = [
  { value: UserStatus.ACTIVE, label: 'Active' },
  { value: UserStatus.INACTIVE, label: 'Inactive' },
  { value: UserStatus.SUSPENDED, label: 'Suspended' },
  { value: UserStatus.PENDING, label: 'Pending' },
];

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  mode,
  userType,
  editUser,
  onClose,
}) => {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [values, setValues] = useState<FormValues>(() =>
    buildInitialValues(userType, editUser)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  // Reset form when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      setValues(buildInitialValues(userType, editUser));
      setErrors({});
      setTouched({});
    }
  }, [isOpen, userType, editUser]);

  const setField = useCallback(<K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      // Live validation — use functional update to avoid stale closure
      setErrors((prevErrors) => {
        const newErrors = validate(next, mode);
        return { ...prevErrors, [field]: newErrors[field as keyof FormErrors] };
      });
      return next;
    });
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, [mode]);

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setValues((currentValues) => {
      const fieldErrors = validate(currentValues, mode);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FormErrors] }));
      return currentValues;
    });
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Partial<Record<keyof FormValues, boolean>> = {
      name: true,
      username: true,
      email: true,
      contactNumber: true,
      address: true,
      password: true,
    };
    setTouched(allTouched);

    const fieldErrors = validate(values, mode);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    try {
      if (mode === 'add') {
        const payload: CreateUserPayload = {
          name: values.name.trim(),
          username: values.username.trim(),
          email: values.email.trim(),
          contactNumber: values.contactNumber.trim(),
          address: values.address.trim(),
          password: values.password,
          userType,
          primaryClassification: values.primaryClassification,
          secondaryClassification: values.secondaryClassification,
          status: values.status,
        };
        await createUser.mutateAsync(payload);
      } else if (editUser) {
        const payload: UpdateUserPayload = {
          name: values.name.trim(),
          email: values.email.trim(),
          contactNumber: values.contactNumber.trim(),
          address: values.address.trim(),
          primaryClassification: values.primaryClassification,
          secondaryClassification: values.secondaryClassification,
          status: values.status,
        };
        await updateUser.mutateAsync({ id: editUser.id, payload });
      }
      onClose();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) onClose();
          }}
        >
          <motion.div
            className="liquid-glass-strong w-full max-w-2xl max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 24, stiffness: 380 }}
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'add' ? 'Add User' : 'Edit User'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/30 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === 'add' ? 'Add New User' : 'Edit User'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {USER_TYPE_LABELS[userType]}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-icon"
                aria-label="Close form"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Form Body — scrollable */}
            <form
              id="user-form"
              onSubmit={handleSubmit}
              noValidate
              className="flex-1 overflow-y-auto px-8 py-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <Field label="Full Name" error={touched.name ? errors.name : undefined} required>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={values.name}
                      onChange={(e) => setField('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      className="form-input pl-10"
                      placeholder="Enter full name"
                      aria-invalid={Boolean(touched.name && errors.name)}
                    />
                  </div>
                </Field>

                {/* Username */}
                <Field
                  label="Username"
                  error={touched.username ? errors.username : undefined}
                  required={mode === 'add'}
                >
                  <div className="relative">
                    <AtSign
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={values.username}
                      onChange={(e) => mode === 'add' && setField('username', e.target.value)}
                      onBlur={() => handleBlur('username')}
                      className="form-input pl-10"
                      placeholder={mode === 'edit' ? 'Cannot be changed' : 'Enter username'}
                      disabled={mode === 'edit'}
                      aria-invalid={Boolean(touched.username && errors.username)}
                    />
                  </div>
                </Field>

                {/* Email */}
                <Field
                  label="Email Address"
                  error={touched.email ? errors.email : undefined}
                  required
                >
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      value={values.email}
                      onChange={(e) => setField('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className="form-input pl-10"
                      placeholder="user@example.com"
                      aria-invalid={Boolean(touched.email && errors.email)}
                    />
                  </div>
                </Field>

                {/* Contact Number */}
                <Field
                  label="Contact Number"
                  error={touched.contactNumber ? errors.contactNumber : undefined}
                  required
                >
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="tel"
                      value={values.contactNumber}
                      onChange={(e) => setField('contactNumber', e.target.value)}
                      onBlur={() => handleBlur('contactNumber')}
                      className="form-input pl-10"
                      placeholder="+91 98765 43210"
                      aria-invalid={Boolean(touched.contactNumber && errors.contactNumber)}
                    />
                  </div>
                </Field>

                {/* Address */}
                <Field
                  label="Address"
                  error={touched.address ? errors.address : undefined}
                  required
                >
                  <div className="relative sm:col-span-2">
                    <MapPin
                      size={15}
                      className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                    />
                    <textarea
                      value={values.address}
                      onChange={(e) => setField('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      className="form-input pl-10 resize-none"
                      placeholder="Enter full address"
                      rows={2}
                      aria-invalid={Boolean(touched.address && errors.address)}
                    />
                  </div>
                </Field>

                {/* Password (add mode only) */}
                {mode === 'add' && (
                  <Field
                    label="Password"
                    error={touched.password ? errors.password : undefined}
                    required
                  >
                    <div className="relative">
                      <Lock
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="password"
                        value={values.password}
                        onChange={(e) => setField('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className="form-input pl-10"
                        placeholder="Minimum 8 characters"
                        aria-invalid={Boolean(touched.password && errors.password)}
                      />
                    </div>
                  </Field>
                )}

                {/* Status */}
                <Field label="Account Status">
                  <CustomSelect
                    options={STATUS_OPTIONS}
                    value={values.status}
                    onChange={(val) => setField('status', val as UserStatus)}
                    label="Account Status"
                  />
                </Field>
              </div>

              {/* Classification Info (read-only display) */}
              <div className="mt-5 p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                  Classification (auto-assigned by user type)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Primary</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {values.primaryClassification}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Secondary</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {values.secondaryClassification}
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-white/30 flex-shrink-0">
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                form="user-form"
                disabled={isSubmitting}
                className="btn-primary"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    {mode === 'add' ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  <>{mode === 'add' ? 'Create User' : 'Save Changes'}</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
