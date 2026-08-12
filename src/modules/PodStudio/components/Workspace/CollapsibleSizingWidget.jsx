import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp, FaRulerCombined } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

// ===========================================================================
// STYLED COMPONENTS (LIGHTER & SMALLER)
// ===========================================================================

const Container = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 0.85rem 1rem;
  box-sizing: border-box;
  margin-top: 0.75rem;
  font-family: "Cairo", sans-serif;
  color: #ffffff;
  z-index: 10;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const ActiveSpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;
  flex-wrap: nowrap;
`;

const CurrentSizeText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Tajawal", sans-serif;
  white-space: nowrap;
`;

const ActiveMetricsList = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  direction: ltr; /* Keeps measurements reading standard */
  flex-wrap: nowrap;
`;

const MetricValue = styled.span`
  font-size: 0.7rem;
  color: #a1a1aa;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;

  span.val {
    color: #ffffff;
    font-weight: 600;
  }
`;

const ColorTag = styled.span`
  font-weight: 800;
  color: ${(props) => props.$color};
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Tajawal", sans-serif;
  white-space: nowrap;
  padding: 0;

  &:hover {
    filter: brightness(1.2);
  }
`;

const CollapsibleContent = styled(motion.div)`
  overflow: hidden;
`;

const ContentInner = styled.div`
  margin-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChartLayout = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: flex-start; /* Ensure top alignment */
`;

const BlueprintStage = styled.div`
  width: 90px;
  height: 100px;
  background: #111214;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;

  svg {
    width: 80%; /* Fixed at 80% */
    height: 80%;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SizeTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #a1a1aa;
`;

const Th = styled.th`
  padding: 6px 4px;
  font-weight: 600;
  font-size: 0.55rem; /* 40% Smaller Text */
  color: #71717a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-family: "Tajawal", sans-serif;
`;

const Td = styled.td`
  padding: 6px 4px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  font-weight: ${(props) => (props.$active ? "700" : "400")};
  color: ${(props) => (props.$active ? "#ffffff" : "inherit")};
  background: ${(props) => (props.$active ? "rgba(240, 122, 72, 0.12)" : "transparent")};
  font-size: 0.55rem; /* 40% Smaller Text */

  &:first-child {
    border-radius: ${(props) => (props.$isArabic ? "0 6px 6px 0" : "6px 0 0 6px")};
  }
  
  &:last-child {
    border-radius: ${(props) => (props.$isArabic ? "6px 0 0 6px" : "0 6px 6px 0")};
  }
`;

// ===========================================================================
// DYNAMIC SVG BLUEPRINTS
// ===========================================================================

const COLORS = {
  A: "#F59E0B", // Yellow
  B: "#EF4444", // Red
  C: "#10B981", // Green
};

const TopsBlueprint = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30 10 Q50 20 70 10 L95 35 L80 50 L75 40 L75 110 L25 110 L25 40 L20 50 L5 35 Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line x1="50" y1="15" x2="50" y2="110" stroke={COLORS.A} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="42" y="70" fill={COLORS.A} fontSize="10" fontWeight="bold" fontFamily="sans-serif">A</text>
    <line x1="25" y1="55" x2="75" y2="55" stroke={COLORS.B} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="46" y="51" fill={COLORS.B} fontSize="10" fontWeight="bold" fontFamily="sans-serif">B</text>
    <path d="M70 10 Q90 5 95 35" fill="none" stroke={COLORS.C} strokeWidth="1.5" strokeDasharray="2 2" />
    <text x="84" y="15" fill={COLORS.C} fontSize="10" fontWeight="bold" fontFamily="sans-serif">C</text>
  </svg>
);

const BottomsBlueprint = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25 10 Q50 15 75 10 L80 105 L55 105 L50 45 L45 105 L20 105 Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line x1="25" y1="18" x2="75" y2="18" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M48 10 V25 M52 10 V25" fill="none" stroke="#ffffff" strokeWidth="1" />
    <line x1="85" y1="10" x2="85" y2="105" stroke={COLORS.B} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="89" y="60" fill={COLORS.B} fontSize="10" fontWeight="bold" fontFamily="sans-serif">A</text>
    <line x1="50" y1="45" x2="45" y2="105" stroke={COLORS.A} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="33" y="60" fill={COLORS.A} fontSize="10" fontWeight="bold" fontFamily="sans-serif">B</text>
    <line x1="25" y1="14" x2="75" y2="14" stroke={COLORS.C} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="46" y="27" fill={COLORS.C} fontSize="10" fontWeight="bold" fontFamily="sans-serif">C</text>
  </svg>
);

const BagsBlueprint = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30 30 Q50 -5 70 30 L75 110 L25 110 Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect x="28" y="65" width="44" height="40" rx="3" fill="none" stroke="#ffffff" strokeWidth="1.5" />
    <path d="M45 5 Q50 0 55 5" fill="none" stroke="#ffffff" strokeWidth="2" />
    <line x1="50" y1="13" x2="50" y2="110" stroke={COLORS.A} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="42" y="45" fill={COLORS.A} fontSize="10" fontWeight="bold" fontFamily="sans-serif">A</text>
    <line x1="26" y1="55" x2="74" y2="55" stroke={COLORS.B} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="60" y="51" fill={COLORS.B} fontSize="10" fontWeight="bold" fontFamily="sans-serif">B</text>
    <line x1="28" y1="105" x2="15" y2="115" stroke={COLORS.C} strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="8" y="118" fill={COLORS.C} fontSize="10" fontWeight="bold" fontFamily="sans-serif">C</text>
  </svg>
);

// ===========================================================================
// COMPONENT LOGIC
// ===========================================================================

const CollapsibleSizingWidget = ({ canvas, selectedSize }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [expanded, setExpanded] = useState(false);

  const sizeChart = canvas?.sizeChart;

  const categoryType = useMemo(() => {
    const name = String(canvas?.title || "").toLowerCase();
    const cat = String(canvas?.rawProduct?.categoryId?.nameEn || "").toLowerCase();
    
    if (name.includes("pant") || name.includes("short") || name.includes("jogger") || cat.includes("bottom")) {
      return "bottoms";
    }
    if (name.includes("bag") || name.includes("tote") || name.includes("sac") || name.includes("pack") || cat.includes("access")) {
      return "bags";
    }
    return "tops";
  }, [canvas]);

  const activeSizeData = useMemo(() => {
    if (!sizeChart?.sizes) return null;
    const target = String(selectedSize || "").toUpperCase();
    return sizeChart.sizes.find(
      (s) => String(s.sizeLabel || s.size || "").toUpperCase() === target
    );
  }, [sizeChart, selectedSize]);

  const getMeasurementVal = (item, key) => {
    if (!item || !item.measurements) return "-";
    const val = item.measurements instanceof Map ? item.measurements.get(key) : item.measurements[key];
    return val !== undefined && val !== null ? `${val}` : "-";
  };

  if (!sizeChart || !sizeChart.sizes || sizeChart.sizes.length === 0) {
    return null; 
  }

  return (
    <Container $isArabic={isArabic}>
      <ActiveSpecRow>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FaRulerCombined style={{ color: "#f07a48", fontSize: "0.75rem" }} />
          <CurrentSizeText>
            {isArabic ? "المقاس: " : "Size: "}{selectedSize}
          </CurrentSizeText>
        </div>

        {activeSizeData && (
          <ActiveMetricsList>
            <MetricValue>
              <ColorTag $color={COLORS.A}>A:</ColorTag> <span className="val">{getMeasurementVal(activeSizeData, "A")} cm</span>
            </MetricValue>
            <MetricValue>
              <ColorTag $color={COLORS.B}>B:</ColorTag> <span className="val">{getMeasurementVal(activeSizeData, "B")} cm</span>
            </MetricValue>
          </ActiveMetricsList>
        )}

        <ToggleButton type="button" onClick={() => setExpanded(!expanded)}>
          <span>{expanded ? (isArabic ? "إخفاء" : "Hide") : (isArabic ? "المزيد" : "Expand")}</span>
          {expanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </ToggleButton>
      </ActiveSpecRow>

      <AnimatePresence>
        {expanded && (
          <CollapsibleContent
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ContentInner>
              <ChartLayout>
                <BlueprintStage>
                  {categoryType === "tops" && <TopsBlueprint />}
                  {categoryType === "bottoms" && <BottomsBlueprint />}
                  {categoryType === "bags" && <BagsBlueprint />}
                </BlueprintStage>

                <TableWrapper>
                  <SizeTable>
                    <thead>
                      <tr>
                        <Th>{isArabic ? "المقاس" : "Size"}</Th>
                        <Th><ColorTag $color={COLORS.A}>A</ColorTag></Th>
                        <Th><ColorTag $color={COLORS.B}>B</ColorTag></Th>
                        <Th><ColorTag $color={COLORS.C}>C</ColorTag></Th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.sizes.map((s, idx) => {
                        const label = s.sizeLabel || s.size || "";
                        const isActive = String(label).toUpperCase() === String(selectedSize).toUpperCase();
                        return (
                          <tr key={idx}>
                            <Td $active={isActive} $isArabic={isArabic}>{label}</Td>
                            <Td $active={isActive}>{getMeasurementVal(s, "A")} cm</Td>
                            <Td $active={isActive}>{getMeasurementVal(s, "B")} cm</Td>
                            <Td $active={isActive}>{getMeasurementVal(s, "C")} cm</Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </SizeTable>
                </TableWrapper>
              </ChartLayout>
            </ContentInner>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Container>
  );
};

CollapsibleSizingWidget.propTypes = {
  canvas: PropTypes.object.isRequired,
  selectedSize: PropTypes.string.isRequired,
};

export default CollapsibleSizingWidget;