import styled from "styled-components";
import AddToCart from "../../assets/addToCart.svg";
import CartManagment from "../../assets/cartManagment.svg";
import Delivery from "../../assets/delivery.svg";
import { useTranslation } from "react-i18next";

const Section = styled.section`
  min-height: 60vh;
  background-color: ${(props) => props.theme.body};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  width: 80%;
  display: flex;
  flex-direction: Column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 100%;
    align-items: flex-start;
  }
`;

const HowItWorksTitle = styled.h2`
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  transition: all 0.3s ease;
  @media (max-width: 768px) {
   flex-direction : column;
   gap: 2rem;
  }
`;

const HowItWorksCard = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  @media (max-width: 768px) {
    width: 100%;
   }
`;

const HowItWorksIcon = styled.img`
  width: 75%;
  height: 30vh;
  object-fit: fill;
  @media (max-width: 768px) {
    width: 75%;
   }
`;

const HowItWorksStep = styled.h1`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.body};
  font-size: ${(props) => props.theme.fontxl};
  border-radius: 50%;
  margin-left: ${(props) => (props.isArabic ? "0" : "1.25rem")};
  margin-right: ${(props) => (props.isArabic ? "1.25rem" : "0")};
  font-family: 'Ubuntu', sans-serif;
  @media (max-width: 768px) {
    align-self: flex-start;
   }
`;

const HowItWorksText = styled.p`

  font-size: ${(props) => props.theme.fontlg};
  color: rgb(${(props) => props.theme.textRgba}, 0.75);
  line-height: 1.5;
  margin-left: ${(props) => (props.isArabic ? "0" : "1.25rem")};
  margin-right: ${(props) => (props.isArabic ? "1.25rem" : "0")};
`;

function HowItWorks() {
  const { t, i18n } = useTranslation();
  return (
    <Section>
     <Container isArabic={i18n.language === "ar"}>
        <HowItWorksTitle isArabic={i18n.language === "ar"}>{t("howItWorksTitle")}</HowItWorksTitle>
        <CardsContainer>
          <HowItWorksCard>
            <HowItWorksIcon src={AddToCart} alt="Shop and Add to cart" />
            <HowItWorksStep isArabic={i18n.language === "ar"}>1</HowItWorksStep>
            <HowItWorksText isArabic={i18n.language === "ar"}>
            {t("howItWorksShoping")}
            </HowItWorksText>
          </HowItWorksCard>
          <HowItWorksCard>
            <HowItWorksIcon src={CartManagment} alt="Proceed To Delivery" />
            <HowItWorksStep isArabic={i18n.language === "ar"}>2</HowItWorksStep>
            <HowItWorksText isArabic={i18n.language === "ar"}>
            {t("howItWorkCartManagment")}
            </HowItWorksText>
          </HowItWorksCard>
          <HowItWorksCard >
            <HowItWorksIcon src={Delivery} alt="Receive your item" />
            <HowItWorksStep isArabic={i18n.language === "ar"}>3</HowItWorksStep>
            <HowItWorksText isArabic={i18n.language === "ar"}>
            {t("howItWorksDelivery")}
            </HowItWorksText>
          </HowItWorksCard>
        </CardsContainer>
      </Container>
    </Section>
  );
}

export default HowItWorks;
