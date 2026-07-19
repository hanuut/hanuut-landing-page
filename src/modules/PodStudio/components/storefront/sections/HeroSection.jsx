import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";

// ==========================================================
// STYLED COMPONENTS - BLUEPRINT NEON NETWORK & MATRICES
// ==========================================================

const HeroContainer = styled.section`
  width: 100%;
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3rem;
  padding: 3rem 0;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 4rem;
    min-height: auto;
    padding-top: 1rem;
  }
`;

const CrosshairTarget = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130%;
  height: 130%;
  pointer-events: none;
  z-index: 4; /* Below active card, above background queue */
  
  /* Strictly Static Blueprint Grid lines (no scaling or shifts) */
  background-image:
    linear-gradient(rgba(255, 255, 255, 1) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(255, 255, 255, 1) 1.5px, transparent 1px),
    radial-gradient(circle, transparent 25%, rgba(255, 255, 255, 1) 26%, transparent 28%);
  background-size: 80px 80px, 80px 80px, 300px 300px;
  background-position: center center;
`;

const StitchMatrixCanvas = styled.div`
  position: absolute;
  inset: -10% -20%;
  pointer-events: none;
  z-index: 0; /* Locked at bottom of everything */
  overflow: hidden;
  background-color: #050505;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.08) 1.2px,
      transparent 1.2px
    );
    background-size: 24px 24px;
    background-position: center center;
    mask-image: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      black 20%,
      transparent 60%
    );
    -webkit-mask-image: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      black 20%,
      transparent 60%
    );
    transition: opacity 0.5s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: calc(var(--mouse-y, 50%) - 180px);
    left: calc(var(--mouse-x, 50%) - 180px);
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      ${(props) => props.$glowColor || "rgba(240, 122, 72, 0.15)"} 0%,
      transparent 70%
    );
    filter: blur(40px);
    opacity: 0.85;
    transition: background 0.8s ease-in-out;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  position: relative;
  z-index: 8; /* Above background cards, below front card */
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -0.5px;

  span {
    background: linear-gradient(
      135deg,
      #ffffff 40%,
      ${(props) => props.$accent || "#f07a48"} 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.8s ease-in-out;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.05rem;
  color: #a1a1aa;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  max-width: 90%;
  margin: 0;
`;

const EnterButton = styled(motion.button)`
  background: ${(props) => props.$accent || "#F07A48"};
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
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: "Tajawal", sans-serif;
  box-shadow: 0 10px 25px
    ${(props) => props.$accent || "rgba(240, 122, 72, 0.25)"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px
      ${(props) => props.$accent || "rgba(240, 122, 72, 0.35)"};
  }
`;

const RightCol = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  perspective: 1500px;
  transform-style: preserve-3d;
  z-index: 5;
`;

// --- FULL-BLEED FLOW WRAPPER ---
const CardsFlowContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
`;

const ShowcaseCard = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 290px;
  height: 350px;
  background: rgba(18, 18, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  
  filter: ${props => props.$isFront ? "none" : `blur(${props.$blur}px)`};
`;

const GlowingGrid = styled.div`
  position: absolute;
  inset: -10%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: center;
  transform: translateZ(20px);
  pointer-events: none;
`;

const GarmentVisual = styled.div`
  width: 80%;
  height: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.65));
  transform: translateZ(45px);
  user-select: none;
  position: relative;
  top: -15px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const NeonFlickerText = styled(motion.div)`
  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 0.99;
    }
    20%, 24%, 55% {
      opacity: 0.25;
    }
  }
  animation: neonFlicker 3s infinite alternate;
`;

const CoordinateOverlay = styled(NeonFlickerText)`
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
  color: ${(props) => props.$color || "#f07a48"};
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-shadow: 0 0 8px ${(props) => props.$color || "rgba(240, 122, 72, 0.45)"};
  transition: all 0.8s ease-in-out;
`;

const TagInfo = styled(NeonFlickerText)`
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
  background: ${(props) => props.$accent || "#F07A48"};
  color: #050505;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 800;
  box-shadow: 0 0 12px ${(props) => props.$accent || "rgba(240, 122, 72, 0.3)"};
  transition: all 0.8s ease-in-out;
`;

const ProductTitle = styled.div`
  color: #ffffff;
  font-weight: 900;
  font-family: "Tajawal", sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

// ============================================================================
// AUXILIARY UTILITIES & ADAPTERS
// ============================================================================

const StackProductImage = ({ availability }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const imgId = availability?.imageId;
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
  }, [availability]);

  return url ? (
    <img src={url} alt="Variant Substrate" loading="lazy" />
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
          width: "32px",
          height: "32px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#f07a48",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
};

const HeroSection = ({ onScrollToCatalog, sampleProducts, onSelectCanvas }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const containerRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);

  // Dynamic Cursor Coordinates Tracker
  const handleMouseMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  // --- DYNAMIC VARIATIONS EXPANDER ---
  const displayItems = useMemo(() => {
    if (!sampleProducts || sampleProducts.length === 0) {
      return [
        {
          title: "PREMIUM HOODIE",
          label: "AURAS_LAB_01",
          colorHex: "#39A170",
          availability: null,
          productObj: null
        },
        {
          title: "HEAVY STREET TEE",
          label: "AURAS_LAB_02",
          colorHex: "#F07A48",
          availability: null,
          productObj: null
        },
        {
          title: "THE STUDIO TOTE",
          label: "AURAS_LAB_03",
          colorHex: "#397FF9",
          availability: null,
          productObj: null
        },
      ];
    }

    const items = [];
    sampleProducts.forEach((product) => {
      if (product.availabilities && Array.isArray(product.availabilities)) {
        product.availabilities.forEach((av) => {
          items.push({
            title: product.name,
            label: product.sku || "AURAS_LAB",
            colorName: av.color || "white",
            availability: av,
            productObj: product
          });
        });
      }
    });

    return items.sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [sampleProducts]);

  useEffect(() => {
    if (displayItems.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % displayItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  // --- LIGHTNESS/CONTRAST SAFEGUARD ---
  const activeColorTheme = useMemo(() => {
    const activeItem = displayItems[activeIdx];
    if (!activeItem)
      return { hex: "#F07A48", rgba: "rgba(240, 122, 72, 0.15)" };

    const color = String(activeItem.colorName).toLowerCase();
    if (
      color.includes("black") ||
      color.includes("noir") ||
      color.includes("charcoal")
    ) {
      return { hex: "#60A5FA", rgba: "rgba(96, 165, 250, 0.18)" };
    }
    if (color.includes("navy")) {
      return { hex: "#38BDF8", rgba: "rgba(56, 189, 248, 0.18)" };
    }
    if (color.includes("green") || color.includes("vert"))
      return { hex: "#1D9E75", rgba: "rgba(29, 158, 117, 0.15)" };
    if (color.includes("blue") || color.includes("bleu"))
      return { hex: "#397FF9", rgba: "rgba(57, 127, 249, 0.15)" };
    if (color.includes("grey") || color.includes("gris"))
      return { hex: "#A1A1AA", rgba: "rgba(161, 161, 170, 0.12)" };
    if (color.includes("rose") || color.includes("pink"))
      return { hex: "#EC4899", rgba: "rgba(236, 72, 153, 0.15)" };
    if (color.includes("yellow") || color.includes("jaune"))
      return { hex: "#F59E0B", rgba: "rgba(245, 158, 11, 0.15)" };
    if (color.includes("red") || color.includes("rouge") || color.includes("bordeaux") || color.includes("grenat"))
      return { hex: "#EF4444", rgba: "rgba(239, 68, 68, 0.15)" };

    return { hex: "#F07A48", rgba: "rgba(240, 122, 72, 0.15)" };
  }, [displayItems, activeIdx]);

  return (
    <HeroContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      dir={isArabic ? "rtl" : "ltr"}
      $isArabic={isArabic}
    >
      {/* Dynamic pointer-tracking grid canvas background */}
      <StitchMatrixCanvas $glowColor={activeColorTheme.rgba} />
      
      {/* Blueprint Net is locked at z-index: 4, fanned-out underneath front card */}
      <CrosshairTarget
        key={activeIdx}
        $accent={activeColorTheme.hex}
        initial={{ opacity: 0.04 }}
        animate={{
          opacity: [0.04, 0.12, 0.04], // Subtle 5-12% static water-flow ripple
        }}
        transition={{ duration: 2.0, ease: "easeInOut" }}
      />

      <LeftCol $isArabic={isArabic}>
        <Title
          $isArabic={isArabic}
          $accent={activeColorTheme.hex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {i18n.language === "ar" ? (
            <>
              اصنع شيئاً يوجد لمرة <br />
              <span>واحدة فقط في العمر.</span>
            </>
          ) : (
            <>
              CREATE SOMETHING <br />
              <span>THAT EXISTS ONCE.</span>
            </>
          )}
        </Title>
        <Description
          $isArabic={isArabic}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {t("pod_studio_hero_desc")}
        </Description>
        <EnterButton
          onClick={onScrollToCatalog}
          $accent={activeColorTheme.hex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {t("pod_studio_btn_enter_workspace")}
        </EnterButton>
      </LeftCol>

      <RightCol>
        <CardsFlowContainer>
          <AnimatePresence>
            {displayItems.map((item, index) => {
              const offset =
                (index - activeIdx + displayItems.length) % displayItems.length;
              const isFront = offset === 0;
              const isMiddle = offset === 1;
              const isBack = offset === 2;
              const isLayer3 = offset === 3;
              const isLast = offset === 4;

              if (offset > 4) return null; // --- RENDER ALL 5 CARDS FOR FLOW ---

              // --- S3 ALIGNED VISUAL DIRECTION: RIGHT-TO-LEFT ---
              // Starts far-right, moves in one single direction to left active forefront
              const targetX = isArabic 
                ? (isFront ? "-70%" : isMiddle ? "10%" : "90%") // RTL Coords
                : (isFront ? "-30%" : isMiddle ? "-90%" : "-150%"); // LTR Coords
                
              const targetY = isFront 
                ? "-50%" 
                : isMiddle 
                  ? "-55%" 
                  : isBack 
                    ? "-60%" 
                    : isLayer3 
                      ? "-65%" 
                      : "-70%";

              // Back is facing right of the screen (in Arabic and LTR), decrementing to 0 at forefront
              const rotateYVal = isFront 
                ? 0 
                : isMiddle 
                  ? (isArabic ? 12 : -12) 
                  : isBack 
                    ? (isArabic ? 24 : -24) 
                    : isLayer3 
                      ? (isArabic ? 36 : -36) 
                      : (isArabic ? 48 : -48);

              const cardScale = isFront 
                ? 1.0 
                : isMiddle 
                  ? 1.12 
                  : isBack 
                    ? 1.24 
                    : isLayer3 
                      ? 1.36 
                      : 1.48; // S3: Background cards are larger

              const cardBlur = isFront 
                ? 0 
                : isMiddle 
                  ? 3 
                  : isBack 
                    ? 6 
                    : isLayer3 
                      ? 10 
                      : 14; // S3: Highest blur at the back

              return (
                <ShowcaseCard
                  key={index}
                  initial={{ opacity: 0, scale: 1.48, x: isArabic ? "95%" : "-150%", y: "-70%", rotateY: isArabic ? 48 : -48 }}
                  
                  // Sequential keyframes to execute your 1.5s grow and 0.5s fade/drop timing!
                  animate={isFront ? {
                    y: ["-50%", "-50%", "-50%", "-10%"], // Drops down slightly at exit
                    x: ["-45%", "-45%", "-45%", "-120%"],
                    scale: [0.95, 1.05, 0.95, 0.5], // Grows for first 1.5s, then drops/shrinks
                    opacity: [1.0, 1.0, 1.0, 0], // Fades out in the last 0.5s of cycle
                    rotateY: 0,
                    zIndex: 15, // --- FIXED: Sits completely on top of all lines ---
                  } : {
                    y: targetY,
                    x: targetX,
                    scale: cardScale,
                    opacity: isMiddle ? 0.55 : isBack ? 0.35 : isLayer3 ? 0.2 : 0.08,
                    rotateY: rotateYVal, 
                    zIndex: isMiddle ? 3 : isBack ? 2 : isLayer3 ? 1 : 0, // Sits completely under the lines
                  }}
                  $isFront={isFront}
                  $blur={cardBlur}
                  exit={{ opacity: 0, scale: 0.7, x: isArabic ? "-150%" : "90%" }}
                  transition={{
                    duration: 4.5, // Synchronized with displayItems loop timer
                    times: [0, 0.33, 0.88, 1], // Accurate transition breakpoints
                    ease: "easeInOut"
                  }}
                  style={{ pointerEvents: isFront ? "auto" : "none" }}
                  onClick={() => {
                    if (isFront && onSelectCanvas && item.productObj) {
                      onSelectCanvas(item.productObj);
                    }
                  }}
                >
                  <GlowingGrid />
                  
                  {/* Neon Information overlay displays with a 300ms delayed flicker */}
                  <AnimatePresence>
                    {isFront && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        <TagInfo $accent={activeColorTheme.hex}>
                          <CoreTag $accent={activeColorTheme.hex}>
                            {item.label}
                          </CoreTag>
                          <ProductTitle>{item.title}</ProductTitle>
                        </TagInfo>
                        <CoordinateOverlay>
                          <CoordText $color={activeColorTheme.hex}>
                            COORD_X: 50.00%
                          </CoordText>
                          <CoordText $color={activeColorTheme.hex}>
                            COORD_Y: 50.00%
                          </CoordText>
                          <CoordText $color={activeColorTheme.hex}>
                            SCALE: 80.0%
                          </CoordText>
                        </CoordinateOverlay>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <GarmentVisual>
                    {item.availability ? (
                      <StackProductImage availability={item.availability} />
                    ) : (
                      <div style={{ fontSize: "5rem" }}>👕</div>
                    )}
                  </GarmentVisual>
                </ShowcaseCard>
              );
            })}
          </AnimatePresence>
        </CardsFlowContainer>
      </RightCol>
    </HeroContainer>
  );
};

HeroSection.propTypes = {
  onScrollToCatalog: PropTypes.func.isRequired,
  sampleProducts: PropTypes.array,
  onSelectCanvas: PropTypes.func
};

export default HeroSection;