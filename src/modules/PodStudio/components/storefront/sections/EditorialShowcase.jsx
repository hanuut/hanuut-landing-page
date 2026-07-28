import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaintBrush, FaCheckCircle, FaLayerGroup, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../../components/Loader";
import ArtistDesignProductModal from "../../Workspace/ArtistDesignProductModal";

// ===========================================================================
// STYLED COMPONENTS - CLUSTERED STACKED COLLECTIONS
// ===========================================================================

const floatOrganic = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(0.3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
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

const ClusterFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1280px;
  width: 90%;
  margin: 0 auto;
`;

const ClusterPileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 1.75rem 2.5rem;
  box-sizing: border-box;
  gap: 2rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(240, 122, 72, 0.3);
    background: rgba(255, 255, 255, 0.035);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
  }
`;

const ClusterMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  .collection-name {
    font-size: 1.6rem;
    font-weight: 900;
    color: white;
    font-family: "Tajawal", sans-serif;
    margin: 0;
  }

  .artist-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #a1a1aa;
    font-weight: 700;
    font-family: "Cairo", sans-serif;
  }

  .count-badge {
    font-size: 0.75rem;
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    font-family: monospace;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const StackPreviewCluster = styled.div`
  position: relative;
  width: 180px;
  height: 130px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 140px;
  }
`;

const StackedItemLayer = styled(motion.div)`
  position: absolute;
  width: 90px;
  height: 110px;
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: ${floatOrganic} 5s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay || "0s"};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
  }
`;

const ExploreStackBtn = styled.button`
  background: #ffffff;
  color: #050505;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const ExpandedGridWrapper = styled(motion.div)`
  background: rgba(14, 14, 16, 0.95);
  border: 1px solid rgba(240, 122, 72, 0.3);
  border-radius: 24px;
  padding: 2rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  position: relative;
`;

const ExpandedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 1rem;

  h4 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: white;
    font-family: "Tajawal", sans-serif;
  }
`;

const CloseGridBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #a1a1aa;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }
`;

const DesignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
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
    font-size: 0.95rem;
    font-weight: 800;
    color: white;
    font-family: "Tajawal", sans-serif;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
  }

  .artist-sub {
    font-size: 0.72rem;
    color: #a1a1aa;
    font-family: "Cairo", sans-serif;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
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

const EditorialShowcase = ({ shopId, onSelectDesign }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCollection, setExpandedCollection] = useState(null);
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

  const groupedCollections = useMemo(() => {
    const groups = {};
    designs.forEach((design) => {
      const meta = design.podDesignMetadata || {};
      const key = meta.collectionName || meta.artistName || "Studio Drop";
      if (!groups[key]) {
        groups[key] = {
          collectionName: meta.collectionName || "Studio Drop",
          artistName: meta.artistName || "Collaborator",
          items: [],
        };
      }
      groups[key].items.push(design);
    });
    return Object.values(groups);
  }, [designs]);

  if (loading) {
    return <Loader fullscreen={false} />;
  }

  if (designs.length === 0) {
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
          <CategoryLabel>{t("pod_studio_hero_badge", "CURATED LAB")}</CategoryLabel>
          <Title>{t("editorial_showcase_title", "Featured Collaborations")}</Title>
        </SectionHeader>
        <JoinCreatorBtn onClick={() => navigate("collab")}>
          <span>🎨</span> {t("pod_studio_join_creators_btn", "Join as a Creator")}
        </JoinCreatorBtn>
      </HeaderRow>

      <ClusterFeed>
        {groupedCollections.map((group, gIdx) => {
          const isExpanded = expandedCollection === group.collectionName;
          const stackPreviews = group.items.slice(0, 3);

          return (
            <div key={gIdx}>
              <ClusterPileRow
                $isArabic={isArabic}
                onClick={() => setExpandedCollection(isExpanded ? null : group.collectionName)}
                style={{ cursor: "pointer" }}
              >
                <ClusterMeta>
                  <span className="count-badge">
                    {group.items.length} {isArabic ? "تصاميم متاحـة" : "Designs Available"}
                  </span>
                  <h3 className="collection-name">{group.collectionName}</h3>
                  <div className="artist-row">
                    <span>{group.artistName}</span>
                    <FaCheckCircle color="#39A170" size={13} title="Verified Creator" />
                  </div>
                </ClusterMeta>

                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <StackPreviewCluster>
                    {stackPreviews.map((item, pIdx) => {
                      const offsets = [
                        { x: -15, rotate: -6, z: 1 },
                        { x: 0, rotate: 2, z: 3 },
                        { x: 15, rotate: 8, z: 2 },
                      ];
                      const transf = offsets[pIdx % offsets.length];

                      return (
                        <StackedItemLayer
                          key={item._id || item.id}
                          $delay={`${pIdx * 0.3}s`}
                          animate={{ x: transf.x, rotate: transf.rotate, zIndex: transf.z }}
                        >
                          <img
                            src={`${API_URL}/image/raw/${item._id || item.id}`}
                            alt=""
                          />
                        </StackedItemLayer>
                      );
                    })}
                  </StackPreviewCluster>

                  <ExploreStackBtn>
                    <FaLayerGroup /> {isExpanded ? (isArabic ? "إغلاق" : "Collapse") : (isArabic ? "استكشاف" : "Explore Stack")}
                  </ExploreStackBtn>
                </div>
              </ClusterPileRow>

              <AnimatePresence>
                {isExpanded && (
                  <ExpandedGridWrapper
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ExpandedHeader>
                      <h4>{group.collectionName} — {group.artistName}</h4>
                      <CloseGridBtn onClick={() => setExpandedCollection(null)}>
                        <FaTimes />
                      </CloseGridBtn>
                    </ExpandedHeader>

                    <DesignsGrid>
                      {group.items.map((design) => {
                        const cleanTitle = design.originalname.split(".")[0].replace(/[_-]/g, " ");
                        return (
                          <PureTextDesignCard
                            key={design._id || design.id}
                            onClick={() => setSelectedArtistDesign(design)}
                            whileHover={{ scale: 1.02 }}
                          >
                            <img
                              src={`${API_URL}/image/raw/${design._id || design.id}`}
                              alt={cleanTitle}
                              loading="lazy"
                            />
                            <DirectTextOverlay $isArabic={isArabic}>
                              <span className="art-title">{cleanTitle}</span>
                              <span className="artist-sub">{group.artistName}</span>
                            </DirectTextOverlay>
                          </PureTextDesignCard>
                        );
                      })}
                    </DesignsGrid>
                  </ExpandedGridWrapper>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </ClusterFeed>

      <ArtistDesignProductModal
        isOpen={!!selectedArtistDesign}
        onClose={() => setSelectedArtistDesign(null)}
        design={selectedArtistDesign}
        shopId={shopId}
        onSelectProductWithDesign={(canvas, design) => {
          setSelectedArtistDesign(null);
          onSelectDesign(canvas, design);
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