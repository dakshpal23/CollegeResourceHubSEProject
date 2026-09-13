const formatDate = (dateString, includeTime = false, month = 'short') => {
  const options = {
    year: 'numeric',
    month,
    day: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default formatDate;
