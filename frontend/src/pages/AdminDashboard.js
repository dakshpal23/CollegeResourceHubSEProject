import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceAPI, announcementAPI, handleApiError } from '../services/api';
import { 
  FiUsers, 
  FiFileText, 
  FiClock, 
  FiCheck, 
  FiX, 
  FiEye,
  FiDownload,
  FiCalendar,
  FiUser,
  FiUpload,
  FiMegaphone
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * Admin Dashboard for managing resources and viewing stats
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingResources, setPendingResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [announcementData, setAnnouncementData] = useState({ title: '', content: '', file: null });
  const [uploadData, setUploadData] = useState({ title: '', description: '', branch: '', file: null });

  /**
   * Fetch dashboard data
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, pendingResponse, announcementsResponse] = await Promise.all([
        resourceAPI.getStats(),
        resourceAPI.getPending({ limit: 10 }),
        announcementAPI.getAll()
      ]);
      
      setStats(statsResponse.data.stats);
      setPendingResources(pendingResponse.data.resources);
      setAnnouncements(announcementsResponse.data.announcements);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle announcement creation
   */
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      if (announcementData.file) {
        const formData = new FormData();
        formData.append('title', announcementData.title);
        formData.append('content', announcementData.content);
        formData.append('file', announcementData.file);
        await announcementAPI.createWithFile(formData);
      } else {
        await announcementAPI.create(announcementData.title, announcementData.content);
      }
      toast.success('Announcement created successfully!');
      setShowAnnouncementForm(false);
      setAnnouncementData({ title: '', content: '', file: null });
      fetchDashboardData();
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * Handle admin resource upload
   */
  const handleAdminUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('branch', uploadData.branch);
      formData.append('file', uploadData.file);

      await resourceAPI.adminUpload(formData);
      toast.success('Resource uploaded successfully!');
      setShowUploadForm(false);
      setUploadData({ title: '', description: '', branch: '',  file: null });
      fetchDashboardData();
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * Delete announcement
   */
  const handleDeleteAnnouncement = async (id) => {
    try {
      await announcementAPI.delete(id);
      toast.success('Announcement deleted!');
      fetchDashboardData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-open modals based on URL params
    const action = searchParams.get('action');
    if (action === 'upload') {
      setShowUploadForm(true);
    } else if (action === 'announcement') {
      setShowAnnouncementForm(true);
    }
  }, [searchParams]);

  /**
   * Handle resource approval
   */
  const handleApprove = async (resourceId, remark = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [resourceId]: 'approving' }));
      await resourceAPI.approve(resourceId, remark);
      
      // Update local state
      setPendingResources(prev => 
        prev.filter(resource => resource._id !== resourceId)
      );
      
      toast.success('Resource approved successfully!');
      
      // Refresh stats
      fetchDashboardData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [resourceId]: null }));
    }
  };

  /**
   * Handle resource rejection
   */
  const handleReject = async (resourceId, remark) => {
    if (!remark.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [resourceId]: 'rejecting' }));
      await resourceAPI.reject(resourceId, remark);
      
      // Update local state
      setPendingResources(prev => 
        prev.filter(resource => resource._id !== resourceId)
      );
      
      toast.success('Resource rejected successfully!');
      
      // Refresh stats
      fetchDashboardData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [resourceId]: null }));
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-24"></div>
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage resources and monitor platform activity
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAnnouncementForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                New Announcement
              </button>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Upload Resource
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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
                  {stats.popularResources?.reduce((sum, r) => sum + r.downloadCount, 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Resources */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Resources ({pendingResources.length})
            </h3>
          </div>
          
          {pendingResources.length === 0 ? (
            <div className="p-12 text-center">
              <FiCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
              <p className="text-gray-600">No resources pending review at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingResources.map((resource) => (
                <div key={resource._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getFileIcon(resource.fileType)}
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

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">

                        
                        <button
                          onClick={() => handleApprove(resource._id)}
                          disabled={actionLoading[resource._id]}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          <FiCheck className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        
                        <button
                          onClick={() => {
                            const remark = prompt('Reason for rejection:');
                            if (remark) handleReject(resource._id, remark);
                          }}
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

        {/* Announcements */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Announcements</h3>
          </div>
          {announcements.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No announcements yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement._id} className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                    <p className="text-gray-600 mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(announcement.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showAnnouncementForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create Announcement</h3>
              <form onSubmit={handleCreateAnnouncement}>
                <input
                  type="text"
                  placeholder="Title"
                  value={announcementData.title}
                  onChange={(e) => setAnnouncementData({...announcementData, title: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <textarea
                  placeholder="Content"
                  value={announcementData.content}
                  onChange={(e) => setAnnouncementData({...announcementData, content: e.target.value})}
                  className="w-full p-2 border rounded mb-3 h-24"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setAnnouncementData({...announcementData, file: e.target.files[0]})}
                  className="w-full p-2 border rounded mb-4"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
                <div className="flex space-x-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Create
                  </button>
                  <button type="button" onClick={() => setShowAnnouncementForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Upload Resource</h3>
              <form onSubmit={handleAdminUpload}>
                <input
                  type="text"
                  placeholder="Title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  className="w-full p-2 border rounded mb-3 h-20"
                  required
                />
                <select
                  value={uploadData.branch}
                  onChange={(e) => setUploadData({...uploadData, branch: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="EE">Electrical</option>
                  <option value="CE">Civil</option>
                  <option value="IT">Information Technology</option>
                  <option value="Other">Other</option>
                </select>
                
                <input
                  type="file"
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  className="w-full p-2 border rounded mb-4"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  required
                />
                <div className="flex space-x-3">
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Upload
                  </button>
                  <button type="button" onClick={() => setShowUploadForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;