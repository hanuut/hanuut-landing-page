import React from "react";
import styled from "styled-components";
import PartnersImg from "../../assets/partnersIllustration.svg";
import { useTranslation } from "react-i18next";
import PartnersForm from "./components/PartnersForm";
import ShopsContainer from "./components/ShopsContainer";

const Section = styled.div`
  width: 80%;
  margin: 0 auto;
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
const UpperBox = styled.div`
  min-height: 70vh;
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
  }
`;

const RightBox = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;
const PartnersImageContainer = styled.img`
  max-width: 100%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: auto;
  }
`;
const LeftBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
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
  gap: 1.5rem;
  flex-wrap: wrap;
  .shopLinkWrapper{
    width: 30%;
  }
  }
`;

const Title = styled.h2`
  align-self: start;
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;
const PartnersPage = () => {
  const { i18n } = useTranslation();

  return (
    <Section>
      <UpperBox isArabic={i18n.language === "ar"}>
        <LeftBox>
          <PartnersForm />
        </LeftBox>
        <RightBox>
          <PartnersImageContainer
            src={PartnersImg}
            isArabic={i18n.language === "ar"}
            alt="Partners"
          />
        </RightBox>
      </UpperBox>
      {/* <LowerBox>
        <Title>Our Partners</Title>
        <ShopsContainer />
      </LowerBox> */}
    </Section>
  );
};

export default PartnersPage;
