// src/modules/PodStudio/components/storefront/sections/DiscoveryCarousel.jsx

import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import {
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";

import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";

const GROUP_CONFIGS = {
  fashion: {
    emoji: "👔",
    titleKey: "discovery_fashion_title",
    defaultTitle: "Wear What Only You Can Imagine.",
    titleAr: "ارتدِ ما لا يستطيع غيرك تخيله.",
    descKey: "discovery_fashion_desc",
    defaultDesc:
      "Transform heavy organic cotton blanks into your signature streetwear line.",
    descAr: "حوّل الخامات القطنية الفاخرة إلى خط ملابسك الخاص والفريد.",
    ctaKey: "discovery_fashion_cta",
    defaultCta: "Start Creating Fashion",
    ctaAr: "صمّم تشكيلة الملابس",
    accentColor: "#F07A48",
    bgGradient:
      "radial-gradient(circle at 75% 35%, rgba(240, 122, 72, 0.22) 0%, transparent 65%)",
  },
  accessories: {
    emoji: "👜",
    titleKey: "discovery_accessories_title",
    defaultTitle: "Carry Your Ideas Everywhere.",
    titleAr: "احمل أفكارك في كل مكان.",
    descKey: "discovery_accessories_desc",
    defaultDesc:
      "Custom canvas totes, backpacks and lifestyle gear engineered for daily expression.",
    descAr: "حقائب قماشية ومستلزمات حصرية تعبّر عن هويتك في كل خطوة.",
    ctaKey: "discovery_accessories_cta",
    defaultCta: "Design Accessories",
    ctaAr: "صمّم الحقائب والإكسسوارات",
    accentColor: "#397FF9",
    bgGradient:
      "radial-gradient(circle at 75% 35%, rgba(57, 127, 249, 0.22) 0%, transparent 65%)",
  },
  sports: {
    emoji: "🎽",
    titleKey: "discovery_sports_title",
    defaultTitle: "Train In Your Own Identity.",
    titleAr: "تدرّب بهويتك الخاصة.",
    descKey: "discovery_sports_desc",
    defaultDesc:
      "Engineered athletic wear and gym apparel tailored for team spirit and solo performance.",
    descAr: "ملابس رياضية مصممة خصيصاً لأداء عالي ورُوح الفريق.",
    ctaKey: "discovery_sports_cta",
    defaultCta: "Customize Activewear",
    ctaAr: "صمّم الملابس الرياضية",
    accentColor: "#39A170",
    bgGradient:
      "radial-gradient(circle at 75% 35%, rgba(57, 161, 112, 0.22) 0%, transparent 65%)",
  },
  kids: {
    emoji: "🧸",
    titleKey: "discovery_kids_title",
    defaultTitle: "Bespoke Apparel Built For Play.",
    titleAr: "ملابس مخصصة للعب والمرح.",
    descKey: "discovery_kids_desc",
    defaultDesc:
      "Soft organic cotton and durable playwear tailored for active little creators.",
    descAr: "ملابس قطنية ناعمة ومتينة مصممة خصيصاً للمبدعين الصغار النشطين.",
    ctaKey: "discovery_kids_cta",
    defaultCta: "Design Kids Collection",
    ctaAr: "صمّم تشكيلة الأطفال",
    accentColor: "#EC4899",
    bgGradient:
      "radial-gradient(circle at 75% 35%, rgba(236, 72, 153, 0.22) 0%, transparent 65%)",
  },
};

const getGroupConfig = (groupKey, index, t, isArabic) => {
  if (GROUP_CONFIGS[groupKey]) {
    const cfg = GROUP_CONFIGS[groupKey];
    return {
      emoji: cfg.emoji,
      title: t(cfg.titleKey, isArabic ? cfg.titleAr : cfg.defaultTitle),
      desc: t(cfg.descKey, isArabic ? cfg.descAr : cfg.defaultDesc),
      cta: t(cfg.ctaKey, isArabic ? cfg.ctaAr : cfg.defaultCta),
      accentColor: cfg.accentColor,
      bgGradient: cfg.bgGradient,
    };
  }

  const formattedName = groupKey.toUpperCase();
  return {
    emoji: "👕",
    title: isArabic
      ? `صمّم منتجات ${groupKey}`
      : `Create Your Own ${formattedName}.`,
    desc: isArabic
      ? `استكشف الخامات المتاحة لـ ${groupKey} وأضف لمستك الفنية.`
      : `Explore specialized ${groupKey} blanks and customize with your artwork.`,
    cta: isArabic ? `ابدأ التصميم` : `Start Designing ${groupKey}`,
    accentColor: index % 2 === 0 ? "#F07A48" : "#397FF9",
    bgGradient:
      "radial-gradient(circle at 75% 35%, rgba(240, 122, 72, 0.18) 0%, transparent 65%)",
  };
};

const CarouselSection = styled.section`
  width: 100%;
  height: ${(props) => (props.$compact ? "100%" : "calc(100vh - 80px)")};
  min-height: ${(props) => (props.$compact ? "100%" : "600px")};
  position: relative;
  background-color: #050505;
  overflow: hidden;
  border-bottom: ${(props) => (props.$compact ? "none" : "1px solid rgba(255, 255, 255, 0.05)")};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: center center;
    z-index: 1;
    pointer-events: none;
  }

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-pagination {
    bottom: 25px !important;
  }

  .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.25);
    opacity: 1;
    width: 12px;
    height: 6px;
    border-radius: 3px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .swiper-pagination-bullet:hover {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.3);
  }

  .swiper-pagination-bullet-active {
    background: #f07a48;
    width: 36px;
  }
`;

const SlideLayout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: ${(props) => (props.$compact ? "1fr" : "1fr 1fr")};
  grid-template-rows: ${(props) => (props.$compact ? "auto 1fr" : "1fr")};
  gap: ${(props) => (props.$compact ? "1.5rem" : "4rem")};
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => (props.$compact ? "1.5rem" : "0 2rem")};
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 2rem;
    padding-top: 4rem;
    justify-content: center;
  }
`;

const GroupEmoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 12px ${(props) => props.$color}50);
`;

const EditorialTitle = styled.h2`
  font-size: ${(props) => (props.$compact ? "clamp(1.5rem, 3.5vw, 2.2rem)" : "clamp(2.4rem, 5vw, 4rem)")};
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -1px;

  span {
    color: ${(props) => props.$color || "#F07A48"};
    text-shadow: 0 0 40px ${(props) => props.$color || "#F07A48"}30;
  }
`;

const EditorialDescription = styled.p`
  font-size: ${(props) => (props.$compact ? "0.95rem" : "1.1rem")};
  color: #a1a1aa;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  max-width: 500px;
  margin: 0;
`;

const PrimaryCTAButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.$compact ? "0.85rem 1.8rem" : "1.1rem 2.6rem")};
  border-radius: 50px;
  background: ${(props) => props.$color || "#F07A48"};
  color: #050505;
  border: none;
  font-size: 1.05rem;
  font-weight: 800;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  box-shadow: 0 12px 30px ${(props) => props.$color || "#F07A48"}30;

  &:hover {
    filter: brightness(1.15);
  }
`;

const AmbientGlow = styled.div`
  position: absolute;
  inset: -15%;
  background: ${(props) => props.$gradient};
  pointer-events: none;
  z-index: 0;
  filter: blur(60px);
  opacity: 0.65;
`;

const StaggeredStackCard = styled(motion.div)`
  position: absolute;
  width: ${(props) => (props.$compact ? "140px" : "190px")};
  height: ${(props) => (props.$compact ? "180px" : "250px")};
  background: rgba(18, 18, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: ${(props) => (props.$compact ? "1rem" : "1.25rem")};
  box-sizing: border-box;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  img {
    width: 100%;
    height: 75%;
    object-fit: contain;
    filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.6));
  }

  .meta {
    text-align: center;
    .name { font-size: 0.85rem; font-weight: 800; color: white; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .price { font-size: 0.8rem; font-family: monospace; color: ${(props) => props.$color}; font-weight: 700; margin-top: 2px; display: block; }
  }

  @media (max-width: 768px) {
    width: 140px;
    height: 180px;
  }
`;

const DenseLayeredStackCard = styled(motion.div)`
  position: absolute;
  width: ${(props) => (props.$compact ? "140px" : "185px")};
  height: ${(props) => (props.$compact ? "180px" : "240px")};
  background: rgba(22, 22, 25, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => (props.$compact ? "1rem" : "1.25rem")};
  box-sizing: border-box;
  box-shadow: 0 30px 55px rgba(0, 0, 0, 0.7);

  img {
    max-width: 90%;
    max-height: 75%;
    object-fit: contain;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.55));
  }

  .meta {
    text-align: center;
    .name { font-size: 0.85rem; font-weight: 800; color: white; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .price { font-size: 0.8rem; font-family: monospace; color: #397FF9; font-weight: 700; display: block; margin-top: 2px; }
  }

  @media (max-width: 768px) {
    width: 135px;
    height: 175px;
  }
`;

const IsoApparelCard = styled(motion.div)`
  position: absolute;
  width: ${(props) => (props.$compact ? "130px" : "175px")};
  height: ${(props) => (props.$compact ? "165px" : "220px")};
  background: rgba(18, 18, 20, 0.9);
  border: 1.5px solid rgba(57, 161, 112, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  box-sizing: border-box;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.75);

  img {
    max-width: 90%;
    max-height: 75%;
    object-fit: contain;
    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.6));
  }

  .meta {
    text-align: center;
    .name { font-size: 0.8rem; font-weight: 800; color: white; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .price { font-size: 0.75rem; font-family: monospace; color: #39A170; font-weight: 700; display: block; margin-top: 2px; }
  }

  @media (max-width: 768px) {
    width: 130px;
    height: 165px;
  }
`;

const XboxTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  z-index: 5;
`;

const XboxActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const MutedSecondaryLink = styled.button`
  background: transparent;
  border: none;
  color: #a1a1aa;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;

  &:hover {
    color: #f07a48;
  }
`;

const PlayStationTextCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  z-index: 5;

  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const NintendoTextCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  z-index: 5;

  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #a1a1aa;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

const ArtCol = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => (props.$compact ? "320px" : "480px")};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    height: 320px;
  }
`;

const GridOverlayBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GridModalCard = styled(motion.div)`
  width: 100%;
  max-width: 1100px;
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 90vh;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
  color: white;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.75rem;

  h3 {
    margin: 0;
    font-size: 1.45rem;
    font-weight: 800;
    font-family: "Tajawal", sans-serif;
  }
`;

const VerticalScrollGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const OptionProductCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.$color};
    background: rgba(255, 255, 255, 0.04);
  }
`;

const CardImageStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #0c0c0e;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  box-sizing: border-box;

  img {
    max-width: 95%;
    max-height: 95%;
    object-fit: contain;
    filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.5));
  }
`;

const CardDetailsRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
  gap: 4px;

  .name {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    font-family: "Tajawal", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .price {
    font-size: 0.85rem;
    font-weight: 800;
    color: ${(props) => props.$color};
    font-family: monospace;
  }
`;

const OptionGridCard = ({ product, color, onSelect }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const imgId =
      product?.previewImages?.[0] ||
      product?.availabilities?.[0]?.imageId ||
      product?.imageId;

    if (imgId) {
      if (
        typeof imgId === "string" &&
        (imgId.startsWith("http") || imgId.startsWith("data:"))
      ) {
        setImgUrl(imgId);
      } else {
        getImage(imgId).then((res) => {
          if (isMounted && res.data) {
            setImgUrl(getImageUrl(res.data));
          }
        });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [product]);

  const price =
    product.availabilities?.[0]?.sizes?.[0]?.sellingPrice ||
    product.sellingPrice ||
    0;

  return (
    <OptionProductCard
      $color={color}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <CardImageStage>
        {imgUrl ? <img src={imgUrl} alt="" /> : <span style={{ fontSize: "2rem" }}>👕</span>}
      </CardImageStage>
      <CardDetailsRow $color={color}>
        <span className="name">{product.name}</span>
        <span className="price">{price} DA</span>
      </CardDetailsRow>
    </OptionProductCard>
  );
};

OptionGridCard.propTypes = {
  product: PropTypes.object.isRequired,
  color: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

const ResolvedFloatingProduct = ({ product, index, config, layoutType, compact }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const imgId =
      product?.previewImages?.[0] ||
      product?.availabilities?.[0]?.imageId ||
      product?.imageId;

    if (imgId) {
      if (
        typeof imgId === "string" &&
        (imgId.startsWith("http") || imgId.startsWith("data:"))
      ) {
        setImgUrl(imgId);
      } else {
        getImage(imgId)
          .then((res) => {
            if (isMounted && res?.data) {
              setImgUrl(getImageUrl(res.data));
            }
          })
          .catch(() => {});
      }
    }
    return () => {
      isMounted = false;
    };
  }, [product]);

  const price =
    product?.availabilities?.[0]?.sizes?.[0]?.sellingPrice ||
    product?.sellingPrice ||
    0;

  if (layoutType === "xbox") {
    const offsets = compact ? [
      { rotate: -8, x: -40, y: 15, zIndex: 1 },
      { rotate: 4, x: 5, y: -25, zIndex: 3 },
      { rotate: -12, x: 50, y: 35, zIndex: 1 },
    ] : [
      { rotate: -8, x: -90, y: 15, zIndex: 1 },
      { rotate: 4, x: 10, y: -25, zIndex: 3 },
      { rotate: -12, x: 95, y: 35, zIndex: 1 },
    ];
    const transf = offsets[index % offsets.length];

    return (
      <StaggeredStackCard
        $compact={compact}
        $color={config.accentColor}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: transf.x,
          y: [transf.y, transf.y - 12, transf.y],
          rotate: transf.rotate,
          zIndex: transf.zIndex,
        }}
        transition={{
          y: { repeat: Infinity, duration: 4.5 + index, ease: "easeInOut" },
          opacity: { duration: 0.6 },
        }}
      >
        {imgUrl ? <img src={imgUrl} alt="" /> : <span style={{ fontSize: "2rem" }}>👕</span>}
        <div className="meta">
          <span className="name">{product.name}</span>
          <span className="price">{price} DA</span>
        </div>
      </StaggeredStackCard>
    );
  }

  if (layoutType === "playstation") {
    const offsets = compact ? [
      { rotate: -10, x: -40, y: 25, zIndex: 1 },
      { rotate: 6, x: 10, y: -15, zIndex: 3 },
      { rotate: -14, x: 50, y: 45, zIndex: 2 },
    ] : [
      { rotate: -10, x: -85, y: 25, zIndex: 1 },
      { rotate: 6, x: 15, y: -15, zIndex: 3 },
      { rotate: -14, x: 100, y: 45, zIndex: 2 },
    ];
    const transf = offsets[index % offsets.length];

    return (
      <DenseLayeredStackCard
        $compact={compact}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: transf.x,
          y: [transf.y, transf.y - 12, transf.y],
          rotate: transf.rotate,
          zIndex: transf.zIndex,
        }}
        transition={{
          y: { repeat: Infinity, duration: 4.5 + index, ease: "easeInOut" },
          opacity: { duration: 0.5 },
        }}
      >
        {imgUrl ? <img src={imgUrl} alt="" /> : <span style={{ fontSize: "2rem" }}>👜</span>}
        <div className="meta">
          <span className="name">{product.name}</span>
          <span className="price">{price} DA</span>
        </div>
      </DenseLayeredStackCard>
    );
  }

  const offsets = compact ? [
    { rotate: -12, x: -35, y: -20, zIndex: 2 },
    { rotate: 8, x: 30, y: 35, zIndex: 3 },
  ] : [
    { rotate: -12, x: -75, y: -20, zIndex: 2 },
    { rotate: 8, x: 65, y: 35, zIndex: 3 },
  ];
  const transf = offsets[index % offsets.length];

  return (
    <IsoApparelCard
      $compact={compact}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: transf.x,
        y: [transf.y, transf.y - 15, transf.y],
        rotate: transf.rotate,
        zIndex: transf.zIndex,
      }}
      transition={{
        y: { repeat: Infinity, duration: 4.8 + index, ease: "easeInOut" },
        opacity: { duration: 0.6 },
      }}
    >
      {imgUrl ? <img src={imgUrl} alt="" /> : <span style={{ fontSize: "3rem" }}>🎽</span>}
      <div className="meta">
        <span className="name">{product.name}</span>
        <span className="price">{price} DA</span>
      </div>
    </IsoApparelCard>
  );
};

ResolvedFloatingProduct.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  layoutType: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

const DiscoveryCarousel = ({ products, onSelectCanvas, compact = false }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [activeOverlayGroup, setActiveOverlayGroup] = useState(null);

  const groupedProducts = useMemo(() => {
    if (!products || products.length === 0) return {};

    const groups = {};

    products.forEach((product) => {
      let groupKey = product.discoveryGroup || product.categoryLanding;

      if (!groupKey) {
        const normName = String(product.name || "").toLowerCase();
        const normCat = String(
          product.categoryId?.name || product.categoryId?.nameFr || ""
        ).toLowerCase();

        if (
          normName.includes("bag") ||
          normName.includes("tote") ||
          normName.includes("backpack") ||
          normName.includes("sac") ||
          normName.includes("pouch") ||
          normCat.includes("accessoir") ||
          normCat.includes("bag")
        ) {
          groupKey = "accessories";
        } else if (
          normName.includes("sport") ||
          normName.includes("active") ||
          normName.includes("gym") ||
          normName.includes("short") ||
          normName.includes("pant") ||
          normCat.includes("sport")
        ) {
          groupKey = "sports";
        } else {
          groupKey = "fashion";
        }
      }

      groupKey = groupKey.toLowerCase().trim();

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(product);
    });

    return groups;
  }, [products]);

  const groupKeys = useMemo(() => {
    const keys = ["fashion", "accessories", "sports"];
    const hasKids = products.some(
      (p) =>
        String(p.discoveryGroup || p.categoryLanding || "").toLowerCase() === "kids"
    );
    if (hasKids) {
      keys.push("kids");
    }
    return keys;
  }, [products]);

  const getLayoutTypeByIndex = (index) => {
    const remainder = index % 4;
    if (remainder === 0) return "xbox";
    if (remainder === 1) return "playstation";
    if (remainder === 2) return "nintendo";
    return "playstation";
  };

  const handleSecondaryCtaClick = () => {
    const el = document.getElementById("canvas-library-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <CarouselSection $compact={compact}>
      <Swiper
        modules={[Autoplay, Keyboard, Pagination]}
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        speed={800}
        slidesPerView={1}
      >
        {groupKeys.map((groupKey, index) => {
          const config = getGroupConfig(groupKey, index, t, isArabic);
          const rawItems = groupedProducts[groupKey] || [];
          const items = rawItems.length > 0 ? rawItems : products; 

          const layoutType = getLayoutTypeByIndex(index);

          if (layoutType === "xbox") {
            return (
              <SwiperSlide key={groupKey}>
                <SlideLayout $isArabic={isArabic} $compact={compact}>
                  <AmbientGlow $gradient={config.bgGradient} />
                  <XboxTextColumn $isArabic={isArabic}>
                    <GroupEmoji $color={config.accentColor}>
                      {config.emoji}
                    </GroupEmoji>
                    <EditorialTitle $color={config.accentColor} $compact={compact}>
                      {config.title}
                    </EditorialTitle>
                    <EditorialDescription $compact={compact}>{config.desc}</EditorialDescription>

                    <XboxActionRow>
                      <PrimaryCTAButton
                        type="button"
                        $color={config.accentColor}
                        $compact={compact}
                        onClick={() => setActiveOverlayGroup(groupKey)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{config.cta}</span>
                        {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                      </PrimaryCTAButton>

                      <MutedSecondaryLink
                        type="button"
                        onClick={handleSecondaryCtaClick}
                      >
                        <span>{isArabic ? "تصفح الكل ➔" : "SHOP BLANKS ➔"}</span>
                      </MutedSecondaryLink>
                    </XboxActionRow>
                  </XboxTextColumn>

                  <ArtCol $compact={compact}>
                    {items.slice(0, 3).map((prod, pIdx) => (
                      <ResolvedFloatingProduct
                        key={prod._id || prod.id}
                        product={prod}
                        index={pIdx}
                        config={config}
                        layoutType="xbox"
                        compact={compact}
                      />
                    ))}
                  </ArtCol>
                </SlideLayout>
              </SwiperSlide>
            );
          }

          if (layoutType === "playstation") {
            return (
              <SwiperSlide key={groupKey}>
                <SlideLayout $isArabic={isArabic} $compact={compact}>
                  <AmbientGlow $gradient={config.bgGradient} />
                  
                  <PlayStationTextCol $isArabic={isArabic}>
                    <GroupEmoji $color={config.accentColor}>
                      {config.emoji}
                    </GroupEmoji>
                    <EditorialTitle $color={config.accentColor} $compact={compact}>
                      {config.title}
                    </EditorialTitle>
                    <EditorialDescription $compact={compact}>{config.desc}</EditorialDescription>

                    <PrimaryCTAButton
                      type="button"
                      $color={config.accentColor}
                      $compact={compact}
                      onClick={() => setActiveOverlayGroup(groupKey)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ marginTop: "0.5rem" }}
                    >
                      <span>{config.cta}</span>
                      {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                    </PrimaryCTAButton>
                  </PlayStationTextCol>

                  <ArtCol $compact={compact}>
                    {items.slice(0, 3).map((prod, pIdx) => (
                      <ResolvedFloatingProduct
                        key={prod._id || prod.id}
                        product={prod}
                        index={pIdx}
                        config={config}
                        layoutType="playstation"
                        compact={compact}
                      />
                    ))}
                  </ArtCol>
                </SlideLayout>
              </SwiperSlide>
            );
          }

          return (
            <SwiperSlide key={groupKey}>
              <SlideLayout $isArabic={isArabic} $compact={compact}>
                <AmbientGlow $gradient={config.bgGradient} />
                
                <NintendoTextCol $isArabic={isArabic}>
                  <GroupEmoji $color={config.accentColor}>
                    {config.emoji}
                  </GroupEmoji>
                  <EditorialTitle $color={config.accentColor} $compact={compact}>
                    {config.title}
                  </EditorialTitle>
                  <EditorialDescription $compact={compact}>{config.desc}</EditorialDescription>

                  <PrimaryCTAButton
                    type="button"
                    $color={config.accentColor}
                    $compact={compact}
                    onClick={() => setActiveOverlayGroup(groupKey)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ marginTop: "0.5rem" }}
                  >
                    <span>{config.cta}</span>
                    {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                  </PrimaryCTAButton>
                </NintendoTextCol>

                <ArtCol $compact={compact}>
                  {items.slice(0, 2).map((prod, pIdx) => (
                    <ResolvedFloatingProduct
                      key={prod._id || prod.id}
                      product={prod}
                      index={pIdx}
                      config={config}
                      layoutType="nintendo"
                      compact={compact}
                    />
                  ))}
                </ArtCol>
              </SlideLayout>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <AnimatePresence>
        {activeOverlayGroup && (
          <GridOverlayBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveOverlayGroup(null)}
          >
            <GridModalCard
              $isArabic={isArabic}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
            >
              <ModalHeader>
                <h3>
                  {isArabic
                    ? `تصفح خامات: ${activeOverlayGroup.toUpperCase()}`
                    : `Browse Blanks: ${activeOverlayGroup.toUpperCase()}`}
                </h3>
                <CloseButton onClick={() => setActiveOverlayGroup(null)}>
                  &times;
                </CloseButton>
              </ModalHeader>

              <VerticalScrollGrid>
                {((groupedProducts[activeOverlayGroup] || []).length > 0 ? (groupedProducts[activeOverlayGroup] || []) : products).map((product) => {
                  const themeColor = getGroupConfig(
                    activeOverlayGroup,
                    groupKeys.indexOf(activeOverlayGroup),
                    t,
                    isArabic
                  ).accentColor;

                  return (
                    <OptionGridCard
                      key={product._id || product.id}
                      product={product}
                      color={themeColor}
                      onSelect={() => {
                        setActiveOverlayGroup(null);
                        onSelectCanvas(product);
                      }}
                    />
                  );
                })}
              </VerticalScrollGrid>
            </GridModalCard>
          </GridOverlayBackdrop>
        )}
      </AnimatePresence>
    </CarouselSection>
  );
};

DiscoveryCarousel.propTypes = {
  products: PropTypes.array,
  onSelectCanvas: PropTypes.func.isRequired,
  compact: PropTypes.bool
};

export default DiscoveryCarousel;