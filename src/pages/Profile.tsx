import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  User,
  AtSign,
  Calendar,
  Shield,
  Edit3,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { DualClassificationTag } from '@/components/common/ClassificationTag';
import { USER_TYPE_CLASSIFICATION, USER_TYPE_LABELS, UserStatus } from '@/types';

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/40 border border-white/50">
    <div className="w-9 h-9 rounded-lg bg-renext-header/10 flex items-center justify-center flex-shrink-0">
      <span className="text-renext-header">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || '—'}</p>
    </div>
  </div>
);

function getStatusStyles(status: UserStatus): { bg: string; text: string; dot: string } {
  switch (status) {
    case UserStatus.ACTIVE:
      return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' };
    case UserStatus.INACTIVE:
      return { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };
    case UserStatus.SUSPENDED:
      return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
    case UserStatus.PENDING:
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 280 } },
};

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout title="Profile">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">User data not available.</p>
        </div>
      </Layout>
    );
  }

  const classification = USER_TYPE_CLASSIFICATION[user.userType];
  const statusStyles = getStatusStyles(user.status);
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const formattedDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Layout
      title="My Profile"
      breadcrumbs={[
        { label: 'Home', path: '/dashboard' },
        { label: 'Profile' },
      ]}
    >
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Back button */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-renext-header hover:text-renext-header-dark text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </motion.div>

          {/* Profile Hero Card */}
          <motion.div variants={itemVariants} className="liquid-glass overflow-hidden">
            {/* Cover gradient */}
            <div
              className="h-28 w-full"
              style={{
                background:
                  'linear-gradient(135deg, #5d768b 0%, #4a6070 40%, #c8b39b 100%)',
              }}
            />

            {/* Avatar + Info */}
            <div className="px-8 pb-8 -mt-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                {/* Avatar */}
                <div className="flex items-end gap-5">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-2xl bg-white shadow-card-hover border-4 border-white flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-renext-header text-2xl font-bold">{initials}</span>
                  </motion.div>

                  <div className="mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">@{user.username}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 sm:mb-1">
                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles.bg} ${statusStyles.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                    {user.status}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-secondary py-2 px-4 text-sm"
                    onClick={() => {
                      // Edit profile — future implementation
                    }}
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </motion.button>
                </div>
              </div>

              {/* Classifications */}
              <div className="mt-5 pt-5 border-t border-renext-card/30 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-renext-header" />
                  <span className="text-xs text-gray-500 font-medium">Role:</span>
                  <span className="text-xs font-semibold text-gray-800">
                    {USER_TYPE_LABELS[user.userType]}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <DualClassificationTag
                  primary={classification.primary}
                  secondary={classification.secondary}
                  size="sm"
                />
              </div>
            </div>
          </motion.div>

          {/* Detail Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="liquid-glass p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-renext-header/10 flex items-center justify-center">
                  <User size={13} className="text-renext-header" />
                </span>
                Contact Information
              </h3>
              <div className="space-y-3">
                <ProfileField icon={<Mail size={16} />} label="Email Address" value={user.email} />
                <ProfileField
                  icon={<Phone size={16} />}
                  label="Contact Number"
                  value={user.contactNumber}
                />
                <ProfileField
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={user.address}
                />
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div variants={itemVariants} className="liquid-glass p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-renext-header/10 flex items-center justify-center">
                  <Shield size={13} className="text-renext-header" />
                </span>
                Account Details
              </h3>
              <div className="space-y-3">
                <ProfileField
                  icon={<AtSign size={16} />}
                  label="Username"
                  value={user.username}
                />
                <ProfileField
                  icon={<Shield size={16} />}
                  label="User Type"
                  value={USER_TYPE_LABELS[user.userType]}
                />
                <ProfileField
                  icon={<Calendar size={16} />}
                  label="Member Since"
                  value={user.createdAt ? formattedDate(user.createdAt) : 'N/A'}
                />
              </div>
            </motion.div>
          </div>

          {/* Classification Detail Card */}
          <motion.div variants={itemVariants} className="liquid-glass p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-renext-header/10 flex items-center justify-center">
                <Shield size={13} className="text-renext-header" />
              </span>
              Classification & Access Level
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Primary Classification */}
              <div className="p-4 rounded-xl bg-white/50 border border-white/60 text-center">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                  Primary Classification
                </p>
                <DualClassificationTag
                  primary={classification.primary}
                  secondary={classification.secondary}
                  size="md"
                />
              </div>

              {/* Secondary Classification */}
              <div className="p-4 rounded-xl bg-white/50 border border-white/60 text-center">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                  Secondary Classification
                </p>
                <span className="text-sm font-semibold text-gray-800">
                  {classification.secondary}
                </span>
              </div>

              {/* Account Status */}
              <div className="p-4 rounded-xl bg-white/50 border border-white/60 text-center">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                  Account Status
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyles.bg} ${statusStyles.text}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
                  {user.status}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};
