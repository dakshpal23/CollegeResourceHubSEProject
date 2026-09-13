import React from 'react';
import { FiCheck, FiEye, FiX } from 'react-icons/fi';
import FileTypeIcon from '../common/FileTypeIcon';

const PendingResources = ({ resources, actionLoading, onApprove, onReject }) => (
  <div className="bg-white rounded-lg shadow-sm mb-8">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">
        Pending Resources ({resources.length})
      </h3>
    </div>

    {resources.length === 0 ? (
      <div className="p-12 text-center">
        <FiCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
        <p className="text-gray-600">No resources pending review at the moment.</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-200">
        {resources.map((resource) => (
          <div key={resource._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FileTypeIcon fileType={resource.fileType} />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {resource.title}
                  </h4>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{resource.branch}</span>
                  <span>{resource.uploadedBy?.name}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => window.open(resource.fileUrl, '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    title="Preview uploaded resource"
                  >
                    <FiEye className="w-4 h-4 mr-1" />
                    Preview
                  </button>

                  <button
                    onClick={() => onApprove(resource._id)}
                    disabled={actionLoading[resource._id]}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <FiCheck className="w-4 h-4 mr-1" />
                    Approve
                  </button>

                  <button
                    onClick={() => onReject(resource._id, '')}
                    disabled={actionLoading[resource._id]}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <FiX className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PendingResources;
