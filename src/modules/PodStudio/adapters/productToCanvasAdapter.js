// src/modules/PodStudio/adapters/productToCanvasAdapter.js

export const productToCanvasAdapter = (product) => {
  if (!product) return null;

  const specificationsList = product.specifications || [];
  
  // --- REMOVED HARDCODED FALLBACKS: Returns null if spec does not exist in DB ---
  const gsmValue = specificationsList.find(spec => spec.name?.toLowerCase() === "gsm")?.value || null;
  const compositionValue = specificationsList.find(spec => spec.name?.toLowerCase() === "material")?.value || null;
  const cutValue = specificationsList.find(spec => spec.name?.toLowerCase() === "fit")?.value || null;

  const defaultAvailability = product.availabilities?.[0] || {};

  return {
    canvasId: product._id || product.id,
    serialNumber: `CANVAS-${String(product._id || product.id).substring(0, 4).toUpperCase()}`,
    title: product.name,
    blueprint: product.description || product.shortDescription,
    previewImageId: defaultAvailability.imageId || null,
    
    specifications: {
      gsm: gsmValue,
      composition: compositionValue,
      fit: cutValue,
      printableSurfaces: product.hasBackPrintSurface ? ["front", "back"] : ["front"]
    },
    
    physicalDimensions: {
      widthMm: 1000,
      heightMm: 1200
    },

    printZones: {
      front: {
        physical: {
          x: 275,
          y: 200,
          width: 450,
          height: 520
        }
      },
      back: {
        physical: {
          x: 275,
          y: 180,
          width: 450,
          height: 550
        }
      }
    },
    
    availableColors: product.availabilities?.map(av => ({
      colorName: av.color,
      imageId: av.imageId,
      podFrontTemplateId: av.podFrontTemplateId || av.imageId,
      podBackTemplateId: av.podBackTemplateId || null,
      altImages: av.altImageIds || []
    })) || [],
    
    sizes: defaultAvailability.sizes?.map(s => ({
      sizeCode: s.size,
      baseCost: s.sellingPrice
    })) || []
  };
};