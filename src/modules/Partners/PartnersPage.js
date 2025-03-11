import React, { useState } from "react";
import styled from "styled-components";
import MyHanuutAppCarousel from "./components/myHanuutAppCarousel";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import PartnersValues from "./components/PartnersValues";
import Windows from "../../assets/windows.svg";
import Playstore from "../../assets/playstore.webp";
import { Helmet } from "react-helmet";
import FeaturesHighlight from "./components/FeaturesHighlight";
import DownloadCTA from "./components/DownloadCta";

//en images
import image1En from "../../assets/my_hanuut_carousel/screenshot1_en.gif";
import image2En from "../../assets/my_hanuut_carousel/screenshot2_en.gif";
import image3En from "../../assets/my_hanuut_carousel/screenshot3_en.gif";
import image4En from "../../assets/my_hanuut_carousel/screenshot4_en.gif";
import image5En from "../../assets/my_hanuut_carousel/screenshot5_en.gif";
import image6En from "../../assets/my_hanuut_carousel/screenshot6_en.gif";
import image7En from "../../assets/my_hanuut_carousel/screenshot7_en.gif";

//fr images
import image2Fr from "../../assets/my_hanuut_carousel/screenshot2_fr.gif";
import image3Fr from "../../assets/my_hanuut_carousel/screenshot3_fr.gif";
import image4Fr from "../../assets/my_hanuut_carousel/screenshot4_fr.gif";
import image5Fr from "../../assets/my_hanuut_carousel/screenshot5_fr.gif";
import image6Fr from "../../assets/my_hanuut_carousel/screenshot6_fr.gif";
import image7Fr from "../../assets/my_hanuut_carousel/screenshot7_fr.gif";

//ar images
import image1Ar from "../../assets/my_hanuut_carousel/screenshot1_ar.gif";
import image2Ar from "../../assets/my_hanuut_carousel/screenshot2_ar.gif";
import image3Ar from "../../assets/my_hanuut_carousel/screenshot3_ar.gif";
import image4Ar from "../../assets/my_hanuut_carousel/screenshot4_ar.gif";
import image5Ar from "../../assets/my_hanuut_carousel/screenshot5_ar.gif";
import image6Ar from "../../assets/my_hanuut_carousel/screenshot6_ar.gif";
import image7Ar from "../../assets/my_hanuut_carousel/screenshot7_ar.gif";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: ${(props) =>
    props.isSelected ? props.theme.body : props.theme.darkGreen};
  color: ${(props) =>
    props.isSelected ? props.theme.primaryColor : props.theme.body};
  font-size: ${(props) => props.theme.fontsm};
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  border-color: ${(props) => props.theme.primaryColor};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.isSelected ? 900 : 400)};
  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? props.theme.primaryColorDark
        : props.theme.primaryColor};
    color: ${(props) => props.theme.body};
    border-color: ${(props) => props.theme.body};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${(props) => props.theme.orangeColor}40;
  }
`;

const Section = styled.div`
  min-height: ${(props) => `calc(80vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.darkGreen};
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const PartnersContainer = styled.div`
  margin: 2rem 0;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
  }
`;

const UpperBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    min-height: 100%;
    flex-direction: column-reverse;
    align-items: flex-start;
    margin-top: 1rem;
  }
`;

const ButtonsRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;

const RightBox = styled.div`
  width: 55%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const LeftBox = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const Heading = styled.h1`
  width: 100%;
  margin-bottom: 0.1rem;
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
  span {
    color: ${(props) => props.theme.orangeColor};
    font-size: 2rem;
    font-weight: 900;
  }
`;

const SubHeading = styled.h2`
  width: 99%;
  font-size: ${(props) => props.theme.fontxxl};
  color: ${(props) => props.theme.body};
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxl};
  margin-bottom: 1rem;
  color: ${(props) => props.theme.body};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const DomainExampleText = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => props.theme.body};
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-style: italic;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const FeaturesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FeatureSection = styled.div`
  padding: 0 0.1rem 0.8rem;
`;

const FeatureTitle = styled.h3`
  font-size: ${(props) => props.theme.fontmd};
  color: ${(props) => props.theme.body};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const PartnersPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("supermarkets");
  const myHanuutDownloadLinkWindows =
    process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
  const myHanuutDownloadLink =
    process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;

  // Domain content from JSON
  const domainContent = {
    domainExamples: {
      supermarkets: t("grocery_domain_examples"),
      foodShops: t("food_domain_examples"),
      globalShops: t("ecom_domain_examples"),
    },
    features: {
      supermarkets: t("myHanuutFeatures.grocerySections", {
        returnObjects: true,
      }),
      foodShops: t("myHanuutFeatures.foodSections", { returnObjects: true }),
      globalShops: t("myHanuutFeatures.ecomSections", { returnObjects: true }),
    },
  };

  const handleDownloadPlay = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLink);
  };

  const handleDownloadWindows = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLinkWindows);
  };

  const images =
    i18n.language === "ar"
      ? [image1Ar, image4Ar, image3Ar, image2Ar, image5Ar, image6Ar, image7Ar]
      : i18n.language === "en"
      ? [image1En, image3En, image2En, image4En, image7En, image5En, image6En]
      : [image1En, image2Fr, image4Fr, image3Fr, image7Fr, image5Fr, image6Fr];

  // Get the appropriate sections for the selected category
  const currentFeatures = domainContent.features[selectedCategory] || [];

  // Get SEO meta data based on language and selected domain
  const getSeoContent = () => {
    let domainType = "";
    switch (selectedCategory) {
      case "supermarkets":
        domainType = t("supermarkets");
        break;
      case "foodShops":
        domainType = t("foodShops");
        break;
      case "globalShops":
        domainType = t("globalShops");
        break;
      default:
        domainType = t("supermarkets");
    }

    return {
      title: `${t("myHanuutTitle")} - ${domainType}`,
      description: `${t("appTitle")}, ${t("myHanuutTitle")}, ${t(
        "partnersBoostYourProfits"
      )} ${domainType}, ${t("partnerSubHeading")}`,
      keywords: `${t("myHanuutTitle")}, ${domainType}, ${t(
        "partnersBoostYourProfits"
      )}, e-commerce, online shop, hanuut`,
    };
  };

  const seoContent = getSeoContent();

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{seoContent.title}</title>
        <meta name="description" content={seoContent.description} />
        <meta name="keywords" content={seoContent.keywords} />
        <link rel="canonical" href="https://www.hanuut.com/partners" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: seoContent.title,
            description: seoContent.description,
            url: "https://www.hanuut.com/partners",
            inLanguage: i18n.language,
          })}
        </script>
      </Helmet>
      <Section>
        <PartnersContainer>
          <UpperBox isArabic={i18n.language === "ar"}>
            <LeftBox>
              <Heading>{t("partnerHeadingBoost")}</Heading>
              <Heading>
                <span>{t("partnerHeading")}</span>
              </Heading>
              <ButtonGroup>
                <Button
                  onClick={() => setSelectedCategory("supermarkets")}
                  isSelected={selectedCategory === "supermarkets"}
                >
                  {t("supermarkets")}
                </Button>
                <Button
                  onClick={() => setSelectedCategory("foodShops")}
                  isSelected={selectedCategory === "foodShops"}
                >
                  {t("foodShops")}
                </Button>
                <Button
                  onClick={() => setSelectedCategory("globalShops")}
                  isSelected={selectedCategory === "globalShops"}
                >
                  {t("globalShops")}
                </Button>
              </ButtonGroup>
              <SubHeading>{t("partnerSubHeading")}</SubHeading>
              {/* Display domain-specific example description */}
              <DomainExampleText>
                {t(domainContent.domainExamples[selectedCategory])}
              </DomainExampleText>
              {/* Domain-specific features */}
              <FeaturesContainer>
                {currentFeatures
                  .slice(1, currentFeatures.length - 1)
                  .map((section, index) => (
                    <FeatureSection key={index}>
                      <FeatureTitle>{section.title}</FeatureTitle>
                    </FeatureSection>
                  ))}
              </FeaturesContainer>
              <Paragraph>{t("partnerParagraph")}</Paragraph>
              <ButtonsRow>
                <ButtonWithIcon
                  image={Playstore}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={t("googlePlay")}
                  className="homeDownloadButton"
                  onClick={(e) => handleDownloadPlay(e)}
                />

                <ButtonWithIcon
                  image={Windows}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={"Windows"}
                  className="homeDownloadButton"
                  onClick={(e) => handleDownloadWindows(e)}
                />
              </ButtonsRow>
            </LeftBox>
            <RightBox>
              <MyHanuutAppCarousel images={images} />
            </RightBox>
          </UpperBox>
          <PartnersValues />
        </PartnersContainer>
        <FeaturesHighlight selectedCategory={selectedCategory} />
        <DownloadCTA
          groceryGuideLink="/path-to-grocery-guide.pdf"
          foodShopGuideLink="/path-to-food-shop-guide.pdf"
          Playstore={Playstore}
          Windows={Windows}
          ButtonWithIcon={ButtonWithIcon}
          handleDownloadPlay={handleDownloadPlay}
          handleDownloadWindows={handleDownloadWindows}
          selectedCategory={selectedCategory}
          currentFeatures={currentFeatures}
        />
      </Section>
    </>
  );
};

export default PartnersPage;
