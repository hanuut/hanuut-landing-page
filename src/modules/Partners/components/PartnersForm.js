import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import AddressesDropDown from "../../../components/AddressesDropDown";
import { isValidEmail, isValidPhone } from "../../../components/validators";
import Sparkles from "../../../assets/sparkles.png";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const PartnerFormStep = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  transition: all 5s ease;
`;

const slideAnimation = keyframes`
  from {
    transform: translateX(5%);
  }
  to {
    transform: translateX(0);
  }
`;

const negativeSlideAnimation = keyframes`
  from {
    transform: translateX(-5%);
  }
  to {
    transform: translateX(0);
  }
`;
const PopUpAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
`;
const Step = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  animation-name: ${(props) =>
    props.isArabic ? negativeSlideAnimation : slideAnimation};
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

const FirstStep = styled(Step)`
  align-items: flex-start;
  justify-content: flex-start;
`;

const SecondStep = styled(Step)`
  align-items: flex-end;
  justify-content: center;
`;

const ThirdStep = styled(Step)`
  align-items: flex-end;
  justify-content: center;
`;

const FourthStep = styled(Step)`
  width: 80%;
  align-items: center;
  justify-content: center;
  align-self: center;
  gap: 1em;
  text-align: center;
  animation-name: ${PopUpAnimation};
  animation-duration: 0.75s;
`;
const SuccessIllustration = styled.img`
  max-width: 50%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: auto;
  }
`;
const Heading = styled.h1`
  width: 80%;
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.primaryColor};
  font-weight: 900;
  text-transform: uppercase;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const SubHeading = styled.h2`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontxl};
    margin-bottom: 1rem;
  }
  &.greenSubHeading {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxl};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin-bottom: 1Opx;

  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: ${(props) => props.theme.fontxl};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.fontlg};
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const EmailInputWrapper = styled(InputWrapper)`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.primaryColor};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const EmailInput = styled(Input)`
  flex: 1;
  border: none;
  font-size: ${(props) => props.theme.fontxl};
  background-color: ${(props) => props.theme.body};

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
    margin-top: 10px;
  }
`;

const SmallParagraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontmd};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Option = styled.button`
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontmd};
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }

  &.selected {
    color: ${(props) => props.theme.body};
    border: 1px solid ${(props) => props.theme.body};
    background-color: ${(props) => props.theme.primaryColor};
    font-size: ${(props) => props.theme.fontlg};
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
const PartnersForm = ({ setStep }) => {
  const { t, i18n } = useTranslation();
  const [formStep, setFormStep] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [channel, setChannel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const options = [
    {
      id: 0,
      label: "Social Media Posts",
      labelAr: "منشورات مواقع التواصل الاجتماعي",
      value: "social media",
    },
    {
      id: 1,
      label: "referral customer",
      labelAr: "إقتراح أحد الزبائن",
      value: "referral customer",
    },
    {
      id: 2,
      label: "referral shop owner",
      labelAr: "إقتراح أحد المحلات",
      value: "referral shop owner",
    },
  ];

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage(t("errorFillAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage(t("errorEmailNotValid"));
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setFormStep(1);
    setStep(1);
    setIsSubmitting(false);
  };

  const handleChooseAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const handleOptionClick = (event) => {
    event.preventDefault();
    const optionId = parseInt(event.target.value);
    setSelectedOption(optionId);
    setChannel(options[optionId].value);
  };

  const handleNext = (event) => {
    event.preventDefault();

    if (!fullName || !phone || !address) {
      setErrorMessage(t("errorFillAllFields"));
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage(t("errorPhoneNotValid"));
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setFormStep(2);
    setStep(2);
    setIsSubmitting(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!domain) {
      setErrorMessage(t("errorFillAllFields"));
      return;
    }

    setIsSubmitting(true);
    const data = {
      fullName: fullName,
      phone: phone,
      email: email,
      wilaya: address.wilaya,
      commune: address.commune,
      domain: domain,
      channel: channel,
    };

    //  const testUrl = process.env.REACT_APP_API_TEST_URL;
    const prodUrl = process.env.REACT_APP_API_PROD_URL;
    try {
      const response = await fetch(prodUrl + "/partnerSubscribeRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setErrorMessage("");
        setFormStep(3);
        setStep(3);
        setIsSubmitting(false);
      } else {
        console.error("Request failed with status:", response.status);
        setErrorMessage(t("errorCouldNotSubscribe"));
        setFormStep(0);
        setStep(0);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <PartnerFormStep>
        {formStep === 0 && (
          <FirstStep isArabic={i18n.language === "ar"}>
            <Heading> {t("partnerHeading")}</Heading>
            <SubHeading>{t("partnerSubHeading")}</SubHeading>
            <Paragraph>{t("partnerParagraph")}</Paragraph>
            <ErrorMessage>{errorMessage && <p>{errorMessage}</p>}</ErrorMessage>
            <EmailInputWrapper>
              <EmailInput
                type="email"
                placeholder={t("partnerInputText")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Button
                onClick={handleSubscribe}
                className={isSubmitting ? "submitting" : ""}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("buttonIsSubmitting")
                  : t("partnerInputButton")}
              </Button>
            </EmailInputWrapper>
            <SmallParagraph>{t("partnerSmallerParagraph")}</SmallParagraph>
          </FirstStep>
        )}
        {formStep === 1 && (
          <SecondStep isArabic={i18n.language === "ar"}>
            <SubHeading>{t("secondStepTitle")} </SubHeading>
            <ErrorMessage>{errorMessage && <p>{errorMessage}</p>}</ErrorMessage>
            <InputWrapper>
              <Label htmlFor="fullname">{t("partnersFormFullName")}</Label>
              <Input
                type="text"
                placeholder={t("partnerInputTextFullName")}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="phone">{t("partnersFormPhone")}</Label>
              <Input
                type="phone"
                placeholder={t("partnerInputTextPhone")}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </InputWrapper>
            <AddressesDropDown onChooseAddress={handleChooseAddress} />

            <Button
              onClick={handleNext}
              className={isSubmitting ? "submitting" : ""}
              disabled={isSubmitting}
            >
              {" "}
              {isSubmitting
                ? t("buttonIsSubmitting")
                : t("partnersFormNextButton")}
            </Button>
          </SecondStep>
        )}
        {formStep === 2 && (
          <ThirdStep isArabic={i18n.language === "ar"}>
            <SubHeading>{t("thirdStepTitle")}</SubHeading>
            <ErrorMessage>{errorMessage && <p>{errorMessage}</p>}</ErrorMessage>
            <InputWrapper>
              <Label htmlFor="domain">{t("partnersFormDomain")}</Label>
              <Input
                type="text"
                placeholder={t("partnerInputTextForm")}
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="channel">{t("partnersFormSource")}</Label>
              <OptionsWrapper>
                {options.map((option) => (
                  <Option
                    key={option.id}
                    type="text"
                    value={option.id}
                    onClick={handleOptionClick}
                    className={selectedOption === option.id ? "selected" : ""}
                  >
                    {i18n.language === "ar" ? option.labelAr : option.label}
                  </Option>
                ))}
              </OptionsWrapper>
            </InputWrapper>

            <Button
              onClick={handleSubmit}
              className={isSubmitting ? "submitting" : ""}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("buttonIsSubmitting")
                : t("partnersFormSubmitButton")}
            </Button>
          </ThirdStep>
        )}
        {formStep === 3 && (
          <FourthStep isArabic={i18n.language === "ar"}>
            <SuccessIllustration src={Sparkles} />
            <SubHeading className="greenSubHeading">
              {t("partnersFormThankYouTitle")}
            </SubHeading>
            <Paragraph>{t("partnersFormThankYouSubTitle")}</Paragraph>
            <Link to="/">
              <Button>{t("navHome")}</Button>
            </Link>
          </FourthStep>
        )}
      </PartnerFormStep>
    </Container>
  );
};

export default PartnersForm;
