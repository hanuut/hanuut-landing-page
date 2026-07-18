import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPalette, FaTshirt } from "react-icons/fa";
import {
  fetchPaginatedProducts,
  selectProducts,
} from "../../../Product/state/reducers";
import { selectCategories } from "../../../Categories/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import Loader from "../../../../components/Loader";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";

// --- TEXT PARSER FOR BILINGUAL DESCRIPTIONS ---
const parseBilingualText = (text, targetLang) => {
  if (!text) return "";
  if (targetLang === "ar") return text;
  return text;
};

// --- STYLED COMPONENTS ---
const LibraryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
    font-family: "Tajawal", sans-serif;
    text-transform: uppercase;
  }
  .line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), transparent);
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    background: #111214;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    color: white;
    font-size: 0.85rem;
    outline: none;
    font-family: "Tajawal", sans-serif;
    transition: border-color 0.2s;
    &:focus {
      border-color: #f07a48;
    }
  }
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #52525b;
  }
`;

// --- NEW BREAKOUT INFINITE MARQUEE COMPONENTS ---
const MarqueeWrapper = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%); /* Full bleed breakout */
  overflow: hidden;
  padding: 3rem 0; /* Extra padding to allow images to break out */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  direction: ltr; /* Force LTR for predictable mathematical scrolling */
`;

const MarqueeTrack = styled(motion.div)`
  display: flex;
  gap: 3rem;
  width: max-content;
  align-items: center;
`;

const MarqueeItem = styled.div`
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-10px);
    z-index: 10;
  }
`;

const CircleBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 0 15px rgba(255, 255, 255, 0.02);
  z-index: 0;
  transition: all 0.3s ease;

  ${MarqueeItem}:hover & {
    border-color: #f07a48;
    box-shadow:
      0 15px 40px rgba(240, 122, 72, 0.2),
      inset 0 0 20px rgba(240, 122, 72, 0.05);
  }
`;

// --- GRID CARD COMPONENTS ---
const GridCard = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    border-color: #f07a48;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }
`;

const GridImageStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;

  img {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.5));
    transition: transform 0.4s ease;
  }

  ${GridCard}:hover & img {
    transform: scale(1.08);
  }
`;

const GridInfo = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  flex-grow: 1;
  justify-content: space-between;
`;

const SpecBadge = styled.span`
  background: rgba(255, 255, 255, 0.03);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  color: #71717a;
  font-family: monospace;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ActionBtn = styled.button`
  background: #f07a48;
  color: #000;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
`;

// --- FLOATING POPOVER (MATERIAL BLUEPRINT) ---
const FloatingPopover = styled(motion.div)`
  position: fixed;
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
  width: 380px;
  z-index: 9999;
  pointer-events: none; /* Crucial: Prevents flickering when hovering */
`;

const BlueprintStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #050505;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 0;
  }
`;

const CoordinateOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  z-index: 5;
`;

const CoordText = styled.span`
  color: #f07a48;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
`;

const TagInfo = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  text-align: right;
  z-index: 5;
`;

const CoreTag = styled.div`
  background: #f07a48;
  color: #050505;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 800;
`;

const TechRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.4rem;
  .label {
    font-size: 0.75rem;
    color: #71717a;
    font-weight: 800;
    text-transform: uppercase;
    font-family: "Tajawal", sans-serif;
  }
  .value {
    font-size: 0.8rem;
    color: #e4e4e7;
    font-weight: 700;
    font-family: monospace;
  }
`;

// --- CUSTOM 3D MOCKUP RENDERER ---
const CustomRotatingMockup = ({
  colorObj,
  title,
  isLarge = false,
  isHovered = false,
  isMarquee = false,
}) => {
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [isFrontActive, setIsFrontActive] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (colorObj?.podFrontTemplateId || colorObj?.imageId) {
      getImage(colorObj.podFrontTemplateId || colorObj.imageId)
        .then((res) => {
          if (isMounted && res.data) setFrontUrl(getImageUrl(res.data));
        })
        .catch(() => {});
    }
    if (colorObj?.podBackTemplateId) {
      getImage(colorObj.podBackTemplateId)
        .then((res) => {
          if (isMounted && res.data) setBackUrl(getImageUrl(res.data));
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [colorObj]);

  useEffect(() => {
    if (!backUrl || (!isHovered && !isLarge)) {
      setIsFrontActive(true);
      return;
    }
    const timer = setInterval(() => setIsFrontActive((prev) => !prev), 2600);
    return () => clearInterval(timer);
  }, [backUrl, isHovered, isLarge]);

  const hasBack = !!backUrl;

  // Calculate dynamic scaling. Marquee images break out of their container.
  const imgScaleActive = isMarquee ? 1.2 : isLarge ? 1.05 : 0.95;
  const imgScaleInactive = isMarquee ? 0.9 : isLarge ? 0.88 : 0.8;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      {frontUrl ? (
        <motion.img
          src={frontUrl}
          alt={title}
          animate={{
            zIndex: isFrontActive ? 3 : 1,
            scale: isFrontActive ? imgScaleActive : imgScaleInactive,
            rotate: isFrontActive ? (isLarge ? 5 : 0) : isLarge ? -4 : 0,
            x: isFrontActive ? 0 : isLarge ? -15 : 0,
            opacity: isFrontActive ? 1.0 : 0.6,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: isLarge ? "85%" : "100%",
            height: isLarge ? "85%" : "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))",
          }}
        />
      ) : (
        <div style={{ zIndex: 3, fontSize: isLarge ? "4rem" : "2.5rem" }}>
          👕
        </div>
      )}
      {hasBack && (
        <motion.img
          src={backUrl}
          alt={title}
          animate={{
            zIndex: isFrontActive ? 1 : 3,
            scale: isFrontActive ? imgScaleInactive : imgScaleActive,
            rotate: isFrontActive ? (isLarge ? -6 : 0) : isLarge ? 5 : 0,
            x: isFrontActive ? (isLarge ? 15 : 0) : 0,
            opacity: isFrontActive ? 0.6 : 1.0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: isLarge ? "85%" : "100%",
            height: isLarge ? "85%" : "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))",
          }}
        />
      )}
    </div>
  );
};

// --- OPTIMIZED MEMOIZED MARQUEE ITEM COMPONENT ---
const MemoizedMarqueeItem = React.memo(
  ({ canvas, idx, popoverState, onSelect, onMouseEnter }) => {
    return (
      <MarqueeItem
        onClick={() => onSelect(canvas)}
        onMouseEnter={(e) => onMouseEnter(e, canvas)}
      >
        <CircleBg />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <CustomRotatingMockup
            colorObj={canvas.availableColors?.[0]}
            title={canvas.title}
            isHovered={popoverState.canvas?.canvasId === canvas.canvasId}
            isMarquee={true}
          />
        </div>
      </MarqueeItem>
    );
  },
);

MemoizedMarqueeItem.displayName = "MemoizedMarqueeItem";

const CanvasLibrary = ({ shopId, onSelectCanvas, shop }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { paginatedProducts, paginationLoading } = useSelector(selectProducts);
  const { categories } = useSelector(selectCategories);

  const [popoverState, setPopoverState] = useState({
    canvas: null,
    rect: null,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(
      fetchPaginatedProducts({
        shopId,
        page: 1,
        limit: 30,
        categoryId: "",
        search: "",
        isNewFilter: true,
        printOnDemand: true,
      }),
    );
  }, [dispatch, shopId]);

  const shopCategoryIds = useMemo(() => {
    if (!shop?.categories) return [];
    return shop.categories.map((cat) =>
      typeof cat === "object" ? cat._id || cat.id : cat,
    );
  }, [shop]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      shopCategoryIds.includes(cat.id || cat._id),
    );
  }, [categories, shopCategoryIds]);

  const canvasList = useMemo(() => {
    if (!Array.isArray(paginatedProducts)) return [];
    return paginatedProducts
      .map((p) => {
        const mapped = productToCanvasAdapter(p);
        if (!mapped) return null;
        return {
          ...mapped,
          sku:
            p.sku ||
            String(p._id || p.id)
              .substring(0, 5)
              .toUpperCase(),
          rawCategory: p.categoryId,
          shortDescription: p.shortDescription || "",
          baseCost: p.availabilities?.[0]?.sizes?.[0]?.sellingPrice || 0,
        };
      })
      .filter(Boolean);
  }, [paginatedProducts]);

  // Top 1/3 Marquee Data (Random 15 items max, shuffled)
  const marqueeItems = useMemo(() => {
    const shuffled = [...canvasList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 15);
  }, [canvasList]);

  // Bottom 2/3 Grid Data (Filtered)
  const filteredList = useMemo(() => {
    return canvasList.filter((canvas) => {
      const canvasCatId =
        canvas.rawCategory?.id || canvas.rawCategory?._id || canvas.rawCategory;
      const matchesCategory =
        !selectedCategory || canvasCatId === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        canvas.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        canvas.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [canvasList, selectedCategory, searchQuery]);

  // Hover Handlers for Popover
  const handleMouseEnter = (e, canvas) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverState({ canvas, rect });
  };

  const handleMouseLeave = () => {
    setPopoverState({ canvas: null, rect: null });
  };

  // Popover Positioning Math
  const popoverStyle = useMemo(() => {
    if (!popoverState.rect) return {};
    const { top, left, right, height } = popoverState.rect;
    const isLeftHalf = left < window.innerWidth / 2;

    // Vertical alignment: align center of popover with center of card, clamp to screen
    let popTop = top + height / 2 - 500 / 2;
    popTop = Math.max(20, Math.min(popTop, window.innerHeight - 520));

    if (isLeftHalf) {
      return { top: popTop, left: right + 20 };
    } else {
      return { top: popTop, right: window.innerWidth - left + 20 };
    }
  }, [popoverState.rect]);

  if (paginationLoading && canvasList.length === 0)
    return <Loader fullscreen={false} />;

  return (
    <LibraryContainer onMouseLeave={handleMouseLeave}>
      {/* 1. INFINITE 3D MARQUEE (Top 1/3 Breakout Effect) */}
      {marqueeItems.length > 0 && (
        <MarqueeWrapper>
          <MarqueeTrack
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: marqueeItems.length * 2.5,
            }}
          >
            {[...marqueeItems, ...marqueeItems].map((canvas, idx) => (
              <MemoizedMarqueeItem
                key={`${canvas.canvasId}-${idx}`}
                canvas={canvas}
                idx={idx}
                popoverState={popoverState}
                onSelect={onSelectCanvas}
                onMouseEnter={handleMouseEnter}
              />
            ))}
          </MarqueeTrack>
        </MarqueeWrapper>
      )}

      <SectionHeader style={{ marginTop: "1rem" }}>
        <h3>{t("pod_studio_catalog_heading", "Explore Blank")}</h3>
        <div className="line" />
      </SectionHeader>

      {/* 2. FILTERS */}
      <FilterRow $isArabic={isArabic}>
        <div className="auras-pills-row">
          <button
            className={`auras-category-pill ${selectedCategory === null ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            {t("all_products", "All")}
          </button>
          {filteredCategories.map((cat) => (
            <button
              key={cat.id || cat._id}
              className={`auras-category-pill ${selectedCategory === (cat.id || cat._id) ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id || cat._id)}
            >
              {isArabic ? cat.name : cat.nameFr || cat.name}
            </button>
          ))}
        </div>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder={t("search_products")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
      </FilterRow>

      {/* 3. ASYMMETRIC 5-4 GRID (Bottom 2/3) */}
      <div className="auras-5-4-grid">
        {filteredList.map((canvas) => (
          <GridCard
            key={canvas.canvasId}
            className="auras-5-4-item"
            onClick={() => onSelectCanvas(canvas)}
            onMouseEnter={(e) => handleMouseEnter(e, canvas)}
          >
            <GridImageStage>
              <CustomRotatingMockup
                colorObj={canvas.availableColors?.[0]}
                title={canvas.title}
                isLarge={false}
              />
            </GridImageStage>
            <GridInfo>
              <div>
                <SpecBadge>{canvas.sku}</SpecBadge>
                <h3
                  style={{
                    margin: "8px 0",
                    fontSize: "1.05rem",
                    color: "white",
                    fontFamily: "Tajawal",
                    fontWeight: 800,
                  }}
                >
                  {canvas.title}
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {parseInt(canvas.baseCost)} {t("dzd", "DA")}
                </span>
                <ActionBtn>
                  <FaTshirt /> Design
                </ActionBtn>
              </div>
            </GridInfo>
          </GridCard>
        ))}
      </div>

      {/* 4. SPATIALLY-AWARE FLOATING BLUEPRINT POPOVER */}
      <AnimatePresence>
        {popoverState.canvas && popoverState.rect && (
          <FloatingPopover
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.2 }}
            style={popoverStyle}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  fontFamily: "Tajawal",
                }}
              >
                {t("pod_studio_blank_specifications", "MATERIAL BLUEPRINT")}
              </h4>
              <SpecBadge>{popoverState.canvas.sku}</SpecBadge>
            </div>

            <BlueprintStage>
              <TagInfo>
                <CoreTag>{popoverState.canvas.sku}</CoreTag>
                <div
                  style={{
                    color: "white",
                    fontWeight: 900,
                    fontFamily: "Tajawal",
                    fontSize: "1rem",
                    textTransform: "uppercase",
                  }}
                >
                  {popoverState.canvas.title}
                </div>
              </TagInfo>
              <CustomRotatingMockup
                colorObj={popoverState.canvas.availableColors?.[0]}
                title={popoverState.canvas.title}
                isLarge={true}
                isHovered={true}
              />
              <CoordinateOverlay>
                <CoordText>
                  GSM: {popoverState.canvas.specifications?.gsm || "---"}
                </CoordText>
                <CoordText>
                  CUT: {popoverState.canvas.specifications?.fit || "---"}
                </CoordText>
              </CoordinateOverlay>
            </BlueprintStage>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {popoverState.canvas.specifications?.gsm ? (
                <>
                  <TechRow>
                    <span className="label">Fabric Weight</span>
                    <span className="value">
                      {popoverState.canvas.specifications.gsm} GSM
                    </span>
                  </TechRow>
                  <TechRow>
                    <span className="label">Composition</span>
                    <span className="value">
                      {popoverState.canvas.specifications.composition}
                    </span>
                  </TechRow>
                  <TechRow>
                    <span className="label">Print Zones</span>
                    <span className="value">
                      {popoverState.canvas.specifications.printableSurfaces
                        .join(" & ")
                        .toUpperCase()}
                    </span>
                  </TechRow>
                </>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "#e4e4e7",
                    lineHeight: "1.5",
                    fontFamily: "Cairo, sans-serif",
                  }}
                >
                  {parseBilingualText(
                    popoverState.canvas.shortDescription,
                    i18n.language,
                  )}
                </p>
              )}
            </div>
          </FloatingPopover>
        )}
      </AnimatePresence>
    </LibraryContainer>
  );
};

CanvasLibrary.propTypes = {
  shopId: PropTypes.string.isRequired,
  onSelectCanvas: PropTypes.func.isRequired,
  shop: PropTypes.object.isRequired,
};

export default CanvasLibrary;
