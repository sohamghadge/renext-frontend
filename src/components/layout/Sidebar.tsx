import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  Settings,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Shield,
  AlertCircle,
  Home,
  TrendingUp,
  Key,
  AlertTriangle,
  BarChart2,
  LineChart,
  DollarSign,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import {
  UserType,
  ROLE_ACCESSIBLE_TYPES,
  USER_TYPE_LABELS,
  USER_TYPE_CLASSIFICATION,
  PrimaryClassification,
  FUNCTION_ACCESS_ROLES,
} from '@/types';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  userTypes?: UserType[];
  disabled?: boolean;
  path?: string;
}

function getUserTypeIcon(userType: UserType): string {
  const classification = USER_TYPE_CLASSIFICATION[userType].primary;
  switch (classification) {
    case PrimaryClassification.ADMINISTRATION:
      return '🏛️';
    case PrimaryClassification.CITIZENS:
      return '👤';
    case PrimaryClassification.COMMERCIAL:
      return '💼';
    default:
      return '⚙️';
  }
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [usersExpanded, setUsersExpanded] = useState(true);
  const [functionsExpanded, setFunctionsExpanded] = useState(true);
  const [entitiesExpanded, setEntitiesExpanded] = useState(false);

  const accessibleTypes = user
    ? ROLE_ACCESSIBLE_TYPES[user.userType] ?? []
    : [];

  const functionItems = [
    { id: 'RE_REGISTRATION', label: 'RE Registration', path: '/functions/re-registration', icon: <Home size={15} /> },
    { id: 'SALE_TRANSACTION', label: 'Sale Transaction', path: '/functions/sale-transaction', icon: <TrendingUp size={15} /> },
    { id: 'RENTAL_TRANSACTION', label: 'Rental Transaction', path: '/functions/rental-transaction', icon: <Key size={15} /> },
    { id: 'DEVELOPMENT_PERMIT', label: 'Development Permit', path: '/functions/development-permit', icon: <Building2 size={15} /> },
    { id: 'DISPUTE_RESOLUTION', label: 'Dispute Resolution', path: '/functions/dispute-resolution', icon: <AlertTriangle size={15} /> },
    { id: 'FINANCIAL_INTELLIGENCE', label: 'Financial Intelligence', path: '/functions/financial-intelligence', icon: <BarChart2 size={15} /> },
    { id: 'ANALYSIS_HUB', label: 'Analysis Hub', path: '/functions/analysis-hub', icon: <LineChart size={15} /> },
    { id: 'INVESTOR_PORTAL', label: 'Investor Portal', path: '/functions/investor-portal', icon: <DollarSign size={15} /> },
  ].filter(item => user && FUNCTION_ACCESS_ROLES[item.id]?.includes(user.userType));

  const entityItems = [
    { id: 're-records', label: 'RE Records', path: '/entities/re-records', tag: 'Static' },
    { id: 'ownership', label: 'Ownership Records', path: '/entities/ownership', tag: 'Dynamic' },
    { id: 'sale-transactions', label: 'Sale Transactions', path: '/entities/sale-transactions', tag: 'Dynamic' },
    { id: 'rental-transactions', label: 'Rental Transactions', path: '/entities/rental-transactions', tag: 'Dynamic' },
    { id: 'disputes', label: 'Dispute Records', path: '/entities/disputes', tag: 'Dynamic' },
    { id: 'sale-pricing', label: 'Sale Pricing', path: '/entities/sale-pricing', tag: 'Dynamic' },
    { id: 'rental-pricing', label: 'Rental Pricing', path: '/entities/rental-pricing', tag: 'Dynamic' },
    { id: 'brokerage-pricing', label: 'Brokerage Pricing', path: '/entities/brokerage-pricing', tag: 'Dynamic' },
    { id: 'project-records', label: 'Project Records', path: '/entities/project-records', tag: 'Dynamic' },
  ];

    const sections: NavSection[] = [
    {
      id: 'users',
      label: 'Users',
      icon: <Users size={18} />,
      userTypes: accessibleTypes,
    },
    {
      id: 'entities',
      label: 'Entities',
      icon: <Building2 size={18} />,
    },
    {
      id: 'functions',
      label: 'Functions',
      icon: <Settings size={18} />,
    },
  ];

  const currentUserType = location.pathname.split('/users/')[1] as UserType | undefined;

  const handleUserTypeClick = (userType: UserType) => {
    navigate(`/users/${userType}`);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar flex flex-col h-full w-[260px] flex-shrink-0">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
          <span className="text-white font-bold text-lg tracking-tight">R</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none tracking-tight">ReNEXT</h1>
          <p className="text-white/50 text-xs mt-0.5">Real Estate Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Dashboard */}
        <button
          onClick={handleDashboardClick}
          className={clsx(
            'sidebar-item w-full text-left',
            location.pathname === '/dashboard' && 'active'
          )}
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id}>
            {/* Section Header */}
            <button
              onClick={() => {
                if (section.disabled) return;
                if (section.id === 'users') {
                  setUsersExpanded((prev) => !prev);
                } else if (section.id === 'entities') {
                  setEntitiesExpanded((prev) => !prev);
                } else if (section.id === 'functions') {
                  setFunctionsExpanded((prev) => !prev);
                }
              }}
              disabled={section.disabled}
              className={clsx(
                'sidebar-item w-full text-left',
                section.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className="flex-shrink-0">{section.icon}</span>
              <span className="text-sm font-medium flex-1">{section.label}</span>
              {section.disabled && (
                <span className="text-xs text-white/40 font-normal">Soon</span>
              )}
              {!section.disabled && section.id === 'users' && (
                <motion.span
                  animate={{ rotate: usersExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              )}
              {!section.disabled && section.id === 'entities' && (
                <motion.span
                  animate={{ rotate: entitiesExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              )}
              {!section.disabled && section.id === 'functions' && (
                <motion.span
                  animate={{ rotate: functionsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={15} />
                </motion.span>
              )}
            </button>

            {/* User Types Sub-menu */}
            {section.id === 'users' && (
              <AnimatePresence initial={false}>
                {usersExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 ml-3 pl-3 border-l border-white/15 space-y-0.5 pb-1">
                      {accessibleTypes.length === 0 ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-white/40 text-xs">
                          <AlertCircle size={13} />
                          No accessible types
                        </div>
                      ) : (
                        accessibleTypes.map((userType, idx) => {
                          const isActive = currentUserType === userType;
                          return (
                            <motion.button
                              key={userType}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03, duration: 0.2 }}
                              onClick={() => handleUserTypeClick(userType)}
                              className={clsx('sidebar-sub-item w-full text-left', isActive && 'active')}
                            >
                              <span className="text-sm">{getUserTypeIcon(userType)}</span>
                              <span className="truncate">{USER_TYPE_LABELS[userType]}</span>
                              {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
                              )}
                            </motion.button>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Entities Sub-menu */}
            {section.id === 'entities' && (
              <AnimatePresence initial={false}>
                {entitiesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 ml-3 pl-3 border-l border-white/15 space-y-0.5 pb-1">
                      {entityItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02, duration: 0.2 }}
                            onClick={() => navigate(item.path)}
                            className={clsx('sidebar-sub-item w-full text-left', isActive && 'active')}
                          >
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${item.tag === 'Static' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-teal-500/30 text-teal-200'}`}>{item.tag[0]}</span>
                            <span className="truncate text-xs">{item.label}</span>
                            {isActive && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

                        {/* Functions Sub-menu */}
            {section.id === 'functions' && (
              <AnimatePresence initial={false}>
                {functionsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 ml-3 pl-3 border-l border-white/15 space-y-0.5 pb-1">
                      {functionItems.length === 0 ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-white/40 text-xs">
                          <AlertCircle size={13} />
                          No accessible functions
                        </div>
                      ) : (
                        functionItems.map((item, idx) => {
                          const isActive = location.pathname === item.path;
                          return (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03, duration: 0.2 }}
                              onClick={() => navigate(item.path)}
                              className={clsx('sidebar-sub-item w-full text-left', isActive && 'active')}
                            >
                              <span className="text-sm flex-shrink-0">{item.icon}</span>
                              <span className="truncate">{item.label}</span>
                              {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
                              )}
                            </motion.button>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom: User info + Logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield size={14} className="text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-white/50 text-xs truncate">{USER_TYPE_LABELS[user.userType]}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/15"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
