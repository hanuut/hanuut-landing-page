// src/modules/PodStudio/components/storefront/sections/EditorialShowcase.jsx
import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes, FaPalette, FaPaintBrush } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../../components/Loader";
import ArtistDesignProductModal from "../../Workspace/ArtistDesignProductModal";

// ===========================================================================
// STYLED COMPONENTS & DYNAMIC HEIGHT ENGINE
// ===========================================================================
const ModalBodyLock = createGlobalStyle`
  body {
    overflow: hidden !important;
    touch-action: none;
  }
`;

const ShowcaseSection = styled.section`
  width: 100%;
  position: relative;
  background-color: #000000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #171717;
  border-bottom: 1px solid #171717;
  transition: all 0.5s ease-out;

  /* 🔴 DYNAMIC SECTION HEIGHT CONSTRAINT */
  ${(props) => {
    if (props.$artistCount <= 4) {
      return `
        min-height: 35vh;
        padding: 3rem 0;
      `;
    } else if (props.$artistCount <= 8) {
      return `
        min-height: 60vh;
        padding: 5rem 0;
      `;
    } else {
      return `
        height: 100vh;
        padding: 2rem 0;
        overflow-y: auto;
      `;
    }
  }}
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  max-width: 1280px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryLabel = styled.span`
  font-family: monospace;
  font-size: 0.75rem;
  color: #f07a48;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -1px;
`;

const JoinCreatorBtn = styled.button`
  background: rgba(240, 122, 72, 0.1);
  border: 1px solid rgba(240, 122, 72, 0.3);
  color: #f07a48;
  padding: 0.8rem 1.75rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.25s;
  font-family: "Tajawal", sans-serif;

  &:hover {
    background: #f07a48;
    color: #050505;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(240, 122, 72, 0.3);
  }
`;

// --- ARTIST CARD REFINEMENTS ---
const ArtistBentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1280px;
  width: 90%;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ArtistCardWrapper = styled(motion.div)`
  aspect-ratio: 4 / 4.5;
  background: #0c0c0e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
`;

const FanningStage = styled(motion.div)`
  position: absolute;
  inset: 0;
  bottom: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ArtistCardWrapper}:hover & {
    opacity: 1;
  }
`;

const CardArtwork = styled(motion.div)`
  position: absolute;
  width: 160px;
  height: 200px;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

// 🔴 BASE STATE: Avatar & Details centered, pushes down on hover
const BaseStateView = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 2;
  transition: transform 0.4s ease, opacity 0.4s ease;

  ${ArtistCardWrapper}:hover & {
    transform: translateY(-20px);
    opacity: 0;
    pointer-events: none;
  }
`;

const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f07a48;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  box-shadow: 0 10px 25px rgba(240, 122, 72, 0.3);
`;

const ArtistCardFooter = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 1.5rem 1.5rem 1.5rem;
  background: linear-gradient(to top, rgba(5, 5, 5, 1) 0%, rgba(5, 5, 5, 0.8) 50%, transparent 100%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  ${(props) => (props.$isArabic ? "align-items: flex-end; text-align: right;" : "")}
`;

const ArtistName = styled.h3`
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin: 0 0 6px 0;
  font-family: "Tajawal", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ArtistMetaPill = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: "Cairo", sans-serif;
`;

const HoverCtaBtn = styled(motion.div)`
  background: #f07a48;
  color: #000;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
  font-family: "Tajawal", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`;

// --- IMMERSIVE TAKEOVER MODAL & STICKY TABS ---
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 2rem;
    align-items: center;
  }
`;

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  background: #0b0b0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px 28px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.8);
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (min-width: 768px) {
    border-radius: 28px;
    height: 85vh;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.85);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #111214;
  flex-shrink: 0;
`;

const ModalHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 900;
    color: white;
    font-family: "Tajawal", sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }
`;

// 🔴 STICKY CATEGORY TABS
const StickyTabsBar = styled.div`
  position: sticky;
  top: 0;
  background: rgba(11, 11, 13, 0.95);
  backdrop-filter: blur(12px);
  z-index: 10;
  display: flex;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;

  &::-webkit-scrollbar { display: none; }
`;

const TabButton = styled.button`
  background: ${(props) => (props.$active ? "#f07a48" : "rgba(255,255,255,0.05)")};
  color: ${(props) => (props.$active ? "#000" : "#a1a1aa")};
  border: 1px solid ${(props) => (props.$active ? "#f07a48" : "rgba(255,255,255,0.1)")};
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.$active ? "#000" : "#fff")};
    border-color: ${(props) => (props.$active ? "#f07a48" : "rgba(255,255,255,0.2)")};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }

  @media (max-width: 768px) { padding: 1.5rem; }
`;

// 🔴 BALANCED CSS GRID
const DesignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
`;

const PureTextDesignCard = styled(motion.div)`
  position: relative;
  background: rgba(23, 23, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  img {
    max-width: 70%;
    max-height: 70%;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
    transition: transform 0.4s ease;
  }

  .hover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    font-weight: 800;
    color: #f07a48;
    font-family: "Tajawal", sans-serif;
  }

  &:hover {
    border-color: rgba(240, 122, 72, 0.5);
    box-shadow: 0 0 20px rgba(240, 122, 72, 0.15);
    transform: scale(1.02);
    
    .hover-overlay { opacity: 1; }
  }
`;

const DirectTextOverlay = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 1rem;
  right: 1rem;
  text-align: center;
  pointer-events: none;
  z-index: 2;

  .art-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: #a1a1aa;
    font-family: "Tajawal", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;

const EmptyContainer = styled.div`
  padding: 4rem 1rem;
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  font-family: "Cairo", sans-serif;
`;

// ===========================================================================
// ANIMATION VARIANTS (THE FANNING EFFECT)
// ===========================================================================
const getFanVariants = (index, total) => {
  const initial = {
    x: 0, y: index * 2, rotate: 0, scale: 0.9, zIndex: total - index
  };

  let hoverX = 0, hoverY = -15, hoverRot = 0;
  if (total === 1) { hoverX = 0; hoverRot = 0; hoverY = -15; } 
  else if (total === 2) {
    if (index === 0) { hoverX = -35; hoverRot = -12; } else { hoverX = 35; hoverRot = 12; }
  } else {
    if (index === 0) { hoverX = -50; hoverRot = -15; hoverY = 10; } 
    else if (index === 1) { hoverX = 0; hoverRot = 0; hoverY = -20; } 
    else if (index === 2) { hoverX = 50; hoverRot = 15; hoverY = 10; } 
    else { hoverX = (index % 2 === 0 ? 60 : -60); hoverRot = (index % 2 === 0 ? 20 : -20); hoverY = 20; }
  }

  return { initial, hover: { x: hoverX, y: hoverY, rotate: hoverRot, scale: index === 1 ? 1 : 0.9, zIndex: total - index } };
};

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

const EditorialShowcase = ({ shopId, onSelectDesign }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCreator, setActiveCreator] = useState(null);
  const [selectedArtistDesign, setSelectedArtistDesign] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const API_URL = useMemo(() => process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com", []);

  useEffect(() => {
    let isMounted = true;
    axios.get(`${API_URL}/image/pod-designs/catalog`)
      .then((res) => { if (isMounted && res.data) setDesigns(res.data); })
      .catch((err) => console.warn("Failed to fetch designs:", err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [API_URL]);

  const creators = useMemo(() => {
    const map = {};
    designs.forEach(design => {
      const meta = design.podDesignMetadata || {};
      const artistName = meta.artistName || "Studio Collaborator";
      const collectionName = meta.collectionName || "Studio Drop";

      if (!map[artistName]) {
        map[artistName] = { artistName, totalDesigns: 0, collections: {}, previewImages: [] };
      }
      if (!map[artistName].collections[collectionName]) {
        map[artistName].collections[collectionName] = [];
      }

      map[artistName].collections[collectionName].push(design);
      map[artistName].totalDesigns += 1;

      if (map[artistName].previewImages.length < 3) {
        map[artistName].previewImages.push(design);
      }
    });
    return Object.values(map);
  }, [designs]);

  // Reset tab when modal opens
  useEffect(() => {
    if (activeCreator) setActiveTab("All");
  }, [activeCreator]);

  if (loading) return <Loader fullscreen={false} />;

  if (creators.length === 0) {
    return (
      <ShowcaseSection $artistCount={0}>
        <HeaderRow $isArabic={isArabic}>
          <SectionHeader>
            <CategoryLabel>{t("pod_studio_hero_badge", "CURATED LAB")}</CategoryLabel>
            <Title>{t("editorial_showcase_title", "Featured Collaborations")}</Title>
          </SectionHeader>
          <JoinCreatorBtn onClick={() => navigate("collab")}>
            <span>🎨</span> {t("pod_studio_join_creators_btn", "Join as a Creator")}
          </JoinCreatorBtn>
        </HeaderRow>
        <EmptyContainer>
          <p>{t("preprepared_empty", "New artist collaborations are coming soon.")}</p>
        </EmptyContainer>
      </ShowcaseSection>
    );
  }

  // Generate Filtered Designs for the active modal
  let displayedDesigns = [];
  let collectionNames = [];
  if (activeCreator) {
    collectionNames = Object.keys(activeCreator.collections);
    if (activeTab === "All") {
      displayedDesigns = Object.values(activeCreator.collections).flat();
    } else {
      displayedDesigns = activeCreator.collections[activeTab] || [];
    }
  }

  return (
    <ShowcaseSection className="editorial-showcase-section" $artistCount={creators.length}>
      <HeaderRow $isArabic={isArabic}>
        <SectionHeader>
          <CategoryLabel>{t("pod_studio_hero_badge", "PREMIUM BLANKS")}</CategoryLabel>
          <Title>{t("editorial_showcase_title", "AURASLAB X CREATORS")}</Title>
        </SectionHeader>
        <JoinCreatorBtn onClick={() => navigate("collab")}>
          <span>🎨</span> {t("pod_studio_join_creators_btn", "Join as a Creator")}
        </JoinCreatorBtn>
      </HeaderRow>

      <ArtistBentoGrid>
        {creators.map((creator, idx) => {
          const creatorKey = creator.artistName || `creator-${idx}`;
          return (
            <ArtistCardWrapper
              key={creatorKey}
              initial="initial"
              whileHover="hover"
              onClick={() => setActiveCreator(creator)}
            >
              <BaseStateView>
                <AvatarCircle>{creator.artistName.charAt(0).toUpperCase()}</AvatarCircle>
                <ArtistName>
                  {creator.artistName}
                  <FaCheckCircle color="#39A170" size={16} title="Verified Creator" />
                </ArtistName>
                <ArtistMetaPill>
                  {Object.keys(creator.collections).length} {isArabic ? "تشكيلات" : "Collections"} • {creator.totalDesigns} {isArabic ? "تصاميم" : "Designs"}
                </ArtistMetaPill>
              </BaseStateView>

              <FanningStage>
                {creator.previewImages.map((img, i) => {
                  const total = creator.previewImages.length;
                  const imgKey = img._id || img.id || `img-${i}`;
                  return (
                    <CardArtwork
                      key={imgKey}
                      variants={getFanVariants(i, total)}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <img src={`${API_URL}/image/raw/${img._id || img.id}`} alt="Artwork preview" />
                    </CardArtwork>
                  );
                })}
              </FanningStage>
            </ArtistCardWrapper>
          );
        })}
      </ArtistBentoGrid>


      {/* 🔴 IMMERSIVE CREATOR TAKEOVER MODAL */}
      <AnimatePresence>
        {activeCreator && (
          <>
            <ModalBodyLock />
            <Overlay
               key="creator-takeover-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCreator(null)}
            >
              <ModalContainer
                $isArabic={isArabic}
                onClick={(e) => e.stopPropagation()}
                initial={{ y: "100%", scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "100%", scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ModalHeader>
                  <ModalHeaderInfo $isArabic={isArabic}>
                    <h2>
                      {activeCreator.artistName}
                      <FaCheckCircle color="#39A170" size={20} />
                    </h2>
                  </ModalHeaderInfo>
                  <CloseBtn onClick={() => setActiveCreator(null)}>
                    <FaTimes />
                  </CloseBtn>
                </ModalHeader>

                <StickyTabsBar>
                  <TabButton $active={activeTab === "All"} onClick={() => setActiveTab("All")}>
                    {isArabic ? "الكل" : "All"}
                  </TabButton>
                  {collectionNames.map(colName => (
                    <TabButton key={colName} $active={activeTab === colName} onClick={() => setActiveTab(colName)}>
                      {colName}
                    </TabButton>
                  ))}
                </StickyTabsBar>

                <ModalBody>
                  <DesignsGrid>
                    {displayedDesigns.map((design) => {
                      const cleanTitle = (design.originalname || "").split(".")[0].replace(/[_-]/g, " ");
                      return (
                        <PureTextDesignCard
                          key={design._id || design.id}
                          onClick={() => {
                            setSelectedArtistDesign(design);
                            setActiveCreator(null); 
                          }}
                        >
                          <img
                            src={`${API_URL}/image/raw/${design._id || design.id}`}
                            alt={cleanTitle}
                            loading="lazy"
                          />
                          <DirectTextOverlay $isArabic={isArabic}>
                            <span className="art-title">{cleanTitle}</span>
                          </DirectTextOverlay>
                          <div className="hover-overlay">
                             {isArabic ? "اختر التصميم" : "Select Design"}
                          </div>
                        </PureTextDesignCard>
                      );
                    })}
                  </DesignsGrid>
                </ModalBody>
              </ModalContainer>
            </Overlay>
          </>
        )}
      </AnimatePresence>

      <ArtistDesignProductModal
        isOpen={!!selectedArtistDesign}
        onClose={() => setSelectedArtistDesign(null)}
        design={selectedArtistDesign}
        shopId={shopId}
        onSelectProductWithDesign={(canvas, design, preferredSide) => {
          setSelectedArtistDesign(null);
          onSelectDesign(canvas, design, preferredSide);
        }}
      />
    </ShowcaseSection>
  );
};

EditorialShowcase.propTypes = {
  shopId: PropTypes.string.isRequired,
  onSelectDesign: PropTypes.func.isRequired,
};

export default EditorialShowcase;