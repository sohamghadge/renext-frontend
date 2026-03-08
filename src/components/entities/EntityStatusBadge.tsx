import React from 'react';

interface Props {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EntityStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const colorMap: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    ENCUMBERED: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  const sizeClass =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorMap[status] ?? colorMap['DRAFT']} ${sizeClass}`}
    >
      {status}
    </span>
  );
};
