import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getFittedPrintZoneRatios } from "../../hooks/usePrintableArea";
import { retrieveFile } from "../../utils/indexedDbHelper";

const MockupContainer = styled.div`
  position: relative;
  width: ${props => props.$width || "100%"};
  height: ${props => props.$height || "100%"};
  background-color: #0c0c0e;
  border-radius: ${props => props.$borderRadius || "12px"};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;
`;

const BaseTemplateImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
`;

const TemplateContentArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: hidden; /* THE PHYSICAL PRODUCT SEAM CLIPPING CONTAINER */
  top: ${props => props.$area.top}%;
  left: ${props => props.$area.left}%;
  width: ${props => props.$area.width}%;
  height: ${props => props.$area.height}%;
  pointer-events: none;
`;

const PrintZoneOutline = styled.div`
  position: absolute;
  z-index: 3;
  border: 1px dashed rgba(255, 255, 255, 0.25); /* Guideline overlay, visible but overflow is visible */
  top: ${props => props.$area.top}%;
  left: ${props => props.$area.left}%;
  width: ${props => props.$area.width}%;
  height: ${props => props.$area.height}%;
  pointer-events: none;
`;

const DesignImage = styled.img`
  position: absolute;
  transform: translate(-50%, -50%);
  object-fit: contain;
  z-index: 4;
`;

const PodMockupPreview = ({ item, side = "front", width, height, borderRadius, onClick }) => {
  const [activeUrl, setActiveUrl] = useState(null);
  const custom = item?.podCustomization;
  
  const design = useMemo(() => {
    if (!custom) return null;
    return side === "back" ? custom.back : custom.front;
  }, [custom, side]);

  useEffect(() => {
    let isMounted = true;
    let blobUrl = null;

    if (design?.imageUrl) {
      if (design.imageUrl.startsWith("blob:") && item.variantId) {
        retrieveFile(`${item.variantId}_${side}`).then((fileBlob) => {
          if (isMounted && fileBlob) {
            blobUrl = URL.createObjectURL(fileBlob);
            setActiveUrl(blobUrl);
          } else if (isMounted) {
            setActiveUrl(design.imageUrl);
          }
        });
      } else {
        setActiveUrl(design.imageUrl);
      }
    }

    return () => {
      isMounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [design, item.variantId, side]);

  if (!custom || !design) return null;

  const ratios = getFittedPrintZoneRatios(item.title, item.sizeSelected || item.size, side);
  const templateUrl = design.templateUrl;

  return (
    <MockupContainer $width={width} $height={height} $borderRadius={borderRadius} onClick={onClick}>
      <BaseTemplateImage src={templateUrl} alt="Garment Base Substrate" />
      
      {/* Product Boundary Clipping Mask */}
      <TemplateContentArea $area={ratios.contentArea}>
        {/* Positioning Container relative to Product boundaries */}
        <div style={{
          position: "absolute",
          top: `${ratios.printArea.top}%`,
          left: `${ratios.printArea.left}%`,
          width: `${ratios.printArea.width}%`,
          height: `${ratios.printArea.height}%`,
          overflow: "visible" // Let artwork bleed outside print zone!
        }}>
          {activeUrl && (
            <DesignImage
              src={activeUrl}
              alt="Custom Print"
              style={{
                left: `${design.x}%`,
                top: `${design.y}%`,
                width: `${design.width}%`,
                transform: `translate(-50%, -50%) rotate(${design.rotation || 0}deg)`
              }}
            />
          )}
        </div>
      </TemplateContentArea>

      {/* Dashed Guideline on Top */}
      <PrintZoneOutline $area={ratios.absolutePrintArea} />
    </MockupContainer>
  );
};

PodMockupPreview.propTypes = {
  item: PropTypes.object.isRequired,
  side: PropTypes.oneOf(["front", "back"]),
  width: PropTypes.string,
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  onClick: PropTypes.func
};

export default PodMockupPreview;