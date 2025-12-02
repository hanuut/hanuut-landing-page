import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.webp";
// Restore the illustration import
import GroceryIllustration from "../../../assets/grocery-illustration.webp";
import ShopStoryView from "./ShopStoryView";
// Utility to convert image buffer to a displayable URL
const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer?.data) return null;
  const imageData = imageObject.buffer.data;
  const base64String = btoa(
    new Uint8Array(imageData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  const format = imageObject.originalname.split(".").pop().toLowerCase();
  const mimeType = format === "jpg" ? "jpeg" : format;
  return `data:image/${mimeType};base64,${base64String}`;
};

// --- Styled Components ---

const PageWrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #1a1a1a; /* Dark Theme */
  box-sizing: border-box;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    padding: 1.5rem 1rem;
    min-height: auto;
  }
`;

// Container for the two-column layout
const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  width: 100%;
  max-width: 1120px;

  @media (max-width: 900px) {
    flex-direction: column-reverse; /* Image will be on top on mobile */
    gap: 2rem;
    text-align: center;
  }
`;

// Column for all the text and buttons
const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  /* Align items to the start of the column */
  align-items: ${(props) => (props.isArabic ? "flex-end" : "flex-start")};
  flex: 1;

  @media (max-width: 900px) {
    align-items: center; /* Center align on mobile */
  }
`;

const ShopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: "serif";

  /* The previous centered layout from last step is now applied here */
  flex-direction: column;
  text-align: center;
  width: 100%;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #333;
`;

const ShopName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const ShopDescription = styled.p`
  font-size: 1.1rem;
  color: #bbbbbb;
  line-height: 1.6;
  margin-top: 0.5rem;
  max-width: 450px;
`;

const DownloadTitle = styled.h3`
  font-weight: 600;
  font-size: 1.25rem;
  color: #ffffff;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

// Column for the illustration
const IllustrationColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Styled illustration with hover effect
const Illustration = styled.img`
  max-width: 300px;
  height: auto;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
      0 0 25px rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 900px) {
    max-width: 300px;
  }
`;

const DownloadRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* This is the key change */
  width: 90%; /* Makes the row take full width of its container */
  margin-top: 1rem; /* Added slightly more space above */

  @media (max-width: 900px) {
    flex-direction: column; /* Stacks vertically on mobile */
    justify-content: center; /* Ensures it's centered when stacked */
    gap: 0.75rem;
    width: auto; /* Resets width on mobile to not force stretch */
  }
`;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const GroceryShopPage = ({ shop, image }) => {
  const { t, i18n } = useTranslation();
  const imageUrl = useMemo(() => bufferToUrl(image), [image]);
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.hanuut.shop";

  const isMobile = useIsMobile();

  // 1. If Mobile, Return the Story View
  if (isMobile) {
    return (
      <ShopStoryView shop={shop} shopImage={imageUrl} appLink={playStoreLink} />
    );
  }

  // 2. If Desktop, Return the existing layout (it works fine for desktop)
  return (
    <PageWrapper isArabic={i18n.language === "ar"}>
      <ContentContainer>
        {/* Left Column */}
        <InfoColumn isArabic={i18n.language === "ar"}>
          <ShopHeader>
            <Logo src={imageUrl} alt={`${shop.name} Logo`} />
            <ShopName>{shop.name}</ShopName>
          </ShopHeader>

          <ShopDescription>{t("grocery_page_info")}</ShopDescription>

          <DownloadRow>
            <DownloadTitle>{t("grocery_page_download_title")}</DownloadTitle>

            <Link to={playStoreLink} target="_blank" rel="noopener noreferrer">
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#39A170" /* Explicit Green for Customer */
                text1={t("getItOn")}
                text2={t("googlePlay")}
              />
            </Link>
          </DownloadRow>
        </InfoColumn>

        {/* Right Column */}
        <IllustrationColumn>
          <Illustration
            src={GroceryIllustration}
            alt="Interactive grocery shopping illustration"
          />
        </IllustrationColumn>
      </ContentContainer>
    </PageWrapper>
  );
};

export default GroceryShopPage;
