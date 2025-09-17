import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// --- All components are imported ---
import MyHanuutAppCarousel from "./myHanuutAppCarousel";
import ButtonWithIcon from "../../../components/ButtonWithIcon"; 
import Windows from "../../../assets/windows.svg"; 
import Playstore from "../../../assets/playstore.webp"; 

// --- All image imports are active ---
import image1En from "../../../assets/my_hanuut_carousel/screenshot1_en.gif";
import image2En from "../../../assets/my_hanuut_carousel/screenshot2_en.gif";
import image3En from "../../../assets/my_hanuut_carousel/screenshot3_en.gif";
import image4En from "../../../assets/my_hanuut_carousel/screenshot4_en.gif";
import image5En from "../../../assets/my_hanuut_carousel/screenshot5_en.gif";
import image6En from "../../../assets/my_hanuut_carousel/screenshot6_en.gif";
import image7En from "../../../assets/my_hanuut_carousel/screenshot7_en.gif";
import image2Fr from "../../../assets/my_hanuut_carousel/screenshot2_fr.gif";
import image3Fr from "../../../assets/my_hanuut_carousel/screenshot3_fr.gif";
import image4Fr from "../../../assets/my_hanuut_carousel/screenshot4_fr.gif";
import image5Fr from "../../../assets/my_hanuut_carousel/screenshot5_fr.gif";
import image6Fr from "../../../assets/my_hanuut_carousel/screenshot6_fr.gif";
import image7Fr from "../../../assets/my_hanuut_carousel/screenshot7_fr.gif";
import image1Ar from "../../../assets/my_hanuut_carousel/screenshot1_ar.gif";
import image2Ar from "../../../assets/my_hanuut_carousel/screenshot2_ar.gif";
import image3Ar from "../../../assets/my_hanuut_carousel/screenshot3_ar.gif";
import image4Ar from "../../../assets/my_hanuut_carousel/screenshot4_ar.gif";
import image5Ar from "../../../assets/my_hanuut_carousel/screenshot5_ar.gif";
import image6Ar from "../../../assets/my_hanuut_carousel/screenshot6_ar.gif";
import image7Ar from "../../../assets/my_hanuut_carousel/screenshot7_ar.gif";

// (Styled-components are unchanged)
const HeroSection = styled.section` width: 100%; padding: 6rem 0; background-color: ${(props) => props.theme.darkGreen}; display: flex; align-items: center; justify-content: center; @media (max-width: 768px) { padding: 4rem 0; } `;
const Container = styled.div` max-width: 1200px; width: 90%; margin: 0 auto; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 3rem; direction: ${(props) => (props.isArabic ? "rtl" : "ltr")}; @media (max-width: 992px) { flex-direction: column-reverse; text-align: center; } `;
const TextContainer = styled.div` width: 60%; display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; @media (max-width: 992px) { align-items: center; width: 100%; } `;
const CarouselContainer = styled.div` width: 40%; display: flex; align-items: center; justify-content: center; min-height: 300px; @media (max-width: 992px) { width: 100%; } `;
const Heading = styled.h1` font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; color: ${(props) => props.theme.body}; line-height: 1.2; span { color: ${(props) => props.theme.accent}; } `;
const SubHeading = styled.p` font-size: clamp(1rem, 2.5vw, 1.25rem); color: rgba(${(props) => props.theme.bodyRgba}, 0.85); line-height: 1.6; max-width: 600px; `;
const ButtonsRow = styled.div` display: flex; flex-direction: row; align-items: center; gap: 1rem; margin-top: 1rem; @media (max-width: 480px) { flex-direction: column; width: 100%; } `;


const PartnersHero = () => {
  const { t, i18n } = useTranslation();

  const handleDownloadPlay = () => window.open(process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY, "_blank");
  const handleDownloadWindows = () => window.open(process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK, "_blank");

  // --- THE IMAGE ORDER FIX IS HERE ---
  const images =
    i18n.language === "ar"
      // This order is now corrected to be sequential
      ? [ image2Ar, image3Ar, image4Ar, image6Ar , image5Ar,image1Ar, image7Ar,]
      : i18n.language === "en"
      ? [image1En, image3En, image2En, image4En, image7En, image5En, image6En]
      : [image1En, image2Fr, image4Fr, image3Fr, image7Fr, image5Fr, image6Fr];

  return (
    <HeroSection>
      <Container isArabic={i18n.language === "ar"}>
        <TextContainer>
          <Heading>
            {t("partnersHero_heading_part1")} <span>{t("partnersHero_heading_part2")}</span>
          </Heading>
          <SubHeading>{t("partnersHero_subheading")}</SubHeading>
          <ButtonsRow>
            <ButtonWithIcon
              image={Playstore}
              backgroundColor="#FFFFFF"
              text1={t("getItOn")}
              text2={t("googlePlay")}
              className="homeDownloadButton blackText"
              onClick={handleDownloadPlay}
            />
            <ButtonWithIcon
              image={Windows}
              backgroundColor="#FFFFFF"
              text1={t("getItOn")}
              text2={"Windows"}
              className="homeDownloadButton blackText"
              onClick={handleDownloadWindows}
            />
          </ButtonsRow>
        </TextContainer>
        <CarouselContainer>
          <MyHanuutAppCarousel images={images} />
        </CarouselContainer>
      </Container>
    </HeroSection>
  );
};

export default PartnersHero;