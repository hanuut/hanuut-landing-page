import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTshirt, FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts } from "../../../Product/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import PodMockupPreview from "./PodMockupPreview";
import Loader from "../../../../components/Loader"

// Prevent background scrolling when modal is active
const ModalBodyLock = createGlobalStyle`
  body {
    overflow: hidden !important;
    touch-action: none;
  }
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
  padding: 2.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.95);
  color: white;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 24px 24px 0 0;
    height: 92vh;
    gap: 1.5rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1.5rem;
  flex-shrink: 0;

  .info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: ${(props) => (props.$isArabic ? "right" : "left")};

    span.tag {
      font-family: monospace;
      font-size: 0.8rem;
      color: ${(props) => props.theme.primaryColor || "#F07A48"};
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 1.5px;
    }

    h3 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 900;
      font-family: "Tajawal", sans-serif;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #a1a1aa;
      font-family: "Cairo", sans-serif;
    }
  }
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ScrollGridContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 10px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const ProductChoiceCard = styled(motion.div)`
  background: #111214;
  border: 1px solid ${(props) => (props.$isSelected ? props.theme.primaryColor || "#F07A48" : "rgba(255, 255, 255, 0.05)")};
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  transition: border-color 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    box-shadow: 0 25px 45px rgba(240, 122, 72, 0.15);
  }
`;

const FluidGlassStage = styled.div`
  width: 100%;
  aspect-ratio: 1.1 / 1;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(240, 122, 72, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 85% 85%, rgba(57, 127, 249, 0.08) 0%, transparent 60%),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 80%);
  background-color: #060608;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
`;

const CardInfoBlock = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  background: #111214;
  flex-grow: 1;
  justify-content: space-between;

  .meta-title {
    font-size: 0.7rem;
    color: #71717a;
    font-family: monospace;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  h4 {
    margin: 4px 0 0 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: white;
    font-family: "Tajawal", sans-serif;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;

    .price {
      font-size: 1.25rem;
      font-weight: 900;
      color: white;
    }
  }
`;

const PrintSideSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
`;

const SideSelectBtn = styled.button`
  background: ${(props) => (props.$active ? props.theme.primaryColor || "#F07A48" : "rgba(255, 255, 255, 0.03)")};
  color: ${(props) => (props.$active ? "#050505" : "#d4d4d8")};
  border: 1px solid ${(props) => (props.$active ? props.theme.primaryColor || "#F07A48" : "rgba(255, 255, 255, 0.08)")};
  padding: 0.6rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const DirectDesignBtn = styled.button`
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Tajawal", sans-serif;
  width: 100%;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(240, 122, 72, 0.15);

  &:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
  }
`;

const ChoicePreviewRenderer = ({ canvas, designImageUrl, metadata, chosenSide }) => {
  const [templateUrl, setTemplateUrl] = useState(null);

  const defaultColorObj = useMemo(() => {
    return canvas.availableColors?.[0] || null;
  }, [canvas]);

  const templateId = chosenSide === "back" && defaultColorObj?.podBackTemplateId
    ? defaultColorObj.podBackTemplateId
    : defaultColorObj?.podFrontTemplateId || defaultColorObj?.imageId;

  useEffect(() => {
    let isMounted = true;
    if (templateId) {
      getImage(templateId)
        .then((res) => {
          if (isMounted && res.data) {
            setTemplateUrl(getImageUrl(res.data));
          }
        })
        .catch((err) => {
          console.error("Error resolving canvas preview template:", err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [templateId]);

  const mockItem = useMemo(() => {
    const defaultSize = canvas.sizes?.[0];
    const customization = {
      printSide: chosenSide,
    };
    customization[chosenSide] = {
      imageUrl: designImageUrl,
      templateUrl: templateUrl,
      x: metadata.defaultPlacement?.x ?? 50,
      y: metadata.defaultPlacement?.y ?? 35,
      width: metadata.defaultPlacement?.scale ?? 55,
      rotation: metadata.defaultPlacement?.rotation ?? 0,
    };

    return {
      title: canvas.title,
      sizeSelected: defaultSize?.sizeCode || "M",
      podCustomization: customization,
    };
  }, [canvas, designImageUrl, templateUrl, metadata, chosenSide]);

  if (!templateUrl) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Loader fullscreen={false} />
      </div>
    );
  }

  return (
    <div style={{ width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PodMockupPreview
        item={mockItem}
        side={chosenSide}
        width="100%"
        height="100%"
        borderRadius="12px"
      />
    </div>
  );
};

const ArtistDesignProductModal = ({ isOpen, onClose, design, shopId, onSelectProductWithDesign }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const { paginatedProducts } = useSelector((state) => state.products);
  const [selectedCanvasId, setSelectedCanvasId] = useState(null);
  const [chosenSide, setChosenSide] = useState("front");

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
        })
      );
    }
  }, [isOpen, shopId, dispatch, paginatedProducts.length]);

  const canvasList = useMemo(() => {
    if (!Array.isArray(paginatedProducts)) return [];
    return paginatedProducts
      .map((p) => productToCanvasAdapter(p))
      .filter(Boolean);
  }, [paginatedProducts]);

  if (!isOpen || !design) return null;

  const designImageUrl = `https://api.hanuut.com/image/raw/${design._id || design.id}`;
  const metadata = design.podDesignMetadata || {};
  const cleanTitle = (design.originalname || "").split(".")[0].replace(/[_-]/g, " ");

  const handleSelectCard = (canvas) => {
    setSelectedCanvasId(canvas.canvasId);
    if (!canvas.specifications.printableSurfaces.includes("back")) {
      setChosenSide("front");
    }
  };

  return (
    <AnimatePresence>
      <ModalBodyLock />
      <Overlay
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
          <ModalHeader $isArabic={isArabic}>
            <div className="info">
              <span className="tag">{metadata.collectionName || "CURATED ARTWORK"}</span>
              <h3>{cleanTitle}</h3>
              <p>
                {isArabic ? "اختر القطعة وجهة الطباعة" : "Select your blank canvas and printing side"}
              </p>
            </div>
            <CloseBtn onClick={onClose}>
              <FaTimes />
            </CloseBtn>
          </ModalHeader>

          <ScrollGridContainer>
            <CardsGrid>
              {canvasList.map((canvas) => {
                const defaultSize = canvas.sizes?.[0];
                const isSelected = selectedCanvasId === canvas.canvasId;
                const hasBackSurface = canvas.specifications.printableSurfaces.includes("back");

                return (
                  <ProductChoiceCard
                    key={canvas.canvasId}
                    onClick={() => handleSelectCard(canvas)}
                    $isSelected={isSelected}
                    whileHover={{ scale: 1.01 }}
                  >
                    <FluidGlassStage>
                      <ChoicePreviewRenderer
                        canvas={canvas}
                        designImageUrl={designImageUrl}
                        metadata={metadata}
                        chosenSide={isSelected ? chosenSide : "front"}
                      />
                    </FluidGlassStage>
                    <CardInfoBlock>
                      <div>
                        <span className="meta-title">
                          {canvas.serialNumber}
                        </span>
                        <h4>{canvas.title}</h4>
                      </div>

                      {isSelected && hasBackSurface && (
                        <PrintSideSelector onClick={(e) => e.stopPropagation()}>
                          <SideSelectBtn
                            $active={chosenSide === "front"}
                            onClick={() => setChosenSide("front")}
                          >
                            {isArabic ? "الواجهة" : "Front"}
                          </SideSelectBtn>
                          <SideSelectBtn
                            $active={chosenSide === "back"}
                            onClick={() => setChosenSide("back")}
                          >
                            {isArabic ? "الظهر" : "Back"}
                          </SideSelectBtn>
                        </PrintSideSelector>
                      )}

                      <div className="price-row" onClick={(e) => e.stopPropagation()}>
                        {(!hasBackSurface || isSelected) ? (
                          <DirectDesignBtn
                            onClick={() => onSelectProductWithDesign(canvas, design, chosenSide)}
                          >
                            <FaTshirt /> {isArabic ? "صمّم الآن" : "Design"}
                          </DirectDesignBtn>
                        ) : (
                          <span className="price">
                            {parseInt(defaultSize?.baseCost || 0)} {t("zd", "DA")}
                          </span>
                        )}
                      </div>
                    </CardInfoBlock>
                  </ProductChoiceCard>
                );
              })}
            </CardsGrid>
          </ScrollGridContainer>
        </ModalCard>
      </Overlay>
    </AnimatePresence>
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