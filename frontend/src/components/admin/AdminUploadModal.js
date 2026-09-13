import React from 'react';

const AdminUploadModal = ({ isOpen, data, onChange, onSubmit, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Upload Resource</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={data.title}
            onChange={(event) => onChange({ ...data, title: event.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <textarea
            placeholder="Description"
            value={data.description}
            onChange={(event) => onChange({ ...data, description: event.target.value })}
            className="w-full p-2 border rounded mb-3 h-20"
            required
          />
          <select
            value={data.branch}
            onChange={(event) => onChange({ ...data, branch: event.target.value })}
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
            type="text"
            placeholder="Subject"
            value={data.subject}
            onChange={(event) => onChange({ ...data, subject: event.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <input
            type="file"
            onChange={(event) => onChange({ ...data, file: event.target.files[0] })}
            className="w-full p-2 border rounded mb-4"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            required
          />
          <div className="flex space-x-3">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Upload
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUploadModal;
