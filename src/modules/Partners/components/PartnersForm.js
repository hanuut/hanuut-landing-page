import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import AddressesDropDown from "../../../components/AddressesDropDown";
import { isValidEmail, isValidPhone } from "../../../components/validators";
import Left from "../../../assets/left.svg";
import Right from "../../../assets/rightOrange.svg";
import {
  checkPhoneNumberAvailability,
  getSubscribeRequest,
  postSubscribeRequest,
} from "../../SubscribeRequest/services/SubscribeRequest";
import { light } from "../../../config/Themes";
import MessageWithLink from "../../../components/MessageWithLink";
import DomainsDropDown from "../../../components/DomainsDropDown";
import { TextButton } from "../../../components/ActionButton";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Send from "../../../assets/send.svg";
import fireworks from "../../../assets/fireworks.svg";
import Playstore from "../../../assets/playstore.png";
import MyHanuutLogo from "../../../assets/myhanuutlogo.png";

import Windows from "../../../assets/windows.svg";

import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const PartnerFormStep = styled.form`
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const FormStepsIndicator = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  max-width: 50%;
  padding: ${(props) => props.theme.smallPadding};
  border-radius: ${(props) => props.theme.bigRadius};
  background: linear-gradient(
    -45deg,
    hsla(146, 45%, 10%, 1) ${(props) => (props.formStep - 1) * 25}%,
    hsla(26, 80%, 10%, 1) 100%
  );

  background: -moz-linear-gradient(
    -45deg,
    hsla(146, 45%, 10%, 1) ${(props) => (props.formStep - 1) * 25}%,
    hsla(26, 80%, 10%, 1) 100%
  );

  background: -webkit-linear-gradient(
    -45deg,
    hsla(26, 80%, 90%, 1) ${(props) => (props.formStep - 1) * 25}%,
    hsla(146, 45%, 90%, 1) ${(props) => (props.formStep + 1) * 50}%
  );
  box-shadow: 0 5px 5px rgba(${(props) => props.theme.primaryColorRgba}, 0.2);
  @media (max-width: 768px) {
    bottom: 5%;
  }
`;

const StepIndicator = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active ? props.theme.primaryColor : "#ccc"};
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
  position: relative;
  z-index: 10;
  width: 90%;
  display: flex;
  flex-direction: column;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  animation-name: ${(props) =>
    props.isArabic ? negativeSlideAnimation : slideAnimation};
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  text-transform: uppercase;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: ${(props) => props.theme.fontLargest};
  text-transform: uppercase;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;
const SubHeading = styled.h2`
  text-align: center;
  font-size: ${(props) => props.theme.fontxxxl};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxl};
  }
  &.greenSubHeading {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const FirstStep = styled(Step)`
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;
const SecondStep = styled(Step)`
  align-items: flex-end;
  justify-content: flex-start;
`;

const ThirdStep = styled(Step)`
  align-items: flex-end;
  justify-content: flex-start;
`;

const FourthStep = styled(Step)`
  align-items: center;
  justify-content: center;
  text-align: center;
  animation-name: ${PopUpAnimation};
  animation-duration: 0.75s;
  background-image: ${(props) =>
    props.isAccepted ? `url(${fireworks})` : "none"};
  background-size: cover;
  background-opacity: 0.5;
`;
const MyHanuutIcon = styled.img`
  height: 8rem;
  width: 8rem;
  margin-bottom: 3rem;
`;
const Icon = styled.img`
  height: 2rem;
  width: 2rem;
  margin-top: 1.5rem;
`;

// const Paragraph = styled.p`
//   text-align: center;
//   width: 100%;
//   font-size: ${(props) => props.theme.fontxl};
//   @media (max-width: 768px) {
//     font-size: ${(props) => props.theme.fontmd};
//   }
// `;

const InputWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Input = styled.input`
  border-radius: ${(props) => props.theme.smallRadius};
  padding: ${(props) => props.theme.smallPadding};
  border: 1px solid rgba(${(props) => props.theme.primaryColorRgba}, 0.5);
  font-size: ${(props) => props.theme.fontxl};
  background-color: transparent;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const Label = styled.label`
  margin: 0.5rem 0;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const PhoneInputWrapper = styled(InputWrapper)`
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const PhoneInput = styled(Input)`
  flex: 1;
  border: none;
  font-size: ${(props) => props.theme.fontxl};
  background-color: transparent;
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
  }
`;

const ButtonsRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const EmailButton = styled(Button)`
  margin: 0.5rem;
`;
const SmallParagraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontmd};
  &.centeredText {
    text-align: center;
  }
  @media (max-width: 768px) {
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
  background-color: transparent;
  color: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontmd};
  cursor: pointer;
  transition: all 0.5s ease;
  padding: ${(props) => props.theme.smallPadding};
  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }

  &.selected {
    color: ${(props) => props.theme.body};
    border: 1px solid ${(props) => props.theme.body};
    background-color: ${(props) => props.theme.primaryColor};
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const ErrorMessage = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;
  p {
    width: fit-content;
    background-color: #ffbaba;
    color: #d8000c;
    padding: ${(props) => props.theme.smallPadding};
    border: 1px solid #d8000c;

    border-radius: ${(props) => props.theme.defaultRadius};
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const PartnersForm = ({ setStep }) => {
  const { t, i18n } = useTranslation();
  const [formStep, setFormStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [channel, setChannel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const totalSteps = 4;

  const myHanuutDownloadLinkWindows =
    process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
  const myHanuutDownloadLink =
    process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;

  useEffect(() => {
    console.log(myHanuutDownloadLinkWindows, myHanuutDownloadLinkWindows);
  }, [myHanuutDownloadLinkWindows, myHanuutDownloadLinkWindows]);

  const resetForm = () => {
    setEmail("");
    setFullName("");
    setPhone("");
    setAddress("");
    setDomain("");
    setBusinessName("");
    setChannel("");
    setIsSubmitting(false);
    setSelectedOption(null);
    setErrorMessage("");
    setSuccessMessage("");
    setIsAccepted(false);
  };

  const handleLeftClick = () => {
    resetForm();
    setFormStep(1);
    setStep(1);
  };

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

  const handleSubscribe = async (event) => {
    event.preventDefault();

    if (!phone) {
      setErrorMessage(t("errorFillAllFields"));
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage(t("errorPhoneNotValid"));
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");

    const isPhoneUsed = await checkPhoneNumberAvailability(phone);
    if (isPhoneUsed === true) {
      const subscribeRequest = await getSubscribeRequest(phone);
      if (subscribeRequest.isAccepted === true) {
        setSuccessMessage(t("clickToDownloadApp"));
        setIsAccepted(true);
      } else {
        setSuccessMessage(t("messagePhoneIsUsed"));
      }
      setErrorMessage("");
      setFormStep(4);
      setStep(4);
      setIsSubmitting(false);
      return;
    } else {
      setFormStep(2);
      setStep(2);
      setIsSubmitting(false);
    }
  };

  const handleChooseAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const handleChooseDomain = (newDomain) => {
    setDomain(newDomain);
  };

  const handleOptionClick = (event) => {
    event.preventDefault();
    const optionId = parseInt(event.target.value);
    setSelectedOption(optionId);
    setChannel(options[optionId].value);
  };

  const handleNext = (event) => {
    event.preventDefault();

    if (!fullName || !email || !address) {
      setErrorMessage(t("errorFillAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage(t("errorEmailNotValid"));
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    setFormStep(3);
    setStep(3);
    setIsSubmitting(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !fullName ||
      !phone ||
      !address ||
      !email ||
      !address.wilaya ||
      !address.commune ||
      !channel ||
      !domain ||
      !businessName
    ) {
      setErrorMessage(t("errorFillAllFields"));

      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMessage(t("errorPhoneNotValid"));

      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage(t("errorEmailNotValid"));

      return;
    }

    setIsSubmitting(true);

    const isPhoneUsed = await checkPhoneNumberAvailability(phone);

    if (isPhoneUsed === true) {
      const subscribeRequest = await getSubscribeRequest(phone);
      if (subscribeRequest.isAccepted === true) {
        setSuccessMessage(t("clickToDownloadApp"));
        setIsAccepted(true);
      } else {
        setSuccessMessage(t("messagePhoneIsUsed"));
      }
      setErrorMessage("");
      setFormStep(4);
      setStep(4);
      setIsSubmitting(false);
      return;
    } else {
      const data = {
        fullName: fullName,
        phone: phone,
        email: email,
        wilaya: address.wilaya,
        commune: address.commune,
        type: "partner",
        channel: channel,
        domain: domain,
        businessName: businessName,
      };

      const response = postSubscribeRequest(data);
      if (!response) {
        setErrorMessage(t("errorCouldNotSubscribe"));
        setFormStep(1);
        setStep(1);
      } else {
        setFormStep(4);
        setStep(4);
      }
      setIsSubmitting(false);
    }
  };

  const handleDownloadPlay = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLink);
  };
  const handleDownloadWindows = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLinkWindows);
  };
  return (
    <Container>
      <PartnerFormStep>
        {formStep === 1 && (
          <FirstStep isArabic={i18n.language === "ar"}>
            <Title>{t("joinOurCommunity")}</Title>
            <SubHeading>{t("partnersFormFirstStepSubHeading")}</SubHeading>
            <PhoneInputWrapper>
              <PhoneInput
                type="phone"
                placeholder={t("partnerInputTextPhone")}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
              <EmailButton
                onClick={handleSubscribe}
                className={isSubmitting ? "submitting" : ""}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("buttonIsSubmitting")
                  : t("partnerInputButton")}
              </EmailButton>
            </PhoneInputWrapper>
            <SmallParagraph className="centeredText">
              {t("partnersFormFirstStepParagraph")}
            </SmallParagraph>
            <ErrorMessage>{errorMessage && <p>{errorMessage}</p>}</ErrorMessage>
          </FirstStep>
        )}
        {formStep === 2 && (
          <SecondStep isArabic={i18n.language === "ar"}>
            <Heading className="greenSubHeading">
              {t("secondStepTitle")}{" "}
            </Heading>
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
              <Label htmlFor="phone">{t("partnersFormEmail")}</Label>
              <Input
                type="email"
                placeholder={t("partnerInputText")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </InputWrapper>
            <SmallParagraph>{t("partnerSmallerParagraph")}</SmallParagraph>
            <AddressesDropDown
              target="partners"
              onChooseAddress={handleChooseAddress}
            />
            <ErrorMessage>{errorMessage && <p>{errorMessage}</p>}</ErrorMessage>
            <TextButton
              onClick={handleNext}
              className={isSubmitting ? "submitting" : ""}
              disabled={isSubmitting}
            >
              {" "}
              {isSubmitting
                ? t("buttonIsSubmitting")
                : t("partnersFormNextButton")}
            </TextButton>
          </SecondStep>
        )}
        {formStep === 3 && (
          <ThirdStep isArabic={i18n.language === "ar"}>
            <Heading className="greenSubHeading">
              {" "}
              {t("thirdStepTitle")}
            </Heading>
            <InputWrapper>
              <Label htmlFor="businessName">
                {t("partnersFormBusinessName")}
              </Label>
              <Input
                type="text"
                placeholder={t("partnerInputTextBusinessName")}
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <DomainsDropDown onChooseDomain={handleChooseDomain} />
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
            {errorMessage ? (
              <ErrorMessage>
                {errorMessage && <p>{errorMessage}</p>}
              </ErrorMessage>
            ) : (
              ""
            )}
            <ButtonWithIcon
              image={Send}
              text2={
                isSubmitting
                  ? t("buttonIsSubmitting")
                  : t("partnersFormSubmitButton")
              }
              className="homeDownloadButton"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e)}
            ></ButtonWithIcon>
          </ThirdStep>
        )}
        {formStep === 4 &&
          (isAccepted ? (
            <FourthStep
              isArabic={i18n.language === "ar"}
              isAccepted={isAccepted}
            >
              <MyHanuutIcon src={MyHanuutLogo} />
              <Heading className="greenSubHeading">
                {t("congratulations")}
              </Heading>
              <SubHeading>{t("clickToDownloadApp")}</SubHeading>
              <ButtonsRow>
                <ButtonWithIcon
                  image={Playstore}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={t("googlePlay")}
                  className="homeDownloadButton"
                  onClick={(e) => handleDownloadPlay(e)}
                ></ButtonWithIcon>

                <ButtonWithIcon
                  image={Windows}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={"Windows"}
                  className="homeDownloadButton"
                  onClick={(e) => handleDownloadWindows(e)}
                ></ButtonWithIcon>
              </ButtonsRow>
              <Icon
                src={i18n.language === "ar" ? Right : Left}
                onClick={() => handleLeftClick()}
              />
            </FourthStep>
          ) : (
            <FourthStep isArabic={i18n.language === "ar"}>
              <MyHanuutIcon src={MyHanuutLogo} />
              <Heading className="greenSubHeading">
                {t("partnersFormThankYouTitle")}
              </Heading>
              <SubHeading>{t("partnersFormThankYouSubTitle")}</SubHeading>
              <Icon
                src={i18n.language === "ar" ? Right : Left}
                onClick={() => handleLeftClick()}
              />
            </FourthStep>
          ))}
        <FormStepsIndicator formStep={formStep}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <StepIndicator key={index} active={index <= formStep - 1} />
          ))}
        </FormStepsIndicator>
      </PartnerFormStep>
    </Container>
  );
};

export default PartnersForm;
