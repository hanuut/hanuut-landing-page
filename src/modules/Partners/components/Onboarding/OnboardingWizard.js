import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // <--- IMPORT THIS

import { 
  WizardWrapper, 
  StepContainer, 
  ProgressContainer, 
  ProgressFill,
  NavContainer,
  NavButton
} from "./WizardComponents";

// Ensure these files exist and have 'export default'
import Step1Contact from "./steps/Step1Contact";
import Step2Shop from "./steps/Step2Shop";
import Step3Location from "./steps/Step3Location";
import Step4Menu from "./steps/Step4Menu";
import SuccessView from "./steps/SuccessView";

import { sendJoinRequest } from "../../services/feedbackService";

const TOTAL_STEPS = 4;

const OnboardingWizard = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    shopName: "",
    customActivity: "",
    domain: "",
    description: "",
    wilaya: "",
    commune: "",
    district: "",
    categories: [{ name: "", products: [""] }] 
  });

  const handleNext = () => {
    // --- VALIDATION LOGIC ---
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        alert(t("errorFillAllFields")); 
        return;
      }
    }
    
    // Step 2 Validation (Shop Info)
    if (step === 2) {
      if (!formData.shopName || !formData.domain) {
        alert(t("errorFillAllFields"));
        return;
      }
    }

    // Step 3 Validation (Location)
    if (step === 3) {
      if (!formData.wilaya || !formData.commune || !formData.district) {
        alert(t("errorFillAllFields"));
        return;
      }
    }

    if (step < TOTAL_STEPS) {
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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await sendJoinRequest(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Onboarding Error:", error);
      alert(t("errorCouldNotSubscribe") || "Error.");
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
    if (isSuccess) return <SuccessView />;

    switch (step) {
      case 1:
        return <Step1Contact data={formData} update={updateData} />;
      case 2:
        return <Step2Shop data={formData} update={updateData} />;
      case 3:
        return <Step3Location data={formData} update={updateData} />;
      case 4:
        return <Step4Menu data={formData} update={updateData} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  const progressPercentage = (step / TOTAL_STEPS) * 100;

  return (
    <WizardWrapper dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* --- ADDED HELMET HERE --- */}
      <Helmet>
        <title>{t("onboarding_page_title")}</title>
        <meta name="description" content={t("cta_wizard_sub")} />
      </Helmet>

      {!isSuccess && (
        <ProgressContainer>
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