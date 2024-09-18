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
import TawsilaLogo from "../../assets/tawsilaLogo.png";
import Playstore from "../../assets/playstore.png";

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
    min-height: 100vh;
  }
`;

const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  width: 80%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 768px) {
    min-height: 100vh;
    width: 90%;
    padding: 1rem 0;
  }
`;
const Step = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
  }
`;
const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const LeftBox = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
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
    margin-top: 1rem;
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
    margin: 1rem 0;
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

const TawsilaIcon = styled.img`
  height: 8rem;
  width: 8rem;
  margin-bottom: 3rem;
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
    font-size: ${(props) => props.theme.fontsm};
    width: 98%;
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
    font-size: ${(props) => props.theme.fontsm};
    max-width: 95%;
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
    font-size: ${(props) => props.theme.fontmd};
    width: 96%;
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
  max-width: 100%;
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.secondaryColor};
  font-weight: 900;
  text-transform: uppercase;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const SubHeading = styled.h1`
  max-width: 100%;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  text-shadow: -1px -1px 0 ${(props) => props.theme.body},
    1px -1px 0 ${(props) => props.theme.body},
    -1px 1px 0 ${(props) => props.theme.body},
    1px 1px 0 ${(props) => props.theme.body};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const Icon = styled.img`
  height: 2rem;
  width: 2rem;
`;

const GetStarted = () => {
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
  const tawsilaDownloadLink = process.env.REACT_APP_TAWSILA_DOWNLOAD_LINK;

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

      setIsSubmitting(false);
      return;
    } else {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPlay = (e) => {
    e.preventDefault();
    window.open(tawsilaDownloadLink);
    setCurrentStep(3);
  };
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <StepTitle>{t("getStartedWithTawsila")}</StepTitle>
        {currentStep === 1 && (
          <Step>
            <LeftBox>
              <StepSubTitle>{t("innovative")}</StepSubTitle>
              <StepContent>{t("welcomeToTawsila")}</StepContent>
            </LeftBox>
            <RightBox>
              <IllustrationContainer src={TawsilaIllustration} alt="Partners" />
            </RightBox>
          </Step>
        )}
        {currentStep === 2 && (
          <Step>
            <LeftBox>
              <StepSubTitle> {t("subscribeYourTawsila")}</StepSubTitle>
              <StepContent>
                <ul>
                  <li>{t("fillTheSubscription")}</li>
                  <li>{t("reviewConditions")}</li>
                  <li>{t("clickToSubmit")}</li>
                </ul>

                <ul>
                  <li>{t("enterPhoneToSubOrCheck")}</li>
                  <li>{t("clickToDownload")}</li>
                </ul>
              </StepContent>
              <SmallStepContent>
                {t("pleaseTakeAMoment")}
                <span>
                  <Link className="footerLink" to="/terms_and_conditions">
                    {" "}
                    {t("footerTermsOfUse")}
                  </Link>
                </span>
                {t("submitToRules")}
              </SmallStepContent>
            </LeftBox>
            <RightBox>
              <ButtonContainer>
                <BlueTextButton
                  onClick={() => setSelectedForm(1)}
                  isSelected={selectedForm === 1}
                >
                  {t("subscribe")}
                </BlueTextButton>
                <BlueTextButton
                  onClick={() => setSelectedForm(2)}
                  isSelected={selectedForm === 2}
                >
                  {t("verify")}
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
              {selectedForm === 2 &&
                (isAccepted ? (
                  <FormContainer onSubmit={handleVerify}>
                    <TawsilaIcon src={TawsilaLogo} />
                    <Heading className="greenSubHeading">
                      {t("congratulations")}
                    </Heading>
                    <SubHeading>{t("clickToDownloadApp")}</SubHeading>

                    <ButtonWithIcon
                      image={Playstore}
                      backgroundColor="#000000"
                      text1={t("getItOn")}
                      text2={t("googlePlay")}
                      className="homeDownloadButton"
                      onClick={(e) => handleDownloadPlay(e)}
                    ></ButtonWithIcon>
                  </FormContainer>
                ) : (
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
                        {isSubmitting
                          ? t("buttonIsSubmitting")
                          : t("buttonSubmit")}
                      </BlueActionButton>
                    </PhoneInputWrapper>
                  </FormContainer>
                ))}
            </RightBox>
          </Step>
        )}
        {currentStep === 3 && (
          <Step>
            <LeftBox>
              <StepSubTitle>{t("acceptance")}</StepSubTitle>
              <StepContent>
                <ul>
                  <li>{t("acceptanceAfterSubmittingRequest")}</li>
                  <li>{t("onceRequestAccepted")}</li>
                  <li>{t("toGetStartedWithTawsila")}</li>
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
              <StepSubTitle> {t("approval")}</StepSubTitle>
              <StepContent>
                <ul>
                  <li>{t("openYourAccount")}</li>
                  <li>{t("fillInformation")}</li>
                  <li>{t("submitDocs")}</li>
                  <li>{t("ourTeamWillReviewAndVerify")}</li>
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
              <StepSubTitle>{t("earnForMission")}</StepSubTitle>
              <StepContent>
                <ul>
                  <li>{t("congratulationsAccepted")}</li>
                  <li>{t("loginAndOnline")}</li>
                  <li>{t("startReceivingMission")}</li>
                  <li>{t("AcceptMissionToWork")}</li>
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
            {t("previous")}
          </BlueSecondaryButton>

          <BlueActionButton disabled={currentStep === 5} onClick={handleNext}>
            {t("partnersFormNextButton")}
          </BlueActionButton>
        </NavigationButtons>
      </Container>
    </Section>
  );
};

export default GetStarted;
