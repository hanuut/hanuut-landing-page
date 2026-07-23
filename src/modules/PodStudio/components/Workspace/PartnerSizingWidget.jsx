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
  font-family: "Tajawal", sans-serif;
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
  font-family: "Cairo", sans-serif;
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
  font-family: "Tajawal", sans-serif;
`;

const Tr = styled.tr`
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  ${(props) =>
    props.$active &&
    css`
      background-color: rgba(240, 122, 72, 0.12) !important;
      border-color: #f07a48 !important;
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
    background: #f07a48;
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

const PartnerSizingWidget = ({ canvas, selectedSize }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [referenceImgSrc, setReferenceImgSrc] = useState(null);

  const sizeChart = canvas?.sizeChart;

  useEffect(() => {
    let isMounted = true;
    if (sizeChart?.referenceImageId) {
      getImage(sizeChart.referenceImageId)
        .then((res) => {
          if (isMounted && res.data) {
            setReferenceImgSrc(getImageUrl(res.data));
          }
        })
        .catch((err) =>
          console.error("Error fetching size chart reference image:", err),
        );
    }
    return () => {
      isMounted = false;
    };
  }, [sizeChart?.referenceImageId]);

  const getMeasurementVal = (s, key) => {
    if (!s || !s.measurements) return "N/A";
    const val = s.measurements instanceof Map ? s.measurements.get(key) : s.measurements[key];
    return val !== undefined && val !== null ? `${val} cm` : "N/A";
  };

  // --- STRICT EXIT GUARD: Render nothing if DB Sizing Data is absent ---
  if (
    !sizeChart ||
    !sizeChart.sizes ||
    sizeChart.sizes.length === 0 ||
    !sizeChart.referenceImageId
  ) {
    return null;
  }

  const category = String(canvas.title || "").toLowerCase();
  const cLabel =
    category.includes("backpack") ||
    category.includes("sac à dos") ||
    category.includes("bag") ||
    category.includes("short") ||
    category.includes("pant")
      ? isArabic
        ? "العمق"
        : "Depth"
      : isArabic
        ? "الأكمام"
        : "Sleeve";

  const columnHeaders = {
    size: isArabic ? "المقاس" : "Size",
    height: isArabic ? "الارتفاع (A)" : "Height (A)",
    width: isArabic ? "العرض (B)" : "Width (B)",
    cDimension: `${cLabel} (C)`,
  };

  return (
    <WidgetContainer id="sizing-spec-widget">
      <WidgetTitle>
        {isArabic
          ? "جدول المقاسات والمواصفات الفنية"
          : t("pod_studio_blank_specifications")}
      </WidgetTitle>
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
              {sizeChart.sizes.map((s, index) => {
                const sizeLabel = s.sizeLabel || s.size || "";
                const isActive =
                  selectedSize &&
                  sizeLabel &&
                  String(sizeLabel).toUpperCase() === String(selectedSize).toUpperCase();
                return (
                  <Tr key={sizeLabel || index} $active={isActive}>
                    <Td>
                      {sizeLabel}
                      {isActive && <span className="badge">Active</span>}
                    </Td>
                    <Td>{getMeasurementVal(s, "A")}</Td>
                    <Td>{getMeasurementVal(s, "B")}</Td>
                    <Td>{getMeasurementVal(s, "C")}</Td>
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
  selectedSize: PropTypes.string,
};

export default PartnerSizingWidget;