import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const uploadImage = async (img: string): Promise<string> => {
  try {
    const data = await cloudinary.uploader.upload(img, {
      overwrite: true,
      invalidate: true,
      resource_type: 'auto',
    });
    const res = data.secure_url;
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
export const uploadMultipleImages = async (images: string[]) => {
  try {
    return await Promise.all(
      images.map(async (base) => {
        return await uploadImage(base) as string;
      }),
    );
  } catch (err) {
    console.log(err);
  }
};
