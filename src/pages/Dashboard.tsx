import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  TrendingUp,
  Shield,
  ArrowRight,
  Activity,
  MapPin,
  BarChart3,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { DualClassificationTag } from '@/components/common/ClassificationTag';
import {
  USER_TYPE_CLASSIFICATION,
  USER_TYPE_LABELS,
  ROLE_ACCESSIBLE_TYPES,
  UserType,
  PrimaryClassification,
} from '@/types';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    className="liquid-glass p-6 hover-lift"
  >
    <div className="flex items-start justify-between">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: color }}
      >
        <span className="text-white">{icon}</span>
      </div>
      <TrendingUp size={14} className="text-green-500 mt-1" />
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  </motion.div>
);

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  delay?: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  delay = 0,
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.35 }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="liquid-glass p-5 text-left w-full group cursor-pointer"
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
      style={{ background: color }}
    >
      <span className="text-white">{icon}</span>
    </div>
    <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    <div className="flex items-center gap-1 mt-3 text-renext-header opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-xs font-medium">Open</span>
      <ArrowRight size={12} />
    </div>
  </motion.button>
);

function getGroupedUserTypes(
  accessibleTypes: UserType[]
): Record<PrimaryClassification, UserType[]> {
  const groups: Record<PrimaryClassification, UserType[]> = {
    [PrimaryClassification.ADMIN]: [],
    [PrimaryClassification.ADMINISTRATION]: [],
    [PrimaryClassification.CITIZENS]: [],
    [PrimaryClassification.COMMERCIAL]: [],
  };

  accessibleTypes.forEach((type) => {
    const classification = USER_TYPE_CLASSIFICATION[type].primary;
    groups[classification].push(type);
  });

  return groups;
}

const GROUP_COLORS: Record<PrimaryClassification, string> = {
  [PrimaryClassification.ADMIN]: 'linear-gradient(135deg, #ea580c, #f97316)',
  [PrimaryClassification.ADMINISTRATION]: 'linear-gradient(135deg, #f97316, #fb923c)',
  [PrimaryClassification.CITIZENS]: 'linear-gradient(135deg, #16a34a, #22c55e)',
  [PrimaryClassification.COMMERCIAL]: 'linear-gradient(135deg, #2563eb, #3b82f6)',
};

const GROUP_ICONS: Record<PrimaryClassification, React.ReactNode> = {
  [PrimaryClassification.ADMIN]: <Shield size={18} />,
  [PrimaryClassification.ADMINISTRATION]: <Building2 size={18} />,
  [PrimaryClassification.CITIZENS]: <Users size={18} />,
  [PrimaryClassification.COMMERCIAL]: <BarChart3 size={18} />,
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const classification = user ? USER_TYPE_CLASSIFICATION[user.userType] : null;
  const accessibleTypes = user ? ROLE_ACCESSIBLE_TYPES[user.userType] ?? [] : [];
  const groupedTypes = getGroupedUserTypes(accessibleTypes);

  const totalManaged = accessibleTypes.length;
  const groupCount = Object.values(groupedTypes).filter((g) => g.length > 0).length;

  const stats: StatCardProps[] = [
    {
      icon: <Users size={20} />,
      label: 'Manageable User Types',
      value: totalManaged,
      sub: `Across ${groupCount} classification groups`,
      color: 'linear-gradient(135deg, #5d768b, #4a6070)',
      delay: 0,
    },
    {
      icon: <Building2 size={20} />,
      label: 'Active Properties',
      value: '—',
      sub: 'Connect to backend to load',
      color: 'linear-gradient(135deg, #c8b39b, #b09a80)',
      delay: 0.05,
    },
    {
      icon: <Activity size={20} />,
      label: 'System Status',
      value: 'Online',
      sub: 'All services operational',
      color: 'linear-gradient(135deg, #16a34a, #22c55e)',
      delay: 0.1,
    },
    {
      icon: <MapPin size={20} />,
      label: 'Regions Covered',
      value: '—',
      sub: 'Connect to backend to load',
      color: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      delay: 0.15,
    },
  ];

  return (
    <Layout
      title="Dashboard"
      breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
    >
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="liquid-glass p-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back, {user?.name?.split(' ')[0] ?? 'User'} 👋
              </h2>
              <p className="text-gray-500 text-sm max-w-lg">
                You're signed in to the ReNEXT platform. Manage your assigned users, properties, and workflows from this dashboard.
              </p>

              {classification && (
                <div className="mt-4">
                  <DualClassificationTag
                    primary={classification.primary}
                    secondary={classification.secondary}
                    size="md"
                  />
                </div>
              )}
            </div>

            {/* Role badge */}
            {user && (
              <div className="flex-shrink-0">
                <div className="liquid-glass-dark px-5 py-4 text-center">
                  <p className="text-white/70 text-xs mb-1">Your Role</p>
                  <p className="text-white font-bold text-sm">{USER_TYPE_LABELS[user.userType]}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base font-semibold text-gray-700 mb-4"
          >
            Overview
          </motion.h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>

        {/* Quick Actions — User Type Groups */}
        {accessibleTypes.length > 0 && (
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base font-semibold text-gray-700 mb-4"
            >
              User Management — Quick Access
            </motion.h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(Object.entries(groupedTypes) as [PrimaryClassification, UserType[]][])
                .filter(([, types]) => types.length > 0)
                .map(([group, types], idx) => (
                  <QuickActionCard
                    key={group}
                    title={group}
                    description={`${types.length} user type${types.length !== 1 ? 's' : ''}: ${types
                      .slice(0, 2)
                      .map((t) => USER_TYPE_LABELS[t])
                      .join(', ')}${types.length > 2 ? '...' : ''}`}
                    icon={GROUP_ICONS[group]}
                    color={GROUP_COLORS[group]}
                    onClick={() => navigate(`/users/${types[0]}`)}
                    delay={0.25 + idx * 0.06}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Individual User Type Cards */}
        {accessibleTypes.length > 0 && (
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base font-semibold text-gray-700 mb-4"
            >
              All Accessible User Types
            </motion.h3>

            <div className="liquid-glass p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {accessibleTypes.map((userType, idx) => {
                  const c = USER_TYPE_CLASSIFICATION[userType];
                  return (
                    <motion.button
                      key={userType}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + idx * 0.025 }}
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(`/users/${userType}`)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 hover:border-renext-header/30 transition-all duration-200 cursor-pointer text-center group"
                    >
                      <span className="text-2xl">
                        {c.primary === PrimaryClassification.ADMINISTRATION
                          ? '🏛️'
                          : c.primary === PrimaryClassification.CITIZENS
                          ? '👤'
                          : c.primary === PrimaryClassification.COMMERCIAL
                          ? '💼'
                          : '⚙️'}
                      </span>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-renext-header transition-colors leading-tight">
                        {USER_TYPE_LABELS[userType]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
