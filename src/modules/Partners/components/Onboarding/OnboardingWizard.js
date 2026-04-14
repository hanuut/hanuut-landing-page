import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import styled from 'styled-components';
import { 
  WizardWrapper, 
  StepContainer, 
  ProgressContainer, 
  ProgressFill,
  NavContainer,
  NavButton
} from "./WizardComponents";

import Step1Contact from "./steps/Step1Contact";
import Step2Shop from "./steps/Step2Shop";
import Step3Location from "./steps/Step3Location";
import SuccessView from "./steps/SuccessView";
import { FaExclamationCircle } from "react-icons/fa";

// --- NEW IMPORTS FOR AUTOMATED FLOW ---
import { trackFunnelStep, trackEvent } from "../../../../utils/analytics";
import { 
  authenticateShopOwner, 
  uploadShopLogo, 
  createAddress, 
  createShop 
} from "../../services/onboardingServices";

const ErrorBanner = styled(motion.div)`
  background-color: #FEE2E2;
  color: #B91C1C;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #F87171;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
`;

const TOTAL_STEPS = 3; // Reduced to 3 steps: Identity -> Shop -> Location

const OnboardingWizard = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // --- UPDATED STATE SCHEMA ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",       
    shopName: "",
    domainId: "",  
    hasConsented: false,     
    domainKeyword: "",  
    description: "",
    logo: null,        
    wilaya: "",
    commune: "",
    district: "",
    lat: null,
    lng: null
  });

  const handleNext = () => {
    setErrorMsg(""); // Clear errors on next

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password) {
        return setErrorMsg(t("errorFillAllFields")); 
      }
      if (formData.password.length < 6) {
        return setErrorMsg(t("errorPasswordTooShort", "Password must be at least 6 characters."));
      }
      if (!formData.hasConsented) {
        return setErrorMsg(t("error_consent", "You must agree to the terms to continue."));
      }
    }
    
    if (step === 2) {
      if (!formData.shopName || !formData.domainId) {
        return setErrorMsg(t("errorFillAllFields"));
      }
    }

    if (step === 3) {
      if (!formData.wilaya || !formData.commune || !formData.district) {
        return setErrorMsg(t("errorFillAllFields"));
      }
    }

    if (step < TOTAL_STEPS) {
      trackFunnelStep("Merchant_Onboarding", "Step_Completed", step);
      setDirection(1);
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setErrorMsg(""); // Clear errors on back
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const authResponse = await authenticateShopOwner(formData);
      const token = authResponse.accessToken;
      const ownerId = authResponse.user.id || authResponse.user._id;

      let imageId = null;
      if (formData.logo) {
        imageId = await uploadShopLogo(formData.logo, token);
      }

      const addressId = await createAddress(formData, token);

      const shopPayload = {
        name: formData.shopName,
        description: formData.description,
        domainId: formData.domainId,
        domainKeyword: formData.domainKeyword,
        ownerId: ownerId,
        addressId: addressId,
        imageId: imageId,
      };
      
      await createShop(shopPayload, token);
      setIsSuccess(true);
    } catch (error) {
      console.error("Onboarding Error:", error);
      // IN-UI ERROR DISPLAY instead of alert()
      setErrorMsg(error.message || t("errorCouldNotSubscribe"));
    } finally {
      setIsSubmitting(false);
    }
  };


  const updateData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  const renderStep = () => {
    if (isSuccess) return <SuccessView data={formData} />;

    switch (step) {
      case 1: return <Step1Contact data={formData} update={updateData} />;
      case 2: return <Step2Shop data={formData} update={updateData} />;
      case 3: return <Step3Location data={formData} update={updateData} />;
      default: return <div>Unknown Step</div>;
    }
  };

  const progressPercentage = (step / TOTAL_STEPS) * 100;

  return (
    <WizardWrapper dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t("onboarding_page_title")}</title>
        <meta name="description" content={t("cta_wizard_sub")} />
      </Helmet>

      {!isSuccess && (
        <ProgressContainer style={{ marginTop: "6rem" }}> {/* Added space for Navbar */}
          <ProgressFill 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressContainer>
      )}

      <StepContainer>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={isSuccess ? "success" : step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {!isSuccess && (
          <NavContainer>
            {/* INJECT ERROR BANNER JUST ABOVE BUTTONS */}
            <AnimatePresence>
              {errorMsg && (
                <ErrorBanner
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <FaExclamationCircle /> {errorMsg}
                </ErrorBanner>
              )}
            </AnimatePresence>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <NavButton 
                onClick={handleBack} 
                disabled={step === 1 || isSubmitting}
                style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto', flex: 1 }}
              >
                {t("wiz_btn_back")}
              </NavButton>

              <NavButton 
                $primary 
                onClick={handleNext}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? "..." : (step === TOTAL_STEPS ? t("wiz_btn_finish") : t("wiz_btn_next"))}
              </NavButton>
            </div>
          </NavContainer>
        )}
      </StepContainer>
    </WizardWrapper>
  );
};

export default OnboardingWizard;