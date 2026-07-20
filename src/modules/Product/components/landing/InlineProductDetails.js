import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import {
  FaTimes,
  FaExpand,
  FaEye,
  FaBookmark,
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaPalette,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  getTemplateConfig,
  getGarmentDimensions,
  getRawPrintCost,
} from "../../../PodStudio/hooks/usePrintableArea";

import { updateCartQuantity } from "../../../Cart/state/reducers";

import {
  PodCanvasPreview,
  PodStepIndicator,
  PodStepTwoControls,
  PodStepThreeControls,
  NavigationRow,
  WizardBtn,
} from "./PodCustomizer";
import {
  retrieveFile,
  persistFile,
} from "../../../PodStudio/utils/indexedDbHelper";

const DetailContainer = styled(motion.div)`
  width: 100%;
  background: #111214;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  min-height: 550px;
`;

const BlurredBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(50px) brightness(0.5);
  transform: scale(1.15);
  z-index: 0;
  pointer-events: none;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(17, 18, 20, 0.4) 0%,
    rgba(17, 18, 20, 0.85) 50%,
    #111214 100%
  );
  z-index: 1;
  pointer-events: none;
`;

const RelativeContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const GallerySection = styled.div`
  width: 100%;
  height: 350px;
  background: rgba(24, 24, 27, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlurBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.6);
  opacity: 0.35;
  z-index: 1;
  pointer-events: none;
`;

const SharpForegroundImage = styled.img`
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;
  z-index: 2;
`;

const AltImagesRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  width: 100%;
  justify-content: center;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AltThumbnail = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  overflow: hidden;
  background: #e5e5e5;
  border: 2px solid
    ${(props) => (props.$active ? props.theme.primaryColor : "transparent")};
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FloatingSocialProof = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  gap: 8px;
`;

const ProofBadge = styled.span`
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const ImageOverlayScrim = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(17, 18, 20, 0.95) 0%,
    rgba(17, 18, 20, 0.4) 60%,
    transparent 100%
  );
  padding: 3rem 1.25rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  z-index: 5;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1.5px;
`;

const ProductName = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 900;
  color: ${(props) => props.theme.primaryColor};
  margin-top: 0.2/rem;
`;

const ZoomHint = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 50%;
  color: white;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const InfoSection = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionPanelRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const PanelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: ${(props) => (props.$isButton ? "1 1 180px" : "0 1 auto")};
  min-width: fit-content;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const PillsContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ColorSwatch = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${(props) => props.$colorCode || "#27272a"};
  border: 2px solid
    ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.1)")};
  box-shadow: ${(props) =>
    props.$active ? `0 0 8px ${props.theme.primaryColor}` : "none"};

  &:hover {
    transform: scale(1.15);
  }
`;

const SizePill = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  background: ${(props) =>
    props.$active ? "white" : "rgba(255,255,255,0.03)"};
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.primaryColor : "rgba(255,255,255,0.1)"};
  color: ${(props) => (props.$active ? "#000" : "#D4D4D8")};
  box-shadow: ${(props) =>
    props.$active ? `0 0 8px ${props.theme.primaryColor}50` : "none"};

  &:hover {
    background: ${(props) =>
      props.$active ? "white" : "rgba(255,255,255,0.08)"};
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 16px;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-family: "Cairo", sans-serif;
  .name {
    font-size: 0.7rem;
    color: #71717a;
    font-weight: 700;
    text-transform: uppercase;
  }
  .val {
    font-size: 0.85rem;
    color: #e4e4e7;
    font-weight: 600;
  }
`;

const QtyBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem;
  border-radius: 12px;
`;

const QtyBtn = styled.button`
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AddToCartBtn = styled.button`
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
  }
`;

const COLOR_MAP = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  grey: "#6B7280",
  beige: "#F5F5DC",
};

const SelectorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InlineProductDetails = ({
  product,
  isPodShop,
  onAddToCart,
  onUpdateQuantity,
  cartItems,
  isOrderingEnabled,
  onClose,
  onImageChange,
  onWizardStepChange,
  editingCartItem,
  setEditingCartItem,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const isPod = product?.printOnDemand || isPodShop;

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [imagesMap, setImagesMap] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(false);

  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [podState, setPodState] = useState({
    side: "front",
    front: {
      file: null,
      previewUrl: null,
      scale: 80,
      x: 50,
      y: 50,
      rotation: 0,
    },
    back: {
      file: null,
      previewUrl: null,
      scale: 80,
      x: 50,
      y: 50,
      rotation: 0,
    },
  });

  useEffect(() => {
    if (onWizardStepChange) onWizardStepChange(wizardStep);
  }, [wizardStep, onWizardStepChange]);

  useEffect(() => {
    let isMounted = true;
    let freshFrontUrl = null;
    let freshBackUrl = null;

    if (editingCartItem) {
      const rawCustom = editingCartItem.podCustomization;
      const adaptedCustom = editingCartItem.customization;

      const custom =
        rawCustom ||
        (adaptedCustom
          ? {
              printSide: adaptedCustom.printSide,
              front: adaptedCustom.front
                ? {
                    originalImageUrl:
                      adaptedCustom.front.artworkUrl ||
                      adaptedCustom.front.originalImageUrl,
                    width:
                      adaptedCustom.front.widthPercent ??
                      adaptedCustom.front.width,
                    x:
                      adaptedCustom.front.xOffsetPercent ??
                      adaptedCustom.front.x,
                    y:
                      adaptedCustom.front.yOffsetPercent ??
                      adaptedCustom.front.y,
                    rotation: adaptedCustom.front.rotation,
                  }
                : null,
              back: adaptedCustom.back
                ? {
                    originalImageUrl:
                      adaptedCustom.back.artworkUrl ||
                      adaptedCustom.back.originalImageUrl,
                    width:
                      adaptedCustom.back.widthPercent ??
                      adaptedCustom.back.width,
                    x:
                      adaptedCustom.back.xOffsetPercent ?? adaptedCustom.back.x,
                    y:
                      adaptedCustom.back.yOffsetPercent ?? adaptedCustom.back.y,
                    rotation: adaptedCustom.back.rotation,
                  }
                : null,
            }
          : null);

      if (custom) {
        const stableId =
          editingCartItem.variantId || editingCartItem.lineItemId;
        setWizardStep(2);

        const loadDesignUrls = async () => {
          let frontPreview = custom.front
            ? custom.front.originalImageUrl
            : null;
          let backPreview = custom.back ? custom.back.originalImageUrl : null;

          if (custom.front?.originalImageUrl?.startsWith("blob:") && stableId) {
            const blob = await retrieveFile(`${stableId}_front`);
            if (blob && isMounted) {
              freshFrontUrl = URL.createObjectURL(blob);
              frontPreview = freshFrontUrl;
            }
          }

          if (custom.back?.originalImageUrl?.startsWith("blob:") && stableId) {
            const blob = await retrieveFile(`${stableId}_back`);
            if (blob && isMounted) {
              freshBackUrl = URL.createObjectURL(blob);
              backPreview = freshBackUrl;
            }
          }

          if (isMounted) {
            setPodState({
              side: custom.printSide === "back" ? "back" : "front",
              front: custom.front
                ? {
                    file: "existing",
                    previewUrl: frontPreview,
                    scale: custom.front.width,
                    x: custom.front.x,
                    y: custom.front.y,
                    rotation: custom.front.rotation || 0,
                  }
                : {
                    file: null,
                    previewUrl: null,
                    scale: 80,
                    x: 50,
                    y: 50,
                    rotation: 0,
                  },
              back: custom.back
                ? {
                    file: "existing",
                    previewUrl: backPreview,
                    scale: custom.back.width,
                    x: custom.back.y,
                    y: custom.back.y,
                    rotation: custom.back.rotation || 0,
                  }
                : {
                    file: null,
                    previewUrl: null,
                    scale: 80,
                    x: 50,
                    y: 50,
                    rotation: 0,
                  },
            });
          }
        };

        loadDesignUrls();
      }
    }

    return () => {
      isMounted = false;
      if (freshFrontUrl) URL.revokeObjectURL(freshFrontUrl);
      if (freshBackUrl) URL.revokeObjectURL(freshBackUrl);
    };
  }, [editingCartItem]);

  useEffect(() => {
    if (product?.availabilities?.length > 0) {
      const firstAvail = product.availabilities[0];
      setSelectedColor(firstAvail.color);
      if (firstAvail.sizes?.length > 0) {
        setSelectedSize(firstAvail.sizes[0].size);
      }

      const previews = product?.previewImages ?? [];
      setActiveImageId(previews.length > 0 ? previews[0] : firstAvail.imageId);
    }
  }, [product]);

  const currentAvailability = useMemo(() => {
    return product.availabilities.find((a) => a.color === selectedColor);
  }, [product, selectedColor]);

  const currentSizeDetails = useMemo(() => {
    return currentAvailability?.sizes.find((s) => s.size === selectedSize);
  }, [currentAvailability, selectedSize]);

  useEffect(() => {
    if (currentAvailability) {
      const sizeExists = currentAvailability.sizes.some(
        (s) => s.size === selectedSize,
      );
      if (!sizeExists && currentAvailability.sizes?.length > 0) {
        setSelectedSize(currentAvailability.sizes[0].size);
      }
      const previews = product?.previewImages ?? [];
      setActiveImageId(
        previews.length > 0 ? previews[0] : currentAvailability.imageId,
      );
    }
  }, [
    selectedColor,
    currentAvailability,
    selectedSize,
    product?.previewImages,
  ]);

  useEffect(() => {
    if (activeImageId && onImageChange) {
      onImageChange(product._id, activeImageId);
    }
  }, [activeImageId, onImageChange, product._id]);

  const activePodTemplateId = useMemo(() => {
    if (!isPod || !currentAvailability) return null;
    return podState.side === "back"
      ? currentAvailability.podBackTemplateId
      : currentAvailability.podFrontTemplateId;
  }, [isPod, currentAvailability, podState.side]);

  const allImageIds = useMemo(() => {
    const ids = [...(product?.previewImages ?? [])];
    if (product?.availabilities) {
      product.availabilities.forEach((av) => {
        if (av.imageId) ids.push(av.imageId);
        if (av.altImageIds) ids.push(...av.altImageIds);
        if (av.podFrontTemplateId) ids.push(av.podFrontTemplateId);
        if (av.podBackTemplateId) ids.push(av.podBackTemplateId);
      });
    }
    return Array.from(new Set(ids));
  }, [product]);

  useEffect(() => {
    allImageIds.forEach((id) => {
      if (imagesMap[id]) return;
      getImage(id).then((res) => {
        if (res.data) {
          setImagesMap((prev) => ({ ...prev, [id]: getImageUrl(res.data) }));
        }
      });
    });
  }, [allImageIds, imagesMap]);

  const currentVariantId = `${product._id}_${selectedColor}_${selectedSize}`;
  const existingCartItem = cartItems.find(
    (item) => item.variantId === currentVariantId,
  );

  const handleAdd = () => {
    if (!currentSizeDetails) return;
    onAddToCart({
      product,
      productId: product._id,
      title: product.name,
      variantId: currentVariantId,
      color: selectedColor,
      size: selectedSize,
      sellingPrice: currentSizeDetails.sellingPrice,
      imageId: currentAvailability.imageId,
      quantity: 1,
    });
  };

  const galleryImages = useMemo(() => {
    const previews = product?.previewImages ?? [];
    const mockups = [];
    if (currentAvailability) {
      if (currentAvailability.imageId)
        mockups.push(currentAvailability.imageId);
      if (currentAvailability.altImageIds)
        mockups.push(...currentAvailability.altImageIds);
    }
    return Array.from(new Set([...previews, ...mockups]));
  }, [product?.previewImages, currentAvailability]);

  const showViews = !!(product.viewsCount && product.viewsCount > 0);
  const showSaves = !!(product.savesCount && product.savesCount > 0);

  const handleFinalSubmit = async (finalPrice) => {
    if ((!podState.front.file && !podState.back.file) || !currentSizeDetails)
      return;
    setIsSubmitting(true);

    const oldId = editingCartItem
      ? editingCartItem.variantId || editingCartItem.lineItemId
      : null;
    const targetVariantId = oldId || `${currentVariantId}_custom_${Date.now()}`;

    try {
      let frontImageId =
        podState.front.file === "existing" ? podState.front.previewUrl : null;
      let backImageId =
        podState.back.file === "existing" ? podState.back.previewUrl : null;

      if (podState.front.file && podState.front.file !== "existing") {
        const frontForm = new FormData();
        frontForm.append("file", podState.front.file);
        const frontRes = await axios.post(
          `${process.env.REACT_APP_API_PROD_URL}/image/upload`,
          frontForm,
        );
        frontImageId = frontRes.data.url;

        await persistFile(`${targetVariantId}_front`, podState.front.file);
      }

      if (podState.back.file && podState.back.file !== "existing") {
        const backForm = new FormData();
        backForm.append("file", podState.back.file);
        const backRes = await axios.post(
          `${process.env.REACT_APP_API_PROD_URL}/image/upload`,
          backForm,
        );
        backImageId = backRes.data.url;

        await persistFile(`${targetVariantId}_back`, podState.back.file);
      }

      const hasFront = !!frontImageId;
      const hasBack = !!backImageId;

      const printSideKeyword =
        hasFront && hasBack ? "double" : hasBack ? "back" : "front";

      const baseApparelCost = currentSizeDetails?.sellingPrice || 0;

      const frontPrintCost = (() => {
        if (!podState.front.file) return 0;
        const wCm =
          (podState.front.scale / 100) *
          ((product.printableAreaWidthMm || 280) / 10);
        const hCm =
          (podState.front.scale / 100) *
          ((product.printableAreaHeightMm || 350) / 10);
        return getRawPrintCost(wCm, hCm) + 50 + 60;
      })();

      const backPrintCost = (() => {
        if (!podState.back.file) return 0;
        const wCm =
          (podState.back.scale / 100) *
          ((product.printableAreaWidthMm || 280) / 10);
        const hCm =
          (podState.back.scale / 100) *
          ((product.printableAreaHeightMm || 350) / 10);
        return getRawPrintCost(wCm, hCm) + 50 + 60;
      })();

      const cfg = getTemplateConfig(product.name);
      const garmentDims = getGarmentDimensions(product.name, selectedSize);
      const productHeightPct = 1 - cfg.topPadding - cfg.bottomPadding;
      const totalWorkspacePhysicalCm = garmentDims.A / productHeightPct;

      const getPhysicalMetrics = (designState) => {
        const scaleFactor = designState.scale / 100;
        const containerWidthCm = scaleFactor * totalWorkspacePhysicalCm;
        return { width: containerWidthCm, height: containerWidthCm };
      };

      const frontMetrics = getPhysicalMetrics(podState.front);
      const backMetrics = getPhysicalMetrics(podState.back);

      const customizationData = {
        printSide: printSideKeyword,
        baseGarmentCost: baseApparelCost,
        printCost: frontPrintCost + backPrintCost,
        front: hasFront
          ? {
              imageId: frontImageId,
              imageUrl: frontImageId,
              originalImageId: frontImageId,
              originalImageUrl: frontImageId,
              x: podState.front.x,
              y: podState.front.y,
              width: parseFloat(frontMetrics.width.toFixed(1)),
              height: parseFloat(frontMetrics.height.toFixed(1)),
              rotation: podState.front.rotation,
              templateUrl: currentAvailability?.podFrontTemplateId
                ? `${process.env.REACT_APP_API_PROD_URL}/image/raw/${currentAvailability.podFrontTemplateId}`
                : null,
            }
          : null,
        back: hasBack
          ? {
              imageId: backImageId,
              imageUrl: backImageId,
              originalImageId: backImageId,
              originalImageUrl: backImageId,
              x: podState.back.x,
              y: podState.back.y,
              width: parseFloat(backMetrics.width.toFixed(1)),
              height: parseFloat(backMetrics.height.toFixed(1)),
              rotation: podState.back.rotation,
              templateUrl: currentAvailability?.podBackTemplateId
                ? `${process.env.REACT_APP_API_PROD_URL}/image/raw/${currentAvailability.podBackTemplateId}`
                : null,
            }
          : null,
      };

      if (editingCartItem) {
        dispatch(updateCartQuantity({ variantId: oldId, quantity: 0 }));
      }

      onAddToCart({
        product,
        productId: product._id,
        title: product.name,
        variantId: targetVariantId,
        color: selectedColor,
        size: selectedSize,
        sellingPrice: finalPrice,
        imageId: currentAvailability.imageId,
        quantity: editingCartItem ? editingCartItem.quantity : 1,
        podCustomization: customizationData,
      });

      setPodState({
        side: "front",
        front: {
          file: null,
          previewUrl: null,
          scale: 80,
          x: 50,
          y: 50,
          rotation: 0,
        },
        back: {
          file: null,
          previewUrl: null,
          scale: 80,
          x: 50,
          y: 50,
          rotation: 0,
        },
      });
      setWizardStep(1);
      setEditingCartItem(null);
      if (onClose) onClose();
    } catch (error) {
      console.error("Customization failed:", error);
      alert("Failed to submit design, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DetailContainer
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BlurredBackdrop
          $imgUrl={imagesMap[activePodTemplateId] || imagesMap[activeImageId]}
        />
        <GradientOverlay />

        <RelativeContent>
          {isPod && (
            <PodStepIndicator currentStep={wizardStep} isArabic={isArabic} />
          )}

          <SplitGrid>
            {/* LEFT SIDE */}
            <div>
              {isPod && wizardStep >= 2 ? (
                <PodCanvasPreview
                  baseImageUrl={
                    imagesMap[activePodTemplateId] || imagesMap[activeImageId]
                  }
                  podState={podState}
                  setPodState={setPodState}
                  productName={product.name}
                  selectedSize={selectedSize}
                />
              ) : (
                <GallerySection>
                  {imagesMap[activeImageId] && (
                    <BlurBackground $imgUrl={imagesMap[activeImageId]} />
                  )}
                  {(showViews || showSaves) && (
                    <FloatingSocialProof>
                      {showViews ? (
                        <ProofBadge>
                          <FaEye /> {product.viewsCount}
                        </ProofBadge>
                      ) : null}
                      {showSaves ? (
                        <ProofBadge>
                          <FaBookmark /> {product.savesCount}
                        </ProofBadge>
                      ) : null}
                    </FloatingSocialProof>
                  )}

                  <MainImageWrapper onClick={() => setIsLightboxOpen(true)}>
                    <AnimatePresence mode="wait">
                      {imagesMap[activeImageId] && (
                        <SharpForegroundImage
                          key={activeImageId}
                          src={imagesMap[activeImageId]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>

                    <ImageOverlayScrim $isArabic={isArabic}>
                      {product.brand && <Brand>{product.brand}</Brand>}
                      <ProductName>{product.name}</ProductName>
                      <Price>
                        {parseInt(currentSizeDetails?.sellingPrice || 0)}{" "}
                        {t("zd", "DA")}
                      </Price>
                    </ImageOverlayScrim>

                    <ZoomHint>
                      <FaExpand />
                    </ZoomHint>
                  </MainImageWrapper>

                  {galleryImages.length > 1 && (
                    <AltImagesRow>
                      {galleryImages.map((id, index) => (
                        <AltThumbnail
                          key={index}
                          $active={activeImageId === id}
                          onClick={() => setActiveImageId(id)}
                        >
                          <img src={imagesMap[id]} alt="Alt view" />
                        </AltThumbnail>
                      ))}
                    </AltImagesRow>
                  )}
                </GallerySection>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div>
              {!isPod ? (
                <InfoSection>
                  <ProductName>{product.name}</ProductName>
                  <ActionPanelRow>
                    <PanelSection>
                      <SectionLabel>{t("color_prefix")}</SectionLabel>
                      <PillsContainer>
                        {product.availabilities.map((av) => (
                          <ColorSwatch
                            key={av.color}
                            $active={selectedColor === av.color}
                            $colorCode={
                              COLOR_MAP[av.color.toLowerCase()] || av.color
                            }
                            onClick={() => setSelectedColor(av.color)}
                          />
                        ))}
                      </PillsContainer>
                    </PanelSection>

                    {currentAvailability && (
                      <PanelSection>
                        <SectionLabel>{t("size_prefix")}</SectionLabel>
                        <PillsContainer>
                          {currentAvailability.sizes.map((s) => (
                            <SizePill
                              key={s.size}
                              $active={selectedSize === s.size}
                              onClick={() => setSelectedSize(s.size)}
                            >
                              {s.size}
                            </SizePill>
                          ))}
                        </PillsContainer>
                      </PanelSection>
                    )}
                  </ActionPanelRow>
                  <AddToCartBtn onClick={handleAdd}>
                    {t("add_to_cart")}
                  </AddToCartBtn>
                </InfoSection>
              ) : (
                <div
                  style={{
                    minHeight: "350px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {wizardStep === 1 && (
                    <InfoSection style={{ padding: 0 }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <Brand>{product.brand}</Brand>
                        <ProductName
                          style={{ fontSize: "1.6rem", marginTop: "4px" }}
                        >
                          {product.name}
                        </ProductName>
                        <Price style={{ fontSize: "1.4rem", marginTop: "4px" }}>
                          {currentSizeDetails?.sellingPrice} DA
                        </Price>
                      </div>

                      <ActionPanelRow>
                        <PanelSection>
                          <SectionLabel
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaPalette /> Colors
                          </SectionLabel>
                          <PillsContainer>
                            {product.availabilities.map((av) => {
                              const hex =
                                COLOR_MAP[av.color.toLowerCase()] || av.color;
                              return (
                                <ColorSwatch
                                  key={av.color}
                                  $active={selectedColor === av.color}
                                  $colorCode={hex}
                                  onClick={() => setSelectedColor(av.color)}
                                >
                                  {selectedColor === av.color && (
                                    <FaCheck
                                      size={10}
                                      color={
                                        av.color.toLowerCase() === "white"
                                          ? "#000"
                                          : "#fff"
                                      }
                                    />
                                  )}
                                </ColorSwatch>
                              );
                            })}
                          </PillsContainer>
                        </PanelSection>

                        {currentAvailability && (
                          <PanelSection>
                            <SectionLabel>Sizes</SectionLabel>
                            <PillsContainer>
                              {currentAvailability.sizes.map((s) => (
                                <SizePill
                                  key={s.size}
                                  $active={selectedSize === s.size}
                                  onClick={() => setSelectedSize(s.size)}
                                >
                                  {s.size}
                                </SizePill>
                              ))}
                            </PillsContainer>
                          </PanelSection>
                        )}
                      </ActionPanelRow>

                      <NavigationRow style={{ marginTop: "2rem" }}>
                        <WizardBtn
                          type="button"
                          $primary
                          onClick={() => setWizardStep(2)}
                        >
                          Customize Garment{" "}
                          {isArabic ? <FaChevronLeft /> : <FaChevronRight />}
                        </WizardBtn>
                      </NavigationRow>
                    </InfoSection>
                  )}

                  {wizardStep === 2 && (
                    <PodStepTwoControls
                      podState={podState}
                      setPodState={setPodState}
                      product={product}
                      isArabic={isArabic}
                      onBack={() => setWizardStep(1)}
                      onNext={() => setWizardStep(3)}
                    />
                  )}

                  {wizardStep === 3 && (
                    <PodStepThreeControls
                      podState={podState}
                      product={product}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      currentSizeDetails={currentSizeDetails}
                      isArabic={isArabic}
                      isSubmitting={isSubmitting}
                      onBack={() => setWizardStep(2)}
                      onSubmit={handleFinalSubmit}
                    />
                  )}
                </div>
              )}
            </div>
          </SplitGrid>
        </RelativeContent>

        {onClose && (
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        )}
      </DetailContainer>

      <AnimatePresence>
        {isLightboxOpen && imagesMap[activeImageId] && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.img
              src={imagesMap[activeImageId]}
              alt={product.name}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default InlineProductDetails;