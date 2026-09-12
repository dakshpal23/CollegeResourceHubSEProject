import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsRoot = path.join(__dirname, '..', 'uploads');

const uploadToStorage = async (file, folder = 'college-resources') => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  const placeholderValues = ['demo', 'example', 'test', 'placeholder'];

  const hasCloudinaryConfig =
    !!cloudName &&
    !!apiKey &&
    !!apiSecret &&
    !placeholderValues.includes(cloudName.toLowerCase()) &&
    !placeholderValues.includes(apiKey.toLowerCase()) &&
    !placeholderValues.includes(apiSecret.toLowerCase());

  if (hasCloudinaryConfig) {
    try {
      const result = await new Promise((resolve, reject) => {
        const isPdf = file.mimetype === 'application/pdf';

        cloudinary.uploader
          .upload_stream(
            {
              // PDF -> raw, Images -> image
              resource_type: isPdf ? 'raw' : 'image',

              folder,

              public_id: `${Date.now()}-${file.originalname.replace(
                /\s+/g,
                '-'
              )}`,
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(result);
            }
          )
          .end(file.buffer);
      });

      return result.secure_url;
    } catch (error) {
      console.warn(
        'Cloudinary upload failed, falling back to local storage:',
        error.message
      );
    }
  }

  // Local storage fallback
  const safeName = `${Date.now()}-${file.originalname.replace(
    /[^a-zA-Z0-9.\-_]/g,
    '_'
  )}`;

  const targetFolder = path.join(uploadsRoot, folder);

  await fs.mkdir(targetFolder, { recursive: true });

  const filePath = path.join(targetFolder, safeName);

  await fs.writeFile(filePath, file.buffer);

  const baseUrl =
    process.env.BASE_URL || 'http://localhost:5000';

  return `${baseUrl}/uploads/${folder}/${safeName}`;
};

export default uploadToStorage;