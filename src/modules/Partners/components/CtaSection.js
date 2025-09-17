import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// --- Corrected Component and Asset Paths ---
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Windows from "../../../assets/windows.svg";
import Playstore from "../../../assets/playstore.webp";

// --- Styled Components ---

const Section = styled.section`
  width: 100%;
  padding: 6rem 0;
  background-color: ${(props) => props.theme.darkGreen}; // Consistent with the hero section
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 800px; // A bit narrower for a focused CTA
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 700;
  color: ${(props) => props.theme.body};
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(${(props) => props.theme.bodyRgba}, 0.85);
  line-height: 1.6;
  max-width: 600px; // Keep text readable
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const CtaSection = () => {
  const { t } = useTranslation();

  // --- Environment variables for download links ---
  const myHanuutDownloadLinkWindows =
    process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
  const myHanuutDownloadLink =
    process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;

  // --- Event Handlers ---
  const handleDownloadPlay = () => {
    window.open(myHanuutDownloadLink, "_blank");
  };

  const handleDownloadWindows = () => {
    window.open(myHanuutDownloadLinkWindows, "_blank");
  };

  return (
    <Section>
      <Container>
        <Title>{t("cta_section_title")}</Title>
        <Description>{t("cta_section_description")}</Description>
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
      </Container>
    </Section>
  );
};

export default CtaSection;