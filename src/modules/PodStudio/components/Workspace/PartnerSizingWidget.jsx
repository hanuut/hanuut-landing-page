import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";

const WidgetContainer = styled.div`
  margin-top: 4rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2.5rem;
  box-sizing: border-box;
  text-align: start;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 2rem;
  }
`;

const WidgetTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1.5rem;
  font-family: 'Tajawal', sans-serif;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
`;

const WidgetSplit = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const DiagramWrapper = styled.div`
  flex: 0.6;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #a1a1aa;
  max-width: 250px;
  width: 100%;
  height: 250px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const TableWrapper = styled.div`
  flex: 1.4;
  width: 100%;
  overflow-x: auto;
`;

const SizingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Cairo', sans-serif;
  text-align: center;
  color: #a1a1aa;
`;

const Th = styled.th`
  padding: 0.85rem 1rem;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #71717a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Tajawal', sans-serif;
`;

const Tr = styled.tr`
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  ${props => props.$active && css`
    background-color: rgba(240, 122, 72, 0.12) !important;
    border-color: #F07A48 !important;
    color: white !important;
    font-weight: 700;
  `}
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.95rem;
  
  span.badge {
    background: #F07A48;
    color: #000;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 8px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
  }
`;

// Local fallback dictionary matching the exact specifications of the current database items
const LOCAL_WIDGET_FALLBACKS = {
  "canvas 170": {
    referenceImageId: "6a53719234375f0d37a15e06",
    sizes: [
      { size: "XS", measurements: { A: 56, B: 49, C: 32 } },
      { size: "S", measurements: { A: 59, B: 51, C: 33 } },
      { size: "M", measurements: { A: 62, B: 53, C: 35 } },
      { size: "L", measurements: { A: 64, B: 55, C: 37 } },
      { size: "XL", measurements: { A: 67, B: 57, C: 38 } },
      { size: "XXL", measurements: { A: 68, B: 60, C: 40 } },
      { size: "XXXL", measurements: { A: 70, B: 62, C: 42 } }
    ]
  },
  "oversize street tee": {
    referenceImageId: "6a54342534375f0d37a16f6d",
    sizes: [
      { size: "S", measurements: { A: 67, B: 47, C: 23 } },
      { size: "M", measurements: { A: 64, B: 49, C: 23 } },
      { size: "L", measurements: { A: 65, B: 52, C: 23 } },
      { size: "XL", measurements: { A: 70, B: 55, C: 23 } }
    ]
  },
  "backpack": {
    referenceImageId: "6a543e9834375f0d37a17237",
    sizes: [
      { size: "Standard", measurements: { A: 34, B: 27, C: 15 } }
    ]
  },
  "sac à dos": {
    referenceImageId: "6a543e9834375f0d37a17237",
    sizes: [
      { size: "Standard", measurements: { A: 34, B: 27, C: 15 } }
    ]
  },
  "hoodie": {
    referenceImageId: "6a5437d934375f0d37a1702b",
    sizes: [
      { size: "S", measurements: { A: 60, B: 54, C: 63 } },
      { size: "M", measurements: { A: 60, B: 58, C: 65 } },
      { size: "L", measurements: { A: 60, B: 60, C: 65 } },
      { size: "XL", measurements: { A: 60, B: 62, C: 68 } },
      { size: "XXL", measurements: { A: 62, B: 64, C: 69 } }
    ]
  },
  "manches longues": {
    referenceImageId: "6a543d5434375f0d37a171f3",
    sizes: [
      { size: "S", measurements: { A: 61, B: 49, C: 62 } },
      { size: "M", measurements: { A: 62, B: 51, C: 65 } },
      { size: "L", measurements: { A: 63, B: 54, C: 66 } },
      { size: "XL", measurements: { A: 65, B: 56, C: 69 } }
    ]
  },
  "sweat classic": {
    referenceImageId: "6a543b0e34375f0d37a17110",
    sizes: [
      { size: "S", measurements: { A: 60, B: 34, C: 59 } },
      { size: "M", measurements: { A: 62, B: 36, C: 60 } },
      { size: "L", measurements: { A: 63, B: 39, C: 61 } },
      { size: "XL", measurements: { A: 64, B: 40, C: 63 } },
      { size: "XXL", measurements: { A: 67, B: 43, C: 65 } },
      { size: "XXXL", measurements: { A: 69, B: 45, C: 65 } }
    ]
  },
  "acid oversize": {
    referenceImageId: "6a5323e5d21b7704643ae1c4",
    sizes: [
      { size: "S", measurements: { A: 65, B: 48, C: 42 } },
      { size: "M", measurements: { A: 66, B: 50, C: 43 } },
      { size: "L", measurements: { A: 67, B: 52, C: 44 } },
      { size: "XL", measurements: { A: 68, B: 52, C: 45 } }
    ]
  }
};

const PartnerSizingWidget = ({ canvas, selectedSize }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [referenceImgSrc, setReferenceImgSrc] = useState(null);

  // 1. Check if size chart is present in database payload
  let sizeChart = canvas?.sizeChart;

  // 2. Local fallback if DB is not yet migrated
  if (!sizeChart && canvas?.title) {
    const titleLower = String(canvas.title).toLowerCase();
    const matchedKey = Object.keys(LOCAL_WIDGET_FALLBACKS).find(key => titleLower.includes(key));
    if (matchedKey) {
      sizeChart = LOCAL_WIDGET_FALLBACKS[matchedKey];
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (sizeChart?.referenceImageId) {
      getImage(sizeChart.referenceImageId)
        .then((res) => {
          if (isMounted && res.data) {
            setReferenceImgSrc(getImageUrl(res.data));
          }
        })
        .catch((err) => console.error("Error fetching size chart reference image:", err));
    }
    return () => {
      isMounted = false;
    };
  }, [sizeChart?.referenceImageId]);

  // If there are no measurements, do not render anything
  if (!sizeChart || !sizeChart.sizes || sizeChart.sizes.length === 0 || !sizeChart.referenceImageId) {
    return null;
  }

  const category = String(canvas.title || "").toLowerCase();
  const cLabel = (category.includes("backpack") || category.includes("bag") || category.includes("short") || category.includes("pant")) 
    ? (isArabic ? "العمق" : "Depth") 
    : (isArabic ? "الأكمام" : "Sleeve");

  const columnHeaders = {
    size: isArabic ? "المقاس" : "Size",
    height: isArabic ? "الارتفاع (A)" : "Height (A)",
    width: isArabic ? "العرض (B)" : "Width (B)",
    cDimension: `${cLabel} (C)`
  };

  return (
    <WidgetContainer>
      <WidgetTitle>{isArabic ? "جدول المقاسات والمواصفات الفنية" : "TECHNICAL SIZE SPECIFICATIONS"}</WidgetTitle>
      <WidgetSplit>
        <DiagramWrapper>
          {referenceImgSrc ? (
            <img src={referenceImgSrc} alt="Sizing Reference Diagram" />
          ) : (
            <div style={{ fontSize: "2.5rem" }}>📐</div>
          )}
        </DiagramWrapper>
        <TableWrapper>
          <SizingTable>
            <thead>
              <tr>
                <Th>{columnHeaders.size}</Th>
                <Th>{columnHeaders.height}</Th>
                <Th>{columnHeaders.width}</Th>
                <Th>{columnHeaders.cDimension}</Th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.sizes.map((s) => {
                const isActive = String(s.size).toUpperCase() === String(selectedSize).toUpperCase();
                return (
                  <Tr key={s.size} $active={isActive}>
                    <Td>
                      {s.size}
                      {isActive && <span className="badge">Active</span>}
                    </Td>
                    <Td>{s.measurements.A} cm</Td>
                    <Td>{s.measurements.B} cm</Td>
                    <Td>{s.measurements.C ? `${s.measurements.C} cm` : "N/A"}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </SizingTable>
        </TableWrapper>
      </WidgetSplit>
    </WidgetContainer>
  );
};

PartnerSizingWidget.propTypes = {
  canvas: PropTypes.object.isRequired,
  selectedSize: PropTypes.string.isRequired
};

export default PartnerSizingWidget;