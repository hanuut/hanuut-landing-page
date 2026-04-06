import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

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

// --- NEW IMPORTS FOR AUTOMATED FLOW ---
import { trackFunnelStep, trackEvent } from "../../../../utils/analytics";
import { 
  authenticateShopOwner, 
  uploadShopLogo, 
  createAddress, 
  createShop 
} from "../../services/onboardingServices";

const TOTAL_STEPS = 3; // Reduced to 3 steps: Identity -> Shop -> Location

const OnboardingWizard = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- UPDATED STATE SCHEMA ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",       
    shopName: "",
    domainId: "",       
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
    // --- VALIDATION LOGIC ---
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password) {
        alert(t("errorFillAllFields")); 
        return;
      }
      if (formData.password.length < 6) {
        alert(t("errorPasswordTooShort", "Password must be at least 6 characters."));
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.shopName || !formData.domainId) {
        alert(t("errorFillAllFields"));
        return;
      }
    }

    if (step === 3) {
      if (!formData.wilaya || !formData.commune || !formData.district) {
        alert(t("errorFillAllFields"));
        return;
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
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const updateData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // --- NEW AUTOMATED SUBMISSION LOGIC ---
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Authenticate / Login Fallback
      const authResponse = await authenticateShopOwner(formData);
      const token = authResponse.accessToken;
      const ownerId = authResponse.user.id || authResponse.user._id;

      // 2. Upload Logo
      let imageId = null;
      if (formData.logo) {
        imageId = await uploadShopLogo(formData.logo, token);
      }

      // 3. Create Address
      const addressId = await createAddress(formData, token);

      // 4. Create Shop
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
      alert(error.message || t("errorCouldNotSubscribe"));
    } finally {
      setIsSubmitting(false);
    }
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
            <NavButton 
              onClick={handleBack} 
              disabled={step === 1 || isSubmitting}
              style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
            >
              {t("wiz_btn_back")}
            </NavButton>

            <NavButton 
              $primary 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? "..." : (step === TOTAL_STEPS ? t("wiz_btn_finish") : t("wiz_btn_next"))}
            </NavButton>
          </NavContainer>
        )}
      </StepContainer>
    </WizardWrapper>
  );
};

export default OnboardingWizard;