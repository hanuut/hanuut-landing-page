import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // Import Link for the CTA
import AboutUsIllustration from "../../assets/shop_owner_illustration.png"; // Using your existing illustration

// Section: Cleaned up to use padding for spacing instead of min-height. Removed background image for clarity.
const Section = styled.section`
  width: 100%;
  padding: 6rem 0; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  overflow: hidden;
`;

// Container: Standardized for better responsiveness.
const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4rem; // Increased gap for more white space

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

// LeftBox: Will now contain all the text content for a clear reading flow.
const TextContainer = styled.div`
  flex: 1; // Takes up 50% of the space
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

// RightBox: Dedicated to the illustration.
const IllustrationContainer = styled.div`
  flex: 1; // Takes up the other 50%
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Illustration = styled.img`
  width: 100%;
  max-width: 450px;
  height: auto;
  object-fit: contain; // Prevents image distortion
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
`;

const Paragraph = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: rgb(${(props) => props.theme.textRgba}, 0.8);
  line-height: 1.7;
  max-width: 600px; // Keeps line length readable
`;

// --- New Call to Action Components ---
const CtaContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(${(props) => props.theme.textRgba}, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const CtaText = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: ${(props) => props.theme.text};
`;

const CtaButton = styled(Link)`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: ${(props) => props.theme.primaryColor};
  text-decoration: none;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

function AboutUs() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Section>
      <Container isArabic={isArabic}>
        <TextContainer>
          <Title>{t("aboutUsTitle")}</Title>
          <Paragraph>{t("aboutUsParagraph")}</Paragraph>
          <CtaContainer>
            <CtaText>{t("aboutUsCtaText")}</CtaText>
            <CtaButton to="/partners">{t("aboutUsCtaButton")} &rarr;</CtaButton>
          </CtaContainer>
        </TextContainer>

        <IllustrationContainer>
          <Illustration
            src={AboutUsIllustration}
            alt={t("aboutUsAlt")}
            loading="lazy"
          />
        </IllustrationContainer>
      </Container>
    </Section>
  );
}

export default AboutUs;