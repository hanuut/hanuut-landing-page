import React, { useState } from "react";
import styled from "styled-components";
import celebration from "../../../assets/celebration.svg";
import successful from "../../../assets/successful.svg";
import right from "../../../assets/right.svg";
import left from "../../../assets/left.svg";
import fireworks from "../../../assets/fireworks.svg";
import { ActionButton } from "../../../components/ActionButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  min-height: calc(100vh - ${(props) => props.theme.navHeight});
  width: 100%;
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  background-image: url(${celebration});
  background-size: cover; /* Use "cover" instead of "100%" */
  background-position: center;
  backdrop-filter: blur(10px);
  @media (max-width: 768px) {
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(10px);
  }
`;

const GlassBox = styled.div`
  width: 76%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(7px);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 2px rgba(${(props) => props.theme.primaryColorRgba}, 0.2),
    ${(props) =>
      props.isArabic
        ? `-15px 15px rgba(${props.theme.primaryColorRgba}, 0.75)`
        : `15px 15px rgba(${props.theme.primaryColorRgba}, 0.75)`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 768px) {
    min-height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;

    box-shadow: 0 0 2px rgba(${(props) => props.theme.primaryColorRgba}, 0.2),
      ${(props) =>
        props.isArabic
          ? `-10px 10px rgba(${props.theme.primaryColorRgba}, 0.75)`
          : `10px 10px rgba(${props.theme.primaryColorRgba}, 0.75)`};
  }
`;

const ContentWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const IllustrationWrapper = styled.div`
  width: 40%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Illustration = styled.img`
  max-width: 100%;
  align-items: center;
  justify-content: center;
  align-items: center;
  justify-content: center;
  background-image: url(${fireworks});
  background-size: 100%;
  background-position: top;
  background-repeat: no-repeat;
`;
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Description = styled.p`
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;
const PaymentInfo = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const PaymentInfoWrapper = styled.div`
  width: 100%;
  color: ${(props) => props.theme.text};
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
`;

const Label = styled.h3`
  max-width: 30%;
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    max-width: 30%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const ValueWrapper = styled.div`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Value = styled.p`
  line-height: 1;
  overflow: ${(props) => (props.expanded ? "" : "hidden")};
  border-radius: ${(props) => props.theme.defaultRadius};
  width: ${(props) => (props.expanded ? "100%" : "4%")};
  color: ${(props) => props.theme.body};
  background-color: ${(props) => props.theme.primaryColor};
  padding: ${(props) => props.theme.actionButtonPaddingMobile};
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
    padding: ${(props) => props.theme.smallPadding};
  }
  &.transparentBackground {
    border-radius: 0;
    color: ${(props) => props.theme.text};
    background-color: transparent;
    padding: 0.1rem 0;
    @media (max-width: 768px) {
      font-size: ${(props) => props.theme.fontsm};
    }
  }
`;
const ShowValueIcon = styled.img`
  transform: ${(props) => (props.isArabic ? "rotateY(180deg)" : "none")};
  max-width: 2rem;
  @media (max-width: 768px) {
    max-width: 1.5rem;
  }
`;
const Success = ({ orderId, depositeAmount, successMessage }) => {
  const { t, i18n } = useTranslation();
  const [orderValueExpanded, setOrderValueExpanded] = useState(false);
  const handleShowOrderValue = () => {
    setOrderValueExpanded(!orderValueExpanded);
  };
  return (
    <Container isArabic={i18n.language === "ar"}>
      <GlassBox>
        <IllustrationWrapper>
          {" "}
          <Illustration src={successful} alt="Illustration" />
        </IllustrationWrapper>
        <ContentWrapper>
          <Content>
            <Title>{t("thankYouForPurchase")}</Title>
            <Description>{t("purchaseSuccess")}</Description>
            <PaymentInfo>
              <PaymentInfoWrapper>
                <Label>{t("order")}</Label>
                <ValueWrapper>
                  <Value expanded={orderValueExpanded}>{orderId}</Value>
                  <ShowValueIcon
                    src={orderValueExpanded ? left : right}
                    alt="img"
                    onClick={handleShowOrderValue}
                    isArabic={i18n.language === "ar"}
                  />
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Label>{t("orderStatus")}</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {successMessage}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Label>{t("depositeAmount")}</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {depositeAmount} {t("dzd")}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Link to="/">
                  <ActionButton> {t("404Button")} </ActionButton>
                </Link>
              </PaymentInfoWrapper>
            </PaymentInfo>
          </Content>
        </ContentWrapper>
      </GlassBox>
    </Container>
  );
};

export default Success;
