import React from 'react';

const AnnouncementModal = ({ isOpen, data, onChange, onSubmit, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create Announcement</h3>
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
            placeholder="Content"
            value={data.content}
            onChange={(event) => onChange({ ...data, content: event.target.value })}
            className="w-full p-2 border rounded mb-3 h-24"
            required
          />
          <input
            type="file"
            onChange={(event) => onChange({ ...data, file: event.target.files[0] })}
            className="w-full p-2 border rounded mb-4"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
          />
          <div className="flex space-x-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create
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

export default AnnouncementModal;
