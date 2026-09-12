// modules/Tawsila/DriverOnboarding.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  FaCar,
  FaShuttleVan,
  FaCarSide,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaMapMarkerAlt
} from "react-icons/fa";

import Loader from "../../components/Loader";

import TawsilaLayout from "./components/TawsilaLayout";
import AddressesDropDown from "../../components/AddressesDropDown";
import { isValidEmail, isValidPhone } from "../../components/validators";
import {
  checkPhoneNumberAvailability,
  postSubscribeRequest
} from "../SubscribeRequest/services/SubscribeRequest";
import Seo from "../../components/Seo";

import {
  WizardContainer,
  StepWrapper,
  StepTitle,
  StepSubtitle,
  InputGroup,
  Label,
  PremiumInput,
  ProgressContainer,
  ProgressFill,
  NavContainer,
  NavButton,
  ErrorText
} from "./components/TawsilaWizardComponents";

const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const VehicleCard = styled.div`
  background: ${(props) =>
    props.$selected ? "#ecfdf5" : "#ffffff"};
  border: 2px solid
    ${(props) => (props.$selected ? "#00875f" : "#e2e8f0")};
  border-radius: 18px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: ${(props) =>
    props.$selected ? "0 4px 15px rgba(0, 135, 95, 0.15)" : "none"};

  &:hover {
    border-color: ${(props) => (props.$selected ? "#00875f" : "#94a3b8")};
    transform: translateY(-2px);
  }

  svg {
    font-size: 2.25rem;
    color: ${(props) => (props.$selected ? "#00875f" : "#64748b")};
  }

  span.title {
    color: ${(props) => (props.$selected ? "#064e3b" : "#1e293b")};
    font-weight: 800;
    font-size: 0.95rem;
  }

  span.sub {
    color: #64748b;
    font-size: 0.75rem;
    line-height: 1.3;
  }
`;

const SuccessCircle = styled(motion.div)`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #00875f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.75rem;
  margin: 0 auto 1.5rem auto;
  box-shadow: 0 10px 30px rgba(0, 135, 95, 0.3);
`;

const TOTAL_STEPS = 4;

const DriverOnboarding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

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
    vehicleType: "Berline / Citadine"
  });

  const updateData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleNext = async () => {
    setError("");

    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        return setError(
          isArabic
            ? "يرجى إدخال الاسم واللقب."
            : "Veuillez renseigner votre nom et prénom."
        );
      }
      if (formData.email && !isValidEmail(formData.email)) {
        return setError(
          isArabic
            ? "يرجى إدخال بريد إلكتروني صحيح."
            : "Veuillez renseigner un email valide."
        );
      }
    }

    if (step === 2) {
      if (!formData.phone.trim()) {
        return setError(
          isArabic ? "يرجى إدخال رقم الهاتف." : "Veuillez renseigner votre numéro."
        );
      }
      if (!isValidPhone(formData.phone)) {
        return setError(
          isArabic
            ? "يرجى إدخال رقم هاتف جزائري صحيح (05/06/07)."
            : "Numéro algérien invalide (05/06/07)."
        );
      }

      setIsSubmitting(true);
      try {
        const isUsed = await checkPhoneNumberAvailability(formData.phone);
        if (isUsed) {
          setIsSubmitting(false);
          return setError(
            isArabic
              ? "هذا الرقم مسجل بالفعل في قائمة الانتظار لدينا. سيتواصل معك الفريق قريباً."
              : "Ce numéro est déjà enregistré. Notre équipe vous contactera sous peu."
          );
        }
      } catch (err) {
        setIsSubmitting(false);
        return setError(
          isArabic
            ? "تعذر التحقق من الرقم حالياً. يرجى المحاولة لاحقاً."
            : "Impossible de vérifier le numéro."
        );
      }
      setIsSubmitting(false);
    }

    if (step === 3) {
      if (!formData.wilaya) {
        return setError(
          isArabic
            ? "يرجى تحديد الولاية والبلدية."
            : "Veuillez sélectionner votre wilaya et commune."
        );
      }
    }

    if (step === 4) {
      if (!formData.vehicleType) {
        return setError(
          isArabic
            ? "يرجى اختيار صنف المركبة."
            : "Veuillez sélectionner un type de véhicule."
        );
      }
      submitApplication();
      return;
    }

    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setError("");
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    const payload = {
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      wilaya: formData.wilaya,
      commune: formData.commune,
      type: "driver", // Matches backend CRM schema
      businessName: formData.vehicleType
    };

    try {
      const res = await postSubscribeRequest(payload);
      if (res) {
        setIsSuccess(true);
      } else {
        setError(
          isArabic
            ? "تعذر إرسال الطلب، يرجى المحاولة لاحقاً."
            : "Impossible d'envoyer la demande."
        );
      }
    } catch (err) {
      setError(
        isArabic
          ? "تعذر إرسال الطلب، يرجى المحاولة لاحقاً."
          : "Erreur lors de l'envoi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const renderStep = () => {
    if (isSuccess) {
      return (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <SuccessCircle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <FaCheck />
          </SuccessCircle>
          <StepTitle>
            {isArabic ? "تم استلام طلبك بنجاح!" : "Candidature Bien Reçue !"}
          </StepTitle>
          <StepSubtitle>
            {isArabic
              ? "شكراً لتسجيلك. سيقوم منسق العمليات الميدانية في بجاية بمراجعة ملفك والاتصال بك لتحديد موعد الفحص وتفعيل حسابك."
              : "Merci pour votre inscription. Notre coordinateur des opérations à Béjaïa vous contactera pour valider vos documents et activer votre profil."}
          </StepSubtitle>
          <NavButton
            $primary
            style={{ margin: "2rem auto 0 auto", maxWidth: "260px" }}
            onClick={() => (window.location.href = "/abridh")}
          >
            {isArabic ? "العودة للرئيسية" : "Retour à l'accueil"}
          </NavButton>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <>
            <StepTitle>
              {isArabic ? "الانضمام ككابتن" : "Devenir Capitaine Abrid"}
            </StepTitle>
            <StepSubtitle>
              {isArabic
                ? "سجّل معلوماتك للمشاركة في المرحلة التجريبية الأولى بمدينة بجاية."
                : "Renseignez vos coordonnées pour rejoindre la phase pilote à Béjaïa."}
            </StepSubtitle>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <InputGroup $isArabic={isArabic}>
                <Label>{isArabic ? "الاسم" : "Prénom"}</Label>
                <PremiumInput
                  type="text"
                  placeholder={isArabic ? "مثال: أمين" : "ex: Amine"}
                  value={formData.firstName}
                  onChange={(e) => updateData("firstName", e.target.value)}
                  autoFocus
                />
              </InputGroup>
              <InputGroup $isArabic={isArabic}>
                <Label>{isArabic ? "اللقب" : "Nom"}</Label>
                <PremiumInput
                  type="text"
                  placeholder={isArabic ? "مثال: عمروش" : "ex: Amrouche"}
                  value={formData.lastName}
                  onChange={(e) => updateData("lastName", e.target.value)}
                />
              </InputGroup>
            </div>

            <InputGroup $isArabic={isArabic}>
              <Label>{isArabic ? "البريد الإلكتروني (اختياري)" : "Email (Optionnel)"}</Label>
              <PremiumInput
                type="email"
                placeholder="amine@example.com"
                value={formData.email}
                onChange={(e) => updateData("email", e.target.value)}
              />
            </InputGroup>
          </>
        );

      case 2:
        return (
          <>
            <StepTitle>
              {isArabic ? "رقم الهاتف للتواصل" : "Votre Numéro de Téléphone"}
            </StepTitle>
            <StepSubtitle>
              {isArabic
                ? "سنستخدم هذا الرقم للتواصل معك وتأكيد تفعيل الحساب."
                : "Ce numéro permettra à notre équipe de vous contacter pour finaliser l'inscription."}
            </StepSubtitle>
            <InputGroup $isArabic={isArabic}>
              <Label>{isArabic ? "رقم الهاتف" : "Numéro de Téléphone"}</Label>
              <PremiumInput
                type="tel"
                placeholder="05 XX XX XX XX / 07 XX XX XX XX"
                value={formData.phone}
                onChange={(e) => updateData("phone", e.target.value)}
                autoFocus
                dir="ltr"
                style={{ textAlign: isArabic ? "right" : "left" }}
              />
            </InputGroup>
          </>
        );

      case 3:
        return (
          <>
            <StepTitle>
              {isArabic ? "منطقة النشاط والتنقل" : "Votre Zone de Déplacement"}
            </StepTitle>
            <StepSubtitle>
              {isArabic
                ? "حدد المدينة والبلدية الرئيسية لتنقلاتك المعتادة (نركز حالياً على ولاية بجاية)."
                : "Sélectionnez votre zone principale de déplacement (Priorité actuelle : Wilaya de Béjaïa)."}
            </StepSubtitle>
            <div
              style={{
                background: "#f8fafc",
                padding: "1.25rem",
                borderRadius: "18px",
                border: "1.5px solid #cbd5e1",
                marginBottom: "1.5rem",
              }}
            >
              <AddressesDropDown
                target="tawsila"
                onChooseAddress={(addr) => {
                  updateData("wilaya", addr.wilaya);
                  updateData("commune", addr.commune);
                }}
              />
            </div>
          </>
        );

      case 4:
        return (
          <>
            <StepTitle>
              {isArabic ? "صنف المركبة" : "Votre Véhicule"}
            </StepTitle>
            <StepSubtitle>
              {isArabic
                ? "ما هو نوع المركبة التي تستخدمها في تنقلاتك اليومية؟"
                : "Quel type de véhicule utilisez-vous pour vos trajets quotidiens ?"}
            </StepSubtitle>

            <VehicleGrid>
              <VehicleCard
                $selected={formData.vehicleType === "Berline / Citadine"}
                onClick={() => updateData("vehicleType", "Berline / Citadine")}
              >
                <FaCarSide />
                <span className="title">{isArabic ? "سيارة سياحية" : "Berline / Citadine"}</span>
                <span className="sub">{isArabic ? "4 مقاعد ركاب" : "4 places passagers"}</span>
              </VehicleCard>

              <VehicleCard
                $selected={formData.vehicleType === "Break / SUV"}
                onClick={() => updateData("vehicleType", "Break / SUV")}
              >
                <FaCar />
                <span className="title">{isArabic ? "سيارة واسعة / SUV" : "Break / SUV"}</span>
                <span className="sub">{isArabic ? "مساحة حقائب واسعة" : "Grand coffre"}</span>
              </VehicleCard>

              <VehicleCard
                $selected={formData.vehicleType === "Minibus / Navette"}
                onClick={() => updateData("vehicleType", "Minibus / Navette")}
              >
                <FaShuttleVan />
                <span className="title">{isArabic ? "حافلة صغيرة / فان" : "Minibus / Van"}</span>
                <span className="sub">{isArabic ? "7 إلى 9 مقاعد" : "7 à 9 places"}</span>
              </VehicleCard>
            </VehicleGrid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <TawsilaLayout>
      <Seo
        title={`${t("abrid_btn_captain", "Devenir Capitaine")} | Abrid`}
        description={t(
          "abrid_hero_sub",
          "Rejoignez la communauté des Capitaines Abrid à Béjaïa. Partagez vos trajets du quotidien."
        )}
        url="https://hanuut.com/abridh/drive"
      />

      <WizardContainer $isArabic={isArabic}>
        {!isSuccess && (
          <ProgressContainer>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
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
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              style={{ width: "100%", display: "flex", flexDirection: "column" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {!isSuccess && (
            <>
              <AnimatePresence>
                {error && (
                  <ErrorText
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </ErrorText>
                )}
              </AnimatePresence>

              <NavContainer>
                <NavButton
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1 || isSubmitting}
                  style={{
                    opacity: step === 1 ? 0 : 1,
                    pointerEvents: step === 1 ? "none" : "auto",
                  }}
                >
                  {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
                  <span>{isArabic ? "السابق" : "Retour"}</span>
                </NavButton>

                <NavButton $primary type="button" onClick={handleNext} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader fullscreen={false} />
                  ) : step === TOTAL_STEPS ? (
                    <span>{isArabic ? "إرسال طلب الانضمام" : "Envoyer ma candidature"}</span>
                  ) : (
                    <>
                      <span>{isArabic ? "التالي" : "Suivant"}</span>
                      {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                    </>
                  )}
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