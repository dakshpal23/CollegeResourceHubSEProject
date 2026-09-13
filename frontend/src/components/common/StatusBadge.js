import React from 'react';
import { FiCheck, FiClock, FiX } from 'react-icons/fi';

const statusConfig = {
  pending: {
    icon: FiClock,
    text: 'Pending Review',
    className: 'bg-yellow-100 text-yellow-800'
  },
  approved: {
    icon: FiCheck,
    text: 'Approved',
    className: 'bg-green-100 text-green-800'
  },
  rejected: {
    icon: FiX,
    text: 'Rejected',
    className: 'bg-red-100 text-red-800'
  }
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
};

export default StatusBadge;
