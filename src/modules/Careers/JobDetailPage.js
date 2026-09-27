// src/modules/Careers/JobDetailPage.js
import React, { useState, useMemo, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaExclamationCircle,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaFileUpload,
  FaPaperclip,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import Seo from "../../components/Seo";
import Loader from "../../components/Loader";
import { JOBS_DATA } from "./data/careersData";
import { encryptCandidatePayload } from "./utils/cryptoHelper";
import { isValidEmail, isValidPhone } from "../../components/validators";

const PageWrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  color: #0f172a;
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 1.5rem);
  padding-bottom: 6rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  font-family: ${(props) =>
    props.$isArabic
      ? "'Cairo', 'Tajawal', sans-serif"
      : "var(--font-primary, 'Tajawal'), sans-serif"};
`;

const Container = styled.div`
  max-width: 860px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  width: fit-content;
  transition: color 0.2s;

  &:hover {
    color: #059669;
  }
`;

const OverviewCard = styled.header`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .tag-row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .dep-tag {
    font-size: 0.8rem;
    font-weight: 800;
    color: #2563eb;
    background: #eff6ff;
    padding: 4px 12px;
    border-radius: 6px;
    text-transform: uppercase;
  }

  .auto-badge {
    font-size: 0.8rem;
    font-weight: 800;
    color: #059669;
    background: #ecfdf5;
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid #a7f3d0;
  }

  h1 {
    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
    font-weight: 900;
    color: #0f172a;
    margin: 0;
    line-height: 1.3;
  }

  .meta-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    color: #64748b;
    font-size: 0.95rem;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  .mission-box {
    background: #f8fafc;
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    border-right: ${(props) => (props.$isArabic ? "4px solid #059669" : "none")};
    border-left: ${(props) => (props.$isArabic ? "none" : "4px solid #059669")};

    p {
      margin: 0;
      color: #334155;
      font-size: 1.05rem;
      line-height: 1.7;
    }
  }
`;

const ToggleSpecsButton = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 0.9rem 1.5rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.95rem;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
  }
`;

const ExpandableSpecsBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
`;

const SpecSectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 1rem;
    color: #475569;
    line-height: 1.7;
    margin: 0;
  }
`;

const LocalizedList = styled.ul`
  margin: 0;
  direction: ${(props) => props.$dir};
  text-align: ${(props) => (props.$dir === "rtl" ? "right" : "left")};
  padding-left: ${(props) => (props.$dir === "rtl" ? "0" : "1.5rem")};
  padding-right: ${(props) => (props.$dir === "rtl" ? "1.5rem" : "0")};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    color: #334155;
    line-height: 1.65;
    font-size: 0.95rem;
  }
`;

// --- MULTI-STEP WIZARD FORM STYLES ---

const WizardCard = styled.section`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.04);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  @media (max-width: 600px) {
    padding: 1.75rem 1.25rem;
  }

  .header {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 1.25rem;

    h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.5rem 0;
    }
    p {
      color: #64748b;
      font-size: 1rem;
      margin: 0;
      line-height: 1.5;
    }
  }
`;

const StepperProgress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 1rem;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e2e8f0;
    z-index: 1;
  }
`;

const StepDot = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active ? "#059669" : props.$completed ? "#ecfdf5" : "#f1f5f9"};
  color: ${(props) =>
    props.$active ? "#ffffff" : props.$completed ? "#059669" : "#94a3b8"};
  border: 2px solid
    ${(props) =>
      props.$active ? "#059669" : props.$completed ? "#059669" : "#cbd5e1"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;

  span.req {
    color: #ef4444;
    margin: 0 4px;
  }

  span.opt {
    color: #94a3b8;
    font-weight: 600;
    font-size: 0.8rem;
    margin: 0 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.95rem 1.1rem;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  color: #0f172a;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #059669;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.95rem 1.1rem;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  color: #0f172a;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #059669;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.95rem 1.1rem;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  color: #0f172a;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #059669;
  }
`;

const FileUploadZone = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 1.5rem;
  border: 2px dashed #94a3b8;
  border-radius: 14px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
  font-weight: 700;
  font-size: 0.95rem;

  &:hover {
    border-color: #059669;
    color: #059669;
    background: #ecfdf5;
  }

  input[type="file"] {
    display: none;
  }
`;

const SelectedFilePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 6px 14px;
  border-radius: 8px;
  color: #065f46;
  font-size: 0.85rem;
  font-weight: 700;
  width: fit-content;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr auto;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const IconButton = styled.button`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #fee2e2;
  }
`;

const AddButton = styled.button`
  background: transparent;
  border: 1.5px dashed #94a3b8;
  color: #475569;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    color: #059669;
    border-color: #059669;
    background: #ecfdf5;
  }
`;

const WizardActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const WizardBtn = styled.button`\n  padding: 1rem 2rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: inherit;

  ${(props) =>
    props.$primary
      ? `
    background: #059669;
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.2);
    &:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-2px);
    }
  `
      : `
    background: #ffffff;
    color: #475569;
    border: 1.5px solid #cbd5e1;
    &:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.85rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  color: #166534;
  font-size: 0.85rem;
  font-weight: 600;

  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1.5px solid #f87171;
  color: #b91c1c;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 700;
`;

const SuccessCard = styled.div`
  background: #ecfdf5;
  border: 2px solid #059669;
  border-radius: 24px;
  padding: 3.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;

  .icon {
    font-size: 3.5rem;
    color: #059669;
  }

  h3 {
    font-size: 1.9rem;
    font-weight: 800;
    color: #064e3b;
    margin: 0;
  }

  p {
    color: #065f46;
    max-width: 550px;
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0;
  }
`;

const PLATFORM_OPTIONS = [
  "LinkedIn",
  "GitHub",
  "GitLab",
  "Portfolio / Website",
  "Behance",
  "Other",
];

const resolveText = (val, langKey, fallback = "") => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val[langKey] || val["ar"] || val["fr"] || val["en"] || fallback;
  }
  return fallback;
};

const resolveList = (val, langKey) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") {
    const list = val[langKey] || val["ar"] || val["fr"] || val["en"];
    return Array.isArray(list) ? list : [];
  }
  return [];
};

const JobDetailPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const langKey = isArabic ? "ar" : i18n.language === "fr" ? "fr" : "en";

  const job = useMemo(() => JOBS_DATA.find((j) => j.slug === slug), [slug]);

  // Progressive Disclosure State
  const [showFullSpec, setShowFullSpec] = useState(false);

  // Stepper State (1: Personal, 2: Experience/CV, 3: Deep-Dive)
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [autoStatus, setAutoStatus] = useState("YES");
  const [currentRole, setCurrentRole] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [profiles, setProfiles] = useState([
    { platform: "LinkedIn", url: "" },
    { platform: "GitHub", url: "" },
  ]);
  const [roleAnswer, setRoleAnswer] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-restore form draft from localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`hanuut_career_draft_${slug}`);
      if (cached) {
        const d = JSON.parse(cached);
        if (d.fullName) setFullName(d.fullName);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.location) setLocation(d.location);
        if (d.autoStatus) setAutoStatus(d.autoStatus);
        if (d.currentRole) setCurrentRole(d.currentRole);
        if (d.cvLink) setCvLink(d.cvLink);
        if (d.profiles) setProfiles(d.profiles);
        if (d.roleAnswer) setRoleAnswer(d.roleAnswer);
        if (d.additionalNotes) setAdditionalNotes(d.additionalNotes);
      }
    } catch (e) {
      console.warn("Could not load draft", e);
    }
  }, [slug]);

  // Auto-save form draft to localStorage
  useEffect(() => {
    try {
      const payload = {
        fullName,
        email,
        phone,
        location,
        autoStatus,
        currentRole,
        cvLink,
        profiles,
        roleAnswer,
        additionalNotes,
      };
      localStorage.setItem(`hanuut_career_draft_${slug}`, JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not save draft", e);
    }
  }, [
    slug,
    fullName,
    email,
    phone,
    location,
    autoStatus,
    currentRole,
    cvLink,
    profiles,
    roleAnswer,
    additionalNotes,
  ]);

  if (!job) {
    return (
      <PageWrapper $isArabic={isArabic}>
        <Container style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2>{isArabic ? "الوظيفة غير موجودة" : "Offre non trouvée"}</h2>
          <Link to="/careers" style={{ color: "#059669", fontWeight: "bold" }}>
            ← {t("careers_back_to_roles", "العودة للوظائف")}
          </Link>
        </Container>
      </PageWrapper>
    );
  }

  // Safe localized text resolvers
  const jobTitle = resolveText(job.title, langKey, job.slug);
  const jobDepartment = resolveText(job.department, langKey, "Engineering");
  const jobLocation = resolveText(job.location, langKey, "Béjaïa, Algeria");
  const jobContract = resolveText(job.contractType, langKey, "Freelance / CDI");
  const jobMission = resolveText(job.mission, langKey, "");
  const jobWhyExists = resolveText(job.whyExists, langKey, "");
  const jobQuestion = resolveText(job.specificQuestion, langKey, "");
  const jobPlaceholder = resolveText(job.questionPlaceholder, langKey, "");

  const responsibilities = resolveList(job.responsibilities, langKey);
  const mustHave = resolveList(job.mustHave, langKey);
  const preferred = resolveList(job.preferred, langKey);

  const handleAddProfile = () => {
    setProfiles((prev) => [...prev, { platform: "LinkedIn", url: "" }]);
  };

  const handleUpdateProfile = (index, field, value) => {
    setProfiles((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveProfile = (index) => {
    setProfiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const validateStep = (targetStep) => {
    setErrorMessage("");

    if (targetStep === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setErrorMessage(t("careers_err_required", "يرجى ملء جميع الحقول الإلزامية."));
        return false;
      }
      if (!isValidEmail(email)) {
        setErrorMessage(t("careers_err_email", "يرجى إدخال عنوان بريد إلكتروني صحيح."));
        return false;
      }
      if (!isValidPhone(phone)) {
        setErrorMessage(t("careers_err_phone", "يرجى إدخال رقم هاتف جزائري صحيح."));
        return false;
      }
    }

    if (targetStep === 2) {
      if (!cvFile && !cvLink.trim()) {
        setErrorMessage(t("careers_err_cv", "يرجى إرفاق ملف السيرة الذاتية أو إدخال رابط معتمد."));
        return false;
      }
    }

    return true;
  };

  const goToNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const goToPrevStep = () => {
    setErrorMessage("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      jobSlug: job.slug,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      location: location.trim(),
      autoEntrepreneurStatus: autoStatus,
      currentRole: currentRole.trim(),
      cvLink: cvLink.trim(),
      cvFileName: cvFile ? cvFile.name : null,
      profiles: profiles.filter((p) => p.url.trim() !== ""),
      roleSpecificAnswer: roleAnswer.trim(),
      additionalNotes: additionalNotes.trim(),
    };

    const apiProdUrl =
      process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

    try {
      let envelope = null;
      try {
        envelope = await encryptCandidatePayload(payload);
      } catch (cryptoErr) {
        console.warn("[Careers Crypto Notice]:", cryptoErr.message);
      }

      const requestBody = envelope ? { envelope } : { data: payload };

      const response = await axios.post(
        `${apiProdUrl}/feedback/careers-apply`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSubmissionSuccess(true);
        localStorage.removeItem(`hanuut_career_draft_${slug}`);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("[Careers Submit Error]:", err);
      const serverMsg = err.response?.data?.message;
      setErrorMessage(
        serverMsg ||
          (isArabic
            ? "تعذر إرسال الطلب حالياً. يرجى التحقق من الشبكة أو مراسلتنا مباشرة على contact.hanuut@gmail.com"
            : "Impossible d'envoyer votre candidature. Veuillez vérifier votre connexion ou nous contacter sur contact.hanuut@gmail.com")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={`${jobTitle} | Abridh & Hanuut`}
        description={jobMission || "Job Opening at Abridh & Hanuut"}
        url={`https://hanuut.com/careers/${job.slug}`}
      />

      <Container>
        <BackLink to="/careers">
          {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{t("careers_back_to_roles", "Retour aux offres")}</span>
        </BackLink>

        {/* --- STEP 1: COMPACT ROLE OVERVIEW --- */}
        <OverviewCard $isArabic={isArabic}>
          <div className="tag-row">
            <span className="dep-tag">{jobDepartment}</span>
            <span className="auto-badge">
              {t("careers_auto_ent_badge", "Auto-Entrepreneur Préféré")}
            </span>
          </div>

          <h1>{jobTitle}</h1>

          <div className="meta-grid">
            <span>
              <FaMapMarkerAlt /> {jobLocation}
            </span>
            <span>•</span>
            <span>
              <FaClock /> {jobContract}
            </span>
            <span>•</span>
            <span style={{ color: "#059669", fontWeight: "800" }}>
              ● {t("careers_role_open", "Ouverte")}
            </span>
          </div>

          {jobMission && (
            <div className="mission-box">
              <p>{jobMission}</p>
            </div>
          )}

          {/* Progressive Disclosure Action */}
          <ToggleSpecsButton
            type="button"
            onClick={() => setShowFullSpec(!showFullSpec)}
          >
            <span>
              {showFullSpec
                ? t("careers_hide_full_spec", "إخفاء التفاصيل")
                : t("careers_view_full_spec", "عرض التفاصيل الكاملة للمنصب")}
            </span>
            {showFullSpec ? <FaChevronUp /> : <FaChevronDown />}
          </ToggleSpecsButton>
        </OverviewCard>

        {/* --- EXPANDABLE SPECIFICATION ACCORDION --- */}
        <AnimatePresence>
          {showFullSpec && (
            <ExpandableSpecsBlock
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {jobWhyExists && (
                <SpecSectionCard $isArabic={isArabic}>
                  <h3>{t("careers_section_why", "لماذا يحتاج فريق أبريذ هذا المنصب؟")}</h3>
                  <p>{jobWhyExists}</p>
                </SpecSectionCard>
              )}

              {responsibilities.length > 0 && (
                <SpecSectionCard $isArabic={isArabic}>
                  <h3>{t("careers_section_responsibilities", "المهام والمسؤوليات المباشرة")}</h3>
                  <LocalizedList $dir={langKey === "ar" ? "rtl" : "ltr"}>
                    {responsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </LocalizedList>
                </SpecSectionCard>
              )}

              {mustHave.length > 0 && (
                <SpecSectionCard $isArabic={isArabic}>
                  <h3>{t("careers_section_requirements", "المتطلبات الأساسية")}</h3>
                  <LocalizedList $dir={langKey === "ar" ? "rtl" : "ltr"}>
                    {mustHave.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </LocalizedList>
                </SpecSectionCard>
              )}

              {preferred.length > 0 && (
                <SpecSectionCard $isArabic={isArabic}>
                  <h3>{t("careers_section_preferred", "مؤهلات وخصائص مفضلة")}</h3>
                  <LocalizedList $dir={langKey === "ar" ? "rtl" : "ltr"}>
                    {preferred.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </LocalizedList>
                </SpecSectionCard>
              )}
            </ExpandableSpecsBlock>
          )}
        </AnimatePresence>

        {/* --- STEPPED APPLICATION WIZARD --- */}
        <WizardCard id="apply" $isArabic={isArabic}>
          <div className="header">
            <h2>{t("careers_apply_title", "الترشح لهذا المنصب")}</h2>
            <p>{t("careers_apply_subtitle")}</p>
          </div>

          {submissionSuccess ? (
            <SuccessCard>
              <div className="icon">
                <FaCheckCircle />
              </div>
              <h3>{t("careers_success_headline", "تم استلام ترشحك بنجاح!")}</h3>
              <p>{t("careers_success_body")}</p>
              <Link
                to="/careers"
                style={{
                  color: "#059669",
                  fontWeight: "800",
                  marginTop: "1rem",
                }}
              >
                ← {t("careers_back_to_roles", "العودة للوظائف")}
              </Link>
            </SuccessCard>
          ) : (
            <form onSubmit={handleSubmit}>
              <StepperProgress>
                <StepDot
                  $active={step === 1}
                  $completed={step > 1}
                  onClick={() => setStep(1)}
                >
                  1
                </StepDot>
                <StepDot
                  $active={step === 2}
                  $completed={step > 2}
                  onClick={() => validateStep(1) && setStep(2)}
                >
                  2
                </StepDot>
                <StepDot
                  $active={step === 3}
                  $completed={step === 3}
                  onClick={() => validateStep(1) && validateStep(2) && setStep(3)}
                >
                  3
                </StepDot>
              </StepperProgress>

              {/* STAGE 1: IDENTITY & CONTACT */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.1rem" }}>
                    1. {t("careers_step_1_title", "البيانات الشخصية")}
                  </h4>

                  <FormRow>
                    <FormGroup>
                      <Label>
                        {t("careers_full_name", "الاسم واللقب")}
                        <span className="req">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder={t("careers_full_name_ph", "مثال: حسان بلقاسم")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        {t("careers_email", "البريد الإلكتروني")}
                        <span className="req">*</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="yacine@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>
                        {t("careers_phone", "رقم الهاتف")}
                        <span className="req">*</span>
                      </Label>
                      <Input
                        type="tel"
                        placeholder={t("careers_phone_ph", "05 XX XX XX XX")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        dir="ltr"
                        style={{ textAlign: isArabic ? "right" : "left" }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        {t("careers_location", "المدينة ومقر الإقامة")}
                        <span className="opt">({t("careers_optional", "اختياري")})</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder={t("careers_location_ph", "مثال: بجاية، الجزائر العاصمة...")}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>
                      {t("candidate_auto_entrepreneur_label", "الوضعية المهنية والفوترة (Auto-Entrepreneur)")}
                      <span className="req">*</span>
                    </Label>
                    <Select
                      value={autoStatus}
                      onChange={(e) => setAutoStatus(e.target.value)}
                      required
                    >
                      <option value="YES">
                        {t("auto_ent_yes", "✅ نعم، حامل لبطاقة المقاول الذاتي (ANAE)")}
                      </option>
                      <option value="IN_PROGRESS">
                        {t("auto_ent_in_progress", "⏳ بصدد استخراج البطاقة / مستعد للتسجيل")}
                      </option>
                      <option value="NO">
                        {t("auto_ent_no", "❌ لا أملك البطاقة (أفضل عقد عمل تقليدي)")}
                      </option>
                    </Select>
                    <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: "600", marginTop: "3px" }}>
                      {t("auto_ent_preferred_hint", "⭐ نفضل العمل بصيغة المقاول الذاتي لمرونة التعاقد.")}
                    </span>
                  </FormGroup>

                  <WizardActionRow>
                    <div />
                    <WizardBtn type="button" $primary onClick={goToNextStep}>
                      <span>{t("careers_step_next", "متابعة ➔")}</span>
                      {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                    </WizardBtn>
                  </WizardActionRow>
                </div>
              )}

              {/* STAGE 2: PROFESSIONAL PROFILE & RESUME */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.1rem" }}>
                    2. {t("careers_step_2_title", "الوضعية المهنية والسيرة")}
                  </h4>

                  <FormGroup>
                    <Label>
                      {t("careers_current_role", "المنصب الحالي أو الأخير")}
                      <span className="opt">({t("careers_optional", "اختياري")})</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder={t("careers_current_role_ph", "مثال: مهندس فلاتر في شركة...")}
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      {t("careers_cv_label", "السيرة الذاتية")}
                      <span className="req">*</span>
                    </Label>

                    <FileUploadZone>
                      <FaFileUpload size={20} />
                      <span>{t("careers_cv_upload_btn", "رفع ملف السيرة الذاتية (PDF, DOCX)")}</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileUpload}
                      />
                    </FileUploadZone>

                    {cvFile && (
                      <SelectedFilePill>
                        <FaPaperclip /> {cvFile.name} ({(cvFile.size / 1024).toFixed(0)} KB)
                      </SelectedFilePill>
                    )}

                    <Input
                      type="url"
                      placeholder={t("careers_cv_link_ph", "أو ضع رابطاً سحابياً (Google Drive / Dropbox)...")}
                      value={cvLink}
                      onChange={(e) => setCvLink(e.target.value)}
                      dir="ltr"
                      style={{ marginTop: "6px" }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      {t("careers_links_label", "روابط الحسابات المهنية والأكواد")}
                      <span className="opt">({t("careers_optional", "اختياري")})</span>
                    </Label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {profiles.map((p, idx) => (
                        <ProfileRow key={idx}>
                          <Select
                            value={p.platform}
                            onChange={(e) =>
                              handleUpdateProfile(idx, "platform", e.target.value)
                            }
                          >
                            {PLATFORM_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </Select>
                          <Input
                            type="url"
                            placeholder="https://..."
                            value={p.url}
                            onChange={(e) =>
                              handleUpdateProfile(idx, "url", e.target.value)
                            }
                            dir="ltr"
                          />
                          {profiles.length > 1 && (
                            <IconButton
                              type="button"
                              onClick={() => handleRemoveProfile(idx)}
                              aria-label="Delete"
                            >
                              <FaTrash />
                            </IconButton>
                          )}
                        </ProfileRow>
                      ))}
                      <AddButton type="button" onClick={handleAddProfile}>
                        <FaPlus /> {t("careers_add_link", "+ إضافة رابط آخر")}
                      </AddButton>
                    </div>
                  </FormGroup>

                  <WizardActionRow>
                    <WizardBtn type="button" onClick={goToPrevStep}>
                      {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
                      <span>{t("careers_step_prev", "السابق")}</span>
                    </WizardBtn>
                    <WizardBtn type="button" $primary onClick={goToNextStep}>
                      <span>{t("careers_step_next", "متابعة ➔")}</span>
                      {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                    </WizardBtn>
                  </WizardActionRow>
                </div>
              )}

              {/* STAGE 3: ENGINEERING DEEP-DIVE & SUBMISSION */}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.1rem" }}>
                    3. {t("careers_step_3_title", "التعمق الهندسي والملاحظات")}
                  </h4>

                  {jobQuestion && (
                    <FormGroup>
                      <Label>
                        {jobQuestion}
                        <span className="opt">({t("careers_optional", "اختياري")})</span>
                      </Label>
                      <TextArea
                        placeholder={jobPlaceholder}
                        rows="4"
                        value={roleAnswer}
                        onChange={(e) => setRoleAnswer(e.target.value)}
                      />
                    </FormGroup>
                  )}

                  <FormGroup>
                    <Label>
                      {t("careers_notes_label", "ملاحظات أو أسئلة إضافية لفريقنا")}
                      <span className="opt">({t("careers_optional", "اختياري")})</span>
                    </Label>
                    <TextArea
                      placeholder={t("careers_notes_ph", "مدى توفرك، شروط معينة، أو أي استفسار...")}
                      rows="3"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                    />
                  </FormGroup>

                  <SecurityNotice>
                    <FaLock />
                    <span>{t("careers_security_notice")}</span>
                  </SecurityNotice>

                  <WizardActionRow>
                    <WizardBtn type="button" onClick={goToPrevStep}>
                      {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
                      <span>{t("careers_step_prev", "السابق")}</span>
                    </WizardBtn>
                    <WizardBtn type="submit" $primary disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader fullscreen={false} />
                      ) : (
                        <span>{t("careers_submit_btn", "إرسال طلب الترشح")}</span>
                      )}
                    </WizardBtn>
                  </WizardActionRow>
                </div>
              )}

              {errorMessage && (
                <ErrorBanner style={{ marginTop: "1.25rem" }}>
                  <FaExclamationCircle /> {errorMessage}
                </ErrorBanner>
              )}
            </form>
          )}
        </WizardCard>
      </Container>
    </PageWrapper>
  );
};

export default JobDetailPage;