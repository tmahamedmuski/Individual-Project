/**
 * Get the full image URL from a path or URL
 * Handles both full URLs and relative paths
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder-image.png';

  // If it's already a full URL or Base64 data URI, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // If it's a relative path starting with /uploads, it's a legacy local file
  // construction: http://localhost:5000 + path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith('/uploads/')) {
    return `http://localhost:5000${cleanPath}`;
  }

  // Otherwise return as is or placeholder
  return path;
};

/**
 * Check if a path is a full URL
 */
export const isFullUrl = (path: string | null | undefined): boolean => {
  if (!path) return false;
  return path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:');
};
