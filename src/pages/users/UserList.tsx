import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  AlertCircle,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Layout } from '@/components/layout/Layout';
import { DualClassificationTag } from '@/components/common/ClassificationTag';
import { TableSkeleton } from '@/components/common/LoadingSpinner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { UserForm } from './UserForm';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import {
  UserType,
  UserStatus,
  USER_TYPE_LABELS,
  USER_TYPE_CLASSIFICATION,
  ROLE_ACCESSIBLE_TYPES,
  type User,
} from '@/types';

const PAGE_SIZE = 15;

function getStatusBadge(status: UserStatus) {
  const configs: Record<UserStatus, { cls: string; dot: string }> = {
    [UserStatus.ACTIVE]: { cls: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
    [UserStatus.INACTIVE]: { cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
    [UserStatus.SUSPENDED]: { cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    [UserStatus.PENDING]: { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  };
  const { cls, dot } = configs[status] ?? configs[UserStatus.INACTIVE];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cls)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', dot)} />
      {status}
    </span>
  );
}

// User Row
const UserRow: React.FC<{
  user: User;
  index: number;
  canDelete: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ user, index, canDelete, onEdit, onDelete }) => {
  const classification = USER_TYPE_CLASSIFICATION[user.userType];

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="group"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-renext-header/10 flex items-center justify-center flex-shrink-0">
            <span className="text-renext-header text-xs font-bold">
              {user.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-gray-700">{user.contactNumber}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-gray-700 truncate max-w-[160px]">{user.email}</p>
      </td>
      <td className="px-5 py-4">
        <DualClassificationTag
          primary={classification.primary}
          secondary={classification.secondary}
          size="sm"
        />
      </td>
      <td className="px-5 py-4">{getStatusBadge(user.status)}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(user)}
            className="btn-icon w-8 h-8 text-renext-header"
            aria-label={`Edit ${user.name}`}
          >
            <Edit3 size={14} />
          </motion.button>
          {canDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(user)}
              className="btn-icon w-8 h-8 text-red-500 hover:bg-red-50"
              aria-label={`Delete ${user.name}`}
            >
              <Trash2 size={14} />
            </motion.button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// Pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i;
    if (currentPage < 4) return i;
    if (currentPage >= totalPages - 3) return totalPages - 7 + i;
    return currentPage - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={clsx('pagination-btn', page === currentPage && 'active')}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page + 1}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page + 1}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export const UserList: React.FC = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const deleteUser = useDeleteUser();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<User | undefined>();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const resolvedUserType = userType as UserType | undefined;

  // Authorization check
  const accessibleTypes = currentUser
    ? ROLE_ACCESSIBLE_TYPES[currentUser.userType] ?? []
    : [];

  const isAuthorized =
    resolvedUserType && accessibleTypes.includes(resolvedUserType);

  const { data, isLoading, isError, refetch } = useUsers(
    resolvedUserType && isAuthorized
      ? {
          userType: resolvedUserType,
          page,
          size: PAGE_SIZE,
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
        }
      : {}
  );

  // Redirect if user type invalid or not authorized
  React.useEffect(() => {
    if (resolvedUserType && !Object.values(UserType).includes(resolvedUserType)) {
      navigate('/dashboard', { replace: true });
    }
  }, [resolvedUserType, navigate]);

  if (!resolvedUserType) {
    return (
      <Layout title="Users">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No user type selected.</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthorized) {
    return (
      <Layout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 text-sm text-center max-w-sm">
            You don't have permission to manage {USER_TYPE_LABELS[resolvedUserType]} users.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-2">
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const users = data?.content ?? [];

  const handleAddUser = () => {
    setFormMode('add');
    setEditingUser(undefined);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setFormMode('edit');
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteUser.mutateAsync(deleteTarget.id);
    setDeleteTarget(undefined);
  };

  const classification = USER_TYPE_CLASSIFICATION[resolvedUserType];

  return (
    <Layout
      title={USER_TYPE_LABELS[resolvedUserType]}
      breadcrumbs={[
        { label: 'Home', path: '/dashboard' },
        { label: 'Users' },
        { label: USER_TYPE_LABELS[resolvedUserType] },
      ]}
    >
      <div className="p-6 space-y-4 max-w-full">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-renext-header/10 flex items-center justify-center">
              <Users size={20} className="text-renext-header" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {USER_TYPE_LABELS[resolvedUserType]}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <DualClassificationTag
                  primary={classification.primary}
                  secondary={classification.secondary}
                  size="sm"
                />
                {!isLoading && (
                  <span className="text-xs text-gray-400">
                    {totalElements} {totalElements === 1 ? 'user' : 'users'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              className="btn-icon w-9 h-9"
              aria-label="Refresh"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilterPanel((p) => !p)}
              className={clsx(
                'btn-icon w-9 h-9',
                (statusFilter || showFilterPanel) && 'bg-renext-header/10 text-renext-header border-renext-header/30'
              )}
              aria-label="Filter"
            >
              <Filter size={15} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddUser}
              className="btn-primary py-2.5 px-5"
            >
              <Plus size={16} />
              Add User
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="liquid-glass p-4 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status:</span>
                {['', UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED, UserStatus.PENDING].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(0);
                      }}
                      className={clsx(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                        statusFilter === status
                          ? 'bg-renext-header text-white border-renext-header shadow-card'
                          : 'bg-white/60 text-gray-600 border-gray-200 hover:border-renext-header/40'
                      )}
                    >
                      {status || 'All'}
                    </button>
                  )
                )}

                {statusFilter && (
                  <button
                    onClick={() => {
                      setStatusFilter('');
                      setPage(0);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium ml-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search + Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass overflow-hidden"
        >
          {/* Search bar */}
          <div className="px-5 py-4 border-b border-white/30">
            <div className="relative max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder={`Search ${USER_TYPE_LABELS[resolvedUserType]}s by name, email...`}
                className="form-input pl-10 py-2.5 text-sm"
                aria-label="Search users"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[700px]">
              <thead>
                <tr className="bg-renext-bg/30">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Classification</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton rows={8} cols={6} />
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle size={32} className="text-red-400" />
                        <p className="text-gray-500 text-sm">Failed to load users.</p>
                        <button onClick={() => refetch()} className="btn-secondary py-2 px-4 text-sm">
                          <RefreshCw size={14} />
                          Try again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-renext-card/30 flex items-center justify-center">
                          <Users size={24} className="text-renext-header/50" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">
                          {debouncedSearch || statusFilter
                            ? 'No users match your search'
                            : `No ${USER_TYPE_LABELS[resolvedUserType]} users yet`}
                        </p>
                        {!debouncedSearch && !statusFilter && (
                          <button onClick={handleAddUser} className="btn-primary py-2 px-5 text-sm mt-1">
                            <Plus size={15} />
                            Add First User
                          </button>
                        )}
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      index={idx}
                      canDelete={true}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-white/30 px-5">
              <div className="flex items-center justify-between py-3">
                <p className="text-xs text-gray-500">
                  Showing {page * PAGE_SIZE + 1}–
                  {Math.min((page + 1) * PAGE_SIZE, totalElements)} of {totalElements} users
                </p>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* User Form Modal */}
      <UserForm
        isOpen={formOpen}
        mode={formMode}
        userType={resolvedUserType}
        editUser={editingUser}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(undefined);
        }}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name ?? 'this user'}? This action cannot be undone.`}
        confirmLabel="Delete User"
        variant="danger"
        isLoading={deleteUser.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(undefined)}
      />
    </Layout>
  );
};
