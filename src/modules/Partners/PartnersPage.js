import React from "react";
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
import image1 from "../../assets/my_hanuut_carousel/myhanuut-play-store-app-preview-assets_01.jpg";
import image2 from "../../assets/my_hanuut_carousel/myhanuut-play-store-app-preview-assets_02.jpg";
import image3 from "../../assets/my_hanuut_carousel/myhanuut-play-store-app-preview-assets_03.jpg";
import image4 from "../../assets/my_hanuut_carousel/myhanuut-play-store-app-preview-assets_04.jpg";
import image5 from "../../assets/my_hanuut_carousel/myhanuut-play-store-app-preview-assets_05.jpg";


const images = [
  image1,
  image2,
  image3,
  image4,
  image5
];


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
  padding: 3rem 0;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
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
  align-items: center;
  justify-content: space-between;
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
  margin-top: 1.5rem;
`;
const RightBox = styled.div`
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const LeftBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;
const LowerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
  }
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  .shopLinkWrapper {
    width: 30%;
    @media (max-width: 768px) {
      width: 100%;
    }
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
  font-size: ${(props) => props.theme.fontxxxl};
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
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 1rem;
 color: ${(props) => props.theme.body};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const PartnersPage = () => {
  const { t, i18n } = useTranslation();
  const myHanuutDownloadLinkWindows =
    process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
  const myHanuutDownloadLink =
    process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;
  const handleDownloadPlay = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLink);
  };
  const handleDownloadWindows = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLinkWindows);
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("myHanuutTitle")}</title>{" "}
        <meta
          name="description"
          content={`${t("appTitle")}, ${t("myHanuutTitle")}, ${t(
            "partnersBoostYourProfits"
          )} , ${t("partnerSubHeading")}`}
        />
        <meta
          name="keywords"
          content={`${t("myHanuutTitle")}, ${t("myHanuutTitle")}, ${t(
            "partnersBoostYourProfits"
          )}, e-commerce, online shop`}
        />
        <link rel="canonical" href="https://www.hanuut.com/partners" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("myHanuutTitle"),
            description: `${t("appTitle")}, ${t("myHanuutTitle")}, ${t(
              "partnersBoostYourProfits"
            )} , ${t("partnerSubHeading")}`,
            url: "https://www.hanuut.com/partners",
          })}
        </script>
      </Helmet>
      <Section>
        <PartnersContainer>
          <UpperBox isArabic={i18n.language === "ar"}>
            <LeftBox>
              <Heading> {t("partnerHeadingBoost")}</Heading>
              <Heading>
                {" "}
                <span>{t("partnerHeading")}</span>
              </Heading>
              <SubHeading>{t("partnerSubHeading")}</SubHeading>
              <Paragraph>{t("partnerParagraph")}</Paragraph>
              <ButtonsRow>
                <ButtonWithIcon
                  image={Playstore}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={t("googlePlay")}
                  className="homeDownloadButton"
                  onClick={(e) => handleDownloadPlay(e)}
                ></ButtonWithIcon>

                <ButtonWithIcon
                  image={Windows}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={"Windows"}
                  className="homeDownloadButton"
                  onClick={(e) => handleDownloadWindows(e)}
                ></ButtonWithIcon>
              </ButtonsRow>
            </LeftBox>
            <RightBox>
            <MyHanuutAppCarousel images={images} />
            </RightBox>
          </UpperBox>
          <PartnersValues />
        </PartnersContainer>
        <FeaturesHighlight />
        <DownloadCTA
          groceryGuideLink="/path-to-grocery-guide.pdf"
          foodShopGuideLink="/path-to-food-shop-guide.pdf"
          Playstore={Playstore}
          Windows={Windows}
          ButtonWithIcon={ButtonWithIcon}
          handleDownloadPlay={handleDownloadPlay}
          handleDownloadWindows={handleDownloadWindows}
        />
      </Section>
    </>
  );
};

export default PartnersPage;
