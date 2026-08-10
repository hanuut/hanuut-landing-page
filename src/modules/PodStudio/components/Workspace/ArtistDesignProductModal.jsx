// src/modules/PodStudio/components/Workspace/ArtistDesignProductModal.jsx

import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaMagic } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts } from "../../../Product/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import PodMockupPreview from "./PodMockupPreview";
import { getImageUrl } from "../../../../utils/imageUtils";
import {
  getTemplateConfig,
  getGarmentDimensions,
  getRawPrintCost,
} from "../../hooks/usePrintableArea";

const ModalBodyLock = createGlobalStyle`
  body { overflow: hidden !important; touch-action: none; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(4, 4, 6, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  height: 85vh;
  background: #0b0b0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.95);
  color: white;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    border-radius: 24px 24px 0 0;
    height: 92vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: #111214;
  flex-shrink: 0;

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    span.tag {
      font-family: monospace;
      font-size: 0.8rem;
      color: #f07a48;
      text-transform: uppercase;
      font-weight: 800;
    }
    h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 900;
      font-family: "Tajawal", sans-serif;
    }
  }
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
  }
`;

const SplitLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const LeftListArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 10px;
  }
`;

const RightPreviewArea = styled.div`
  flex: 1;
  background: #060608;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    border-left: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    min-height: 350px;
  }
`;

const ListItemCard = styled.div`
  background: ${(props) =>
    props.$active ? "rgba(240,122,72,0.05)" : "#111214"};
  border: 1px solid
    ${(props) => (props.$active ? "#F07A48" : "rgba(255, 255, 255, 0.05)")};
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  gap: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${(props) =>
    props.$active ? "0 10px 20px rgba(240,122,72,0.1)" : "none"};

  &:hover {
    border-color: #f07a48;
    background: rgba(240, 122, 72, 0.02);
  }
`;

const ListThumb = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: #18181b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ListInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    h4 {
      margin: 0;
      font-size: 1.1rem;
      color: white;
      font-family: "Tajawal", sans-serif;
    }
    .sku {
      font-size: 0.7rem;
      color: #71717a;
      font-family: monospace;
    }
  }

  .price-breakdown {
    font-size: 0.75rem;
    color: #a1a1aa;
    font-family: "Cairo", sans-serif;
    margin-top: 4px;
    span {
      color: #f07a48;
      font-weight: 700;
    }
  }
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const SideToggles = styled.div`
  display: flex;
  gap: 4px;
  background: black;
  padding: 4px;
  border-radius: 8px;
  button {
    background: ${(props) =>
      props.$activeSide === "front" ? "#39A170" : "transparent"};
    color: ${(props) => (props.$activeSide === "front" ? "#000" : "#a1a1aa")};
    border: none;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    &:last-child {
      background: ${(props) =>
        props.$activeSide === "back" ? "#39A170" : "transparent"};
      color: ${(props) => (props.$activeSide === "back" ? "#000" : "#a1a1aa")};
    }
  }
`;

const ProceedBtn = styled.button`
  background: #f07a48;
  color: #000;
  font-weight: 800;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

const ArtistDesignProductModal = ({
  isOpen,
  onClose,
  design,
  shopId,
  onSelectProductWithDesign,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const { paginatedProducts } = useSelector((state) => state.products);

  const [hoveredCanvasId, setHoveredCanvasId] = useState(null);
  const [activeSide, setActiveSide] = useState("front");

  useEffect(() => {
    if (isOpen && shopId && paginatedProducts.length === 0) {
      dispatch(
        fetchPaginatedProducts({
          shopId,
          page: 1,
          limit: 25,
          categoryId: "",
          search: "",
          isNewFilter: true,
          printOnDemand: true,
        }),
      );
    }
  }, [isOpen, shopId, dispatch, paginatedProducts.length]);

  // Unconditional Hooks
  const canvasList = useMemo(() => {
    if (!Array.isArray(paginatedProducts)) return [];
    return paginatedProducts
      .map((p) => productToCanvasAdapter(p))
      .filter(Boolean);
  }, [paginatedProducts]);

  const designImageUrl = useMemo(() => {
    if (!design) return "";
    return getImageUrl(design._id || design.id || design);
  }, [design]);

  const metadata = useMemo(() => {
    return design?.podDesignMetadata || {};
  }, [design]);

  const cleanTitle = useMemo(() => {
    if (!design?.originalname) return "";
    return design.originalname.split(".")[0].replace(/[_-]/g, " ");
  }, [design]);

  const activeCanvas = useMemo(() => {
    if (!canvasList || canvasList.length === 0) return null;
    return (
      canvasList.find((c) => c.canvasId === hoveredCanvasId) || canvasList[0]
    );
  }, [canvasList, hoveredCanvasId]);

  // 🔴 SAFE UNIVERSAL IMAGE RESOLUTION
  const previewItemMock = useMemo(() => {
    if (!activeCanvas || !design) return null;

    const defaultColorObj = activeCanvas.availableColors?.[0] || null;

    const rawTemplateId =
      activeSide === "back" && defaultColorObj?.podBackTemplateId
        ? defaultColorObj.podBackTemplateId
        : defaultColorObj?.podFrontTemplateId ||
          defaultColorObj?.imageId ||
          activeCanvas.previewImageId;

    // 🔴 UNIVERSAL RESOLUTION VIA getImageUrl
    const resolvedTemplateUrl = getImageUrl(rawTemplateId);

    const customization = { printSide: activeSide };
    customization[activeSide] = {
      imageUrl: designImageUrl,
      templateUrl: resolvedTemplateUrl,
      x: metadata.defaultPlacement?.x ?? 50,
      y: metadata.defaultPlacement?.y ?? 35,
      width: metadata.defaultPlacement?.scale ?? 55,
      rotation: metadata.defaultPlacement?.rotation ?? 0,
    };

    return {
      title: activeCanvas.title,
      sizeSelected: "M",
      podCustomization: customization,
      variantId: activeCanvas.canvasId,
    };
  }, [activeCanvas, activeSide, designImageUrl, metadata, design]);

  const calculateApproxPrice = (canvas) => {
    const baseCost = canvas.sizes?.[0]?.baseCost || 0;
    const cfg = getTemplateConfig(canvas.title);
    const garmentDims = getGarmentDimensions(
      canvas.title,
      "M",
      canvas.sizeChart,
    );
    const printWidthRatio = cfg.printW_ref / cfg.B_ref;
    const maxPrintWidthCm = garmentDims.B * printWidthRatio;
    const scale = metadata.defaultPlacement?.scale || 55;
    const wCm = (scale / 100) * maxPrintWidthCm;
    const printCost = getRawPrintCost(wCm, wCm) + 170;
    return { base: baseCost, print: printCost, total: baseCost + printCost };
  };

  if (!isOpen || !design) return null;

  return (
    <>
      <ModalBodyLock />
      <AnimatePresence>
        <Overlay
          key="artist-design-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalCard
            $isArabic={isArabic}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
          >
            <ModalHeader>
              <div className="info">
                <span className="tag">
                  {metadata.collectionName || "CURATED ARTWORK"}
                </span>
                <h3>{cleanTitle}</h3>
              </div>
              <CloseBtn onClick={onClose}>
                <FaTimes />
              </CloseBtn>
            </ModalHeader>

            <SplitLayout>
              <LeftListArea>
                {canvasList.map((canvas, idx) => {
                  const isHovered =
                    (activeCanvas?.canvasId || canvasList[0]?.canvasId) ===
                    canvas.canvasId;
                  const hasBack =
                    canvas.specifications.printableSurfaces.includes("back");
                  const pricing = calculateApproxPrice(canvas);

                  const itemKey =
                    canvas.canvasId ||
                    canvas.id ||
                    `canvas-item-${idx}`;

                  return (
                    <ListItemCard
                      key={itemKey}
                      $active={isHovered}
                      onMouseEnter={() => setHoveredCanvasId(canvas.canvasId)}
                    >
                      <ListThumb>
                        <img
                          src={getImageUrl(canvas.previewImageId)}
                          alt="thumb"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </ListThumb>
                      <ListInfo>
                        <div className="header">
                          <div>
                            <h4>{canvas.title}</h4>
                            <span className="sku">{canvas.serialNumber}</span>
                          </div>
                          <span style={{ fontWeight: 900, color: "white" }}>
                            {pricing.total} DA
                          </span>
                        </div>
                        <div className="price-breakdown">
                          Base: {pricing.base} DA + Print:{" "}
                          <span>~{pricing.print} DA</span>
                        </div>
                        <ActionsRow>
                          {hasBack ? (
                            <SideToggles $activeSide={activeSide}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSide("front");
                                  setHoveredCanvasId(canvas.canvasId);
                                }}
                              >
                                Front
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSide("back");
                                  setHoveredCanvasId(canvas.canvasId);
                                }}
                              >
                                Back
                              </button>
                            </SideToggles>
                          ) : (
                            <div />
                          )}

                          <ProceedBtn
                            onClick={() =>
                              onSelectProductWithDesign(
                                canvas,
                                design,
                                hasBack ? activeSide : "front",
                              )
                            }
                          >
                            <FaMagic /> Edit in Studio
                          </ProceedBtn>
                        </ActionsRow>
                      </ListInfo>
                    </ListItemCard>
                  );
                })}
              </LeftListArea>

              <RightPreviewArea>
                <div
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    left: "1.5rem",
                    color: "#a1a1aa",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                  }}
                >
                  LIVE PREVIEW ({activeSide.toUpperCase()})
                </div>
                {previewItemMock && (
                  <div style={{ width: "350px", height: "350px" }}>
                    <PodMockupPreview
                      item={previewItemMock}
                      side={activeSide}
                      width="100%"
                      height="100%"
                      borderRadius="16px"
                    />
                  </div>
                )}
              </RightPreviewArea>
            </SplitLayout>
          </ModalCard>
        </Overlay>
      </AnimatePresence>
    </>
  );
};

ArtistDesignProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  design: PropTypes.object,
  shopId: PropTypes.string.isRequired,
  onSelectProductWithDesign: PropTypes.func.isRequired,
};

export default ArtistDesignProductModal;