import React, { useMemo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Keyboard } from "swiper/modules";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMagic,
  FaArrowRight,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";

// ============================================================================
// DISCOVERY GROUP MARKETING CONFIGURATIONS
// ============================================================================

const GROUP_CONFIGS = {
  fashion: {
    badge: "01 / FASHION",
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
    badge: "02 / ACCESSORIES",
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
    badge: "03 / PERFORMANCE & SPORTS",
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
};

const getGroupConfig = (groupKey, index, t, isArabic) => {
  if (GROUP_CONFIGS[groupKey]) {
    const cfg = GROUP_CONFIGS[groupKey];
    return {
      badge: cfg.badge,
      title: t(cfg.titleKey, isArabic ? cfg.titleAr : cfg.defaultTitle),
      desc: t(cfg.descKey, isArabic ? cfg.descAr : cfg.defaultDesc),
      cta: t(cfg.ctaKey, isArabic ? cfg.ctaAr : cfg.defaultCta),
      accentColor: cfg.accentColor,
      bgGradient: cfg.bgGradient,
    };
  }

  const numStr = String(index + 1).padStart(2, "0");
  const formattedName = groupKey.toUpperCase();
  return {
    badge: `${numStr} / ${formattedName}`,
    title: isArabic
      ? `صمّم منتجات ${groupKey}`
      : `Create Your Own ${groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}.`,
    desc: isArabic
      ? `استكشف الخامات المتاحة لـ ${groupKey} وأضف لمستك الفنية.`
      : `Explore specialized ${groupKey} blanks and customize with your artwork.`,
    cta: isArabic ? `ابدأ التصميم` : `Start Designing ${groupKey}`,
    accentColor: index % 2 === 0 ? "#F07A48" : "#397FF9",
    bgGradient:
      "radial-gradient(circle at 75% 35%, rgba(240, 122, 72, 0.18) 0%, transparent 65%)",
  };
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const CarouselSection = styled.section`
  width: 100%;
  position: relative;
  background-color: #050505;
  overflow: hidden;
  padding: 1rem 0 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .swiper {
    width: 100%;
    padding-bottom: 4rem;
  }

  .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.25);
    opacity: 1;
    width: 10px;
    height: 10px;
    transition: all 0.3s ease;
  }

  .swiper-pagination-bullet-active {
    background: #f07a48;
    width: 32px;
    border-radius: 6px;
  }
`;

const SlideLayout = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 75vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 2.5rem;
    padding: 2rem 0;
  }
`;

const TextCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 1.2rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${(props) => props.$color || "#F07A48"}60;
  color: ${(props) => props.$color || "#F07A48"};
  font-size: 0.8rem;
  font-weight: 800;
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -0.5px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #a1a1aa;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  max-width: 540px;
  margin: 0;
`;

const BannerCTAButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 1.1rem 2.5rem;
  border-radius: 50px;
  background: ${(props) => props.$color || "#F07A48"};
  color: #050505;
  border: none;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  box-shadow: 0 12px 30px ${(props) => props.$color || "#F07A48"}40;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 18px 40px ${(props) => props.$color || "#F07A48"}60;
    filter: brightness(1.1);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const ArtCol = styled.div`
  position: relative;
  width: 100%;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    height: 320px;
  }
`;

const SlideBackgroundGlow = styled.div`
  position: absolute;
  inset: -20%;
  background: ${(props) => props.$gradient};
  pointer-events: none;
  z-index: 0;
  filter: blur(50px);
  opacity: 0.8;
`;

const ArtCardWrapper = styled(motion.div)`
  position: absolute;
  width: 210px;
  background: rgba(18, 18, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  cursor: pointer;
  z-index: ${(props) => props.$zIndex};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${(props) => props.$accentColor || "#F07A48"};
  }

  @media (max-width: 768px) {
    width: 160px;
    padding: 0.75rem;
  }
`;

const ArtImageStage = styled.div`
  width: 100%;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.6));
  }

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const ArtInfoOverlay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 0.5rem;
  text-align: center;

  .prod-name {
    font-size: 0.85rem;
    font-weight: 800;
    color: #ffffff;
    font-family: "Tajawal", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .prod-price {
    font-size: 0.8rem;
    font-weight: 700;
    font-family: monospace;
  }
`;

const NavControlBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #f07a48;
    color: #f07a48;
    transform: translateY(-50%) scale(1.08);
  }

  &.discovery-prev-btn {
    left: 1.5rem;
  }
  &.discovery-next-btn {
    right: 1.5rem;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    &.discovery-prev-btn {
      left: 0.5rem;
    }
    &.discovery-next-btn {
      right: 0.5rem;
    }
  }
`;

// ============================================================================
// ARTISTIC PRODUCT COMPOSITION ELEMENT
// ============================================================================

const ProductArtElement = ({ product, index, onSelect, accentColor }) => {
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

  // Spatial layout transforms for 3D layered floating artwork
  const transforms = [
    { scale: 1.05, rotate: 0, x: 0, y: -10, zIndex: 3 },
    { scale: 0.88, rotate: -8, x: -65, y: 25, zIndex: 2 },
    { scale: 0.88, rotate: 8, x: 65, y: 20, zIndex: 2 },
    { scale: 0.75, rotate: -14, x: -110, y: 55, zIndex: 1 },
  ];

  const styleConfig = transforms[index % transforms.length];

  const price =
    product.availabilities?.[0]?.sizes?.[0]?.sellingPrice ||
    product.sellingPrice ||
    0;

  return (
    <ArtCardWrapper
      onClick={() => onSelect(product)}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: [styleConfig.y, styleConfig.y - 8, styleConfig.y],
        scale: styleConfig.scale,
        rotate: styleConfig.rotate,
      }}
      transition={{
        y: { repeat: Infinity, duration: 4 + index, ease: "easeInOut" },
        opacity: { duration: 0.6 },
      }}
      whileHover={{
        scale: styleConfig.scale * 1.08,
        rotate: 0,
        zIndex: 10,
        boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 25px ${accentColor}40`,
      }}
      $zIndex={styleConfig.zIndex}
      style={{ left: `calc(50% + ${styleConfig.x}px - 105px)` }}
      $accentColor={accentColor}
    >
      <ArtImageStage>
        {imgUrl ? (
          <img src={imgUrl} alt={product.name} loading="lazy" />
        ) : (
          <div style={{ fontSize: "3.5rem" }}>👕</div>
        )}
      </ArtImageStage>
      <ArtInfoOverlay>
        <span className="prod-name">{product.name}</span>
        <span className="prod-price" style={{ color: accentColor }}>
          {price} DA
        </span>
      </ArtInfoOverlay>
    </ArtCardWrapper>
  );
};

// ============================================================================
// MAIN DISCOVERY CAROUSEL COMPONENT
// ============================================================================

const DiscoveryCarousel = ({ products, onSelectCanvas }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Group products dynamically by product.discoveryGroup or product.categoryLanding
  const groupedProducts = useMemo(() => {
    if (!products || products.length === 0) return {};

    const groups = {};

    products.forEach((product) => {
      // 1. Explicit backend attribute check
      let groupKey = product.discoveryGroup || product.categoryLanding;

      // 2. Fallback heuristic if attribute is not set on legacy products
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
    const keys = Object.keys(groupedProducts);
    return keys.length > 0 ? keys : ["fashion", "accessories", "sports"];
  }, [groupedProducts]);

  const handleCtaClick = (groupKey, items) => {
    if (items && items.length > 0 && onSelectCanvas) {
      onSelectCanvas(items[0]);
    } else {
      const el = document.getElementById("canvas-library-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <CarouselSection>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, Keyboard]}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".discovery-prev-btn",
          nextEl: ".discovery-next-btn",
        }}
        speed={700}
        slidesPerView={1}
      >
        {groupKeys.map((groupKey, index) => {
          const config = getGroupConfig(groupKey, index, t, isArabic);
          const items = groupedProducts[groupKey] || [];

          return (
            <SwiperSlide key={groupKey}>
              <SlideLayout $isArabic={isArabic}>
                <SlideBackgroundGlow $gradient={config.bgGradient} />

                <TextCol $isArabic={isArabic}>
                  <Badge $color={config.accentColor}>{config.badge}</Badge>
                  <Title $color={config.accentColor}>{config.title}</Title>
                  <Description>{config.desc}</Description>

                  <BannerCTAButton
                    type="button"
                    $color={config.accentColor}
                    onClick={() => handleCtaClick(groupKey, items)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{config.cta}</span>
                    {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                  </BannerCTAButton>
                </TextCol>

                <ArtCol>
                  {items.slice(0, 3).map((prod, pIdx) => (
                    <ProductArtElement
                      key={prod._id || prod.id || pIdx}
                      product={prod}
                      index={pIdx}
                      onSelect={onSelectCanvas}
                      accentColor={config.accentColor}
                    />
                  ))}
                </ArtCol>
              </SlideLayout>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Floating Navigation Controls */}
      <NavControlBtn className="discovery-prev-btn" ref={prevRef}>
        {isArabic ? <FaChevronRight /> : <FaChevronLeft />}
      </NavControlBtn>
      <NavControlBtn className="discovery-next-btn" ref={nextRef}>
        {isArabic ? <FaChevronLeft /> : <FaChevronRight />}
      </NavControlBtn>
    </CarouselSection>
  );
};

DiscoveryCarousel.propTypes = {
  products: PropTypes.array,
  onSelectCanvas: PropTypes.func.isRequired,
};

export default DiscoveryCarousel;