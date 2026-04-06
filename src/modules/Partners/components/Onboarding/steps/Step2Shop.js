import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaUtensils, FaShoppingBasket, FaGlobe,FaStore } from "react-icons/fa";
import { getAllDomains } from "../../../../Domains/services/DomainServices";
import ImageUploader from "./ImageUploader";
import { 
  StepTitle, 
  StepSubtitle, 
  InputGroup, 
  Label, 
  BigInput 
} from "../WizardComponents";

const DomainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DomainCard = styled.div`
  border: 2px solid ${props => props.$selected ? "#39A170" : "#E5E5E5"};
  background-color: ${props => props.$selected ? "rgba(57, 161, 112, 0.05)" : "#FAFAFA"};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: ${props => props.$selected ? "#39A170" : "#CCC"};
    transform: translateY(-3px);
  }

  svg {
    font-size: 2rem;
    color: ${props => props.$selected ? "#39A170" : "#999"};
  }

  span {
    font-weight: 700;
    font-size: 1rem;
    color: ${props => props.$selected ? "#39A170" : "#666"};
  }
`;

const ICONS = {
  food: <FaUtensils />,
  grocery: <FaShoppingBasket />,
  global: <FaGlobe />
};

const Step2Shop = ({ data, update }) => {
  const { t } = useTranslation();
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    const fetchAllDomains = async () => {
      try {
        console.log("Attempting to fetch domains...");
        const response = await getAllDomains();
        const allDomains = response.data;
        console.log("API Response (All Domains):", allDomains); // See the raw data

        if (!Array.isArray(allDomains)) {
          console.error("API did not return an array of domains.");
          setDomains([]);
          return;
        }

        const keywords = ['food', 'grocery', 'global'];
        const primaryDomains = keywords.map(kw => 
          allDomains.find(d => d.keyword === kw)
        ).filter(Boolean);
        
        console.log("Filtered Primary Domains to Display:", primaryDomains); // See the final data
        setDomains(primaryDomains);

      } catch (error) {
        console.error("Failed to fetch or process domains:", error);
        setDomains([]); // Ensure we have an empty array on error
      }
    };

    fetchAllDomains();
  }, []); // This runs only once when the component mounts

  const handleDomainSelect = (domain) => {
    update("domainId", domain.id);
    update("domainKeyword", domain.keyword);
  };
  
  return (
    <>
      <StepTitle>{t("wiz_step2_title")}</StepTitle>
      <StepSubtitle>{t("wiz_step2_subtitle")}</StepSubtitle>
      
      <ImageUploader onFileSelect={(file) => update("logo", file)} />

      <InputGroup>
        <Label>{t("wiz_label_shopname")}</Label>
        <BigInput 
          type="text" 
          placeholder="El Baraka Market"
          value={data.shopName}
          onChange={(e) => update("shopName", e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <Label>{t("wiz_select_type_label")}</Label>
        <DomainGrid>
          {domains.map((domain) => (
            <DomainCard 
              key={domain.id}
              $selected={data.domainId === domain.id} 
              onClick={() => handleDomainSelect(domain)}
            >
              {ICONS[domain.keyword] || <FaStore />}
              <span>{t(`wiz_type_${domain.keyword}`)}</span>
            </DomainCard>
          ))}
        </DomainGrid>
      </InputGroup>

      <InputGroup>
        <Label>{t("wiz_label_desc")}</Label>
        <BigInput 
          as="textarea"
          rows="3"
          style={{ resize: "vertical" }}
          placeholder={t("wiz_placeholder_desc")}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </InputGroup>
    </>
  );
};

export default Step2Shop;