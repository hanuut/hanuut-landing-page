import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import HomeCarousel from "../components/Carousel";
import homeIllustration1 from "../assets/screenshot1.jpeg";
import homeIllustration2 from "../assets/screenshot2.jpg";
import homeIllustration3 from "../assets/screenshot3.jpg";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    min-height: 100vh;
  }
`;
const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;
const RightBox = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LeftBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const Heading = styled.h1`
  width: 80%;
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.primaryColor};
  font-weight: 900;
  text-transform: uppercase;
`;
const SubHeading = styled.h2`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 2rem;
`;
const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxl};
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  &:hover {
    transform: scale(1.03);
  }
`;

const SmallParagraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontmd};
  margin-bottom: 1rem;
`;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <LeftBox>
          <Heading> {t("homeHeading")}</Heading>
          <SubHeading>{t("homeSubHeading")}</SubHeading>
          <Paragraph>{t("homeParagraph")}</Paragraph>
            <Button>{t("homeInputButton")}</Button>
          <SmallParagraph>{t("homeSmallerParagraph")}</SmallParagraph>
        </LeftBox>
        <RightBox>
          <HomeCarousel images = {[homeIllustration1, homeIllustration2, homeIllustration3]}/>
        </RightBox>
      </Container>
    </Section>
  );
};

export default HomePage;
