import React from 'react';
import { FiX } from 'react-icons/fi';
import formatDate from '../../utils/formatDate';

const AnnouncementList = ({ announcements, onDelete }) => (
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
                {formatDate(announcement.createdAt, true)}
              </p>
            </div>
            <button
              onClick={() => onDelete(announcement._id)}
              className="text-red-600 hover:text-red-800 ml-4"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AnnouncementList;
