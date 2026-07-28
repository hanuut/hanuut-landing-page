import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { addToCart, updateCartQuantity } from "../../../Cart/state/reducers";
import { persistFile, retrieveFile } from "../../utils/indexedDbHelper";
import {
  getGarmentDimensions,
  getTemplateConfig,
  getRawPrintCost,
  calculatePhysicalMetrics,
} from "../../hooks/usePrintableArea";

const BillCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  box-sizing: border-box;
`;

const CostRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #a1a1aa;
  font-family: "Cairo", sans-serif;
`;

const GrandTotalRow = styled(CostRow)`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
`;

const CommitButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  background-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  margin-top: 1rem;

  &:hover {
    filter: brightness(1.1);
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
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const activeColorObj = canvas.availableColors.find(
    (c) => c.colorName === selectedColor,
  );

  const baseCost = useMemo(() => {
    const matchedSize = canvas.sizes.find((s) => s.sizeCode === selectedSize);
    return matchedSize ? matchedSize.baseCost : 0;
  }, [canvas, selectedSize]);

  const [frontAspect, setFrontAspect] = useState(1);
  const [backAspect, setBackAspect] = useState(1);

  useEffect(() => {
    let isMounted = true;
    if (frontDesign.previewUrl) {
      const img = new Image();
      img.src = frontDesign.previewUrl;
      img.onload = () => {
        if (isMounted) setFrontAspect(img.naturalWidth / img.naturalHeight);
      };
    }
    return () => {
      isMounted = false;
    };
  }, [frontDesign.previewUrl]);

  useEffect(() => {
    let isMounted = true;
    if (backDesign.previewUrl) {
      const img = new Image();
      img.src = backDesign.previewUrl;
      img.onload = () => {
        if (isMounted) setBackAspect(img.naturalWidth / img.naturalHeight);
      };
    }
    return () => {
      isMounted = false;
    };
  }, [backDesign.previewUrl]);

  const cfg = useMemo(() => getTemplateConfig(canvas.title), [canvas.title]);
  const garmentDims = useMemo(
    () => getGarmentDimensions(canvas.title, selectedSize, canvas.sizeChart),
    [canvas.title, selectedSize, canvas.sizeChart],
  );

  // Exact replication of NestJS backend's dimension and scale math
  const printWidthRatio = useMemo(() => cfg.printW_ref / cfg.B_ref, [cfg]);

  const frontPrintCost = useMemo(() => {
    if (!frontDesign.previewUrl) return 0;
    
    const maxPrintWidthCm = garmentDims.B * printWidthRatio;
    const wCm = (frontDesign.scale / 100) * maxPrintWidthCm;
    const hCm = wCm / frontAspect;

    // Matches backend: rawPrintCost + (50 + 60) for active side
    return getRawPrintCost(wCm, hCm) + 110;
  }, [frontDesign.previewUrl, frontDesign.scale, garmentDims, printWidthRatio, frontAspect]);

  const backPrintCost = useMemo(() => {
    if (!backDesign.previewUrl) return 0;

    const maxPrintWidthCm = garmentDims.B * printWidthRatio;
    const wCm = (backDesign.scale / 100) * maxPrintWidthCm;
    const hCm = wCm / backAspect;

    // Matches backend: rawPrintCost + (50 + 60) for active side
    return getRawPrintCost(wCm, hCm) + 110;
  }, [backDesign.previewUrl, backDesign.scale, garmentDims, printWidthRatio, backAspect]);

  const totalPrintCost = frontPrintCost + backPrintCost;
  const totalCost = baseCost + totalPrintCost;

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

    const printSideKeyword = hasFront && hasBack ? "double" : hasBack ? "back" : hasFront ? "front" : "blank";

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
        printCost: totalPrintCost,
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
      <CostRow>
        <span>{t("pod_studio_item_base_cost")}</span>
        <span>
          {baseCost} {t("zd", "DA")}
        </span>
      </CostRow>
      {frontPrintCost > 0 && (
        <CostRow>
          <span>{t("pod_studio_item_front_cost")} (Front)</span>
          <span>
            +{frontPrintCost} {t("zd", "DA")}
          </span>
        </CostRow>
      )}
      {backPrintCost > 0 && (
        <CostRow>
          <span>{t("pod_studio_item_front_cost")} (Back)</span>
          <span>
            +{backPrintCost} {t("zd", "DA")}
          </span>
        </CostRow>
      )}
      <GrandTotalRow>
        <span>{t("pod_studio_item_total_cost")}</span>
        <span>
          {totalCost} {t("zd", "DA")}
        </span>
      </GrandTotalRow>

      <CommitButton
        type="button"
        onClick={handleCommitToTray}
      >
        {t("pod_studio_btn_commit_tray")}
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
};

export default ProductionSummary;