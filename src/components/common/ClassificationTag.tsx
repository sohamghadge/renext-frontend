import React from 'react';
import { clsx } from 'clsx';
import {
  PrimaryClassification,
  SecondaryClassification,
  ADMIN_SECONDARY_LEVEL,
} from '@/types';

interface ClassificationTagProps {
  classification: PrimaryClassification | SecondaryClassification;
  type: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getPrimaryTagClass(classification: PrimaryClassification): string {
  switch (classification) {
    case PrimaryClassification.ADMIN:
      return 'tag tag-admin-l6';
    case PrimaryClassification.ADMINISTRATION:
      return 'tag tag-admin';
    case PrimaryClassification.CITIZENS:
      return 'tag tag-citizen';
    case PrimaryClassification.COMMERCIAL:
      return 'tag tag-commercial';
    default:
      return 'tag';
  }
}

function getSecondaryTagClass(secondary: SecondaryClassification, primary?: PrimaryClassification): string {
  if (primary === PrimaryClassification.CITIZENS) {
    return 'tag tag-citizen';
  }
  if (primary === PrimaryClassification.COMMERCIAL) {
    return 'tag tag-commercial';
  }
  if (primary === PrimaryClassification.ADMIN) {
    return 'tag tag-admin-l6';
  }

  // Administration: gradient by level
  const level = ADMIN_SECONDARY_LEVEL[secondary] ?? 3;
  return `tag tag-admin-l${level}`;
}

const PRIMARY_DOTS: Record<PrimaryClassification, string> = {
  [PrimaryClassification.ADMIN]: '#c2410c',
  [PrimaryClassification.ADMINISTRATION]: '#f97316',
  [PrimaryClassification.CITIZENS]: '#16a34a',
  [PrimaryClassification.COMMERCIAL]: '#2563eb',
};

export const ClassificationTag: React.FC<ClassificationTagProps> = ({
  classification,
  type,
  size = 'md',
  className,
}) => {
  const sizeClass = clsx({
    'text-xs px-2 py-0.5': size === 'sm',
    'text-xs px-3 py-1': size === 'md',
    'text-sm px-4 py-1.5': size === 'lg',
  });

  if (type === 'primary') {
    const primary = classification as PrimaryClassification;
    const tagClass = getPrimaryTagClass(primary);
    const dotColor = PRIMARY_DOTS[primary];

    return (
      <span className={clsx(tagClass, sizeClass, className)}>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        {classification}
      </span>
    );
  }

  // Secondary tag — we need primary context for correct color
  const secondary = classification as SecondaryClassification;
  const tagClass = getSecondaryTagClass(secondary);

  return (
    <span className={clsx(tagClass, sizeClass, className)}>
      {classification}
    </span>
  );
};

interface DualTagProps {
  primary: PrimaryClassification;
  secondary: SecondaryClassification;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DualClassificationTag: React.FC<DualTagProps> = ({
  primary,
  secondary,
  size = 'md',
  className,
}) => {
  const primaryTagClass = getPrimaryTagClass(primary);
  const secondaryTagClass = getSecondaryTagClass(secondary, primary);
  const dotColor = PRIMARY_DOTS[primary];

  const sizeClass = clsx({
    'text-xs px-2 py-0.5': size === 'sm',
    'text-xs px-3 py-1': size === 'md',
    'text-sm px-4 py-1.5': size === 'lg',
  });

  return (
    <div className={clsx('flex flex-wrap items-center gap-1.5', className)}>
      <span className={clsx(primaryTagClass, sizeClass)}>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        {primary}
      </span>
      <span className={clsx(secondaryTagClass, sizeClass)}>{secondary}</span>
    </div>
  );
};
