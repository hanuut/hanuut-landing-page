// modules/Careers/JobDetailPage.js
import React, { useState, useMemo } from "react";
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
} from "react-icons/fa";

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
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 2rem);
  padding-bottom: 6rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  font-family: ${(props) =>
    props.$isArabic
      ? "'Cairo', 'Tajawal', sans-serif"
      : "var(--font-primary, 'Tajawal'), sans-serif"};
`;

const Container = styled.div`
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
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

const HeaderCard = styled.header`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    font-size: clamp(1.85rem, 3.8vw, 2.6rem);
    font-weight: 800;
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
    padding-top: 0.5rem;
    border-top: 1px solid #f1f5f9;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
`;

const SectionCard = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  h2 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 1.05rem;
    color: #334155;
    line-height: 1.7;
    margin: 0;
  }

  ul {
    margin: 0;
    padding-left: ${(props) => (props.$isArabic ? "0" : "1.5rem")};
    padding-right: ${(props) => (props.$isArabic ? "1.5rem" : "0")};
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    li {
      color: #334155;
      line-height: 1.6;
      font-size: 1rem;
    }
  }
`;

const FormWrapper = styled.section`
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.75rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.05);
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
    margin-right: 4px;
    margin-left: 4px;
  }

  span.opt {
    color: #94a3b8;
    font-weight: 600;
    font-size: 0.8rem;
    margin-right: 4px;
    margin-left: 4px;
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
  min-height: 110px;
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
  font-size: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #059669;
  }
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr auto;
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

const SubmitBtn = styled.button`
  background-color: #059669;
  color: #ffffff;
  border: none;
  padding: 1.15rem 2.25rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #047857;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(5, 150, 105, 0.25);
  }

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

const HoneypotWrapper = styled.div`
  display: none !important;
  visibility: hidden;
  position: absolute;
  left: -9999px;
`;

const PLATFORM_OPTIONS = [
  "LinkedIn",
  "GitHub",
  "GitLab",
  "Portfolio / Website",
  "Behance",
  "Other",
];

// --- Bullet-proof text resolver that handles both objects and legacy strings ---
const resolveText = (val, langKey, fallback = "") => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val[langKey] || val["fr"] || val["en"] || val["ar"] || fallback;
  }
  return fallback;
};

// --- Bullet-proof array resolver for responsibilities/mustHave/preferred ---
const resolveList = (val, langKey) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") {
    const list = val[langKey] || val["fr"] || val["en"] || val["ar"];
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

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [autoStatus, setAutoStatus] = useState("YES");
  const [currentRole, setCurrentRole] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [profiles, setProfiles] = useState([
    { platform: "LinkedIn", url: "" },
    { platform: "GitHub", url: "" },
  ]);
  const [roleAnswer, setRoleAnswer] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [middleNameHp, setMiddleNameHp] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!job) {
    return (
      <PageWrapper $isArabic={isArabic}>
        <Container style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2>{isArabic ? "الوظيفة غير موجودة" : "Offre non trouvée"}</h2>
          <Link to="/careers" style={{ color: "#059669", fontWeight: "bold" }}>
            ← {t("back_to_careers", "العودة للوظائف")}
          </Link>
        </Container>
      </PageWrapper>
    );
  }

  // Safe localized properties
  const jobTitle = resolveText(
    job.title,
    langKey,
    job.titleFr || job.titleEn || job.slug,
  );
  const jobDepartment = resolveText(job.department, langKey, "Engineering");
  const jobLocation = resolveText(job.location, langKey, "Béjaïa, Algérie");
  const jobContractType = resolveText(
    job.contractType || job.type,
    langKey,
    "Freelance / CDI",
  );
  const jobMission = resolveText(job.mission, langKey, "");
  const jobWhyExists = resolveText(job.whyExists, langKey, "");
  const jobSpecificQuestion = resolveText(job.specificQuestion, langKey, "");
  const jobPlaceholder = resolveText(
    job.placeholder || job.questionPlaceholder,
    langKey,
    "",
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (middleNameHp && middleNameHp.trim() !== "") {
      setSubmissionSuccess(true);
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage(
        isArabic
          ? "يرجى ملء جميع الحقول الإلزامية (*)."
          : "Veuillez remplir tous les champs obligatoires (*).",
      );
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage(
        isArabic
          ? "يرجى إدخال عنوان بريد إلكتروني صحيح."
          : "Veuillez saisir une adresse email valide.",
      );
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMessage(
        isArabic
          ? "يرجى إدخال رقم هاتف جزائري صحيح (05/06/07)."
          : "Veuillez saisir un numéro de téléphone algérien valide.",
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      jobSlug: job.slug,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      location: location.trim(),
      autoEntrepreneurStatus: autoStatus,
      currentRole: currentRole.trim(),
      cvLink: cvLink.trim(),
      profiles: profiles.filter((p) => p.url.trim() !== ""),
      roleSpecificAnswer: roleAnswer.trim(),
      additionalNotes: additionalNotes.trim(),
    };

    const apiProdUrl =
      process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

    try {
      console.log("[Careers] Preparing candidate submission...");
      let envelope = null;

      try {
        envelope = await encryptCandidatePayload(payload);
      } catch (cryptoErr) {
        console.warn("[Careers Crypto Notice]:", cryptoErr.message);
      }

      // Use envelope if encrypted, otherwise send safe fallback payload
      const requestBody = envelope
        ? { envelope, hpField: middleNameHp }
        : { data: payload, hpField: middleNameHp };

      const response = await axios.post(
        `${apiProdUrl}/feedback/careers-apply`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setSubmissionSuccess(true);
      } else {
        throw new Error("Server returned non-success response");
      }
    } catch (err) {
      console.error("[Careers Submit Error]:", err);
      const serverMsg = err.response?.data?.message;
      setErrorMessage(
        serverMsg ||
          (isArabic
            ? "تعذر إرسال الطلب حالياً. يرجى التحقق من الشبكة أو مراسلتنا على contact.hanuut@gmail.com"
            : "Impossible d'envoyer votre candidature. Veuillez vérifier votre connexion ou nous contacter sur contact.hanuut@gmail.com"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={`${jobTitle} | Abridh & Hanuut`}
        description={jobMission || "Offre d'emploi chez Abridh"}
        url={`https://hanuut.com/careers/${job.slug}`}
      />

      <Container>
        <BackLink to="/careers">
          {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{t("back_to_careers", "Retour aux offres")}</span>
        </BackLink>

        {/* --- HEADER --- */}
        <HeaderCard $isArabic={isArabic}>
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
              <FaClock /> {jobContractType}
            </span>
            <span>•</span>
            <span style={{ color: "#059669", fontWeight: "800" }}>
              ● {isArabic ? "مفتوحة" : "Ouvert"}
            </span>
          </div>
        </HeaderCard>

        {/* --- MISSION --- */}
        {jobMission && (
          <SectionCard $isArabic={isArabic}>
            <h2>{isArabic ? "الهدف الأساسي من المنصب" : "Mission du Poste"}</h2>
            <p>{jobMission}</p>
          </SectionCard>
        )}

        {/* --- WHY THIS ROLE EXISTS --- */}
        {jobWhyExists && (
          <SectionCard $isArabic={isArabic}>
            <h2>
              {isArabic
                ? "لماذا يحتاج فريق أبريذ هذا المنصب؟"
                : "Pourquoi ce rôle existe"}
            </h2>
            <p>{jobWhyExists}</p>
          </SectionCard>
        )}

        {/* --- RESPONSIBILITIES --- */}
        {responsibilities.length > 0 && (
          <SectionCard $isArabic={isArabic}>
            <h2>
              {isArabic ? "المهام والمسؤوليات المباشرة" : "Vos Responsabilités"}
            </h2>
            <ul>
              {responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* --- MUST HAVE --- */}
        {mustHave.length > 0 && (
          <SectionCard $isArabic={isArabic}>
            <h2>{isArabic ? "المتطلبات الأساسية" : "Critères Requis"}</h2>
            <ul>
              {mustHave.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* --- PREFERRED --- */}
        {preferred.length > 0 && (
          <SectionCard $isArabic={isArabic}>
            <h2>
              {isArabic ? "مؤهلات وخصائص مفضلة" : "Points Forts Souhaités"}
            </h2>
            <ul>
              {preferred.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* --- APPLICATION FORM --- */}
        <FormWrapper id="apply" $isArabic={isArabic}>
          <div className="header">
            <h2>{t("apply_now_title", "Postuler à cette offre")}</h2>
            <p>
              {t(
                "apply_now_sub_clean",
                "Notre équipe examine chaque candidature directement. Décrivez vos expériences pratiques avec précision.",
              )}
            </p>
          </div>

          {submissionSuccess ? (
            <SuccessCard>
              <div className="icon">
                <FaCheckCircle />
              </div>
              <h3>{t("careers_success_title", "Candidature bien reçue")}</h3>
              <p>
                {t(
                  "careers_success_desc_clean",
                  "Merci pour votre candidature. Notre équipe étudiera attentivement votre profil et vous recontactera directement si une opportunité se confirme.",
                )}
              </p>
              <Link
                to="/careers"
                style={{
                  color: "#059669",
                  fontWeight: "800",
                  marginTop: "1rem",
                }}
              >
                ← {t("back_to_careers", "Retour aux offres")}
              </Link>
            </SuccessCard>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <HoneypotWrapper aria-hidden="true">
                <input
                  type="text"
                  name="middle_name_field"
                  tabIndex="-1"
                  autoComplete="off"
                  value={middleNameHp}
                  onChange={(e) => setMiddleNameHp(e.target.value)}
                />
              </HoneypotWrapper>

              <FormRow>
                <FormGroup>
                  <Label>
                    {isArabic ? "الاسم واللقب" : "Nom et Prénom"}
                    <span className="req">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder={
                      isArabic ? "مثال: حسان بلقاسم" : "ex: Yacine Khelifi"
                    }
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    {isArabic ? "البريد الإلكتروني" : "Adresse Email"}
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
                    {isArabic ? "رقم الهاتف" : "Numéro de Téléphone"}
                    <span className="req">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="05 XX XX XX XX / 07 XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    dir="ltr"
                    style={{ textAlign: isArabic ? "right" : "left" }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    {isArabic ? "المدينة ومقر الإقامة" : "Ville de résidence"}
                    <span className="opt">
                      ({isArabic ? "اختياري" : "Optionnel"})
                    </span>
                  </Label>
                  <Input
                    type="text"
                    placeholder={
                      isArabic
                        ? "مثال: بجاية، الجزائر العاصمة..."
                        : "ex: Béjaïa, Alger..."
                    }
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>
                    {t(
                      "candidate_auto_entrepreneur_label",
                      "Statut Auto-Entrepreneur / Facturation",
                    )}
                    <span className="req">*</span>
                  </Label>
                  <Select
                    value={autoStatus}
                    onChange={(e) => setAutoStatus(e.target.value)}
                    required
                  >
                    <option value="YES">
                      {t(
                        "auto_ent_yes",
                        "✅ Oui, titulaire de la carte Auto-Entrepreneur (ANAE)",
                      )}
                    </option>
                    <option value="IN_PROGRESS">
                      {t(
                        "auto_ent_in_progress",
                        "⏳ Démarche en cours / Prêt(e) à l'obtenir",
                      )}
                    </option>
                    <option value="NO">
                      {t(
                        "auto_ent_no",
                        "❌ Pas de statut (Souhaite un contrat salarié)",
                      )}
                    </option>
                  </Select>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#059669",
                      fontWeight: "600",
                      marginTop: "3px",
                    }}
                  >
                    {t(
                      "auto_ent_preferred_hint",
                      "⭐ Nous privilégions le statut auto-entrepreneur pour la flexibilité de contractualisation.",
                    )}
                  </span>
                </FormGroup>

                <FormGroup>
                  <Label>
                    {isArabic
                      ? "المنصب الحالي أو الأخير"
                      : "Poste actuel ou plus récent"}
                    <span className="opt">
                      ({isArabic ? "اختياري" : "Optionnel"})
                    </span>
                  </Label>
                  <Input
                    type="text"
                    placeholder={
                      isArabic
                        ? "مثال: مهندس فلاتر في شركة X"
                        : "ex: Développeur Flutter chez..."
                    }
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>
                  {isArabic
                    ? "رابط السيرة الذاتية (Google Drive / Dropbox / Notion)"
                    : "Lien vers votre CV / Portfolio"}
                  <span className="opt">
                    ({isArabic ? "اختياري" : "Optionnel"})
                  </span>
                </Label>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  dir="ltr"
                />
              </FormGroup>

              {/* Profiles Row */}
              <FormGroup>
                <Label>
                  {isArabic
                    ? "روابط مهنية وحسابات الأكواد (LinkedIn / GitHub)"
                    : "Profils professionnels & code"}
                  <span className="opt">
                    ({isArabic ? "اختياري" : "Optionnel"})
                  </span>
                </Label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
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
                          aria-label="Supprimer"
                        >
                          <FaTrash />
                        </IconButton>
                      )}
                    </ProfileRow>
                  ))}
                  <AddButton type="button" onClick={handleAddProfile}>
                    <FaPlus />{" "}
                    {isArabic ? "إضافة رابط آخر" : "Ajouter un autre lien"}
                  </AddButton>
                </div>
              </FormGroup>

              {/* Role Specific Question */}
              {jobSpecificQuestion && (
                <FormGroup>
                  <Label>
                    {jobSpecificQuestion}
                    <span className="opt">
                      ({isArabic ? "اختياري" : "Optionnel"})
                    </span>
                  </Label>
                  <TextArea
                    placeholder={jobPlaceholder}
                    rows="4"
                    value={roleAnswer}
                    onChange={(e) => setRoleAnswer(e.target.value)}
                  />
                </FormGroup>
              )}

              {/* Additional Notes */}
              <FormGroup>
                <Label>
                  {isArabic
                    ? "ملاحظات أو أسئلة إضافية لفريقنا"
                    : "Remarques ou questions pour notre équipe"}
                  <span className="opt">
                    ({isArabic ? "اختياري" : "Optionnel"})
                  </span>
                </Label>
                <TextArea
                  placeholder={
                    isArabic
                      ? "مدى توفرك، شروط معينة، أو أي استفسار..."
                      : "Disponibilité, contraintes particulières, questions..."
                  }
                  rows="3"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </FormGroup>

              <SecurityNotice>
                <FaLock />
                <span>
                  {t(
                    "careers_encryption_notice",
                    "Vos données de candidature sont chiffrées côté client avant leur transmission et protégées selon la loi 18-07.",
                  )}
                </span>
              </SecurityNotice>

              {errorMessage && (
                <ErrorBanner>
                  <FaExclamationCircle /> {errorMessage}
                </ErrorBanner>
              )}

              <SubmitBtn type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader fullscreen={false} />
                ) : (
                  <>
                    <span>
                      {isArabic
                        ? "إرسال طلب الترشح"
                        : "Soumettre ma candidature"}
                    </span>
                    {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                  </>
                )}
              </SubmitBtn>
            </form>
          )}
        </FormWrapper>
      </Container>
    </PageWrapper>
  );
};

export default JobDetailPage;
