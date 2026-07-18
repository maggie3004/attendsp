/**
 * Storage Abstraction Layer
 * Provider: Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  provider: 'cloudinary'
}

export async function uploadImage(
  base64Data: string,
  folder: string,
  filename: string
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder: `attendsp/${folder}`,
    public_id: filename,
    resource_type: 'image',
    overwrite: true,
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    provider: 'cloudinary',
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return
  await cloudinary.uploader.destroy(publicId)
}
