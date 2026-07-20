/**
 * Converts backend image data (in various formats) into a browser-readable URL.
 */
export const getImageUrl = (imageInput) => {
  if (!imageInput) return "";

  const prodUrl = process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

  // --- 1. HANDLE CONSOLE LOG CASE: buffer is a base64 string ---
  if (imageInput.buffer && typeof imageInput.buffer === 'string') {
    const extension = imageInput.originalname?.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    return `data:${mimeType};base64,${imageInput.buffer}`;
  }

  // --- 2. Handle nested $binary structure ---
  if (imageInput.buffer?.$binary?.base64) {
    const base64Data = imageInput.buffer.$binary.base64;
    const extension = imageInput.originalname?.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    return `data:${mimeType};base64,${base64Data}`;
  }

  // --- 3. Handle standard MongoDB ID strings ---
  if (typeof imageInput === 'string') {
    if (imageInput.startsWith('http') || imageInput.startsWith('data:')) {
      return imageInput;
    }
    return `${prodUrl}/image/raw/${imageInput}`; 
  }

  // --- 4. Legacy Fallback: buffer.data is an array (used on other pages) ---
  if (imageInput.buffer?.data) {
    try {
      const byteArray = new Uint8Array(imageInput.buffer.data);
      const extension = imageInput.originalname?.split('.').pop()?.toLowerCase() || 'jpeg';
      const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
      const blob = new Blob([byteArray], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error processing standard image buffer:", error);
      return "";
    }
  }

  return "";
};