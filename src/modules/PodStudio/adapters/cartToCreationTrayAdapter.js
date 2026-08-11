// src/modules/PodStudio/adapters/cartToCreationTrayAdapter.js

export const cartToCreationTrayAdapter = (globalCartItems, activeShopId) => {
  if (!Array.isArray(globalCartItems)) return [];

  const shopItems = globalCartItems.filter(
    (item) => item && item.shopId === activeShopId
  );

  return shopItems.map((item) => {
    const isCustomized = !!item.podCustomization;

    return {
      lineItemId: item.variantId,
      canvasId: item.productId,
      title: item.title,
      colorSelected: item.color,
      sizeSelected: item.size,
      thumbnailImageId: item.imageId,
      unitPrice: item.sellingPrice,
      quantity: item.quantity,

      baseCost: item.podCustomization?.baseGarmentCost || item.sellingPrice,
      printCost: item.podCustomization?.printCost || 0,

      customization: isCustomized
        ? {
            printSide: item.podCustomization.printSide || "blank",
            front: item.podCustomization.front
              ? {
                  artworkUrl:
                    item.podCustomization.front.originalImageUrl ||
                    item.podCustomization.front.imageUrl,
                  templateUrl: item.podCustomization.front.templateUrl,
                  widthPercent: item.podCustomization.front.width,
                  xOffsetPercent: item.podCustomization.front.x,
                  yOffsetPercent: item.podCustomization.front.y,
                  rotation: item.podCustomization.front.rotation || 0,
                }
              : null,
            back: item.podCustomization.back
              ? {
                  artworkUrl:
                    item.podCustomization.back.originalImageUrl ||
                    item.podCustomization.back.imageUrl,
                  templateUrl: item.podCustomization.back.templateUrl,
                  widthPercent: item.podCustomization.back.width,
                  xOffsetPercent: item.podCustomization.back.x,
                  yOffsetPercent: item.podCustomization.back.y,
                  rotation: item.podCustomization.back.rotation || 0,
                }
              : null,
          }
        : null,

      completionState: isCustomized ? "complete" : "needs_design",
    };
  });
};