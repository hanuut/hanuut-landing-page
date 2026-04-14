/**
 * Converts backend image data or IDs into a browser-readable URL.
 * Optimized to use the direct CDN/Raw endpoint when possible to save memory.
 */
export const getImageUrl = (imageInput) => {
  if (!imageInput) return "";

  const prodUrl = process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

  // 1. If it's a string (MongoDB ID or Web URL)
  if (typeof imageInput === 'string') {
    // If it's already a full HTTP URL (Cloudinary, etc.)
    if (imageInput.startsWith('http') || imageInput.startsWith('data:')) {
      return imageInput;
    }
    // OPTIMIZATION: It's a MongoDB ID. Hit the raw endpoint directly!
    // This bypasses Redux Buffer caching entirely.
    return `${prodUrl}/image/raw/${imageInput}`; 
  }

  // 2. Legacy Fallback (If Redux still passes the massive Buffer object)
  if (imageInput.buffer && imageInput.buffer.data) {
    try {
      const byteArray = new Uint8Array(imageInput.buffer.data);
      const extension = imageInput.originalname?.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';
      if (extension === 'png') mimeType = 'image/png';
      if (extension === 'svg') mimeType = 'image/svg+xml';
      if (extension === 'webp') mimeType = 'image/webp';

      const blob = new Blob([byteArray], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error processing image buffer:", error);
      return "";
    }
  }

  return "";
};