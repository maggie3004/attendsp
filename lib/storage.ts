/**
 * Storage Abstraction Layer
 * Supports: local filesystem
 */

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export interface UploadResult {
  url: string
  provider: 'local'
}

export async function uploadImage(
  base64Data: string,
  folder: string,
  filename: string
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const buffer = Buffer.from(
    base64Data.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  )

  const filePath = path.join(uploadDir, `${filename}.jpg`)
  await writeFile(filePath, buffer)

  return {
    url: `/uploads/${folder}/${filename}.jpg`,
    provider: 'local',
  }
}

export async function deleteImage(
  publicIdOrPath: string
): Promise<void> {
  // Local: file stays as audit trail, or implement fs.unlink if needed
}
