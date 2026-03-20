import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { FaMotorcycle, FaCar, FaTruck, FaCheck, FaArrowRight, FaArrowLeft } from "react-icons/fa";

// --- Custom Components & Services ---
import TawsilaLayout from "./components/TawsilaLayout";
import AddressesDropDown from "../../components/AddressesDropDown";
import { isValidEmail, isValidPhone } from "../../components/validators";
import { 
  checkPhoneNumberAvailability, 
  postSubscribeRequest 
} from "../SubscribeRequest/services/SubscribeRequest";

// --- Styled Components ---
import {
  WizardContainer, StepWrapper, StepTitle, StepSubtitle, InputGroup, Label, 
  PremiumInput, ProgressContainer, ProgressFill, NavContainer, NavButton, ErrorText
} from "./components/TawsilaWizardComponents";
import styled from "styled-components";

// --- Additional local styled components ---
const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
`;

const VehicleCard = styled.div`
  background: ${props => props.$selected ? "rgba(57, 127, 249, 0.15)" : "rgba(255, 255, 255, 0.03)"};
  border: 2px solid ${props => props.$selected ? "#397FF9" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$selected ? "#397FF9" : "rgba(255, 255, 255, 0.3)"};
    transform: translateY(-2px);
  }

  svg {
    font-size: 2rem;
    color: ${props => props.$selected ? "#397FF9" : "#A1A1AA"};
  }

  span {
    color: ${props => props.$selected ? "white" : "#A1A1AA"};
    font-weight: 600;
    font-size: 0.95rem;
  }
`;

const SuccessCircle = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #39A170;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  margin: 0 auto 2rem auto;
  box-shadow: 0 10px 30px rgba(57, 161, 112, 0.4);
`;

const TOTAL_STEPS = 4;

const DriverOnboarding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    wilaya: "",
    commune: "",
    vehicleType: ""
  });

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error on typing
  };

  const handleNext = async () => {
    setError("");

    // Step 1 Validation
    if (step === 1) {
      if (!formData.firstName || !formData.lastName) {
        return setError(t("errorFillAllFields", "Please fill all fields."));
      }
      if (formData.email && !isValidEmail(formData.email)) {
        return setError(t("errorEmailNotValid", "Invalid email address."));
      }
    }

    // Step 2 Validation (Phone)
    if (step === 2) {
      if (!formData.phone) return setError(t("errorFillAllFields"));
      if (!isValidPhone(formData.phone)) return setError(t("errorPhoneNotValid", "Invalid phone number."));
      
      // Real-time API check
      setIsSubmitting(true);
      try {
        const isUsed = await checkPhoneNumberAvailability(formData.phone);
        if (isUsed) {
          setIsSubmitting(false);
          return setError(t("messagePhoneIsUsed", "Phone number already in use."));
        }
      } catch (err) {
        setIsSubmitting(false);
        return setError(t("errorCouldNotSubscribe", "Server error. Please try again."));
      }
      setIsSubmitting(false);
    }

    // Step 3 Validation (Location)
    if (step === 3) {
      if (!formData.wilaya || !formData.commune) {
        return setError(t("errorFillAllFields"));
      }
    }

    // Step 4 (Vehicle & Submission)
    if (step === 4) {
      if (!formData.vehicleType) return setError(t("errorFillAllFields"));
      submitApplication();
      return;
    }

    setDirection(1);
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setError("");
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    const payload = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      email: formData.email,
      wilaya: formData.wilaya,
      commune: formData.commune,
      type: "driver", // Critical for backend segmentation
      businessName: formData.vehicleType // Sending vehicle type here temporarily
    };

    try {
      const res = await postSubscribeRequest(payload);
      if (res) setIsSuccess(true);
      else setError(t("errorCouldNotSubscribe"));
    } catch (err) {
      setError(t("errorCouldNotSubscribe"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer Motion Variants
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  const renderStep = () => {
    if (isSuccess) return (
      <div style={{ textAlign: 'center' }}>
        <SuccessCircle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <FaCheck />
        </SuccessCircle>
        <StepTitle>{t("congratulations", "Congratulations!")}</StepTitle>
        <StepSubtitle>
          Your application has been received. Our team will review your details and contact you shortly to activate your Captain account.
        </StepSubtitle>
        <NavButton $primary style={{ margin: '0 auto' }} onClick={() => window.location.href = "/"}>
          {t("payment_back_to_home_button", "Back to Home")}
        </NavButton>
      </div>
    );

    switch (step) {
      case 1:
        return (
          <>
            <StepTitle>{t("tawsila_wizard_title", "Become a Captain")}</StepTitle>
            <StepSubtitle>{t("tawsila_wizard_subtitle", "Join the fleet. Enter your details below to get started.")}</StepSubtitle>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: isArabic ? 'row-reverse' : 'row' }}>
              <InputGroup>
                <Label>First Name</Label>
                <PremiumInput type="text" placeholder="John" value={formData.firstName} onChange={(e) => updateData("firstName", e.target.value)} autoFocus />
              </InputGroup>
              <InputGroup>
                <Label>Last Name</Label>
                <PremiumInput type="text" placeholder="Doe" value={formData.lastName} onChange={(e) => updateData("lastName", e.target.value)} />
              </InputGroup>
            </div>
            <InputGroup>
              <Label>{t("partnersFormEmail", "Email")} ({t("optional", "Optional")})</Label>
              <PremiumInput type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => updateData("email", e.target.value)} />
            </InputGroup>
          </>
        );
      case 2:
        return (
          <>
            <StepTitle>Your Phone Number</StepTitle>
            <StepSubtitle>We need this to contact you and verify your account.</StepSubtitle>
            <InputGroup>
              <Label>{t("form_phone_number", "Phone Number")}</Label>
              <PremiumInput type="tel" placeholder="0550 XX XX XX" value={formData.phone} onChange={(e) => updateData("phone", e.target.value)} autoFocus dir="ltr" />
            </InputGroup>
          </>
        );
      case 3:
        return (
          <>
            <StepTitle>Where do you drive?</StepTitle>
            <StepSubtitle>Select your primary city of operation.</StepSubtitle>
            {/* Custom wrapper to override the transparent/white styles of AddressesDropDown to fit Tawsila Dark Theme */}
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <AddressesDropDown 
                target="tawsila" 
                onChooseAddress={(addr) => { updateData("wilaya", addr.wilaya); updateData("commune", addr.commune); }} 
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <StepTitle>Your Vehicle</StepTitle>
            <StepSubtitle>What type of vehicle will you be driving?</StepSubtitle>
            <VehicleGrid>
              <VehicleCard $selected={formData.vehicleType === "moto"} onClick={() => updateData("vehicleType", "moto")}>
                <FaMotorcycle /><span>Moto</span>
              </VehicleCard>
              <VehicleCard $selected={formData.vehicleType === "car"} onClick={() => updateData("vehicleType", "car")}>
                <FaCar /><span>Car</span>
              </VehicleCard>
              <VehicleCard $selected={formData.vehicleType === "van"} onClick={() => updateData("vehicleType", "van")}>
                <FaTruck /><span>Van / Truck</span>
              </VehicleCard>
            </VehicleGrid>
          </>
        );
      default: return null;
    }
  };

  const progressPercentage = (step / TOTAL_STEPS) * 100;

  return (
    <TawsilaLayout>
      <Helmet>
        <title>{t("tawsila_btn_drive", "Apply to Drive")} | Abridh</title>
      </Helmet>

      <WizardContainer dir={isArabic ? 'rtl' : 'ltr'}>
        {!isSuccess && (
          <ProgressContainer>
            <ProgressFill initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.4 }} />
          </ProgressContainer>
        )}

        <StepWrapper>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={isSuccess ? "success" : step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {!isSuccess && (
            <>
              <AnimatePresence>
                {error && <ErrorText initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{error}</ErrorText>}
              </AnimatePresence>

              <NavContainer>
                <NavButton onClick={handleBack} disabled={step === 1 || isSubmitting} style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}>
                   {isArabic ? <FaArrowRight/> : <FaArrowLeft/>} {t("wiz_btn_back", "Back")}
                </NavButton>

                <NavButton $primary onClick={handleNext} disabled={isSubmitting}>
                  {isSubmitting ? "..." : (step === TOTAL_STEPS ? t("buttonSubmit", "Submit") : t("wiz_btn_next", "Next"))}
                  {!isSubmitting && step !== TOTAL_STEPS && (isArabic ? <FaArrowLeft/> : <FaArrowRight/>)}
                </NavButton>
              </NavContainer>
            </>
          )}
        </StepWrapper>
      </WizardContainer>
    </TawsilaLayout>
  );
};

export default DriverOnboarding;