// import DeliveryMissions from "../../assets/deliverymissions.svg";
import React, { useState } from "react";
import styled from "styled-components";
import AddressesDropDown from "../../components/AddressesDropDown";
import { useTranslation } from "react-i18next";
import { isValidEmail, isValidPhone } from "../../components/validators";
import {
  checkPhoneNumberAvailability,
  getSubscribeRequest,
  postSubscribeRequest,
} from "../SubscribeRequest/services/SubscribeRequest";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { light } from "../../config/Themes";
// import ScrollDownIcon from "../../assets/arrowDownIcon.svg";
// import Steps from "./components/Steps";
import MessageWithLink from "../../components/MessageWithLink";
// import { BlueActionButton } from "../../components/ActionButton";
// import { Link } from "react-router-dom";

const HeroSection = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(3px);
  background: rgb(10, 153, 255);
  background: linear-gradient(
    0deg,
    rgba(10, 153, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  @media (max-width: 768px) {
    position: static;
    flex-direction: column;
  }
`;

const FormContainerOverlay = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;
  @media (max-width: 768px) {
    padding: 2rem 0;
    position: static;
    width: 90%;
  }
`;

const ContentOverlay = styled.div`
  width: 50%;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  right: ${(props) => (props.isArabic ? "11%" : "54%")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  border-radius: ${(props) => props.theme.bigRadius};
  transition: all 0.2s ease;
  @media (max-width: 768px) {
    position: static;
    width: 90%;
  }
`;

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    align-self: flex-start;
    width: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  font-size: ${(props) => props.theme.fontxl};
  background-color: rgba(${(props) => props.theme.bodyRgba}, 0.7);
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.secondaryColor};
  }
  @media (max-width: 768px) {
    position: static;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
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

const Button = styled.button`
  background-color: ${(props) => props.theme.secondaryColor};
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

const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.secondaryColor};
  font-weight: 900;
  text-transform: uppercase;
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Subheading = styled.h1`
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  margin: 0.5rem 0;
  text-shadow: -1px -1px 0 ${(props) => props.theme.body},
    1px -1px 0 ${(props) => props.theme.body},
    -1px 1px 0 ${(props) => props.theme.body},
    1px 1px 0 ${(props) => props.theme.body};
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const Text = styled.p`
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  margin: 0.5rem 0;
  text-shadow: -1px -1px 0 ${(props) => props.theme.body},
    1px -1px 0 ${(props) => props.theme.body},
    -1px 1px 0 ${(props) => props.theme.body},
    1px 1px 0 ${(props) => props.theme.body};
  margin-bottom: 1rem;
  max-width: 80%;
  text-align: center;
  @media (max-width: 768px) {
    text-align: ${(props) => (props.isArabic ? "right" : "left")};
    max-width: 100%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;
// const FormTitle = styled.p`
//   max-width: 100%;
//   color: ${(props) => props.theme.text};
//   font-size: ${(props) => props.theme.fontxxxl};
//   font-weight: 600;
//   @media (max-width: 768px) {
//     width: 90%;
//     font-size: ${(props) => props.theme.fontxl};
//   }
// `;

const RegisterTawsila = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);

  const TawsilaDownloadLink = process.env.REACT_APP_TAWSILA_DOWNLOAD_LINK + "";

  const handleChooseAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const handleScroll = () => {
    setSuccessMessage("");
    setFullName("");
    setPhone("");
    setAddress(null);
    setErrorMessage("");
    setIsAccepted(false);

    // const element = document.getElementById("stepsSection");
    // if (element) {
    //   element.scrollIntoView({ behavior: "smooth" });
    // }
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (
      !fullName ||
      !phone ||
      !address ||
      !email ||
      !address.wilaya ||
      !address.commune
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
    setErrorMessage("");
    setIsSubmitting(true);

    const isPhoneUsed = await checkPhoneNumberAvailability(phone);

    if (isPhoneUsed === true) {
      const subscribeRequest = await getSubscribeRequest(phone);
      if (subscribeRequest.isAccepted === true) {
        setSuccessMessage(t("clickToDownloadApp"));
        setIsAccepted(true);
      } else {
        setSuccessMessage(t("messagePhoneIsUsed"));
        setIsAccepted(false);
      }
      setIsSubmitting(false);
      return;
    } else {
      setIsAccepted(false);
      const data = {
        fullName: fullName,
        phone: phone,
        email: email,
        wilaya: address.wilaya,
        commune: address.commune,
        type: "driver",
      };

      const response = postSubscribeRequest(data);
      if (!response) {
        setErrorMessage(t("errorCouldNotSubscribe"));
      } else {
        setErrorMessage("");
        setSuccessMessage(t("partnersFormThankYouSubTitle"));
      }
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <HeroSection isArabic={i18n.language === "ar"}>
        <ContentOverlay isArabic={i18n.language === "ar"}>
          {" "}
          <Heading>{t("signUp")}</Heading>
          <Subheading>{t("tawsilaSubHeading")}</Subheading>
          <Text isArabic={i18n.language === "ar"}>{t("tawsilaText")}</Text>
          {/* <Link to="/get-started-with-Tawsila">
            <BlueActionButton onClick={() => {}}>
              {" "}
              {"> "} {t("getStarted")}{" "}
            </BlueActionButton>
          </Link> */}
        </ContentOverlay>
        <FormContainerOverlay isArabic={i18n.language === "ar"}>
          {successMessage ? (
            <>
              {successMessage && (
                <MessageWithLink
                  message={successMessage}
                  link={isAccepted ? TawsilaDownloadLink : ""}
                  linkText={isAccepted ? t("downloadTawsila") : ""}
                  textColor={light.secondaryColor}
                />
              )}
              <ButtonWithIcon
                text1={"Done"}
                onClick={handleScroll}
                backgroundColor={light.secondaryColor}
              >
                {t("scrollDown")}
              </ButtonWithIcon>
            </>
          ) : (
            <FormContainer onSubmit={handleSubscribe}>
              <FormGroup>
                <Input
                  type="text"
                  placeholder={t("partnerInputTextFullName")}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="email"
                  placeholder={t("partnerInputText")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="phone"
                  placeholder={t("partnerInputTextPhone")}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </FormGroup>
              <AddressesDropDown
                target="tawsila"
                onChooseAddress={handleChooseAddress}
              />
              {errorMessage ? (
                <ErrorMessage>
                  {errorMessage && <p>{errorMessage}</p>}
                </ErrorMessage>
              ) : (
                ""
              )}

              <Button
                onClick={handleSubscribe}
                className={isSubmitting ? "submitting" : ""}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("buttonIsSubmitting")
                  : t("partnerInputButton")}
              </Button>
            </FormContainer>
          )}
        </FormContainerOverlay>
      </HeroSection>
    </>
  );
};

export default RegisterTawsila;
