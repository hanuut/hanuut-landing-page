import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaTimes, FaBarcode, FaBell, FaFileInvoiceDollar, FaWifi, FaQrcode, FaTv, FaEyeSlash, FaPalette, FaTshirt, FaTruck, FaLink, FaCalculator } from "react-icons/fa";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 768px) {
    align-items: center;
  }
`;

const ModalContent = styled(motion.div)`
  background: #18181B;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  border-radius: 24px 24px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  color: white;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (min-width: 768px) {
    border-radius: 24px;
  }
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  ${(props) => (props.$isArabic ? "left: 1.5rem;" : "right: 1.5rem;")}
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.2); }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: ${(props) => props.theme.primaryColor};
  font-family: "Tajawal", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.3s;

  &:hover { border-color: ${(props) => props.theme.primaryColor}; }
`;

const IconWrapper = styled.div`
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(240, 122, 72, 0.15);
  color: #F07A48;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
`;

const FeatTitle = styled.h3`
  font-size: 1.1rem; font-weight: 700; margin: 0;
  font-family: "Tajawal", sans-serif;
`;

const FeatDesc = styled.p`
  font-size: 0.95rem; color: #A1A1AA; margin: 0; line-height: 1.5;
`;

// Configuration Mapping
const directoryData = {
  supermarkets: [
    { icon: FaBarcode, title: "feat_gro_1_t", desc: "feat_gro_1_d" },
    { icon: FaBell, title: "feat_gro_2_t", desc: "feat_gro_2_d" },
    { icon: FaFileInvoiceDollar, title: "feat_gro_3_t", desc: "feat_gro_3_d" },
    { icon: FaWifi, title: "feat_gro_4_t", desc: "feat_gro_4_d" },
  ],
  foodShops: [
    { icon: FaQrcode, title: "feat_food_1_t", desc: "feat_food_1_d" },
    { icon: FaTv, title: "feat_food_2_t", desc: "feat_food_2_d" },
    { icon: FaEyeSlash, title: "feat_food_3_t", desc: "feat_food_3_d" },
    { icon: FaPalette, title: "feat_food_4_t", desc: "feat_food_4_d" },
  ],
  globalShops: [
    { icon: FaTshirt, title: "feat_ecom_1_t", desc: "feat_ecom_1_d" },
    { icon: FaTruck, title: "feat_ecom_2_t", desc: "feat_ecom_2_d" },
    { icon: FaLink, title: "feat_ecom_3_t", desc: "feat_ecom_3_d" },
    { icon: FaCalculator, title: "feat_ecom_4_t", desc: "feat_ecom_4_d" },
  ]
};

const FeatureDirectoryModal = ({ isOpen, onClose, activeTab }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const data = directoryData[activeTab] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            $isArabic={isArabic}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <CloseButton $isArabic={isArabic} onClick={onClose}><FaTimes /></CloseButton>
            <Title>{t("modal_title")}</Title>
            
            <Grid>
              {data.map((feat, idx) => (
                <FeatureCard key={idx}>
                  <IconWrapper><feat.icon /></IconWrapper>
                  <div>
                    <FeatTitle>{t(feat.title)}</FeatTitle>
                    <FeatDesc>{t(feat.desc)}</FeatDesc>
                  </div>
                </FeatureCard>
              ))}
            </Grid>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default FeatureDirectoryModal;