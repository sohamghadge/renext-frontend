import React from 'react';

interface Props {
  type: 'Static' | 'Dynamic';
  size?: 'sm' | 'md';
}

export const EntityTypeTag: React.FC<Props> = ({ type, size = 'md' }) => {
  const base = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const colors = type === 'Static'
    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
    : 'bg-teal-100 text-teal-700 border border-teal-200';

  return (
    <span className={`inline-flex items-center font-semibold rounded-md ${base} ${colors}`}>
      {type}
    </span>
  );
};
