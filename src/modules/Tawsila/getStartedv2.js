import React, { useEffect, useState } from "react";
import BackgroundImage from "../../assets/background.png";
import TawsilaIllustration from "../../assets/tawsilaIllustration.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { light } from "../../config/Themes";
import {
  ActionButton,
  BlueActionButton,
  BlueSecondaryButton,
  BlueTextButton,
  TextButton,
} from "../../components/ActionButton";
import { useTranslation } from "react-i18next";
import AddressesDropDown from "../../components/AddressesDropDown";
import Accepted from "../../assets/acceptTawsila.svg";
import Approved from "../../assets/approvedTawsila.svg";
import Deliver from "../../assets/deliver.svg";
import {
  checkPhoneNumberAvailability,
  getSubscribeRequest,
  postSubscribeRequest,
} from "../SubscribeRequest/services/SubscribeRequest";
import { isValidEmail, isValidPhone } from "../../components/validators";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  gap: 2rem;
  background-position: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const Container = styled.div`
  width: 80%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
  }
`;
const Step = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
  }
`;
const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;
const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;
const StepTitle = styled.h1`
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 900;
  color: ${(props) => props.theme.secondaryColor};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const StepSubTitle = styled.h1`
  width: 100%;
  font-size: 4rem;
  color: ${(props) => props.theme.text};
  font-weight: 900;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;
const StepContent = styled.p`
  margin-top: 2rem;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxl};
  @media (max-width: 768px) {
    width: 100%;
    text-align: ${(props) => (props.isArabic ? "right" : "left")};
    font-size: ${(props) => props.theme.fontlg};
  }
`;
const SmallStepContent = styled.p`
  margin-top: 1rem;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontlg};
  @media (max-width: 768px) {
    width: 100%;
    text-align: ${(props) => (props.isArabic ? "right" : "left")};
    font-size: ${(props) => props.theme.fontlg};
  }
  span {
    &:hover {
      color: ${(props) => props.theme.secondaryColor};
    }
  }
`;

const IllustrationContainer = styled.img`
  width: 100%;
  height: 60vh;
  object-fit: cover;
  @media (max-width: 768px) {
    width: ${(props) => (props.hide ? "0" : "100%")};
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const NavigationButtons = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const FormContainer = styled.form`
  align-self: center;
  width: 80%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    align-self: flex-start;
    width: 100%;
  }
`;
const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const PhoneInputWrapper = styled(InputWrapper)`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid ${(props) => props.theme.secondaryColor};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid;
  background-color: transparent;
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

const PhoneInput = styled(Input)`
  flex: 1;
  border: none;
  font-size: ${(props) => props.theme.fontxl};
  background-color: transparent;
  &:focus {
    outline: none;
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

const GetStartedv2 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedForm, setSelectedForm] = useState(1);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
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

  const handleChooseAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    console.log("Verifying phone number...");
    const isPhoneUsed = await checkPhoneNumberAvailability(phone);
    if (isPhoneUsed === true) {
      console.log("Phone number is used. Checking subscription request...");
      const subscribeRequest = await getSubscribeRequest(phone);
      console.log(subscribeRequest);
      if (subscribeRequest.isAccepted === true) {
        setSuccessMessage(t("clickToDownloadApp"));
        setIsAccepted(true);
      } else {
        setSuccessMessage(t("messagePhoneIsUsed"));
      }
      setErrorMessage("");

      setIsSubmitting(false);
      return;
    } else {
      console.log("Phone number is not used.");
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    console.log(currentStep);
  }, [currentStep]);

  return (
    <Section>
      <Container>
        <StepTitle>Get Started With Tawsila</StepTitle>
        {currentStep === 1 && (
          <Step>
            <LeftBox>
              <StepSubTitle>An innovative mobile app for delivery</StepSubTitle>
              <StepContent>
                Welcome to our platform! We're excited to have you join our
                community of drivers. To get started, please follow the steps
              </StepContent>
              <SmallStepContent>
                Please take a moment to review our{" "}
                <span>
                  <Link className="footerLink" to="/terms_and_conditions">
                    terms and conditions
                  </Link>
                </span>
                . By submitting your subscription request, you agree to abide by
                these terms and conditions.
              </SmallStepContent>
            </LeftBox>
            <RightBox>
              {" "}
              <IllustrationContainer src={TawsilaIllustration} alt="Partners" />
            </RightBox>
          </Step>
        )}
        {currentStep === 2 && (
          <Step>
            <LeftBox>
              <StepSubTitle>Subscription Request</StepSubTitle>
              <StepContent>
                <ul>
                  <li>
                    Fill out the subscription request form below with your
                    contact information and relevant details.
                  </li>
                  <li>
                    Review the terms and conditions carefully before submitting
                    your request.
                  </li>
                  <li>
                    Click the "Submit" button to send your subscription request
                    to our team for review.
                  </li>
                </ul>

                <ul>
                  <li>Enter your phone number to check your sub request</li>
                  <li>Click the link to download the app</li>
                </ul>
              </StepContent>
              <SmallStepContent>
                Please take a moment to review our{" "}
                <span>
                  <Link className="footerLink" to="/terms_and_conditions">
                    terms and conditions
                  </Link>
                </span>
                . By submitting your subscription request, you agree to abide by
                these terms and conditions.
              </SmallStepContent>
            </LeftBox>
            <RightBox>
              <ButtonContainer>
                <BlueTextButton
                  onClick={() => setSelectedForm(1)}
                  isSelected={selectedForm === 1}
                >
                  Subscribe{" "}
                </BlueTextButton>
                <BlueTextButton
                  onClick={() => setSelectedForm(2)}
                  isSelected={selectedForm === 2}
                >
                  Verify
                </BlueTextButton>
              </ButtonContainer>
              {selectedForm === 1 && (
                <FormContainer onSubmit={handleSubscribe}>
                  <InputWrapper>
                    <Input
                      type="text"
                      placeholder={t("partnerInputTextFullName")}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Input
                      type="email"
                      placeholder={t("partnerInputText")}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Input
                      type="phone"
                      placeholder={t("partnerInputTextPhone")}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </InputWrapper>
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
                  <ButtonContainer>
                    {" "}
                    <Button
                      onClick={handleSubscribe}
                      className={isSubmitting ? "submitting" : ""}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t("buttonIsSubmitting")
                        : t("partnerInputButton")}
                    </Button>
                  </ButtonContainer>
                </FormContainer>
              )}
              {selectedForm === 2 && (
                <FormContainer onSubmit={handleVerify}>
                  <PhoneInputWrapper>
                    <PhoneInput
                      type="phone"
                      placeholder={t("partnerInputTextPhone")}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                    <BlueActionButton
                      onClick={(event) => handleVerify(event)}
                      className={isSubmitting ? "submitting" : ""}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t("buttonIsSubmitting") : "Submit"}
                    </BlueActionButton>
                  </PhoneInputWrapper>
                </FormContainer>
              )}
            </RightBox>
          </Step>
        )}
        {currentStep === 3 && (
          <Step>
            <LeftBox>
              <StepSubTitle>Acceptance</StepSubTitle>
              <StepContent>
                <ul>
                  <li>
                    After submitting your subscribe request, our team will
                    diligently review the information you provided.
                  </li>
                  <li>
                    Once your request is accepted, we will notify you of your
                    acceptance. Congratulations! You're now officially a part of
                    our driver community.
                  </li>
                  <li>
                    To get started, simply provide your phone number and find
                    the download link for the app. Click on it to visite the
                    download page. Our user-friendly app is designed to provide
                    you with a seamless experience and access to the tools you
                    need.
                  </li>
                </ul>
              </StepContent>
            </LeftBox>
            <RightBox>
              {" "}
              <IllustrationContainer src={Accepted} alt="Partners" />
            </RightBox>
          </Step>
        )}
        {currentStep === 4 && (
          <Step>
            <LeftBox>
              <StepSubTitle>Account Creation and Approval</StepSubTitle>
              <StepContent>
                <ul>
                  <li>
                    Open your account on our platform by providing the required
                    information.
                  </li>
                  <li>
                    Fill in your personal details and vehicle information
                    accurately.
                  </li>
                  <li>
                    Submit the necessary documents for verification and
                    validation.
                  </li>
                  <li>
                    Our team will carefully review the information provided and
                    verify your submitted documents. Once your data and
                    documents have been successfully validated, you will receive
                    approval.
                  </li>
                </ul>
              </StepContent>
            </LeftBox>
            <RightBox>
              {" "}
              <IllustrationContainer src={Approved} alt="Partners" />
            </RightBox>
          </Step>
        )}
        {currentStep === 5 && (
          <Step>
            <LeftBox>
              <StepSubTitle>Earn For Your Delivery Missions</StepSubTitle>
              <StepContent>
                <ul>
                  <li>
                    Congratulations! You are now eligible to go online as an
                    active driver.
                  </li>
                  <li>
                    Log in to our driver app and set your availability status to
                    "online."
                  </li>
                  <li>
                    You'll start receiving mission requests from our system,
                    matching you with suitable tasks.
                  </li>
                  <li>
                    Accept missions and provide excellent service to our
                    customers.
                  </li>
                </ul>
              </StepContent>
            </LeftBox>
            <RightBox>
              {" "}
              <IllustrationContainer src={Deliver} alt="Partners" />
            </RightBox>
          </Step>
        )}

        <NavigationButtons>
          <BlueSecondaryButton
            disabled={currentStep === 1}
            onClick={handlePrevious}
          >
            Previous
          </BlueSecondaryButton>

          <BlueActionButton disabled={currentStep === 5} onClick={handleNext}>
            Next
          </BlueActionButton>
        </NavigationButtons>
      </Container>
    </Section>
  );
};

export default GetStartedv2;
