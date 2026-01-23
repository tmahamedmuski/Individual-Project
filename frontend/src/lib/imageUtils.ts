/**
 * Get the full image URL from a path or URL
 * Handles both full URLs and relative paths
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder-image.png';
  
  // If it's already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a relative path, construct full URL
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://localhost:5000${cleanPath}`;
};

/**
 * Check if a path is a full URL
 */
export const isFullUrl = (path: string | null | undefined): boolean => {
  if (!path) return false;
  return path.startsWith('http://') || path.startsWith('https://');
};
