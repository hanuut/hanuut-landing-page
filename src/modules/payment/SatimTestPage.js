import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BackgroundImage from "../../assets/background.png";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { light } from "../../config/Themes";
import creditCard from "../../assets/creaditCard.svg";
import { refund, registerOrder } from "./services/paymentServices";
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
  width: 80%;
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
    font-size: ${(props) => props.theme.fontxxl};
  }
`;
const LowerBox = styled.div`
  height: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;

    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const RightBox = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;
    text-align: center;
  }
`;
const LeftBox = styled.div`
  width: 45%;
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
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormGroup = styled.div`
width: 75%;
  display; flex;
  @media (max-width: 768px) {
    max-width: 75%;
    width: 90%;
  }
`;

const Label = styled.label`
  margin: 0 1rem;
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontsm};
  }
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
    width: 100%;
    position: static;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const ErrorMessage = styled.p`
  width: 100%;
  text-align: center;
  background-color: #ffbaba;
  color: #d8000c;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.redColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontmd};
`;

const SuccessMessage = styled.p`
  width: 100%;
  text-align: center;
  background-color: rgba(${(props) => props.theme.primaryColorRgba}, 0.2);
  color: ${(props) => props.theme.primaryColor};
  padding: 10px;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontmd};
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

const SubHeading = styled.h2`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const SatimTestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [selectedForm, setSelectedForm] = useState("registerOrder");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);
  const { t, i18n } = useTranslation();

  const handleRadioChange = (event) => {
    setSelectedForm(event.target.value);
  };

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
        if (selectedForm === "registerOrder") {
          const response = await registerOrder(data);
          const responseData = response.data;
          if (responseData) {
            if (responseData.errorCode === "0") {
              setRedirecting(true);
              setTimeout(() => {
                window.location.href = responseData.formUrl;
              }, 2000);
              return () => {
                setRedirecting(false);
              };
            } else {
              setErrorMessage(responseData.errorMessage);
            }
          }
        } else {
          const response = await refund(data);
          const responseData = response.data;
          if (responseData) {
            if (responseData.errorCode === "0") {
              setErrorMessage("");
              setSuccessMessage(responseData.errorMessage);
            } else {
              setSuccessMessage("");
              setErrorMessage(responseData.errorMessage);
            }
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
          <LeftBox>
            <SubHeading>{t("testPaymentSubHeading")}</SubHeading>
            <Paragraph>{t("testPaymentParagraph")}</Paragraph>
            <Paragraph> {t("testPaymentParagraph2")} </Paragraph>
            <FormGroup>
              <input
                type="radio"
                id="testRegisterOrder"
                name="testType"
                value="registerOrder"
                checked={selectedForm === "registerOrder"}
                onChange={handleRadioChange}
              />
              <Label for="testRegisterOrder">
                {t("testPaymentRegisterOrder")}
              </Label>
            </FormGroup>

            <FormGroup>
              <input
                type="radio"
                id="testRefund"
                name="testType"
                value="refund"
                checked={selectedForm === "refund"}
                onChange={handleRadioChange}
              />
              <Label for="testRefund">{t("testPaymentRefundOrder")}</Label>
            </FormGroup>
          </LeftBox>

          <RightBox>
            {" "}
            {redirecting ? (
              <>
                <FormTitle>{t("redirecting")}</FormTitle>
                <FormContainer>
                  <Loader />
                </FormContainer>
              </>
            ) : (
              <>
                <FormTitle>
                  {selectedForm === "registerOrder"
                    ? t("testPaymentRegisterOrder")
                    : t("testPaymentRefundOrder")}
                </FormTitle>
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
                    <FormGroup>
                      {" "}
                      <ErrorMessage>
                        {errorMessage && <p>{errorMessage}</p>}
                      </ErrorMessage>
                    </FormGroup>
                  ) : (
                    ""
                  )}
                  {successMessage ? (
                    <FormGroup>
                      {" "}
                      <SuccessMessage>
                        {successMessage && <p>{successMessage}</p>}
                      </SuccessMessage>
                    </FormGroup>
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
          </RightBox>
        </LowerBox>
      </ShopPageContainer>
    </Section>
  );
};

export default SatimTestPage;
