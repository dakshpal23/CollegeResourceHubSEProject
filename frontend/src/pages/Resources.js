import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceAPI, handleApiError } from '../services/api';
import { FiFileText } from 'react-icons/fi';
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceCard from '../components/resources/ResourceCard';
import PaginationControls from '../components/resources/PaginationControls';

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

        <ResourceFilters
          filters={filters}
          branches={branches}
          sortOptions={sortOptions}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>

            <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;