import React, { useState, useEffect , useMemo} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp, FaRulerCombined } from "react-icons/fa";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import { AnimatePresence } from "framer-motion";

const Container = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1rem;
  box-sizing: border-box;
  margin-top: 1rem;
  font-family: "Cairo", sans-serif;
  color: #ffffff;
  z-index: 10;
`;

const ActiveSpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ActiveMetricsList = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  direction: ltr; /* Keeps measurements reading standard */
`;

const MetricValue = styled.span`
  font-size: 0.85rem;
  color: #a1a1aa;
  font-weight: 600;
  span {
    color: #ffffff;
    font-weight: 800;
  }
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Tajawal", sans-serif;
`;

const CollapsibleContent = styled.div`
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ChartLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const DiagramBox = styled.div`
  width: 100px;
  height: 100px;
  background: #09090b;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-x: auto;
`;

const SizeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  color: #a1a1aa;
`;

const Th = styled.th`
  padding: 6px 8px;
  font-weight: 800;
  color: #71717a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const Td = styled.td`
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  font-weight: ${(props) => (props.$active ? "800" : "400")};
  color: ${(props) => (props.$active ? "#ffffff" : "inherit")};
  background: ${(props) => (props.$active ? "rgba(240, 122, 72, 0.12)" : "transparent")};
`;

const CollapsibleSizingWidget = ({ canvas, selectedSize }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [expanded, setExpanded] = useState(false);
  const [diagramUrl, setDiagramUrl] = useState(null);

  const sizeChart = canvas?.sizeChart;

  useEffect(() => {
    let isMounted = true;
    if (sizeChart?.referenceImageId) {
      getImage(sizeChart.referenceImageId)
        .then((res) => {
          if (isMounted && res.data) {
            setDiagramUrl(getImageUrl(res.data));
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [sizeChart?.referenceImageId]);

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
    return val !== undefined && val !== null ? `${val} cm` : "-";
  };

  if (!sizeChart || !sizeChart.sizes || sizeChart.sizes.length === 0) {
    return null;
  }

  return (
    <Container>
      <ActiveSpecRow>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaRulerCombined style={{ color: "#f07a48", fontSize: "0.85rem" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: "800" }}>
            {isArabic ? `المقاس الحالي: ${selectedSize}` : `Active Size: ${selectedSize}`}
          </span>
        </div>

        {activeSizeData && (
          <ActiveMetricsList>
            <MetricValue>
              A: <span>{getMeasurementVal(activeSizeData, "A")}</span>
            </MetricValue>
            <MetricValue>
              B: <span>{getMeasurementVal(activeSizeData, "B")}</span>
            </MetricValue>
          </ActiveMetricsList>
        )}

        <ToggleButton type="button" onClick={() => setExpanded(!expanded)}>
          <span>{expanded ? (isArabic ? "إخفاء" : "Hide") : (isArabic ? "المزيد" : "Expand")}</span>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </ToggleButton>
      </ActiveSpecRow>

      <AnimatePresence>
        {expanded && (
          <CollapsibleContent>
            <ChartLayout>
              {diagramUrl && (
                <DiagramBox>
                  <img src={diagramUrl} alt="Sizing Reference Diagram" />
                </DiagramBox>
              )}
              <TableWrapper>
                <SizeTable>
                  <thead>
                    <tr>
                      <Th>{isArabic ? "المقاس" : "Size"}</Th>
                      <Th>A</Th>
                      <Th>B</Th>
                      <Th>C</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.sizes.map((s, idx) => {
                      const label = s.sizeLabel || s.size || "";
                      const isActive = String(label).toUpperCase() === String(selectedSize).toUpperCase();
                      return (
                        <tr key={idx}>
                          <Td $active={isActive}>{label}</Td>
                          <Td $active={isActive}>{getMeasurementVal(s, "A")}</Td>
                          <Td $active={isActive}>{getMeasurementVal(s, "B")}</Td>
                          <Td $active={isActive}>{getMeasurementVal(s, "C")}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </SizeTable>
              </TableWrapper>
            </ChartLayout>
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