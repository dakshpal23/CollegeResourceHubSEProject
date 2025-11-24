import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceAPI, handleApiError } from '../services/api';
import { 
  FiUpload, 
  FiEye, 
  FiClock, 
  FiCheck, 
  FiX, 
  FiTrash2,
  FiFileText,
  FiCalendar
} from 'react-icons/fi';

/**
 * My Uploads page for students to view their submitted resources
 */
const MyUploads = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  /**
   * Status badge component
   */
  const StatusBadge = ({ status }) => {
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

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  /**
   * Fetch user's uploads
   */
  const fetchMyUploads = async (page = 1) => {
    try {
      setLoading(true);
      const response = await resourceAPI.getMyUploads({ page, limit: 10 });
      setResources(response.data.resources);
      setPagination(response.data.pagination);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyUploads();
  }, []);

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get file type icon
   */
  const getFileIcon = (fileType) => {
    const iconClass = "w-5 h-5";
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FiFileText className={`${iconClass} text-red-500`} />;
      case 'doc':
      case 'docx':
        return <FiFileText className={`${iconClass} text-blue-500`} />;
      case 'ppt':
      case 'pptx':
        return <FiFileText className={`${iconClass} text-orange-500`} />;
      default:
        return <FiFileText className={`${iconClass} text-gray-500`} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Uploads</h1>
            <p className="text-gray-600">
              Track the status of your submitted resources
            </p>
          </div>
          <Link
            to="/upload"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors btn-hover inline-flex items-center"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Upload New
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resources.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resources.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiX className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resources.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources List */}
        {resources.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing your knowledge by uploading your first resource.
            </p>
            <Link
              to="/upload"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors btn-hover inline-flex items-center"
            >
              <FiUpload className="w-4 h-4 mr-2" />
              Upload Resource
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Resources</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {resources.map((resource) => (
                <div key={resource._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getFileIcon(resource.fileType)}
                        <h4 className="text-lg font-semibold text-gray-900">
                          {resource.title}
                        </h4>
                        <StatusBadge status={resource.status} />
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Branch:</span>
                          <span>{resource.branch}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Subject:</span>
                          <span>{resource.subject}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>{formatDate(resource.createdAt)}</span>
                        </div>
                        {resource.status === 'approved' && (
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Downloads:</span>
                            <span>{resource.downloadCount}</span>
                          </div>
                        )}
                      </div>

                      {/* Admin Remark */}
                      {resource.adminRemark && (
                        <div className={`mt-3 p-3 rounded-md ${
                          resource.status === 'approved' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className={`text-sm ${
                            resource.status === 'approved' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            <span className="font-medium">Admin Note:</span> {resource.adminRemark}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-6 flex flex-col space-y-2">
                      {resource.status === 'approved' && (
                        <Link
                          to={`/resources/${resource._id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      )}
                      
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-primary-300 rounded-md text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                      >
                        <FiFileText className="w-4 h-4 mr-1" />
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUploads;