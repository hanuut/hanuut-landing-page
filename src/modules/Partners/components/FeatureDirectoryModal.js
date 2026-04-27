// src/modules/Partners/components/FeatureDirectoryModal.js
import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaTimes,
  FaBarcode,
  FaBell,
  FaFileInvoiceDollar,
  FaWifi,
  FaQrcode,
  FaTv,
  FaChartLine,
  FaLink,
  FaImages,
  FaEyeSlash,
  FaPalette,
  FaTshirt,
  FaCalculator,
} from "react-icons/fa";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
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
  background: #111217;
  width: 100%;
  max-width: 850px;
  max-height: 90vh;
  border-radius: 24px 24px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  overflow-y: auto;
  position: relative;
  color: white;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (min-width: 768px) {
    border-radius: 24px;
    padding: 3rem;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  ${(props) => (props.$isArabic ? "left: 1.5rem;" : "right: 1.5rem;")}
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #f07a48;
  font-family: "Tajawal", sans-serif;
`;

const CategorySection = styled.div`
  margin-bottom: 2.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
  font-family: "Tajawal", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: border-color 0.3s;
  &:hover {
    border-color: #39a170;
    background: rgba(57, 161, 112, 0.05);
  }
`;

const IconWrapper = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: rgba(57, 161, 112, 0.15);
  color: #39a170;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const FeatText = styled.div`
  h4 {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0 0 0.3rem 0;
    font-family: "Tajawal", sans-serif;
    color: #fff;
  }
  p {
    font-size: 0.9rem;
    color: #a1a1aa;
    margin: 0;
    line-height: 1.5;
    font-family: "Cairo", sans-serif;
  }
`;

// --- DOMAIN-SPECIFIC DATA STRUCTURE ---
const domainFeaturesData = {
  supermarkets: [
    {
      categoryTitle: "cat_sales_pos",
      features: [
        { icon: FaWifi, title: "feat_gro_4_t", desc: "feat_gro_4_d" }, // Offline POS
      ],
    },
    {
      categoryTitle: "cat_inventory",
      features: [
        { icon: FaBarcode, title: "feat_gro_1_t", desc: "feat_gro_1_d" }, // Barcode DB
        { icon: FaBell, title: "feat_gro_2_t", desc: "feat_gro_2_d" }, // Expiry Alerts
        {
          icon: FaFileInvoiceDollar,
          title: "feat_gro_3_t",
          desc: "feat_gro_3_d",
        }, // Purchase to Receipt
      ],
    },
  ],
  foodShops: [
    {
      categoryTitle: "cat_sales_orders",
      features: [
        { icon: FaQrcode, title: "feat_food_1_t", desc: "feat_food_1_d" }, // QR Menu
        { icon: FaEyeSlash, title: "feat_food_3_t", desc: "feat_food_3_d" }, // Menu Toggling
      ],
    },
    {
      categoryTitle: "cat_operations",
      features: [
        { icon: FaTv, title: "feat_food_2_t", desc: "feat_food_2_d" }, // KDS
        { icon: FaPalette, title: "feat_food_4_t", desc: "feat_food_4_d" }, // Flyer Studio
      ],
    },
  ],
  globalShops: [
    {
      categoryTitle: "cat_digital_store",
      features: [
        { icon: FaLink, title: "feat_ecom_3_t", desc: "feat_ecom_3_d" }, // Landing Page Builder
        { icon: FaTshirt, title: "feat_ecom_1_t", desc: "feat_ecom_1_d" }, // Variant Matrix
      ],
    },
    {
      categoryTitle: "cat_growth",
      features: [
        { icon: FaImages, title: "feat_grow_2_t", desc: "feat_grow_2_d" }, // Promo Studio
        { icon: FaCalculator, title: "feat_ecom_4_t", desc: "feat_ecom_4_d" }, // Profit Calculator
        { icon: FaChartLine, title: "feat_grow_3_t", desc: "feat_grow_3_d" }, // Net Profit Analytics
      ],
    },
  ],
};

const FeatureDirectoryModal = ({ isOpen, onClose, activeTab }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Fetch only the data relevant to the currently selected tab
  const activeDirectory = domainFeaturesData[activeTab] || [];

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
            initial={{ y: "100%", scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <CloseButton $isArabic={isArabic} onClick={onClose}>
              <FaTimes />
            </CloseButton>
            <Title>{t("modal_title")}</Title>

            {activeDirectory.map((section, sIdx) => (
              <CategorySection key={sIdx}>
                <CategoryTitle>{t(section.categoryTitle)}</CategoryTitle>
                <Grid>
                  {section.features.map((feat, fIdx) => (
                    <FeatureCard key={fIdx}>
                      <IconWrapper>
                        <feat.icon />
                      </IconWrapper>
                      <FeatText>
                        <h4>{t(feat.title)}</h4>
                        <p>{t(feat.desc)}</p>
                      </FeatText>
                    </FeatureCard>
                  ))}
                </Grid>
              </CategorySection>
            ))}
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default FeatureDirectoryModal;
