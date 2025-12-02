/**
 * Converts backend image data (Buffer) into a browser-readable URL.
 * Uses Blob (Binary Large Object) for performance instead of Base64 strings.
 */
export const getImageUrl = (imageInput) => {
  // 1. If it's null or undefined
  if (!imageInput) return "";

  // 2. If it's already a full URL (e.g. Cloudinary or external link)
  if (typeof imageInput === 'string') {
    if (imageInput.startsWith('http') || imageInput.startsWith('data:')) {
      return imageInput;
    }
    // If it's just an ID string, we can't use it yet without a raw API endpoint
    return ""; 
  }

  // 3. The MongoDB Buffer Pattern (Your current architecture)
  // Checks for imageInput.buffer.data (Redux state usually looks like this)
  if (imageInput.buffer && imageInput.buffer.data) {
    try {
      // Convert array of integers to a Uint8Array
      const byteArray = new Uint8Array(imageInput.buffer.data);
      
      // Determine MIME type (simple check based on filename or default to jpeg)
      const extension = imageInput.originalname?.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';
      if (extension === 'png') mimeType = 'image/png';
      if (extension === 'svg') mimeType = 'image/svg+xml';
      if (extension === 'webp') mimeType = 'image/webp';

      // Create a Blob (This is much faster than btoa/Base64)
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Create a DOM String URL (e.g., blob:http://localhost:3000/...)
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error processing image buffer:", error);
      return "";
    }
  }

  // 4. Fallback for legacy data structures
  return "";
};