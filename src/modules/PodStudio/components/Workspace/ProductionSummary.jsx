// src/modules/PodStudio/components/Workspace/ProductionSummary.jsx

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToCart, updateCartQuantity } from "../../../Cart/state/reducers";
import { persistFile, retrieveFile } from "../../utils/indexedDbHelper";

const BillCard = styled.div`
  background: #060608;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  box-sizing: border-box;
  margin-top: auto;
`;

const BaseRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #a1a1aa;
  font-family: "Cairo", sans-serif;
  font-weight: 500;
`;

const PrintRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Cairo", sans-serif;
  font-weight: 700;
`;

const GrandTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 0.6rem;
  margin-top: 0.2rem;
  font-size: 0.9rem; /* ~10% larger than 0.8rem */
  font-weight: 800;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  font-family: "Tajawal", sans-serif;
`;

const CommitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  margin-top: 0.75rem;

  &:hover {
    filter: brightness(1.15);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #27272a;
    color: #52525b;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProductionSummary = ({
  canvas,
  frontDesign,
  backDesign,
  selectedColor,
  selectedSize,
  shopId,
  onCommitSuccess,
  editingCartItem,
  // 🔴 NEW: Pricing values passed down from DesignWorkspace to prevent duplicate calculation
  baseCost,
  frontPrintCost,
  backPrintCost,
  totalCost,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const dispatch = useDispatch();

  const activeColorObj = canvas.availableColors.find(
    (c) => c.colorName === selectedColor,
  );

  const apiProdUrl =
    process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

  const frontTemplateUrl = useMemo(() => {
    return activeColorObj?.podFrontTemplateId
      ? `${apiProdUrl}/image/raw/${activeColorObj.podFrontTemplateId}`
      : null;
  }, [activeColorObj, apiProdUrl]);

  const backTemplateUrl = useMemo(() => {
    return activeColorObj?.podBackTemplateId
      ? `${apiProdUrl}/image/raw/${activeColorObj.podBackTemplateId}`
      : null;
  }, [activeColorObj, apiProdUrl]);

  const handleCommitToTray = async () => {
    const hasFront = !!frontDesign.previewUrl;
    const hasBack = !!backDesign.previewUrl;

    if (!hasFront && !hasBack) {
      const confirmBlank = window.confirm(
        isArabic
          ? "لم تقوم بإضافة أي تصميم. هل ترغب في شراء القطعة بدون طباعة؟"
          : "You haven't added a design. Would you like to buy this item blank?",
      );
      if (!confirmBlank) return;
    }

    const oldId = editingCartItem
      ? editingCartItem.variantId || editingCartItem.lineItemId
      : null;
    const targetVariantId =
      oldId ||
      `pod_${canvas.canvasId}_${selectedColor}_${selectedSize}_${Date.now()}`;

    if (hasFront) {
      if (frontDesign.file && typeof frontDesign.file !== "string") {
        await persistFile(`${targetVariantId}_front`, frontDesign.file);
      } else if (
        frontDesign.file === "existing" &&
        oldId &&
        targetVariantId !== oldId
      ) {
        const oldFile = await retrieveFile(`${oldId}_front`);
        if (oldFile) await persistFile(`${targetVariantId}_front`, oldFile);
      }
    }

    if (hasBack) {
      if (backDesign.file && typeof backDesign.file !== "string") {
        await persistFile(`${targetVariantId}_back`, backDesign.file);
      } else if (
        backDesign.file === "existing" &&
        oldId &&
        targetVariantId !== oldId
      ) {
        const oldFile = await retrieveFile(`${oldId}_back`);
        if (oldFile) await persistFile(`${targetVariantId}_back`, oldFile);
      }
    }

    if (editingCartItem) {
      dispatch(updateCartQuantity({ variantId: oldId, quantity: 0 }));
    }

    const printSideKeyword =
      hasFront && hasBack
        ? "double"
        : hasBack
          ? "back"
          : hasFront
            ? "front"
            : "blank";

    const cartPayload = {
      productId: canvas.canvasId,
      variantId: targetVariantId,
      title: canvas.title,
      color: selectedColor,
      size: selectedSize,
      sellingPrice: totalCost,
      imageId: canvas.previewImageId,
      quantity: editingCartItem ? editingCartItem.quantity : 1,
      shopId: shopId,
      podCustomization: {
        printSide: printSideKeyword,
        baseGarmentCost: baseCost,
        printCost: frontPrintCost + backPrintCost,
        front: hasFront
          ? {
              imageId:
                frontDesign.file === "existing"
                  ? frontDesign.previewUrl
                  : `${targetVariantId}_front`,
              imageUrl: frontDesign.previewUrl,
              originalImageId:
                frontDesign.file === "existing"
                  ? frontDesign.previewUrl
                  : `${targetVariantId}_front`,
              originalImageUrl: frontDesign.previewUrl,
              width: frontDesign.scale,
              height: frontDesign.scale,
              x: frontDesign.x,
              y: frontDesign.y,
              rotation: frontDesign.rotation,
              templateUrl: frontTemplateUrl,
            }
          : null,
        back: hasBack
          ? {
              imageId:
                backDesign.file === "existing"
                  ? backDesign.previewUrl
                  : `${targetVariantId}_back`,
              imageUrl: backDesign.previewUrl,
              originalImageId:
                backDesign.file === "existing"
                  ? backDesign.previewUrl
                  : `${targetVariantId}_back`,
              originalImageUrl: backDesign.previewUrl,
              width: backDesign.scale,
              height: backDesign.scale,
              x: backDesign.x,
              y: backDesign.y,
              rotation: backDesign.rotation,
              templateUrl: backTemplateUrl,
            }
          : null,
      },
    };

    dispatch(addToCart(cartPayload));
    if (onCommitSuccess) onCommitSuccess();
  };

  return (
    <BillCard>
      <BaseRow>
        <span>{isArabic ? "القطعة الأساسية:" : "Apparel Base:"}</span>
        <span>
          {baseCost} {t("zd", "DA")}
        </span>
      </BaseRow>
      {frontPrintCost > 0 && (
        <PrintRow>
          <span>{isArabic ? "الطباعة (أمامي):" : "Custom Print (Front):"}</span>
          <span>
            +{frontPrintCost} {t("zd", "DA")}
          </span>
        </PrintRow>
      )}
      {backPrintCost > 0 && (
        <PrintRow>
          <span>{isArabic ? "الطباعة (خلفي):" : "Custom Print (Back):"}</span>
          <span>
            +{backPrintCost} {t("zd", "DA")}
          </span>
        </PrintRow>
      )}
      <GrandTotalRow>
        <span>{isArabic ? "الإجمالي المستحق:" : "Total Cost:"}</span>
        <span>
          {totalCost} {t("zd", "DA")}
        </span>
      </GrandTotalRow>

      <CommitButton type="button" onClick={handleCommitToTray}>
        {editingCartItem
          ? isArabic
            ? "حفظ التعديلات"
            : "Update Design"
          : isArabic
            ? "إضافة إلى السلة"
            : "Add to Cart"}
      </CommitButton>
    </BillCard>
  );
};

ProductionSummary.propTypes = {
  canvas: PropTypes.object.isRequired,
  frontDesign: PropTypes.object.isRequired,
  backDesign: PropTypes.object.isRequired,
  selectedColor: PropTypes.string.isRequired,
  selectedSize: PropTypes.string.isRequired,
  shopId: PropTypes.string.isRequired,
  onCommitSuccess: PropTypes.func,
  editingCartItem: PropTypes.object,
  baseCost: PropTypes.number.isRequired,
  frontPrintCost: PropTypes.number.isRequired,
  backPrintCost: PropTypes.number.isRequired,
  totalCost: PropTypes.number.isRequired,
};

export default ProductionSummary;
