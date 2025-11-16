
import React from 'react';

interface PermissionPillProps {
  name: string;
}

const PermissionPill: React.FC<PermissionPillProps> = ({ name }) => {
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      {name}
    </span>
  );
};

export default PermissionPill;