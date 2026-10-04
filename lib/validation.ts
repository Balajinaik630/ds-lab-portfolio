export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
  } catch {
    return false
  }
}

export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_VIDEO_BYTES = 300 * 1024 * 1024

export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Please choose a PNG, JPG or WEBP image.'
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 10 MB or smaller.'
  return null
}

export function validateVideo(file: File): string | null {
  if (!file.type.startsWith('video/')) return 'Please choose a valid video file.'
  if (file.size > MAX_VIDEO_BYTES) return 'Video must be 300 MB or smaller.'
  return null
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
