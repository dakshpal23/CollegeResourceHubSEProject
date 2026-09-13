import React from 'react';
import { FiUsers, FiFileText, FiClock, FiDownload } from 'react-icons/fi';

const AdminStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FiFileText className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Resources</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalResources || 0}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <FiClock className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingResources || 0}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <FiUsers className="w-6 h-6 text-green-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Active Students</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <FiDownload className="w-6 h-6 text-purple-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.popularResources?.reduce((sum, resource) => sum + resource.downloadCount, 0) || 0}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminStatsCards;
