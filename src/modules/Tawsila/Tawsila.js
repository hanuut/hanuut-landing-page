import DeliveryMissions from "../../assets/deliverymissions.svg";
import React, { useState } from "react";
import styled from "styled-components";
import AddressesDropDown from "../../components/AddressesDropDown";
import { useTranslation } from "react-i18next";
import { isValidEmail, isValidPhone } from "../../components/validators";
import {
  checkPhoneNumberAvailability,
  getSubscribeRequest,
  postSubscribeRequest,
} from "./services/Tawsila";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { light } from "../../config/Themes";
import ScrollDownIcon from "../../assets/arrowDownIcon.svg";
import Steps from "./components/Steps";
import MessageWithLink from "../../components/MessageWithLink";
import { BlueActionButton } from "../../components/ActionButton";
import { Link } from "react-router-dom";

const HeroSection = styled.div`
  position: relative;
  min-height: ${(props) => `calc(85vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    position: static;
    flex-direction: column;
  }
`;

const BackgroundImage = styled.div`
  height: 70vh;
  background-image: url(${DeliveryMissions});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  background-color: ${(props) => props.theme.body};
  @media (max-width: 768px) {
    width: 80%;
    height: 25vh;
    background-size: cover;
    background-position: center;
  }
`;

const FormContainerOverlay = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  position: absolute;
  width: 25%;
  margin: 1rem 0;
  padding: 2.5rem 0;
  right: ${(props) => (props.isArabic ? "65%" : "10%")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  border-radius: ${(props) => props.theme.bigRadius};
  transition: all 0.2s ease;
  background: rgba(${(props) => props.theme.bodyRgba}, 0.5);
  backdrop-filter: blur(3px);
  @media (max-width: 768px) {
    padding: 2rem 0;
    position: static;
    width: 90%;
  }
`;

const ContentOverlay = styled.div`
  width: 35%;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  position: absolute;
  right: ${(props) => (props.isArabic ? "11%" : "54%")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: ${(props) => props.theme.text};
  border-radius: ${(props) => props.theme.bigRadius};
  transition: all 0.2s ease;
  @media (max-width: 768px) {
    position: static;
    width: 90%;
  }
`;

const FormContainer = styled.form`
  width: 90%;
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
  width: 80%;
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.secondaryColor};
  font-weight: 900;
  text-transform: uppercase;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Subheading = styled.h1`
  max-width: 80%;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  margin: 0.5rem 0;
  text-shadow: -1px -1px 0 ${(props) => props.theme.body},
    1px -1px 0 ${(props) => props.theme.body},
    -1px 1px 0 ${(props) => props.theme.body},
    1px 1px 0 ${(props) => props.theme.body};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const Text = styled.p`
  max-width: 100%;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  margin: 0.5rem 0;
  text-shadow: -1px -1px 0 ${(props) => props.theme.body},
    1px -1px 0 ${(props) => props.theme.body},
    -1px 1px 0 ${(props) => props.theme.body},
    1px 1px 0 ${(props) => props.theme.body};
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
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

const Tawsila = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    const element = document.getElementById("stepsSection");
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
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
    setIsSubmitting(true);
    const isPhoneUsed = await checkPhoneNumberAvailability(phone);
    if (isPhoneUsed === true) {
      const subscribeRequest = await getSubscribeRequest(phone);

      if (subscribeRequest.isAccepted) {
        // setSuccessMessage(t("messagePhoneIsUsed"));
        setSuccessMessage(t("clickToDownloadTawsila"));
      } else {
        setSuccessMessage(t("messagePhoneIsUsed"));
      }
      setIsSubmitting(false);
      return;
    } else {
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
        <BackgroundImage />

        <ContentOverlay isArabic={i18n.language === "ar"}>
          {" "}
          <Heading>{t("tawsilaHeading")}</Heading>
          <Subheading>{t("tawsilaSubHeading")}</Subheading>
          <Text>{t("tawsilaText")}</Text>
          <Link to="/get started with Tawsila">
            <BlueActionButton onClick={() => {}}>
              {" "}
              {"> "} {t("getStarted")}{" "}
            </BlueActionButton>
          </Link>
        </ContentOverlay>
        <FormContainerOverlay isArabic={i18n.language === "ar"}>
          {successMessage ? (
            <>
              {successMessage && (
                <MessageWithLink
                  message={t("clickToDownloadTawsila")}
                  link={TawsilaDownloadLink}
                  linkText={t("downloadTawsila")}
                />
              )}
              <ButtonWithIcon
                image={ScrollDownIcon}
                onClick={handleScroll}
                backgroundColor={light.secondaryColor}
              >
                {t("scrollDown")}
              </ButtonWithIcon>
            </>
          ) : (
            <FormContainer onSubmit={handleSubscribe}>
              <FormTitle>{t("signUp")}</FormTitle>
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
      <div id="stepsSection">
        <Steps />
      </div>
    </>
  );
};

export default Tawsila;
