import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceAPI, announcementAPI, handleApiError } from '../services/api';
import toast from 'react-hot-toast';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import PendingResources from '../components/admin/PendingResources';
import AnnouncementList from '../components/admin/AnnouncementList';
import AnnouncementModal from '../components/admin/AnnouncementModal';
import AdminUploadModal from '../components/admin/AdminUploadModal';

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
  const [uploadData, setUploadData] = useState({ title: '', description: '', branch: '', subject: '', file: null });

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
      formData.append('subject', uploadData.subject);
      formData.append('file', uploadData.file);

      await resourceAPI.adminUpload(formData);
      toast.success('Resource uploaded successfully!');
      setShowUploadForm(false);
      setUploadData({ title: '', description: '', branch: '', subject: '', file: null });
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

        <AdminStatsCards stats={stats} />
        <PendingResources
          resources={pendingResources}
          actionLoading={actionLoading}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <AnnouncementList
          announcements={announcements}
          onDelete={handleDeleteAnnouncement}
        />

        <AnnouncementModal
          isOpen={showAnnouncementForm}
          data={announcementData}
          onChange={setAnnouncementData}
          onSubmit={handleCreateAnnouncement}
          onClose={() => setShowAnnouncementForm(false)}
        />

        <AdminUploadModal
          isOpen={showUploadForm}
          data={uploadData}
          onChange={setUploadData}
          onSubmit={handleAdminUpload}
          onClose={() => setShowUploadForm(false)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;