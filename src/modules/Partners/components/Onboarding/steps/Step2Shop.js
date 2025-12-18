import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaUtensils, FaShoppingBasket, FaGlobe, FaStore } from "react-icons/fa";
import { 
  StepTitle, 
  StepSubtitle, 
  InputGroup, 
  Label, 
  BigInput 
} from "../WizardComponents";

// Update Grid to support 3 items
const DomainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* Stack on mobile */
  }
`;

const DomainCard = styled.div`
  border: 2px solid ${props => props.$selected ? "#39A170" : "#E5E5E5"};
  background-color: ${props => props.$selected ? "rgba(57, 161, 112, 0.05)" : "#FAFAFA"};
  border-radius: 16px;
  padding: 1.2rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: ${props => props.$selected ? "#39A170" : "#CCC"};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.8rem;
    color: ${props => props.$selected ? "#39A170" : "#999"};
  }

  span {
    font-weight: 700;
    font-size: 0.9rem;
    color: ${props => props.$selected ? "#39A170" : "#666"};
  }
`;

const SectionLabel = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Step2Shop = ({ data, update }) => {
  const { t } = useTranslation();

  return (
    <>
      <StepTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("wiz_step2_title")}
      </StepTitle>
      <StepSubtitle>
        {t("wiz_step2_subtitle")}
      </StepSubtitle>

      <InputGroup>
        <Label>{t("wiz_label_shopname")}</Label>
        <BigInput 
          type="text" 
          placeholder="Superette El Baraka"
          value={data.shopName}
          onChange={(e) => update("shopName", e.target.value)}
          autoFocus
        />
      </InputGroup>

      {/* NEW: Free Text Input for specific activity */}
      <InputGroup>
        <Label>{t("wiz_label_activity")}</Label>
        <BigInput 
          type="text" 
          placeholder={t("wiz_placeholder_activity")} // e.g. Handmade, Electronics
          value={data.customActivity}
          onChange={(e) => update("customActivity", e.target.value)}
        />
      </InputGroup>

      {/* System Type Selection (3 Cards) */}
      <InputGroup>
        <SectionLabel>{t("wiz_select_type_label")}</SectionLabel>
        <DomainGrid>
          <DomainCard 
            $selected={data.domain === 'grocery'} 
            onClick={() => update("domain", "grocery")}
          >
            <FaShoppingBasket />
            <span>{t("wiz_type_grocery")}</span>
          </DomainCard>
          
          <DomainCard 
            $selected={data.domain === 'food'} 
            onClick={() => update("domain", "food")}
          >
            <FaUtensils />
            <span>{t("wiz_type_food")}</span>
          </DomainCard>

          <DomainCard 
            $selected={data.domain === 'global'} 
            onClick={() => update("domain", "global")}
          >
            <FaGlobe />
            <span>{t("wiz_type_general")}</span>
          </DomainCard>
        </DomainGrid>
      </InputGroup>

      <InputGroup>
        <Label>{t("wiz_label_desc")}</Label>
        <BigInput 
          as="textarea"
          rows="3"
          style={{ resize: "none" }}
          placeholder={t("wiz_placeholder_desc")}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </InputGroup>
    </>
  );
};

export default Step2Shop;