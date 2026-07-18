import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";

const HeroContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
  min-height: 80vh;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    min-height: auto;
    padding-top: 2rem;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.75rem;
  position: relative;
  z-index: 2;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const CrosshairTarget = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130%;
  height: 130%;
  pointer-events: none;
  z-index: -1;
  opacity: 0.04;
  background-image:
    linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px),
    radial-gradient(
      circle,
      transparent 25%,
      rgba(255, 255, 255, 1) 26%,
      transparent 28%
    );
  background-size:
    80px 80px,
    80px 80px,
    300px 300px;
  background-position: center;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4.5vw, 4rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -0.5px;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const Description = styled(motion.p)`
  font-size: 1.05rem;
  color: #a1a1aa;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  max-width: 90%;
  margin: 0;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const EnterButton = styled(motion.button)`
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  padding: 1.1rem 2.2rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  box-shadow: 0 10px 25px rgba(240, 122, 72, 0.25);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(240, 122, 72, 0.35);
  }
`;

const RightCol = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 460px;
  perspective: 1200px;
  transform-style: preserve-3d;
`;

const StackWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 420px;
  transform-style: preserve-3d;
`;

const ShowcaseCard = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(28, 28, 30, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.55);
  overflow: hidden;
`;

const GlowingGrid = styled.div`
  position: absolute;
  inset: -10%;
  background-image:
    linear-gradient(rgba(240, 122, 72, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240, 122, 72, 0.08) 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: center;
  transform: translateZ(20px);
  pointer-events: none;
`;

const GarmentVisual = styled.div`
  width: 65%;
  height: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.6));
  transform: translateZ(45px);
  user-select: none;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const CoordinateOverlay = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  transform: translateZ(60px);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  pointer-events: none;
  text-align: left;
`;

const CoordText = styled.span`
  color: #f07a48;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(240, 122, 72, 0.45);
`;

const TagInfo = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  transform: translateZ(55px);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  text-align: right;
`;

const CoreTag = styled.div`
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 800;
`;

const ProductTitle = styled.div`
  color: #ffffff;
  font-weight: 900;
  font-family: "Tajawal", sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
`;

const StackProductImage = ({ product }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const imgId = product?.availabilities?.[0]?.imageId || product?.imageId;
    if (imgId) {
      getImage(imgId)
        .then((res) => {
          if (isMounted && res.data) setUrl(getImageUrl(res.data));
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [product]);

  return url ? (
    <img src={url} alt={product.name || "Product"} loading="lazy" />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#f07a48",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
};

const HeroSection = ({ onScrollToCatalog, sampleProducts }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [activeIdx, setActiveIdx] = useState(0);

  const displayItems = useMemo(() => {
    if (sampleProducts && sampleProducts.length >= 3) {
      return sampleProducts.slice(0, 3).map((p) => ({
        productObj: p,
        title: p.name,
        label: p.sku || "AURAS_LAB",
      }));
    }
    return [
      {
        productObj: { name: "PREMIUM HOODIE" },
        title: "PREMIUM HOODIE",
        label: "PROTOTYPE_084",
      },
      {
        productObj: { name: "HEAVY BOX TEE" },
        title: "HEAVYWEIGHT TEE",
        label: "CORE_ITEM_042",
      },
      {
        productObj: { name: "STUDIO TOTE" },
        title: "STUDIO TOTE",
        label: "CANVAS_121",
      },
    ];
  }, [sampleProducts]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % displayItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  return (
    <HeroContainer dir={isArabic ? "rtl" : "ltr"} $isArabic={isArabic}>
      <LeftCol $isArabic={isArabic}>
        <CrosshairTarget />
        <Title
          $isArabic={isArabic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t("pod_studio_hero_title")}
        </Title>
        <Description
          $isArabic={isArabic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t("pod_studio_hero_desc")}
        </Description>
        <EnterButton
          onClick={onScrollToCatalog}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t("pod_studio_btn_enter_workspace")}
        </EnterButton>
      </LeftCol>

      <RightCol
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX / rect.width - 0.5);
          y.set(e.clientY / rect.height - 0.5);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <StackWrapper style={{ rotateX, rotateY }}>
          {displayItems.map((item, index) => {
            const offset =
              (index - activeIdx + displayItems.length) % displayItems.length;
            const isFront = offset === 0;
            const isMiddle = offset === 1;

            return (
              <ShowcaseCard
                key={index}
                animate={{
                  y: isFront ? 0 : isMiddle ? -35 : -70,
                  scale: isFront ? 1 : isMiddle ? 0.92 : 0.84,
                  opacity: isFront ? 1 : isMiddle ? 0.6 : 0.2,
                  rotateZ: isFront ? 0 : isMiddle ? -2 : 3,
                  zIndex: isFront ? 3 : isMiddle ? 2 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 1,
                }}
                style={{ pointerEvents: isFront ? "auto" : "none" }}
              >
                <GlowingGrid />
                <TagInfo>
                  <CoreTag>{item.label}</CoreTag>
                  <ProductTitle>{item.title}</ProductTitle>
                </TagInfo>
                <GarmentVisual>
                  <StackProductImage product={item.productObj} />
                </GarmentVisual>
                <CoordinateOverlay>
                  <CoordText>COORD_X: {isFront ? "42.09" : "---"}</CoordText>
                  <CoordText>COORD_Y: {isFront ? "80.11" : "---"}</CoordText>
                  <CoordText>Z_DEPTH: {isFront ? "0.25" : "---"}</CoordText>
                </CoordinateOverlay>
              </ShowcaseCard>
            );
          })}
        </StackWrapper>
      </RightCol>
    </HeroContainer>
  );
};

HeroSection.propTypes = {
  onScrollToCatalog: PropTypes.func.isRequired,
  sampleProducts: PropTypes.array,
};

export default HeroSection;
