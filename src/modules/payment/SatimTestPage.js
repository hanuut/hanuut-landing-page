import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BackgroundImage from "../../assets/background.png";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { light } from "../../config/Themes";
import creditCard from "../../assets/creaditCard.svg";
import { registerOrder } from "./services/paymentServices";
import Loader from "../../components/Loader";

const Section = styled.div`
  height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-position: center;
  padding: 2rem 0;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const ShopPageContainer = styled.div`
  padding: 2rem;
  min-height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  background: hsla(147, 45%, 80%, 1);
  background: linear-gradient(
    90deg,
    hsla(147, 45%, 80%, 1) 0%,
    hsla(148, 46%, 92%, 1) 48%,
    hsla(0, 0%, 100%, 1) 100%
  );

  background: -moz-linear-gradient(
    90deg,
    hsla(147, 45%, 80%, 1) 0%,
    hsla(148, 46%, 92%, 1) 48%,
    hsla(0, 0%, 100%, 1) 100%
  );

  background: -webkit-linear-gradient(
    90deg,
    hsla(147, 45%, 80%, 1) 0%,
    hsla(148, 46%, 92%, 1) 48%,
    hsla(0, 0%, 100%, 1) 100%
  );

  filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#B5E3CA", endColorstr="#E1F4EA", GradientType=1 );
  border-radius: ${(props) => props.theme.defaultRadius};
  box-shadow: 0 0 2px rgba(${(props) => props.theme.primaryColorRgba}, 0.2);
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.smallPadding};
    width: 85%;
  }
`;

const UpperBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

const MenuTitle = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.orangeColor};
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const LowerBox = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormContainer = styled.form`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    align-self: flex-start;
    width: 100%;
  }
`;

const FormGroup = styled.div`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  font-size: ${(props) => props.theme.fontxl};
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.secondaryColor};
  }
  @media (max-width: 768px) {
    position: static;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const ErrorMessage = styled.div`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;

  p {
    background-color: #ffbaba;
    color: #d8000c;
    padding: 0.5rem 1rem;
    border: 1px solid #d8000c;
    border-radius: ${(props) => props.theme.defaultRadius};
    font-size: ${(props) => props.theme.fontmd};
  }
`;
const FormTitle = styled.p`
  max-width: 100%;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 600;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const SatimTestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);
  const { t, i18n } = useTranslation();

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!isSubmitting) {
      if (!orderId || !amount) {
        setErrorMessage(t("errorFillAllFields"));
        return;
      }

      if (amount < 50) {
        setErrorMessage(`${t("errorAmount")} ${t("dzd")}`);
        return;
      }

      setErrorMessage("");
      setIsSubmitting(true);

      const data = {
        orderId: orderId,
        amount: amount * 100,
      };

      try {
        console.log(
          `attempting to register order ${data.orderId} ${data.amount}`
        );
        const response = await registerOrder(data);
        const responseData = response.data;
        console.log(
          `attempting to register order ${responseData}`
        );
        if (responseData) {
          if (responseData.errorCode === "0") {
            console.log(
            "registering order"
            );
            setRedirecting(true);
            console.log(
              "redirecting ..."
              );
            setTimeout(() => {
              window.location.href = responseData.formUrl;
            }, 3000);
            return () => {
              setRedirecting(false);
            };
          } else {
            setErrorMessage(responseData.errorMessage);
          }
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message); 
      }

      setIsSubmitting(false);
    }
  };
  return (
    <Section>
      <ShopPageContainer isArabic={i18n.language === "ar"}>
        <UpperBox>
          <MenuTitle>{t("testPayment")}</MenuTitle>
        </UpperBox>
        <LowerBox>
          {redirecting ? (
            <>
              <FormTitle>redirecting ...</FormTitle>
              <FormContainer>
                <Loader />
              </FormContainer>
            </>
          ) : (
            <>
              <FormTitle>{t("testPaymentTitle")}</FormTitle>
              <FormContainer onSubmit={handleSubscribe}>
                {" "}
                <FormGroup>
                  <Input
                    type="text"
                    placeholder={t("testPaymentOrder")}
                    value={orderId}
                    onChange={(event) => setOrderId(event.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    placeholder={t("testPaymentAmount")}
                    value={amount > 0 ? amount : ""}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </FormGroup>
                {errorMessage ? (
                  <ErrorMessage>
                    {errorMessage && <p>{errorMessage}</p>}
                  </ErrorMessage>
                ) : (
                  ""
                )}
                <ButtonWithIcon
                  image={creditCard}
                  backgroundColor={light.primaryColor}
                  text2={
                    isSubmitting
                      ? t("buttonIsSubmitting")
                      : t("testPaymentButton")
                  }
                  disabled={isSubmitting}
                ></ButtonWithIcon>
              </FormContainer>
            </>
          )}
        </LowerBox>
      </ShopPageContainer>
    </Section>
  );
};

export default SatimTestPage;
