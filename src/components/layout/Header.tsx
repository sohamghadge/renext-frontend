import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Bell, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DualClassificationTag } from '@/components/common/ClassificationTag';
import { USER_TYPE_CLASSIFICATION } from '@/types';

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export const Header: React.FC<HeaderProps> = ({ title, breadcrumbs }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const classification = user ? USER_TYPE_CLASSIFICATION[user.userType] : null;

  const initials = user
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header className="app-header h-16 flex items-center justify-between px-6 flex-shrink-0 relative z-10">
      {/* Left: Title + Breadcrumbs */}
      <div className="flex flex-col justify-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-0.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={11} className="text-gray-300" />}
                {crumb.path ? (
                  <button
                    onClick={() => navigate(crumb.path!)}
                    className="text-gray-400 hover:text-renext-header text-xs transition-colors font-medium"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h2 className="text-gray-900 font-bold text-lg leading-tight tracking-tight">{title}</h2>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-renext-header/8 flex items-center justify-center transition-colors border border-transparent hover:border-renext-header/12"
          aria-label="Search"
        >
          <Search size={16} className="text-gray-500" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-renext-header/8 flex items-center justify-center transition-colors relative border border-transparent hover:border-renext-header/12"
          aria-label="Notifications"
        >
          <Bell size={16} className="text-gray-500" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-400 border-2 border-white" />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User Profile Button */}
        {user && classification && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 hover:bg-renext-header/6 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-renext-header/20"
            aria-label="View profile"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-renext-header flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>

            {/* Name + Tags */}
            <div className="flex flex-col items-start gap-1 min-w-0">
              <span className="text-gray-900 text-sm font-semibold leading-none truncate max-w-[140px]">
                {user.name}
              </span>
              <DualClassificationTag
                primary={classification.primary}
                secondary={classification.secondary}
                size="sm"
              />
            </div>
          </motion.button>
        )}
      </div>
    </header>
  );
};
