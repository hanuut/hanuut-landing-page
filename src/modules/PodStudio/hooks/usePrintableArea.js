import { useState, useEffect } from "react";
import { scanGarmentAlphaBounds } from "../utils/garmentAlphaScanner";

/**
 * Backward-compatible Template Configurations for legacy imports.
 */
export const TEMPLATE_CONFIGS = {
  tshirt: {
    printW_ref: 30,
    printH_ref: 40,
    A_ref: 62,
    B_ref: 53,
    topPadding: 0.08,
    bottomPadding: 0.1,
    printYOffset: 0.16,
  },
};

export const getTemplateConfig = () => {
  return TEMPLATE_CONFIGS.tshirt;
};

/**
 * Extracts physical garment dimensions (A = Height, B = Width, C = Secondary)
 * strictly from data. Zero string/keyword matching.
 */
export const getGarmentDimensions = (category, sizeCode, sizeChart = null) => {
  const normSize = String(sizeCode || "").toUpperCase() || "S";

  if (sizeChart && Array.isArray(sizeChart.sizes) && sizeChart.sizes.length > 0) {
    const matchedSize =
      sizeChart.sizes.find(
        (s) =>
          String(s.sizeLabel || s.size || "").toUpperCase() === normSize
      ) || sizeChart.sizes[0];

    if (matchedSize && matchedSize.measurements) {
      const m = matchedSize.measurements;
      const getVal = (key) => (m instanceof Map ? m.get(key) : m[key]);
      const valA = parseFloat(getVal("A"));
      const valB = parseFloat(getVal("B"));
      const valC = parseFloat(getVal("C"));

      if (!isNaN(valA) && valA > 0 && !isNaN(valB) && valB > 0) {
        return {
          A: valA,
          B: valB,
          C: !isNaN(valC) ? valC : 0,
        };
      }
    }
  }

  // Fallback defaults strictly when sizeChart is absent (70cm height, 50cm width)
  return { A: 70, B: 50, C: 20 };
};

/**
 * Data-Driven Print Zone Calculation (Keyword-Free).
 * Computes bounding areas strictly using physical data (A, B) and alpha bounds.
 */
export const getFittedPrintZoneRatios = (
  title,
  sizeCode,
  printSide = "front",
  sizeChart = null,
  alphaBounds = null
) => {
  const { A, B } = getGarmentDimensions(title, sizeCode, sizeChart);

  // Read non-transparent fabric bounding box from PNG alpha channel
  const padLeft = alphaBounds ? alphaBounds.paddingLeftPct : 5;
  const padTop = alphaBounds ? alphaBounds.paddingTopPct : 5;
  const visWidthPct = alphaBounds ? alphaBounds.visibleWidthPct : 90;
  const visHeightPct = alphaBounds ? alphaBounds.visibleHeightPct : 90;

  // Garment Content Box on Canvas Stage
  const contentLeft = padLeft;
  const contentTop = padTop;
  const contentWidth = visWidthPct;
  const contentHeight = visHeightPct;

  // Standard recommended print region relative to visible fabric
  const printWidthPct = 70;
  const printHeightPct = 60;
  const printLeftPct = 15;
  const printTopPct = 18;

  // Absolute print zone relative to entire template PNG stage
  const absolutePrintWidth = (visWidthPct * printWidthPct) / 100;
  const absolutePrintHeight = (visHeightPct * printHeightPct) / 100;
  const absolutePrintLeft = padLeft + (visWidthPct * printLeftPct) / 100;
  const absolutePrintTop = padTop + (visHeightPct * printTopPct) / 100;

  return {
    contentArea: {
      top: parseFloat(contentTop.toFixed(2)),
      left: parseFloat(contentLeft.toFixed(2)),
      width: parseFloat(contentWidth.toFixed(2)),
      height: parseFloat(contentHeight.toFixed(2)),
    },
    printArea: {
      top: parseFloat(printTopPct.toFixed(2)),
      left: parseFloat(printLeftPct.toFixed(2)),
      width: parseFloat(printWidthPct.toFixed(2)),
      height: parseFloat(printHeightPct.toFixed(2)),
    },
    absolutePrintArea: {
      top: parseFloat(absolutePrintTop.toFixed(2)),
      left: parseFloat(absolutePrintLeft.toFixed(2)),
      width: parseFloat(absolutePrintWidth.toFixed(2)),
      height: parseFloat(absolutePrintHeight.toFixed(2)),
    },
  };
};

export const getRawPrintCost = (widthCm, heightCm) => {
  if (!widthCm || !heightCm || widthCm <= 0 || heightCm <= 0) return 0;

  const smallestSide = Math.min(widthCm, heightCm);
  const largestSide = Math.max(widthCm, heightCm);

  // TIER A: smallestSide <= 30cm -> based on largestSide (D)
  if (smallestSide <= 30) {
    const d = largestSide;
    if (d <= 5) return 100;
    if (d <= 10) return 150;
    if (d <= 15) return 250;
    if (d <= 20) return 350;
    if (d <= 25) return 500;
    if (d <= 30) return 700;
    if (d <= 35) return 800;
    if (d <= 40) return 900;
    if (d <= 45) return 1000;
    if (d <= 50) return 1100;
    if (d <= 55) return 1200;
    return 1300;
  } 
  // TIER B: smallestSide > 30cm -> based on smallestSide (D)
  else {
    const d = smallestSide;
    if (d <= 35) return 1500;
    if (d <= 40) return 1700;
    if (d <= 45) return 1950;
    if (d <= 50) return 2150;
    return 2550;
  }
};

/**
 * Calculates physical dimensions (in cm) based on real visible fabric proportions.
 * Maps the design's on-screen size directly to the physical dimensions of the garment,
 * ensuring that the displayed measurements always match visual reality.
 */
export const calculatePhysicalMetrics = (
  scale,
  bodyWidthCm,
  bodyHeightCm,
  aspectRatio
) => {
  // In the visual canvas, the printable box is scaled to occupy almost the entire
  // visible fabric area on screen. We map the scale directly to the garment's full dimensions.
  const visualGarmentWidthPct = 0.95;
  const visualGarmentHeightPct = 0.95;

  const maxPrintWidthCm = bodyWidthCm * visualGarmentWidthPct;
  const maxPrintHeightCm = bodyHeightCm * visualGarmentHeightPct;

  // Compute physical width based on the scale percentage
  const widthCm = (scale / 100) * maxPrintWidthCm;

  // Calculate height using the image aspect ratio
  let heightCm = widthCm / (aspectRatio || 1);

  // Bound the height so it doesn't exceed the t-shirt's physical boundaries
  if (heightCm > bodyHeightCm) {
    heightCm = bodyHeightCm;
  }

  return {
    width: parseFloat(widthCm.toFixed(1)),
    height: parseFloat(heightCm.toFixed(1)),
    maxPrintWidthCm: parseFloat(maxPrintWidthCm.toFixed(1)),
    maxPrintHeightCm: parseFloat(bodyHeightCm.toFixed(1)), // Max height matches full garment length
  };
};

export const calculateScaleFromPhysicalWidth = (
  widthCm,
  bodyWidthCm
) => {
  const visualGarmentWidthPct = 0.95;
  const maxPrintWidthCm = bodyWidthCm * visualGarmentWidthPct;
  const scale = (widthCm / maxPrintWidthCm) * 100;
  return Math.min(120, Math.max(15, Math.round(scale)));
};

export const useGarmentAlphaBounds = (imageUrl) => {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (imageUrl) {
      scanGarmentAlphaBounds(imageUrl).then((result) => {
        if (isMounted) setBounds(result);
      });
    } else {
      setBounds(null);
    }
    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return bounds;
};

export const getPreferredProductImageId = (
  product,
  index = 0,
  selectedColor = null
) => {
  const previews = product?.previewImages ?? [];

  if (previews.length > index) {
    return previews[index];
  }

  const availability = selectedColor
    ? product?.availabilities?.find(
        (av) =>
          String(av.color).toLowerCase() === String(selectedColor).toLowerCase()
      )
    : product?.availabilities?.[0];

  if (availability?.podFrontTemplateId) {
    return availability.podFrontTemplateId;
  }

  if (availability?.imageId) {
    return availability.imageId;
  }

  return product?.images?.[0] || null;
};