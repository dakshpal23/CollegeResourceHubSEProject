import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiEye, FiCalendar, FiUser } from 'react-icons/fi';
import FileTypeIcon from '../common/FileTypeIcon';
import formatDate from '../../utils/formatDate';

const ResourceCard = ({ resource }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow card-hover">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {resource.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
              {resource.branch}
            </span>
            <span>•</span>
            <span>{resource.subject}</span>
          </div>
        </div>
        <div className="ml-4">
          <FileTypeIcon fileType={resource.fileType} />
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {resource.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <FiUser className="w-3 h-3" />
          <span>{resource.uploadedBy?.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FiCalendar className="w-3 h-3" />
          <span>{formatDate(resource.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <FiDownload className="w-4 h-4" />
          <span>{resource.downloadCount} downloads</span>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/resources/${resource._id}`}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FiEye className="w-4 h-4 mr-1" />
            View
          </Link>
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <FiDownload className="w-4 h-4 mr-1" />
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default ResourceCard;
