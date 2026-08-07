/**
 * Utility to extract dynamic hex color codes and localized labels from 
 * GlobalProduct's specifications array with legacy fallback support.
 */

const LEGACY_COLOR_MAP = {
  black: "#000000",
  noir: "#000000",
  white: "#FFFFFF",
  blanc: "#FFFFFF",
  red: "#EF4444",
  rouge: "#EF4444",
  blue: "#3B82F6",
  bleu: "#3B82F6",
  navy: "#1E3A8A",
  green: "#10B981",
  vert: "#10B981",
  yellow: "#F59E0B",
  jaune: "#F59E0B",
  grey: "#9CA3AF",
  gris: "#9CA3AF",
  pink: "#EC4899",
  rose: "#EC4899",
  beige: "#F5F5DC",
  cream: "#FEF3C7",
  brown: "#78350F",
  marron: "#78350F",
  purple: "#8B5CF6",
  mauve: "#8B5CF6",
  burgundy: "#7F1D1D",
  bordeaux: "#7F1D1D",
};

export const resolveColorData = (product, colorKey, lang = "ar") => {
  if (!colorKey) return { hex: "#18181b", label: "" };

  const cleanKey = String(colorKey).trim().toLowerCase();
  const specs = product?.specifications || [];

  // 1. Look for custom hex specification: colorHex_{key}
  const hexSpec = specs.find(
    (s) => s.name?.toLowerCase() === `colorhex_${cleanKey}`
  );
  
  // 2. Look for localized label specification: colorLabel_{lang}_{key}
  const labelSpec = specs.find(
    (s) => s.name?.toLowerCase() === `colorlabel_${lang}_${cleanKey}`
  );

  let finalHex = hexSpec?.value;
  let finalLabel = labelSpec?.value;

  // 3. Fallback check for dirty legacy data:
  // If the label itself is a hex code (starts with # or matches hex regex), use it as hex
  const isHexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  
  if (!finalHex) {
    if (finalLabel && isHexRegex.test(finalLabel.trim())) {
      finalHex = finalLabel.trim();
      finalLabel = null; // Reset dirty label so we can provide a readable text fallback
    } else if (isHexRegex.test(cleanKey)) {
      finalHex = cleanKey;
    } else {
      finalHex = LEGACY_COLOR_MAP[cleanKey] || "#27272a";
    }
  }

  if (!finalLabel) {
    // Generate readable fallback label from key
    finalLabel = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
  }

  return {
    hex: finalHex,
    label: finalLabel,
  };
};