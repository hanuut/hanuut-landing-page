import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPaintBrush } from "react-icons/fa";
import { getImageUrl } from "../../../../../utils/imageUtils";
import Loader from "../../../../../components/Loader";

// ============================================================================
// STYLED COMPONENTS - PREMIUM EDITORIAL DESIGN SYSTEM
// ============================================================================

const ShowcaseSection = styled.section`
  width: 100%;
  min-height: 50vh;
  position: relative;
  background-color: #050505;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const CategoryLabel = styled.span`
  font-family: monospace;
  font-size: 0.75rem;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  display: block;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;

// --- ADAPTIVE LAYOUT PANELS ---

const AsymmetricHeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
`;

const StaggeredMosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
  width: 100%;
`;

const HorizontalScrollTrack = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0.5rem;
  width: 100%;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// --- CORE DESIGN CARD ---

const DesignCard = styled(motion.div)`
  position: relative;
  background-color: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  aspect-ratio: 4 / 5;
  width: ${(props) => (props.$isCarousel ? "300px" : "100%")};
  scroll-snap-align: start;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  flex: 1;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.6));
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  ${DesignCard}:hover img {
    transform: scale(1.05) rotate(1deg);
  }
`;

const GlassOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(17, 18, 20, 0.95) 0%,
    rgba(17, 18, 20, 0.4) 50%,
    transparent 100%
  );
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 2;
  text-align: left;
`;

// --- TYPOGRAPHY COMPOSITIONS ---

const OversizedArtistBackground = styled.div`
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
  position: absolute;
  bottom: 5%;
  left: 2%;
  line-height: 0.8;
  font-family: "Tajawal", sans-serif;
  pointer-events: none;
  z-index: 0;
  text-transform: uppercase;
  max-width: 95%;
  overflow: hidden;
  white-space: nowrap;
`;

const CollectionStamp = styled.span`
  background: rgba(240, 122, 72, 0.08);
  border: 1px solid rgba(240, 122, 72, 0.2);
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.6rem;
  display: inline-block;
`;

const ArtistLabel = styled.span`
  font-size: 0.8rem;
  color: #71717a;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
`;

const DesignTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0.25rem 0 0 0;
  font-family: "Tajawal", sans-serif;
`;

const CTAButton = styled.button`
  background: #ffffff;
  color: #050505;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-family: "Tajawal", sans-serif;
  width: fit-content;

  &:hover {
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const EmptyContainer = styled.div`
  padding: 4rem 1rem;
  width: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: #71717a;
  font-family: "Cairo", sans-serif;
  font-weight: 500;
  margin: 0;
`;

// ============================================================================
// COMPONENT CLASS
// ============================================================================

const EditorialShowcase = ({ shopId, onSelectDesign }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loader fullscreen={false} />;
  }

  const renderAdaptiveLayout = () => {
    if (designs.length === 0) {
      return (
        <EmptyContainer>
          <EmptyText>
            {t("preprepared_empty", "New collaborations are coming soon.")}
          </EmptyText>
        </EmptyContainer>
      );
    }

    // SCENARIO 1: Minimal Catalog (1–8 Designs)
    if (designs.length <= 8) {
      if (designs.length === 1) {
        const singleDesign = designs[0];
        const meta = singleDesign.podDesignMetadata || {};
        return (
          <AsymmetricHeroGrid>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <OversizedArtistBackground>
                {meta.artistName || "COVOIT"}
              </OversizedArtistBackground>
              <DesignCard
                onClick={() => onSelectDesign(singleDesign)}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ImageContainer>
                  <img
                    src={`${API_URL}/image/raw/${singleDesign._id || singleDesign.id}`}
                    alt={singleDesign.originalname}
                  />
                  <GlassOverlay>
                    {meta.collectionName && (
                      <CollectionStamp>{meta.collectionName}</CollectionStamp>
                    )}
                    <ArtistLabel>
                      {meta.artistName || t("anonymous_artist", "Collaborator")}
                    </ArtistLabel>
                    <DesignTitle>
                      {singleDesign.originalname
                        .split(".")[0]
                        .replace(/[_-]/g, " ")}
                    </DesignTitle>
                  </GlassOverlay>
                </ImageContainer>
              </DesignCard>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                textAlign: isArabic ? "right" : "left",
                alignItems: isArabic ? "flex-start" : "flex-start",
              }}
            >
              <CollectionStamp style={{ width: "fit-content" }}>
                {meta.collectionName || "LAB EXCLUSIVE"}
              </CollectionStamp>
              <Title style={{ fontSize: "2.4rem" }}>
                {singleDesign.originalname.split(".")[0].replace(/[_-]/g, " ")}
              </Title>
              <p
                style={{
                  color: "#a1a1aa",
                  lineHeight: "1.6",
                  margin: "0 0 1rem 0",
                }}
              >
                {t(
                  "editorial_hero_desc",
                  "An exclusive production-ready custom graphic. Apply this layout directly onto any heavy cotton blank inside our custom streetwear laboratory.",
                )}
              </p>
              <CTAButton onClick={() => onSelectDesign(singleDesign)}>
                <FaPaintBrush />{" "}
                {t("pod_studio_start_designing_btn", "Design With This")}
              </CTAButton>
            </div>
          </AsymmetricHeroGrid>
        );
      }

      // Small Grid layout for 2 to 8 items
      return (
        <StaggeredMosaicGrid>
          {designs.map((design) => {
            const meta = design.podDesignMetadata || {};
            return (
              <DesignCard
                key={design._id || design.id}
                onClick={() => onSelectDesign(design)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <ImageContainer>
                  <img
                    src={`${API_URL}/image/raw/${design._id || design.id}`}
                    alt={design.originalname}
                    loading="lazy"
                  />
                  <GlassOverlay>
                    {meta.collectionName && (
                      <CollectionStamp>{meta.collectionName}</CollectionStamp>
                    )}
                    <ArtistLabel>
                      {meta.artistName || t("anonymous_artist", "Collaborator")}
                    </ArtistLabel>
                    <DesignTitle>
                      {design.originalname.split(".")[0].replace(/[_-]/g, " ")}
                    </DesignTitle>
                  </GlassOverlay>
                </ImageContainer>
              </DesignCard>
            );
          })}
        </StaggeredMosaicGrid>
      );
    }

    // SCENARIO 2: Medium Catalog (8–30 Designs)
    if (designs.length <= 30) {
      return (
        <HorizontalScrollTrack style={{ direction: "ltr" }}>
          {designs.map((design) => {
            const meta = design.podDesignMetadata || {};
            return (
              <DesignCard
                key={design._id || design.id}
                $isCarousel={true}
                onClick={() => onSelectDesign(design)}
              >
                <ImageContainer>
                  <img
                    src={`${API_URL}/image/raw/${design._id || design.id}`}
                    alt={design.originalname}
                    loading="lazy"
                  />
                  <GlassOverlay>
                    {meta.collectionName && (
                      <CollectionStamp>{meta.collectionName}</CollectionStamp>
                    )}
                    <ArtistLabel>
                      {meta.artistName || t("anonymous_artist", "Collaborator")}
                    </ArtistLabel>
                    <DesignTitle>
                      {design.originalname.split(".")[0].replace(/[_-]/g, " ")}
                    </DesignTitle>
                  </GlassOverlay>
                </ImageContainer>
              </DesignCard>
            );
          })}
        </HorizontalScrollTrack>
      );
    }

    // SCENARIO 3: Large Catalog (30+ Designs)
    return (
      <HorizontalScrollTrack style={{ direction: "ltr" }}>
        {[...designs, ...designs].map((design, idx) => {
          const meta = design.podDesignMetadata || {};
          return (
            <DesignCard
              key={`${design._id || design.id}-marquee-${idx}`}
              $isCarousel={true}
              onClick={() => onSelectDesign(design)}
            >
              <ImageContainer>
                <img
                  src={`${API_URL}/image/raw/${design._id || design.id}`}
                  alt={design.originalname}
                  loading="lazy"
                />
                <GlassOverlay>
                  {meta.collectionName && (
                    <CollectionStamp>{meta.collectionName}</CollectionStamp>
                  )}
                  <ArtistLabel>
                    {meta.artistName || t("anonymous_artist", "Collaborator")}
                  </ArtistLabel>
                  <DesignTitle>
                    {design.originalname.split(".")[0].replace(/[_-]/g, " ")}
                  </DesignTitle>
                </GlassOverlay>
              </ImageContainer>
            </DesignCard>
          );
        })}
      </HorizontalScrollTrack>
    );
  };

  return (
    <ShowcaseSection className="editorial-showcase-section">
      <SectionHeader $isArabic={isArabic}>
        <CategoryLabel>
          {t("pod_studio_hero_badge", "CURATED LAB")}
        </CategoryLabel>
      </SectionHeader>
      {renderAdaptiveLayout()}
    </ShowcaseSection>
  );
};

EditorialShowcase.propTypes = {
  shopId: PropTypes.string.isRequired,
  onSelectDesign: PropTypes.func.isRequired,
};

export default EditorialShowcase;