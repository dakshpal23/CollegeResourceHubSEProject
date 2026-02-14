import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resourceAPI, handleApiError } from '../services/api';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiCalendar,
  FiUser,
  FiFileText,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * Resources listing page with search and filters
 */
const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    branch: searchParams.get('branch') || 'all',
    subject: searchParams.get('subject') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  /**
   * Branch options
   */
  const branches = [
    { value: 'all', label: 'All Branches' },
    { value: 'CSE', label: 'Computer Science' },
    { value: 'ECE', label: 'Electronics' },
    { value: 'ME', label: 'Mechanical' },
    { value: 'EE', label: 'Electrical' },
    { value: 'CE', label: 'Civil' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'Other', label: 'Other' }
  ];

  /**
   * Sort options
   */
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'title', label: 'Title A-Z' }
  ];

  /**
   * Fetch resources based on current filters
   */
  const fetchResources = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await resourceAPI.getApproved(params);
      setResources(response.data.resources);
      setPagination(response.data.pagination);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update URL params when filters change
   */
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  /**
   * Fetch resources when filters change
   */
  useEffect(() => {
    fetchResources();
  }, [filters]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    fetchResources(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Academic Resources
          </h1>
          <p className="text-gray-600">
            Discover and download quality academic materials shared by students
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </form>
            </div>

            {/* Branch Filter */}
            <div>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {branches.map(branch => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Filter by subject..."
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {resources.length} of {pagination.total} resources
              </p>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <div key={resource._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow card-hover">
                  <div className="p-6">
                    {/* Header */}
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
                        {getFileIcon(resource.fileType)}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    {/* Meta Info */}
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

                    {/* Actions */}
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
                          Details
                        </Link>
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                        >
                          <FiDownload className="w-4 h-4 mr-1" />
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FiChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;