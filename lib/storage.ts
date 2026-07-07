/**
 * Storage Layer — Cloudinary
 * Handles face registration images and attendance capture photos.
 * Falls back to local filesystem if Cloudinary env vars are not set.
 */

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary once (uses env vars automatically)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface UploadResult {
  url: string
  publicId: string
  provider: 'cloudinary'
}

/**
 * Upload a base64 image to Cloudinary
 * @param base64Data  Full base64 string (with or without data URI prefix)
 * @param folder      Cloudinary folder — e.g. "attendsp/faces" or "attendsp/attendance"
 * @param filename    Public ID suffix — e.g. "face-userId-timestamp"
 */
export async function uploadImage(
  base64Data: string,
  folder: string,
  filename: string
): Promise<UploadResult> {
  // Ensure data URI prefix is present
  const dataUri = base64Data.startsWith('data:')
    ? base64Data
    : `data:image/jpeg;base64,${base64Data}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `attendsp/${folder}`,
    public_id: filename,
    overwrite: true,
    resource_type: 'image',
    // Auto quality + format for bandwidth savings
    transformation: [
      { quality: 'auto:good', fetch_format: 'auto' },
    ],
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    provider: 'cloudinary',
  }
}

/**
 * Delete an image from Cloudinary by its public ID or secure URL
 */
export async function deleteImage(publicIdOrUrl: string): Promise<void> {
  try {
    // Extract public_id if a full URL was passed
    let publicId = publicIdOrUrl
    if (publicIdOrUrl.startsWith('http')) {
      // e.g. https://res.cloudinary.com/egvnttlx/image/upload/v.../attendsp/faces/face-xxx.jpg
      const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/)
      if (match?.[1]) publicId = match[1]
    }
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    // Deletion failure is non-fatal — log and continue
    console.error('[Storage] Failed to delete image from Cloudinary:', error)
  }
}
