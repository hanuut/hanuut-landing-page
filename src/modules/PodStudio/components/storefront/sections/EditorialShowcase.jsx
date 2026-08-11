// src/modules/PodStudio/components/storefront/sections/EditorialShowcase.jsx

import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../../components/Loader";
import ArtistDesignProductModal from "../../Workspace/ArtistDesignProductModal";

const ModalBodyLock = createGlobalStyle`
  body {
    overflow: hidden !important;
    touch-action: none;
  }
`;

const ShowcaseSection = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #08080a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.$compact ? "1.75rem" : "3rem 1.5rem")};
  overflow-y: auto;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CategoryLabel = styled.span`
  font-family: monospace;
  font-size: 0.7rem;
  color: #f07a48;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
`;

const Title = styled.h2`
  font-size: ${(props) => (props.$compact ? "1.25rem" : "clamp(1.8rem, 3vw, 2.5rem)")};
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  line-height: 1.2;
`;

const JoinCreatorBtn = styled.button`
  background: rgba(240, 122, 72, 0.1);
  border: 1px solid rgba(240, 122, 72, 0.3);
  color: #f07a48;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s;
  font-family: "Tajawal", sans-serif;
  flex-shrink: 0;

  &:hover {
    background: #f07a48;
    color: #050505;
    transform: translateY(-2px);
  }
`;

/* 🔴 2-ELEMENTS PER LINE GRID WITH FULL-WIDTH EXPANSION ON HOVER */
const ArtistBentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ArtistCardWrapper = styled(motion.div)`
  height: 220px;
  background: #0f1013;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  transition: grid-column 0.3s ease, border-color 0.3s ease;

  &:hover {
    grid-column: 1 / -1;
    border-color: rgba(240, 122, 72, 0.4);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(240, 122, 72, 0.04) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }
`;

const FanningStage = styled(motion.div)`
  position: absolute;
  inset: 0;
  bottom: 55px;
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
  width: 110px;
  height: 130px;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

/* 🔴 BASE STATE WITH DESIGN PREVIEW TILE STACK INSTEAD OF LETTER CIRCLE */
const BaseStateView = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  z-index: 2;
  padding: 1rem;
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${ArtistCardWrapper}:hover & {
    transform: translateY(-15px);
    opacity: 0;
    pointer-events: none;
  }
`;

const DesignStackPreview = styled.div`
  width: 68px;
  height: 68px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
`;

const MiniDesignTile = styled.div`
  width: 100%;
  height: 100%;
  background: #18181c;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }

  span {
    font-size: 0.65rem;
    color: #52525b;
  }
`;

const ArtistCardFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  background: rgba(10, 10, 12, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const ArtistName = styled.h3`
  font-size: 0.95rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ArtistMetaPill = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  padding: 3px 8px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: "Cairo", sans-serif;
`;

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
  padding: 2rem 1rem;
  width: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
  font-family: "Cairo", sans-serif;
  font-size: 0.85rem;
`;

const getFanVariants = (index, total) => {
  const initial = {
    x: 0, y: index * 2, rotate: 0, scale: 0.9, zIndex: total - index
  };

  let hoverX = 0, hoverY = -10, hoverRot = 0;
  if (total === 1) { hoverX = 0; hoverRot = 0; hoverY = -10; } 
  else if (total === 2) {
    if (index === 0) { hoverX = -25; hoverRot = -10; } else { hoverX = 25; hoverRot = 10; }
  } else {
    if (index === 0) { hoverX = -35; hoverRot = -12; hoverY = 5; } 
    else if (index === 1) { hoverX = 0; hoverRot = 0; hoverY = -15; } 
    else if (index === 2) { hoverX = 35; hoverRot = 12; hoverY = 5; } 
    else { hoverX = (index % 2 === 0 ? 40 : -40); hoverRot = (index % 2 === 0 ? 15 : -15); hoverY = 10; }
  }

  return { initial, hover: { x: hoverX, y: hoverY, rotate: hoverRot, scale: index === 1 ? 1 : 0.9, zIndex: total - index } };
};

const EditorialShowcase = ({ shopId, onSelectDesign, compact = false }) => {
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
      const artistName = meta.artistName || "Studio Creator";
      const collectionName = meta.collectionName || "Studio Drop";

      if (!map[artistName]) {
        map[artistName] = { artistName, totalDesigns: 0, collections: {}, previewImages: [] };
      }
      if (!map[artistName].collections[collectionName]) {
        map[artistName].collections[collectionName] = [];
      }

      map[artistName].collections[collectionName].push(design);
      map[artistName].totalDesigns += 1;

      if (map[artistName].previewImages.length < 4) {
        map[artistName].previewImages.push(design);
      }
    });
    return Object.values(map);
  }, [designs]);

  useEffect(() => {
    if (activeCreator) setActiveTab("All");
  }, [activeCreator]);

  if (loading) return <Loader fullscreen={false} />;

  if (creators.length === 0) {
    return (
      <ShowcaseSection $compact={compact} $isArabic={isArabic}>
        <HeaderRow $isArabic={isArabic}>
          <SectionHeader>
            <CategoryLabel>{t("pod_studio_hero_badge", "CURATED LAB")}</CategoryLabel>
            <Title $compact={compact}>{t("editorial_showcase_title", "AURASLAB X CREATORS")}</Title>
          </SectionHeader>
          <JoinCreatorBtn onClick={() => navigate("collab")}>
            <span>🎨</span> {t("pod_studio_join_creators_btn", "Join")}
          </JoinCreatorBtn>
        </HeaderRow>
        <EmptyContainer>
          <p>{t("preprepared_empty", "New artist collaborations are coming soon.")}</p>
        </EmptyContainer>
      </ShowcaseSection>
    );
  }

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
    <ShowcaseSection $compact={compact} $isArabic={isArabic}>
      <HeaderRow $isArabic={isArabic}>
        <SectionHeader>
          <CategoryLabel>{t("pod_studio_hero_badge", "COLLABORATIONS")}</CategoryLabel>
          <Title $compact={compact}>
            {isArabic ? "الصنايعية X AURASLAB" : "AURASLAB X CREATORS"}
          </Title>
        </SectionHeader>
        <JoinCreatorBtn onClick={() => navigate("collab")}>
          <span>🎨</span> {t("pod_studio_join_creators_btn", "Join")}
        </JoinCreatorBtn>
      </HeaderRow>

      {/* 🔴 2-ELEMENT GRID WITH HOVER FULL-WIDTH EXPANSION */}
      <ArtistBentoGrid>
        {creators.map((creator, idx) => {
          const creatorKey = creator.artistName || `creator-${idx}`;
          const previews = creator.previewImages.slice(0, 4);

          return (
            <ArtistCardWrapper
              key={creatorKey}
              initial="initial"
              whileHover="hover"
              onClick={() => setActiveCreator(creator)}
            >
              {/* BASE STATE: STACKED DESIGNS TILES */}
              <BaseStateView>
                <DesignStackPreview>
                  {[0, 1, 2, 3].map((tileIdx) => {
                    const imgObj = previews[tileIdx];
                    return (
                      <MiniDesignTile key={tileIdx}>
                        {imgObj ? (
                          <img src={`${API_URL}/image/raw/${imgObj._id || imgObj.id}`} alt="Design tile" />
                        ) : (
                          <span>✨</span>
                        )}
                      </MiniDesignTile>
                    );
                  })}
                </DesignStackPreview>
              </BaseStateView>

              {/* HOVER STATE: FANNING ARTWORK PREVIEWS */}
              <FanningStage>
                {previews.map((img, i) => {
                  const total = previews.length;
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

              <ArtistCardFooter $isArabic={isArabic}>
                <ArtistName>
                  {creator.artistName}
                  <FaCheckCircle color="#39A170" size={14} title="Verified Creator" />
                </ArtistName>
                <ArtistMetaPill>
                  {creator.totalDesigns} {isArabic ? "تصاميم" : "Designs"}
                </ArtistMetaPill>
              </ArtistCardFooter>
            </ArtistCardWrapper>
          );
        })}
      </ArtistBentoGrid>

      {/* MODAL TAKEOVER */}
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
                  {collectionNames.map((colName) => (
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
  compact: PropTypes.bool,
};

export default EditorialShowcase;