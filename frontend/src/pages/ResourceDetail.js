import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceAPI, handleApiError } from '../services/api';
import { 
  FiDownload, 
  FiArrowLeft, 
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import FileTypeIcon from '../components/common/FileTypeIcon';
import formatDate from '../utils/formatDate';
import toast from 'react-hot-toast';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getById(id);
      setResource(response.data.resource);
    } catch (error) {
      handleApiError(error);
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = resource.fileUrl.replace('/upload/', '/upload/fl_attachment/');
      link.download = resource.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource not found</h2>
          <p className="text-gray-600 mb-4">The resource you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/resources')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/resources')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft className="w-4 h-4 mr-1" />
          Back to Resources
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <FileTypeIcon fileType={resource.fileType} size="w-8 h-8" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {resource.branch}
                      </span>
                      <span className="text-gray-600">{resource.subject}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FiDownload className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{resource.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <FiUser className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Uploaded by</p>
                  <p className="text-sm text-gray-600">{resource.uploadedBy?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiCalendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload Date</p>
                  <p className="text-sm text-gray-600">{formatDate(resource.createdAt, false, 'long')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiDownload className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Downloads</p>
                  <p className="text-sm text-gray-600">{resource.downloadCount} times</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Preview</h3>
              {resource.fileType?.toLowerCase() === 'pdf' ? (
                <iframe
                  src={resource.fileUrl}
                  className="w-full h-96 border rounded-lg"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <FileTypeIcon fileType={resource.fileType} size="w-8 h-8" />
                    <p className="mt-2 text-sm text-gray-600">
                      {resource.fileType?.toUpperCase()} File
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Preview not available for this file type
                    </p>
                    <button
                      onClick={() => window.open(resource.fileUrl, '_blank')}
                      className="mt-2 px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                    >
                      Open File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;