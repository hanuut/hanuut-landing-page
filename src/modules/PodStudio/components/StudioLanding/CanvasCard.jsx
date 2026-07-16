import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";

const CardContainer = styled.div`
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-4px);
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
`;

const CanvasPreviewArea = styled.div`
  width: 100%;
  height: 240px;
  background-color: #0c0c0e;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
    transition: transform 0.4s ease;
  }

  ${CardContainer}:hover img {
    transform: scale(1.05);
  }
`;

const SerialTag = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.75rem;
  color: #a1a1aa;
`;

const ContentBlock = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CanvasTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem 0;
  font-family: 'Tajawal', sans-serif;
  cursor: pointer;
`;

const TechList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const TechMetric = styled.span`
  font-size: 0.85rem;
  color: #a1a1aa;
  font-family: 'Cairo', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '•';
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    font-weight: bold;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background-color: #ffffff;
  color: #050505;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Tajawal', sans-serif;

  &:hover {
    background-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #ffffff;
  }
`;

const CanvasCard = ({ canvas, onSelect }) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (canvas.previewImageId) {
      getImage(canvas.previewImageId)
        .then((res) => {
          if (isMounted && res.data) {
            setImageUrl(getImageUrl(res.data));
          }
        })
        .catch((err) => console.error("Error fetching canvas image preview:", err));
    }
    return () => { isMounted = false; };
  }, [canvas.previewImageId]);

  return (
    <CardContainer>
      <CanvasPreviewArea onClick={() => onSelect(canvas)}>
        <SerialTag>{canvas.serialNumber}</SerialTag>
        {imageUrl ? (
          <img src={imageUrl} alt={canvas.title} loading="lazy" />
        ) : (
          <div style={{ color: "#333", fontSize: "3rem" }}>👕</div>
        )}
      </CanvasPreviewArea>
      <ContentBlock>
        <CanvasTitle onClick={() => onSelect(canvas)}>{canvas.title}</CanvasTitle>
        <TechList>
          <TechMetric>{canvas.specifications.gsm} GSM</TechMetric>
          <TechMetric>{canvas.specifications.composition}</TechMetric>
          <TechMetric>{canvas.specifications.fit}</TechMetric>
          <TechMetric>
            {t("pod_studio.printable_surface")}: {canvas.specifications.printableSurfaces.join(" + ").toUpperCase()}
          </TechMetric>
        </TechList>
        <ActionButton onClick={() => onSelect(canvas)}>
          {t("pod_studio.start_designing_cta")}
        </ActionButton>
      </ContentBlock>
    </CardContainer>
  );
};

CanvasCard.propTypes = {
  canvas: PropTypes.shape({
    canvasId: PropTypes.string.isRequired,
    serialNumber: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    previewImageId: PropTypes.string,
    specifications: PropTypes.shape({
      gsm: PropTypes.string,
      composition: PropTypes.string,
      fit: PropTypes.string,
      printableSurfaces: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
  }).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default CanvasCard;