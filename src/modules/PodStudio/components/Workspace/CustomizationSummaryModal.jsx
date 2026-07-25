import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaShieldAlt, FaTimes } from "react-icons/fa";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalCard = styled(motion.div)`
  width: 100%;
  max-width: 460px;
  background: #141416;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    font-family: "Tajawal", sans-serif;
  }
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #a1a1aa;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    color: white;
  }
`;

const SummaryTable = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;

  .label {
    color: #a1a1aa;
  }
  .value {
    color: white;
    font-weight: 700;
  }
`;

const NoteBox = styled.div`
  background: rgba(240, 122, 72, 0.08);
  border: 1px solid rgba(240, 122, 72, 0.2);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 0.8rem;
  color: #d4d4d8;
  line-height: 1.4;

  svg {
    color: #f07a48;
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  border: none;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$primary
      ? `
    background: #F07A48;
    color: #050505;
  `
      : `
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
`;

export const CustomizationSummaryModal = ({
  isOpen,
  onClose,
  onConfirm,
  summaryData,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (!isOpen || !summaryData) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalCard
          $isArabic={isArabic}
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <Header>
            <h3>
              {isArabic
                ? "تأكيد تفاصيل التصميم"
                : "Your Customization Summary"}
            </h3>
            <CloseBtn onClick={onClose}>
              <FaTimes />
            </CloseBtn>
          </Header>

          <SummaryTable>
            <Row>
              <span className="label">{isArabic ? "المنتج" : "Product"}</span>
              <span className="value">{summaryData.productTitle}</span>
            </Row>
            <Row>
              <span className="label">{isArabic ? "المقاس" : "Size"}</span>
              <span className="value">{summaryData.size}</span>
            </Row>
            <Row>
              <span className="label">{isArabic ? "اللون" : "Color"}</span>
              <span className="value">{summaryData.color}</span>
            </Row>
            <Row>
              <span className="label">
                {isArabic ? "جهة الطباعة" : "Print Side"}
              </span>
              <span className="value">{summaryData.printSide}</span>
            </Row>
            {summaryData.frontDimensions && (
              <Row>
                <span className="label">
                  {isArabic
                    ? "أبعاد الطباعة (أمامي)"
                    : "Front Dimensions"}
                </span>
                <span className="value">
                  {summaryData.frontDimensions.width} ×{" "}
                  {summaryData.frontDimensions.height} cm
                </span>
              </Row>
            )}
            {summaryData.backDimensions && (
              <Row>
                <span className="label">
                  {isArabic
                    ? "أبعاد الطباعة (خلفي)"
                    : "Back Dimensions"}
                </span>
                <span className="value">
                  {summaryData.backDimensions.width} ×{" "}
                  {summaryData.backDimensions.height} cm
                </span>
              </Row>
            )}
          </SummaryTable>

          <NoteBox>
            <FaShieldAlt />
            <span>
              {isArabic
                ? "سيتم مراجعة موضع وحجم التصميم يدويًا من قبل فريق الإنتاج قبل الطباعة لضمان جودة الجودة والنتيجة النهائية."
                : "Your artwork placement and physical scale will be reviewed by our production team before printing to ensure the best possible result."}
            </span>
          </NoteBox>

          <ActionRow>
            <Button onClick={onClose}>
              {isArabic ? "تعديل" : "Edit Design"}
            </Button>
            <Button $primary onClick={onConfirm}>
              {isArabic ? "تأكيد وإضافة" : "Confirm & Add"}
            </Button>
          </ActionRow>
        </ModalCard>
      </Overlay>
    </AnimatePresence>
  );
};

CustomizationSummaryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  summaryData: PropTypes.object,
};

export default CustomizationSummaryModal;