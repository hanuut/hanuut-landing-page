import React, { useState } from "react";
import styled from "styled-components";
import failure from "../../../assets/failure.svg";
import noData from "../../../assets/noData.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../../components/ActionButton";
import SatimLigne from "../../../assets/satimLigne.png";

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
  background-image: url(${failure});
  background-size: 80%;
  background-position: top;
  backdrop-filter: blur(10px);
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    background-size: 80%;
    background-position: top;
    backdrop-filter: blur(10px);
    padding: 0;
  }
`;

const GlassBox = styled.div`
  width: 76%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 2px rgba(${(props) => props.theme.redColorRgba}, 0.3),
    ${(props) =>
      props.isArabic
        ? `-15px 15px rgba(${props.theme.redColorRgba}, 0.75)`
        : `15px 15px rgba(${props.theme.redColorRgba}, 0.75)`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 768px) {
    min-height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;

    backdrop-filter: blur(20px);
    box-shadow: 0 0 2px rgba(${(props) => props.theme.redColorRgba}, 0.2),
      ${(props) =>
        props.isArabic
          ? `-10px 10px rgba(${props.theme.redColorRgba}, 0.75)`
          : `10px 10px rgba(${props.theme.redColorRgba}, 0.75)`};
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
  @media (max-width: 768px) {
    width: 100%;
  }
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
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  &.satimMessage {
    max-width: 100%;
    font-size: ${(props) => props.theme.fontxxl};
    color: ${(props) => props.theme.primaryColor};
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const ValueWrapper = styled.div`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Value = styled.p`
  line-height: 1;
  overflow: hidden;
  border-radius: ${(props) => props.theme.defaultRadius};
  width: ${(props) => (props.expanded ? "100%" : "4%")};
  font-size: 1.2rem;
  color: ${(props) => props.theme.body};
  background-color: ${(props) => props.theme.redColor};
  padding: ${(props) => props.theme.actionButtonPaddingMobile};
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
    padding: ${(props) => props.theme.smallPadding};
  }
  &.transparentBackground {
    border-radius: 0;
    color: ${(props) => props.theme.text};
    background-color: transparent;
    padding: 0.1rem 0;
    @media (max-width: 768px) {
      font-size: ${(props) => props.theme.fontmd};
    }
  }
`;
const Failed = ({ orderId, responseData, error }) => {
  const { t, i18n } = useTranslation();
  const [orderValueExpanded, setOrderValueExpanded] = useState(false);
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear()).slice(-2);
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${day}/${month}/20${year}, ${hours}:${minutes}`;

  return (
    <Container isArabic={i18n.language === "ar"}>
      <GlassBox>
        <IllustrationWrapper>
          {" "}
          <Illustration src={noData} alt="Illustration" />
        </IllustrationWrapper>
        <ContentWrapper>
          <Content>
            <Title>{t("somethingWrongHappened")}</Title>
            <Description>{t("purchaseFailure")}</Description>
            <PaymentInfoWrapper>
              <Label className="satimMessage">Recu de Paiment</Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                <Label>Merchant: SARL Hanuut Express</Label>
              </Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                {" "}
                <Label>Address: Arris, Batna</Label>
              </Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                {" "}
                <Label>email: contact@hanuut.com</Label>
              </Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                {" "}
                <Label className="satimMessage">Payment Details</Label>
              </Label>
            </PaymentInfoWrapper>

            <PaymentInfo>
              <PaymentInfoWrapper>
                <Label>Order ID</Label>
                <ValueWrapper>
                  <Value expanded={true}>{orderId}</Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Label>Time</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {formattedDateTime}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
            </PaymentInfo>
            <PaymentInfo>
              <PaymentInfoWrapper>
                <Label>{t("errorDescription")}</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {error}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>

              <PaymentInfoWrapper>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {responseData.params && responseData.params.respCode_desc
                      ? responseData.params.respCode_desc
                      : responseData.actionCodeDescription}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>

              <PaymentInfoWrapper>
                <Label className="satimMessage">
                  En cas de problème de paiement, veuillez contacter le numéro
                  vert de la SATIM 3020 <img src={SatimLigne}></img>
                </Label>
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

export default Failed;
