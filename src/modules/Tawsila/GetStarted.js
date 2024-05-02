import React, { useState } from "react";
import styled from "styled-components";
import DeliveryImage from "../../assets/convenience.svg";
import OnboardingImage from "../../assets/convenience.svg";
import AddressesDropDown from "../../components/AddressesDropDown";
import { useTranslation } from "react-i18next";
import { isValidEmail, isValidPhone } from "../../components/validators";
import {
  checkPhoneNumberAvailability,
  getSubscribeRequest,
  postSubscribeRequest,
} from "../SubscribeRequest/services/SubscribeRequest";
import { light } from "../../config/Themes";
import MessageWithLink from "../../components/MessageWithLink";

const Section = styled.section`
  height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;
const Container = styled.div`
  height: 90%;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 3rem;
  overflow-y: scroll;
  overflow-x: hidden;

  @media (max-width: 768px) {
    height: 90%;
    width: 90%;
    gap: 2rem;
  }
`;

const StepContainer = styled.div`
  width: 100%;
  flex-direction: ${(props) => (props.reversed ? "row-reverse" : "row")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const StepConent = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.secondaryColor};
  align-self: flex-start;
  margin-bottom: 0.5rem;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const StepTitle = styled.h1`
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxl};
    margin-bottom: 0.5rem;
  }
`;

const Description = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
    margin-bottom: 0.5rem;
  }
`;

const Step = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
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
const StepNumber = styled.div`
  background-color: ${(props) => props.theme.secondaryColor};
  color: ${(props) => props.theme.body};
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const StepDescription = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ImageStepContainer = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    margin: 1rem 0;
  }
`;

const SubscribeFormContainer = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
  @media (max-width: 768px) {
    width: auto;
  }
`;

const GetStarted = () => {
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

      if (subscribeRequest.isAccepted === true) {
        // setSuccessMessage(t("messagePhoneIsUsed"));
        setSuccessMessage(t("clickToDownloadApp"));
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
    <Section>
      <Container>
        <Title>Getting Started</Title>
        <StepContainer>
          <StepConent>
            <StepTitle>Subscribe</StepTitle>
            <Description>
              Subscribe here to place a request for our team to treat it.
            </Description>
            <Step>
              <StepNumber>1</StepNumber>
              <StepDescription>Enter your informations.</StepDescription>
            </Step>
            <Step>
              <StepNumber>2</StepNumber>
              <StepDescription>
                We will treat your request, then Call you or send you an email
                to inform you when you are accepted
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>3</StepNumber>
              <StepDescription>Download Tawsila App</StepDescription>
            </Step>
          </StepConent>
          <SubscribeFormContainer>
            {successMessage ? (
              <>
                {successMessage && (
                  <MessageWithLink
                    message={t("clickToDownloadApp")}
                    link={TawsilaDownloadLink}
                    linkText={t("downloadTawsila")}
                    textColor={light.secondaryColor}
                  />
                )}
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
          </SubscribeFormContainer>
        </StepContainer>

        <StepContainer reversed={true}>
          <StepConent>
            <StepTitle>Create Account </StepTitle>
            <Description>
              After downloading Tawsila, you need to create an account and
              accept the terms and the conditions
            </Description>
            <Step>
              <StepNumber>1</StepNumber>
              <StepDescription>
                Provide your email, and password
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>2</StepNumber>
              <StepDescription>Provide your address</StepDescription>
            </Step>
          </StepConent>
          <ImageStepContainer>
            <Image src={DeliveryImage} alt="Personal Details" />
          </ImageStepContainer>
        </StepContainer>

        <StepContainer>
          <StepConent>
            <StepTitle>Complete delivery mission</StepTitle>
            <Description>
              With Tawsila, you only get delivery missions when you're free and
              online
            </Description>
            <Step>
              <StepNumber>1</StepNumber>
              <StepDescription>
                Login to your account and Go online
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>2</StepNumber>
              <StepDescription>
                Receive delivery missions from different types
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>3</StepNumber>
              <StepDescription>
                Get paid after completing your missions
              </StepDescription>
            </Step>
          </StepConent>
          <ImageStepContainer>
            <Image src={OnboardingImage} alt="Onboarding Process" />
          </ImageStepContainer>
        </StepContainer>
      </Container>
    </Section>
  );
};

export default GetStarted;
