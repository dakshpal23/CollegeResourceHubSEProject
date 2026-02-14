import { v2 as cloudinary } from 'cloudinary';

// Initialize cloudinary configuration
const initCloudinary = () => {
  // Validate environment variables
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary environment variables:', {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'Missing',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'Missing',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'Missing'
    });
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('✅ Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
  return true;
};

// Initialize immediately
initCloudinary();

export default cloudinary;
export { initCloudinary };