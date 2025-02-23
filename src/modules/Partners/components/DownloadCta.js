import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Styled Components with minimalistic design
const Section = styled(motion.section)`
  min-height: ${(props) => `calc(80vh - ${props.theme.navHeight})`};
  width: 100%;
  padding: 6rem 2rem;
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) => `linear-gradient(
      135deg,
      ${theme.primaryColor}05,
      ${theme.secondaryColor}05
    )`};
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  text-align: center;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: ${({ theme }) => theme.primaryColor};
  line-height: 1.2;
  letter-spacing: -0.02em;

  span {
    color: ${({ theme }) => theme.orangeColor};
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  color: ${({ theme }) => theme.text}cc;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const GuideSection = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const GuideButton = styled(motion.a)`
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.smallRadius};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${({ theme }) => `${theme.primaryColor}08`};
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryColor};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text}99;
  }
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
const DownloadCTA = ({
  groceryGuideLink,
  foodShopGuideLink,
  ButtonWithIcon,
  Windows,
  Playstore,
  handleDownloadPlay,
  handleDownloadWindows,
}) => {
  const handleDownloadPlayClick = (e) => {
    handleDownloadPlay(e);
  };
  const handleDownloadWindowsClick = (e) => {
    handleDownloadWindows(e);
  };
  const { t } = useTranslation();
  return (
    <Section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <ContentWrapper>
          <Title>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t("partnersCtaTitle")}{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("partnersCtaBusiness")}
            </motion.span>
          </Title>

          <Description
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t("PartnerCtaDescription")}
          </Description>

          <ButtonsContainer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ButtonWithIcon
              image={Playstore}
              backgroundColor="#000000"
              text1={t("getItOn")}
              text2={t("googlePlay")}
              className="homeDownloadButton"
              onClick={(e) => handleDownloadPlayClick(e)}
            />
            <ButtonWithIcon
              image={Windows}
              backgroundColor="#000000"
              text1={t("getItOn")}
              text2="Windows"
              className="homeDownloadButton"
              onClick={(e) => handleDownloadWindowsClick(e)}
            />
          </ButtonsContainer>

          <GuideSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GuideButton
              href={groceryGuideLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <h3>{t("PartnerCtaGuideGroceried")}</h3>
              <p>{t("PartnerCtaGuideDownload")}</p>
            </GuideButton>

            <GuideButton
              href={foodShopGuideLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <h3>{t("PartnerCtaGuideFood")}</h3>
              <p>{t("PartnerCtaGuideDownload")}</p>
            </GuideButton>
          </GuideSection>
        </ContentWrapper>
      </Container>
    </Section>
  );
};

export default DownloadCTA;
