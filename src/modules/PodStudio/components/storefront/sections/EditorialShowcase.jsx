import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes, FaPalette, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../../components/Loader";
import ArtistDesignProductModal from "../../Workspace/ArtistDesignProductModal";

// ===========================================================================
// GLOBALS & STYLES
// ===========================================================================

const ModalBodyLock = createGlobalStyle`
  body {
    overflow: hidden !important;
    touch-action: none;
  }
`;

const ShowcaseSection = styled.section`
  width: 100%;
  padding: 5rem 0;
  position: relative;
  background-color: #050505;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
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
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
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
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
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
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(240, 122, 72, 0.3);
  }
`;

// --- NEW COMPACT BENTO GRID FOR ARTISTS ---
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

const FanningStage = styled.div`
  position: absolute;
  inset: 0;
  bottom: 80px; /* Leave space for the text footer */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
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
    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));
  }
`;

const ArtistCardFooter = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 1.5rem 1.5rem 1.5rem;
  background: linear-gradient(to top, rgba(5, 5, 5, 1) 0%, rgba(5, 5, 5, 0.8) 50%, transparent 100%);
  z-index: 2;
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
  margin-top: 1rem;
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #000;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
  font-family: "Tajawal", sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// --- IMMERSIVE TAKEOVER MODAL ---
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #a1a1aa;
    font-family: "Cairo", sans-serif;
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

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  box-sizing: border-box;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }

  @media (max-width: 768px) { padding: 1.5rem; }
`;

const CollectionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CollectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  h4 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: white;
    font-family: "Tajawal", sans-serif;
  }

  span {
    background: rgba(240, 122, 72, 0.1);
    color: #F07A48;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: monospace;
  }
`;

const DesignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const PureTextDesignCard = styled(motion.div)`
  position: relative;
  background: #09090b;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  img {
    max-width: 75%;
    max-height: 75%;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6));
    transition: transform 0.4s ease;
  }

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    transform: translateY(-4px);
    img { transform: scale(1.06); }
  }
`;

const DirectTextOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1.25rem;
  right: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  pointer-events: none;

  .art-title {
    font-size: 0.85rem;
    font-weight: 800;
    color: white;
    font-family: "Tajawal", sans-serif;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  // Default messy stacked state
  const initial = {
    x: 0,
    y: index * 4,
    rotate: (index % 2 === 0 ? 1 : -1) * (index * 2.5),
    scale: 1 - (index * 0.05),
    zIndex: total - index
  };

  // Fanned out elegant state on hover
  let hoverX = 0, hoverY = -15, hoverRot = 0;

  if (total === 1) { 
    hoverX = 0; hoverRot = 0; hoverY = -15; 
  } else if (total === 2) {
    if (index === 0) { hoverX = -35; hoverRot = -12; hoverY = 0; }
    else { hoverX = 35; hoverRot = 12; hoverY = 0; }
  } else {
    if (index === 0) { hoverX = -55; hoverRot = -18; hoverY = 10; } // Left
    else if (index === 1) { hoverX = 0; hoverRot = 0; hoverY = -25; } // Center High
    else if (index === 2) { hoverX = 55; hoverRot = 18; hoverY = 10; } // Right
    else { hoverX = (index % 2 === 0 ? 70 : -70); hoverRot = (index % 2 === 0 ? 25 : -25); hoverY = 30; } // Hidden backs
  }

  const hover = {
    x: hoverX,
    y: hoverY,
    rotate: hoverRot,
    scale: index === 1 && total > 2 ? 1.05 : 1, // Center pops out more
    zIndex: total - index
  };

  return { initial, hover };
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

  const API_URL = useMemo(() => {
    return process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";
  }, []);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API_URL}/image/pod-designs/catalog`)
      .then((res) => {
        if (isMounted && res.data) {
          setDesigns(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch pre-prepared designs:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  // Transform flat array into Artist -> Collections hierarchy
  const creators = useMemo(() => {
    const map = {};
    designs.forEach(design => {
      const meta = design.podDesignMetadata || {};
      const artistName = meta.artistName || "Studio Collaborator";
      const collectionName = meta.collectionName || "Studio Drop";

      if (!map[artistName]) {
        map[artistName] = {
          artistName,
          totalDesigns: 0,
          collections: {},
          previewImages: [] // Cap at 3 for the fanning effect
        };
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

  if (loading) {
    return <Loader fullscreen={false} />;
  }

  if (creators.length === 0) {
    return (
      <ShowcaseSection>
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

  return (
    <ShowcaseSection className="editorial-showcase-section">
      <HeaderRow $isArabic={isArabic}>
        <SectionHeader>
          <CategoryLabel>{t("pod_studio_hero_badge", "PREMIUM BLANKS")}</CategoryLabel>
          <Title>{t("editorial_showcase_title", "AURASLAB X CREATORS")}</Title>
        </SectionHeader>
        <JoinCreatorBtn onClick={() => navigate("collab")}>
          <span>🎨</span> {t("pod_studio_join_creators_btn", "Join as a Creator")}
        </JoinCreatorBtn>
      </HeaderRow>

      {/* 🔴 THE COMPACT CREATOR BENTO GRID */}
      <ArtistBentoGrid>
        {creators.map((creator, idx) => (
          <ArtistCardWrapper
            key={idx}
            initial="initial"
            whileHover="hover"
            onClick={() => setActiveCreator(creator)}
          >
            <FanningStage>
              {creator.previewImages.map((img, i) => {
                const total = creator.previewImages.length;
                return (
                  <CardArtwork
                    key={img._id || img.id}
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
                <FaCheckCircle color="#39A170" size={16} title="Verified Creator" />
              </ArtistName>
              <ArtistMetaPill>
                {Object.keys(creator.collections).length} {isArabic ? "تشكيلات" : "Collections"} • {creator.totalDesigns} {isArabic ? "تصاميم" : "Designs"}
              </ArtistMetaPill>
              
              <HoverCtaBtn
                variants={{
                  initial: { opacity: 0, y: 15, height: 0, marginTop: 0 },
                  hover: { opacity: 1, y: 0, height: "auto", marginTop: "1rem" }
                }}
              >
                <FaPalette /> {isArabic ? "استكشاف الفنان" : "View Creator"}
              </HoverCtaBtn>
            </ArtistCardFooter>
          </ArtistCardWrapper>
        ))}
      </ArtistBentoGrid>

      {/* 🔴 IMMERSIVE CREATOR TAKEOVER MODAL */}
      <AnimatePresence>
        {activeCreator && (
          <>
            <ModalBodyLock />
            <Overlay
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
                    <p>
                      {activeCreator.totalDesigns} {isArabic ? "تصميم متاح" : "Exclusive Designs"}
                    </p>
                  </ModalHeaderInfo>
                  <CloseBtn onClick={() => setActiveCreator(null)}>
                    <FaTimes />
                  </CloseBtn>
                </ModalHeader>

                <ModalBody>
                  {Object.entries(activeCreator.collections).map(([colName, items]) => (
                    <CollectionSection key={colName}>
                      <CollectionTitleRow>
                        <h4>{colName}</h4>
                        <span>{items.length} {isArabic ? "عناصر" : "Items"}</span>
                      </CollectionTitleRow>
                      
                      <DesignsGrid>
                        {items.map((design) => {
                          const cleanTitle = (design.originalname || "").split(".")[0].replace(/[_-]/g, " ");
                          return (
                            <PureTextDesignCard
                              key={design._id || design.id}
                              onClick={() => {
                                setSelectedArtistDesign(design);
                                setActiveCreator(null); // Close profile, open product selector
                              }}
                              whileHover={{ scale: 1.03 }}
                            >
                              <img
                                src={`${API_URL}/image/raw/${design._id || design.id}`}
                                alt={cleanTitle}
                                loading="lazy"
                              />
                              <DirectTextOverlay $isArabic={isArabic}>
                                <span className="art-title">{cleanTitle}</span>
                              </DirectTextOverlay>
                            </PureTextDesignCard>
                          );
                        })}
                      </DesignsGrid>
                    </CollectionSection>
                  ))}
                </ModalBody>
              </ModalContainer>
            </Overlay>
          </>
        )}
      </AnimatePresence>

      {/* RE-USE EXISTING PRODUCT SELECTION MODAL ONCE A DESIGN IS CLICKED */}
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