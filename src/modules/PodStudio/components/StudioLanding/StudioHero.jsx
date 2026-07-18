import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import AppLogo3D from "../../../../assets/logos/myHanuut/logo_ar.png";

import PlatformDownloadButtons from "../../../Partners/components/PlatformDownloadButtons";
import DigitalMatrixCanvas from "../../../Partners/components/DigitalMatrixCanvas";

const HeroContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  margin-bottom: 1.5rem;
  box-sizing: border-box;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
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

const Title = styled.h1`
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin: 0;
  text-transform: uppercase;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -0.5px;
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: #a1a1aa;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  max-width: 90%;
  margin: 0;
`;

const EnterButton = styled.button`
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
  transition:
    opacity 0.5s,
    transform 0.5s;
`;

const GlowingGrid = styled.div`
  position: absolute;
  inset: -10%;
  background-image:
    linear-gradient(rgba(0, 210, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 210, 255, 0.08) 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: center;
  transform: translateZ(20px);
  pointer-events: none;
`;

const GarmentVisual = styled.div`
  font-size: 8rem;
  color: #ffffff;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.6));
  transform: translateZ(45px);
  user-select: none;
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
  color: #00d2ff;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(0, 210, 255, 0.45);
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
  box-shadow: 0 0 12px rgba(240, 122, 72, 0.3);
`;

const ProductTitle = styled.div`
  color: #ffffff;
  font-weight: 900;
  font-family: "Tajawal", sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
`;

const DEFAULT_STACK = [
  { emoji: "👕", title: "HEAVYWEIGHT TEE", label: "CORE_ITEM_042" },
  { emoji: "🧥", title: "PREMIUM HOODIE", label: "PROTOTYPE_084" },
  { emoji: "🎒", title: "TRAVEL BACKPACK", label: "CORDURA_121" },
];

const StudioHero = ({ onEnterWorkspace }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [activeIdx, setActiveIdx] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 18 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % DEFAULT_STACK.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <HeroContainer dir={isArabic ? "rtl" : "ltr"}>
      <LeftCol $isArabic={isArabic}>
        <CrosshairTarget />
        <Title>{t("pod_studio_hero_create_once")}</Title>
        <Description>{t("pod_studio_hero_desc")}</Description>
        <EnterButton onClick={onEnterWorkspace}>
          {t("pod_studio_btn_enter_workspace")}
        </EnterButton>
      </LeftCol>
      <RightCol onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <StackWrapper style={{ rotateX, rotateY }}>
          {DEFAULT_STACK.map((item, index) => {
            const offset =
              (index - activeIdx + DEFAULT_STACK.length) % DEFAULT_STACK.length;
            const isFront = offset === 0;
            const isMiddle = offset === 1;

            let zIndex = 1;
            let opacity = 0.45;
            let scale = 0.88;
            let yShift = "-40px";

            if (isFront) {
              zIndex = 3;
              opacity = 1.0;
              scale = 1.0;
              yShift = "0px";
            } else if (isMiddle) {
              zIndex = 2;
              opacity = 0.7;
              scale = 0.94;
              yShift = "-20px";
            }

            return (
              <ShowcaseCard
                key={index}
                style={{
                  zIndex,
                  opacity,
                  scale,
                  y: yShift,
                  pointerEvents: isFront ? "auto" : "none",
                }}
              >
                <GlowingGrid />
                <TagInfo>
                  <CoreTag>{item.label}</CoreTag>{" "}
                  <ProductTitle>{item.title}</ProductTitle>{" "}
                </TagInfo>{" "}
                <GarmentVisual>{item.emoji}</GarmentVisual>{" "}
                <CoordinateOverlay>
                  {" "}
                  <CoordText>COORD_X: 42.09</CoordText>{" "}
                  <CoordText>COORD_Y: 80.11</CoordText>{" "}
                  <CoordText>Z_DEPTH: 0.25</CoordText>{" "}
                </CoordinateOverlay>{" "}
              </ShowcaseCard>
            );
          })}{" "}
        </StackWrapper>{" "}
      </RightCol>{" "}
    </HeroContainer>
  );
};
StudioHero.propTypes = { onEnterWorkspace: PropTypes.func.isRequired };
export default StudioHero;
