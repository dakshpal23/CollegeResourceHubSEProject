import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with direct values (since env vars aren't loading properly)
cloudinary.config({
  cloud_name: 'dwxa5esxn',
  api_key: '287987698176621',
  api_secret: '5RGttnHvWlWPoI7EY-FU4NMj6yk',
  secure: true
});

console.log('✅ Cloudinary configured successfully');

export default cloudinary;