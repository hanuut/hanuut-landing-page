/**
 * Utility to scan garment template PNG images and determine non-transparent pixel boundaries.
 * Keeps computations purely on the frontend and caches results in memory.
 */

const boundsCache = new Map();

export const scanGarmentAlphaBounds = async (imageUrl) => {
  if (!imageUrl) {
    return {
      paddingLeftPct: 0,
      paddingTopPct: 0,
      visibleWidthPct: 100,
      visibleHeightPct: 100,
    };
  }

  if (boundsCache.has(imageUrl)) {
    return boundsCache.get(imageUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;

        let minX = width;
        let minY = height;
        let maxX = 0;
        let maxY = 0;
        let foundPixel = false;

        // Scan alpha values (> 15 considered visible fabric)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 15) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              foundPixel = true;
            }
          }
        }

        if (!foundPixel) {
          minX = 0;
          minY = 0;
          maxX = width;
          maxY = height;
        }

        const visibleWidth = Math.max(1, maxX - minX);
        const visibleHeight = Math.max(1, maxY - minY);

        const bounds = {
          paddingLeftPct: (minX / width) * 100,
          paddingTopPct: (minY / height) * 100,
          visibleWidthPct: (visibleWidth / width) * 100,
          visibleHeightPct: (visibleHeight / height) * 100,
          minX,
          minY,
          maxX,
          maxY,
          width,
          height,
        };

        boundsCache.set(imageUrl, bounds);
        resolve(bounds);
      } catch (err) {
        console.warn("Alpha scan fallback due to CORS/canvas restriction:", err);
        const fallback = {
          paddingLeftPct: 0,
          paddingTopPct: 0,
          visibleWidthPct: 100,
          visibleHeightPct: 100,
        };
        resolve(fallback);
      }
    };

    img.onerror = () => {
      const fallback = {
        paddingLeftPct: 0,
        paddingTopPct: 0,
        visibleWidthPct: 100,
        visibleHeightPct: 100,
      };
      resolve(fallback);
    };
  });
};