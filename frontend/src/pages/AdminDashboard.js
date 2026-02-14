import React, { useState, useEffect } from 'react';
import { resourceAPI, announcementAPI, handleApiError } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingResources, setPendingResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    file: null
  });

  // Resource upload form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    branch: 'CSE',
    subject: '',
    file: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load pending resources first
      console.log('Loading pending resources...');
      const pendingRes = await resourceAPI.getPending();
      console.log('Pending resources response:', pendingRes.data);
      setPendingResources(pendingRes.data.resources || []);
      
      // Load other data
      const [statsRes, announcementsRes] = await Promise.all([
        resourceAPI.getStats(),
        announcementAPI.getAll()
      ]);
      
      setStats(statsRes.data.stats || {});
      setAnnouncements(announcementsRes.data.announcements || []);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceAction = async (id, action, remark = '') => {
    try {
      if (action === 'approve') {
        await resourceAPI.approve(id, remark);
        toast.success('Resource approved successfully');
      } else if (action === 'reject') {
        await resourceAPI.reject(id, remark);
        toast.success('Resource rejected successfully');
      } else if (action === 'delete') {
        await resourceAPI.delete(id);
        toast.success('Resource deleted successfully');
      }
      loadData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    
    // Validate: must have either content or file
    if (!announcementForm.title || (!announcementForm.content && !announcementForm.file)) {
      toast.error('Title and either content or file is required');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', announcementForm.title);
      formData.append('content', announcementForm.content || '');
      if (announcementForm.file) {
        formData.append('file', announcementForm.file);
      }

      await announcementAPI.create(formData);
      toast.success('Announcement created successfully');
      setAnnouncementForm({ title: '', content: '', file: null });
      loadData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleResourceUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', resourceForm.title);
      formData.append('description', resourceForm.description);
      formData.append('branch', resourceForm.branch);
      formData.append('subject', resourceForm.subject);
      formData.append('file', resourceForm.file);

      await resourceAPI.upload(formData);
      toast.success('Resource uploaded and approved successfully');
      setResourceForm({ title: '', description: '', branch: 'CSE', subject: '', file: null });
      loadData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await announcementAPI.delete(id);
      toast.success('Announcement deleted successfully');
      loadData();
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              📤 Upload Resource
            </button>
            <button
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              📢 Create Announcement
            </button>
          </div>
        </div>

        {/* Statistics - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Resources</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalResources || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingResources || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
            <p className="text-3xl font-bold text-purple-600">{announcements.length}</p>
          </div>
        </div>

        {/* Upload Resource Form */}
        {showUploadForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Upload Resource (Auto-Approved)</h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleResourceUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <select
                    value={resourceForm.branch}
                    onChange={(e) => setResourceForm({ ...resourceForm, branch: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {['CSE', 'ECE', 'ME', 'EE', 'CE', 'IT', 'Other'].map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={resourceForm.subject}
                    onChange={(e) => setResourceForm({ ...resourceForm, subject: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setResourceForm({ ...resourceForm, file: e.target.files[0] })}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload Resource
              </button>
            </form>
          </div>
        )}

        {/* Announcement Form */}
        {showAnnouncementForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Create Announcement</h2>
              <button
                onClick={() => setShowAnnouncementForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content (Optional)</label>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Enter announcement text (optional if uploading file)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File Attachment (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, file: e.target.files[0] })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
                <p className="mt-1 text-xs text-gray-500">Upload documents, images, or other files</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You can create announcements with just text, just a file, or both. At least one is required.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Announcement
              </button>
            </form>
          </div>
        )}

        {/* Pending Resources */}
        <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Pending Resources ({pendingResources.length})</h2>
              <button
                onClick={loadData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {pendingResources.map((resource) => (
                  <div key={resource._id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                        <p className="text-gray-600 mt-1">{resource.description}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>Branch: {resource.branch}</span>
                          <span>Subject: {resource.subject}</span>
                          <span>Uploaded by: {resource.uploadedBy?.name}</span>
                          <span>Type: {resource.fileType?.toUpperCase()}</span>
                          <span>Date: {new Date(resource.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <div className="flex space-x-2">
                          <a
                            href={resource.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 text-center flex-1"
                          >
                            👁️ View
                          </a>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 text-center flex-1"
                          >
                            📄 Details
                          </a>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResourceAction(resource._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleResourceAction(resource._id, 'reject', 'Not suitable')}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingResources.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No pending resources
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Existing Announcements */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Existing Announcements</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                    {announcement.content && (
                      <p className="text-gray-600 mt-2">{announcement.content}</p>
                    )}
                    {announcement.fileUrl && (
                      <div className="mt-2">
                        <a
                          href={announcement.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm inline-block mr-4"
                        >
                          📎 Download File
                        </a>
                        <a
                          href={announcement.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm inline-block"
                        >
                          👁️ View Online
                        </a>
                      </div>
                    )}
                    {!announcement.content && announcement.fileUrl && (
                      <p className="text-gray-500 text-sm mt-2 italic">File-only announcement</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAnnouncement(announcement._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No announcements yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;