import { useMemo } from "react";

export const getGarmentDimensions = (category, sizeCode) => {
  const normCat = String(category || "").toLowerCase();
  const normSize = String(sizeCode || "").toUpperCase() || "M";

  if (
    normCat.includes("canvas 170") ||
    normCat.includes("regular tee") ||
    normCat.includes("tshirt classic")
  ) {
    const table = {
      XS: { A: 56, B: 49, C: 32 },
      S: { A: 59, B: 51, C: 33 },
      M: { A: 62, B: 53, C: 35 },
      L: { A: 64, B: 55, C: 37 },
      XL: { A: 67, B: 57, C: 38 },
      XXL: { A: 68, B: 60, C: 40 },
      XXXL: { A: 70, B: 62, C: 42 },
    };
    return table[normSize] || table.M;
  }

  if (
    normCat.includes("oversize street") ||
    normCat.includes("oversize 260") ||
    normCat.includes("heavy oversize")
  ) {
    const table = {
      S: { A: 67, B: 47, C: 23 },
      M: { A: 64, B: 49, C: 23 },
      L: { A: 65, B: 52, C: 23 },
      XL: { A: 70, B: 55, C: 23 },
    };
    return table[normSize] || table.M;
  }

  if (
    normCat.includes("sac à dos") ||
    normCat.includes("backpack") ||
    normCat.includes("bag")
  ) {
    return { A: 34, B: 27, C: 15 };
  }

  if (normCat.includes("hoodie")) {
    const table = {
      S: { A: 60, B: 54, C: 63 },
      M: { A: 60, B: 58, C: 65 },
      L: { A: 60, B: 60, C: 65 },
      XL: { A: 60, B: 62, C: 68 },
      XXL: { A: 62, B: 64, C: 69 },
    };
    return table[normSize] || table.M;
  }

  if (normCat.includes("manches longues") || normCat.includes("long sleeve")) {
    const table = {
      S: { A: 61, B: 49, C: 62 },
      M: { A: 62, B: 51, C: 65 },
      L: { A: 63, B: 54, C: 66 },
      XL: { A: 65, B: 56, C: 69 },
    };
    return table[normSize] || table.M;
  }

  if (
    normCat.includes("sweat classic") ||
    normCat.includes("crewneck") ||
    normCat.includes("sweet shirt")
  ) {
    const table = {
      S: { A: 60, B: 34, C: 59 },
      M: { A: 62, B: 36, C: 60 },
      L: { A: 63, B: 39, C: 61 },
      XL: { A: 64, B: 40, C: 63 },
      XXL: { A: 67, B: 43, C: 65 },
      XXXL: { A: 69, B: 45, C: 65 },
    };
    return table[normSize] || table.M;
  }

  if (normCat.includes("acid oversize") || normCat.includes("vintage")) {
    const table = {
      S: { A: 65, B: 48, C: 42 },
      M: { A: 66, B: 50, C: 43 },
      L: { A: 67, B: 52, C: 44 },
      XL: { A: 68, B: 52, C: 45 },
    };
    return table[normSize] || table.M;
  }

  return { A: 72, B: 52, C: 21 };
};

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
  hoodie: {
    printW_ref: 30,
    printH_ref: 40,
    A_ref: 60,
    B_ref: 58,
    topPadding: 0.05,
    bottomPadding: 0.05,
    printYOffset: 0.18,
  },
  backpack: {
    printW_ref: 20,
    printH_ref: 25,
    A_ref: 34,
    B_ref: 27,
    topPadding: 0.1,
    bottomPadding: 0.12,
    printYOffset: 0.22,
  },
  shorts: {
    printW_ref: 15,
    printH_ref: 15,
    A_ref: 45,
    B_ref: 32,
    topPadding: 0.05,
    bottomPadding: 0.05,
    printYOffset: 0.25,
  },
  longsleeve: {
    printW_ref: 30,
    printH_ref: 40,
    A_ref: 62,
    B_ref: 51,
    topPadding: 0.1,
    bottomPadding: 0.1,
    printYOffset: 0.16,
  },
  sweatshirt: {
    printW_ref: 30,
    printH_ref: 40,
    A_ref: 62,
    B_ref: 36,
    topPadding: 0.1,
    bottomPadding: 0.1,
    printYOffset: 0.16,
  },
};

export const getTemplateConfig = (title) => {
  const normTitle = String(title || "").toLowerCase();
  if (
    normTitle.includes("backpack") ||
    normTitle.includes("sac à dos") ||
    normTitle.includes("bag")
  )
    return TEMPLATE_CONFIGS.backpack;
  if (normTitle.includes("hoodie")) return TEMPLATE_CONFIGS.hoodie;
  if (normTitle.includes("short") || normTitle.includes("pant"))
    return TEMPLATE_CONFIGS.shorts;
  if (
    normTitle.includes("manches longues") ||
    normTitle.includes("long sleeve")
  )
    return TEMPLATE_CONFIGS.longsleeve;
  if (normTitle.includes("sweat classic") || normTitle.includes("crewneck"))
    return TEMPLATE_CONFIGS.sweatshirt;
  return TEMPLATE_CONFIGS.tshirt;
};

export const getFittedPrintZoneRatios = (
  title,
  sizeCode,
  printSide = "front",
) => {
  const { A, B } = getGarmentDimensions(title, sizeCode);
  const cfg = getTemplateConfig(title);

  // Dynamic reference-dimension based ratios
  const printWidthRatio = cfg.printW_ref / cfg.B_ref;
  const printHeightRatio = cfg.printH_ref / cfg.A_ref;

  const productHeightPct = 1 - cfg.topPadding - cfg.bottomPadding;
  const productWidthPct = productHeightPct * (B / A);

  // 1. Content Area (Garment bounds relative to Square Mockup Canvas)
  const contentHeight = productHeightPct * 100;
  const contentWidth = productWidthPct * 100;
  const contentLeft = 50 - (contentWidth / 2);
  const contentTop = cfg.topPadding * 100;

  // 2. Print Area (Relative to Content Area)
  const printWidth = printWidthRatio * 100;
  const printHeight = printHeightRatio * 100;
  const printLeft = 50 - (printWidth / 2);
  const printTop = cfg.printYOffset * 100;

  // 3. Absolute Print Area (Relative to Square Mockup Canvas)
  const absolutePrintWidth = printWidthRatio * productWidthPct * 100;
  const absolutePrintHeight = printHeightRatio * productHeightPct * 100;
  const absolutePrintLeft = 50 - (absolutePrintWidth / 2);
  const absolutePrintTop = (cfg.topPadding + productHeightPct * cfg.printYOffset) * 100;

  return {
    contentArea: {
      top: parseFloat(contentTop.toFixed(2)),
      left: parseFloat(contentLeft.toFixed(2)),
      width: parseFloat(contentWidth.toFixed(2)),
      height: parseFloat(contentHeight.toFixed(2))
    },
    printArea: {
      top: parseFloat(printTop.toFixed(2)),
      left: parseFloat(printLeft.toFixed(2)),
      width: parseFloat(printWidth.toFixed(2)),
      height: parseFloat(printHeight.toFixed(2))
    },
    absolutePrintArea: {
      top: parseFloat(absolutePrintTop.toFixed(2)),
      left: parseFloat(absolutePrintLeft.toFixed(2)),
      width: parseFloat(absolutePrintWidth.toFixed(2)),
      height: parseFloat(absolutePrintHeight.toFixed(2))
    }
  };
};

export const getRawPrintCost = (widthCm, heightCm) => {
  const largestSide = Math.max(widthCm, heightCm);
  const smallestSide = Math.min(widthCm, heightCm);

  let rawCost = 0;

  if (smallestSide <= 30) {
    const D = largestSide;
    if (D <= 5) rawCost = 0;
    else if (D <= 10) rawCost = 40;
    else if (D <= 15) rawCost = 90;
    else if (D <= 20) rawCost = 160;
    else if (D <= 25) rawCost = 250;
    else if (D <= 30) rawCost = 360;
    else if (D <= 35) rawCost = 420;
    else if (D <= 40) rawCost = 480;
    else if (D <= 45) rawCost = 540;
    else if (D <= 50) rawCost = 590;
    else if (D <= 55) rawCost = 660;
    else rawCost = 720;
  } else {
    const D = smallestSide;
    if (D <= 35) rawCost = 840;
    else if (D <= 40) rawCost = 940;
    else if (D <= 45) rawCost = 1080;
    else if (D <= 50) rawCost = 1200;
    else rawCost = 1440;
  }

  return rawCost;
};

/**
 * Calculates physical dimensions in centimeters using the active garment
 * size measurements and dynamic print boundaries as the single source of truth.
 */
export const calculatePhysicalMetrics = (scale, bodyWidthCm, bodyHeightCm, printWidthRatio, printHeightRatio, aspectRatio) => {
  const maxPrintWidthCm = bodyWidthCm * printWidthRatio;
  const widthCm = (scale / 100) * maxPrintWidthCm;
  const heightCm = widthCm / (aspectRatio || 1);

  return {
    width: parseFloat(widthCm.toFixed(1)),
    height: parseFloat(heightCm.toFixed(1)),
    maxPrintWidthCm: parseFloat(maxPrintWidthCm.toFixed(1)),
    maxPrintHeightCm: parseFloat((bodyHeightCm * printHeightRatio).toFixed(1))
  };
};

/**
 * Derives the relative scale percentage (15-100) from physical centimeter inputs.
 */
export const calculateScaleFromPhysicalWidth = (widthCm, bodyWidthCm, printWidthRatio) => {
  const maxPrintWidthCm = bodyWidthCm * printWidthRatio;
  const scale = (widthCm / maxPrintWidthCm) * 100;
  return Math.min(100, Math.max(15, Math.round(scale)));
};

const usePrintableArea = (
  canvas,
  containerWidth,
  containerHeight,
  activeSide = "front",
  selectedSize = "M",
) => {
  return useMemo(() => {
    if (!canvas || !containerWidth || !containerHeight) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        garmentWidthPx: 0,
        garmentHeightPx: 0,
        printableAreaWidthCm: 0,
        printableAreaHeightCm: 0,
        A: 0,
        B: 0,
        C: 0,
      };
    }
    const titleStr = canvas.title || "";
    const dimensions = getGarmentDimensions(titleStr, selectedSize);
    const { A, B } = dimensions;
    const cfg = getTemplateConfig(titleStr);
    const printableAreaWidthCm = cfg.printW_ref;
    const printableAreaHeightCm = cfg.printH_ref;
    const productHeightPx =
      containerHeight * (1 - cfg.topPadding - cfg.bottomPadding);
    const productWidthPx = productHeightPx * (B / A);
    const printableAreaWidthPx = (printableAreaWidthCm / B) * productWidthPx;
    const printableAreaHeightPx = (printableAreaHeightCm / A) * productHeightPx;
    const leftPx = (containerWidth - printableAreaWidthPx) / 2;
    const topPx =
      containerHeight * cfg.topPadding + productHeightPx * cfg.printYOffset;
    return {
      left: Math.round(leftPx),
      top: Math.round(topPx),
      width: Math.round(printableAreaWidthPx),
      height: Math.round(printableAreaHeightPx),
      garmentWidthPx: Math.round(productWidthPx),
      garmentHeightPx: Math.round(productHeightPx),
      printableAreaWidthCm,
      printableAreaHeightCm,
      A,
      B,
      C: dimensions.C,
    };
  }, [canvas, containerWidth, containerHeight, activeSide, selectedSize]);
};
export default usePrintableArea;