import styled from "styled-components";
import AddToCart from "../../assets/girl_sofa.png";
import CartManagment from "../../assets/mobile_order.png";
import Delivery from "../../assets/order_here.png";
import { useTranslation } from "react-i18next";

// The main section container. Switched to padding for better spacing control.
const Section = styled.section`
  width: 100%;
  padding: 4rem 0; // Creates space above and below
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Container for the content. Uses max-width for better responsiveness on large screens.
const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center; // Center the title and cards container
  gap: 3rem; // Consistent gap between title and cards
`;

// Main title for the section. Centered for a cleaner look.
const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 700; // Bold but not overly so
  color: ${(props) => props.theme.primaryColor};
`;

// Container for the three step cards.
const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem; // Gap between cards

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center; // Center cards on mobile
    gap: 3rem;
  }
`;

// Individual card for each step.
const Card = styled.div`
  flex: 1; // Allows cards to grow and shrink equally
  min-width: 280px; // Prevents cards from getting too small
  display: flex;
  flex-direction: column;
  align-items: center; // Center content within the card
  text-align: center;
  gap: 1.5rem;
`;

// The illustration for each step.
const CardIcon = styled.img`
  width: 100%;
  max-height: 250px;
  // CRITICAL CHANGE: 'object-fit' is changed to 'contain' to prevent image stretching.
  // This ensures your illustrations keep their original shape.
  object-fit: contain; 
`;

// Header that contains the number and title for each step.
const StepHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

// The numbered circle.
const StepNumber = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.body};
  font-size: ${(props) => props.theme.fontxl};
  border-radius: 50%;
  font-family: "Ubuntu", sans-serif;
`;

// The title for each step (e.g., "Explore Shops").
const StepTitle = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 600;
  color: ${(props) => props.theme.text};
`;

// The descriptive text for each step.
const StepText = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: rgb(${(props) => props.theme.textRgba}, 0.75);
  line-height: 1.6;
`;

function HowItWorks() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Section>
      <Container isArabic={isArabic}>
        <Title>{t("howItWorksTitle")}</Title>

        <CardsContainer>
          <Card>
            <CardIcon src={AddToCart} alt={t("howItWorksStep1_alt")} />
            <StepHeader>
              <StepNumber>1</StepNumber>
              <StepTitle>{t("howItWorksStep1_title")}</StepTitle>
            </StepHeader>
            <StepText>{t("howItWorksStep1_text")}</StepText>
          </Card>

          <Card>
            <CardIcon src={CartManagment} alt={t("howItWorksStep2_alt")} />
            <StepHeader>
              <StepNumber>2</StepNumber>
              <StepTitle>{t("howItWorksStep2_title")}</StepTitle>
            </StepHeader>
            <StepText>{t("howItWorksStep2_text")}</StepText>
          </Card>

          <Card>
            <CardIcon src={Delivery} alt={t("howItWorksStep3_alt")} />
            <StepHeader>
              <StepNumber>3</StepNumber>
              <StepTitle>{t("howItWorksStep3_title")}</StepTitle>
            </StepHeader>
            <StepText>{t("howItWorksStep3_text")}</StepText>
          </Card>
        </CardsContainer>
      </Container>
    </Section>
  );
}

export default HowItWorks;