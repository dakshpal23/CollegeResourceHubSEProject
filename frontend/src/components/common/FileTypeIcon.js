import React from 'react';
import { FiFileText } from 'react-icons/fi';

const FileTypeIcon = ({ fileType, size = 'w-5 h-5' }) => {
  let colorClass = 'text-gray-500';

  switch (fileType?.toLowerCase()) {
    case 'pdf':
      colorClass = 'text-red-500';
      break;
    case 'doc':
    case 'docx':
      colorClass = 'text-blue-500';
      break;
    case 'ppt':
    case 'pptx':
      colorClass = 'text-orange-500';
      break;
    default:
      break;
  }

  return <FiFileText className={`${size} ${colorClass}`} />;
};

export default FileTypeIcon;
