/**
 * Offscreen image analyzer that measures product pixel luminosity 
 * and returns dynamic, low-opacity liquid glass light source colors.
 */

const luminanceCache = new Map();

export const analyzeProductImageLuminance = (imgUrl) => {
  return new Promise((resolve) => {
    if (!imgUrl) {
      return resolve({
        isDark: false,
        color1: "rgba(240, 122, 72, 0.18)",
        color2: "rgba(57, 127, 249, 0.18)",
        color3: "rgba(57, 161, 112, 0.15)",
      });
    }

    if (luminanceCache.has(imgUrl)) {
      return resolve(luminanceCache.get(imgUrl));
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = 40;
        canvas.height = 40;

        ctx.drawImage(img, 0, 0, 40, 40);
        const data = ctx.getImageData(0, 0, 40, 40).data;

        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 16) {
          const alpha = data[i + 3];
          if (alpha > 40) { // Sample non-transparent pixels
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }

        if (count === 0) {
          const fallback = {
            isDark: true,
            color1: "rgba(255, 255, 255, 0.22)",
            color2: "rgba(147, 197, 253, 0.22)",
            color3: "rgba(167, 243, 208, 0.18)",
          };
          luminanceCache.set(imgUrl, fallback);
          return resolve(fallback);
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Perceived Brightness Formula
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        const isDark = brightness < 115;

        let result;
        if (isDark) {
          // Dark Product -> Light / High Contrast Orbs (Soft White, Icy Blue, Cyan)
          result = {
            isDark: true,
            color1: "rgba(255, 255, 255, 0.22)",
            color2: "rgba(147, 197, 253, 0.25)",
            color3: "rgba(167, 243, 208, 0.18)",
          };
        } else {
          // Light Product -> Complementary Low-Opacity Accents (Coral, Electric Blue, Emerald)
          result = {
            isDark: false,
            color1: "rgba(240, 122, 72, 0.18)",
            color2: "rgba(57, 127, 249, 0.18)",
            color3: "rgba(57, 161, 112, 0.15)",
          };
        }

        luminanceCache.set(imgUrl, result);
        resolve(result);
      } catch (err) {
        const fallback = {
          isDark: false,
          color1: "rgba(240, 122, 72, 0.18)",
          color2: "rgba(57, 127, 249, 0.18)",
          color3: "rgba(57, 161, 112, 0.15)",
        };
        resolve(fallback);
      }
    };

    img.onerror = () => {
      resolve({
        isDark: false,
        color1: "rgba(240, 122, 72, 0.18)",
        color2: "rgba(57, 127, 249, 0.18)",
        color3: "rgba(57, 161, 112, 0.15)",
      });
    };
  });
};