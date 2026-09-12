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
  FaEnvelope,
} from "react-icons/fa";

import Seo from "../../components/Seo";
import Loader from "../../components/Loader";
import { JOBS_DATA } from "./data/careersData";
import { encryptCandidatePayload } from "./utils/cryptoHelper";
import { isValidEmail, isValidPhone } from "../../components/validators";

const PageWrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: #090a0d;
  color: #f4f4f5;
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 2.5rem);
  padding-bottom: 6rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  font-family: var(--font-primary, "Tajawal"), sans-serif;
`;

const Container = styled.div`
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #a1a1aa;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  width: fit-content;
  transition: color 0.2s;

  &:hover {
    color: #10b981;
  }
`;

const HeaderBox = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 2rem;

  .dep-tag {
    font-size: 0.8rem;
    font-weight: 700;
    color: #397ff9;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    color: #a1a1aa;
    font-size: 0.95rem;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
`;

const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: start;

  h2 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  p {
    font-size: 1.05rem;
    color: #a1a1aa;
    line-height: 1.6;
    margin: 0;
  }

  ul {
    margin: 0;
    padding-left: ${(props) => (props.$isArabic ? "0" : "1.5rem")};
    padding-right: ${(props) => (props.$isArabic ? "1.5rem" : "0")};
    display: flex;
    flex-direction: column;
    gap: 0.65rem;

    li {
      color: #d4d4d8;
      line-height: 1.5;
    }
  }
`;

const FormCard = styled.section`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: start;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }

  .header {
    h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }
    p {
      color: #a1a1aa;
      font-size: 0.95rem;
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

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #d4d4d8;

  span.req {
    color: #ef4444;
    margin-left: 3px;
  }

  span.opt {
    color: #71717a;
    font-weight: normal;
    font-size: 0.8rem;
    margin-left: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.95rem;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.95rem;
  box-sizing: border-box;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #10b981;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const Select = styled.select`
  padding: 0.85rem 1rem;
  background: #111217;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr auto;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const IconButton = styled.button`
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  border-radius: 10px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
  }
`;

const AddButton = styled.button`
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: #a1a1aa;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    color: #ffffff;
    border-color: #10b981;
  }
`;

const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1rem;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 10px;
  color: #a1a1aa;
  font-size: 0.8rem;

  svg {
    color: #10b981;
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const SubmitBtn = styled.button`
  background-color: #10b981;
  color: #050505;
  border: none;
  padding: 1.1rem 2rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const SuccessCard = styled.div`
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid #10b981;
  border-radius: 24px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;

  .icon {
    font-size: 3rem;
    color: #10b981;
  }

  h3 {
    font-size: 1.8rem;
    color: #ffffff;
    margin: 0;
  }

  p {
    color: #a1a1aa;
    max-width: 550px;
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
  "X / Twitter",
  "Behance",
  "Dribbble",
  "Stack Overflow",
  "Other",
];

const JobDetailPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const job = useMemo(() => JOBS_DATA.find((j) => j.slug === slug), [slug]);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [profiles, setProfiles] = useState([
    { platform: "LinkedIn", url: "" },
    { platform: "GitHub", url: "" },
  ]);
  const [roleAnswer, setRoleAnswer] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  // 1. Add state variable
  const [autoEntrepreneurStatus, setAutoEntrepreneurStatus] = useState("YES"); // YES, IN_PROGRESS, NO

  // Honeypot anti-spam trap
  const [middleNameHp, setMiddleNameHp] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!job) {
    return (
      <PageWrapper $isArabic={isArabic}>
        <Container style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2>{t("job_not_found", "Role not found")}</h2>
          <p style={{ color: "#a1a1aa" }}>
            {t(
              "job_not_found_desc",
              "This role may have been filled or updated.",
            )}
          </p>
          <Link to="/careers" style={{ color: "#10b981", fontWeight: "bold" }}>
            ← {t("back_to_careers", "Back to Careers Hub")}
          </Link>
        </Container>
      </PageWrapper>
    );
  }

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

    // Bot trap check
    if (middleNameHp && middleNameHp.trim() !== "") {
      setSubmissionSuccess(true);
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage(
        t("errorFillAllFields", "Please fill in all required fields."),
      );
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage(
        t("errorEmailNotValid", "Please provide a valid email address."),
      );
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMessage(
        t(
          "errorPhoneNotValid",
          "Please provide a valid Algerian mobile number (05/06/07).",
        ),
      );
      return;
    }

    setIsSubmitting(true);

    // 2. Include in payload sent to crypto helper
    const payload = {
      jobSlug: job.slug,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      location: location.trim(),
      autoEntrepreneurStatus: autoEntrepreneurStatus, // <-- Added field
      currentRole: currentRole.trim(),
      experienceSummary: experienceSummary.trim(),
      cvLink: cvLink.trim(),
      profiles: profiles.filter((p) => p.url.trim() !== ""),
      roleSpecificAnswer: roleAnswer.trim(),
      additionalNotes: additionalNotes.trim(),
    };

    try {
      // 1. Client-Side Encryption using Server Public RSA Key
      const envelope = await encryptCandidatePayload(payload);

      // 2. Submit to dedicated, rate-limited endpoint
      const apiProdUrl =
        process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";
      await axios.post(`${apiProdUrl}/feedback/careers-apply`, {
        envelope,
        hpField: middleNameHp,
      });

      setSubmissionSuccess(true);
    } catch (err) {
      console.error("Application submission error:", err);
      setErrorMessage(
        t(
          "careers_submit_error",
          "Unable to send your application. Please check your network and try again, or email contact.hanuut@gmail.com directly.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocalizedTitle = (j) => {
    if (isArabic) return j.titleAr;
    if (i18n.language === "fr") return j.titleFr;
    return j.titleEn;
  };

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={`${getLocalizedTitle(job)} | Abridh & Hanuut`}
        description={job.mission}
        url={`https://hanuut.com/careers/${job.slug}`}
      />

      <Container>
        <BackLink to="/careers">
          {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
          <span>{t("back_to_careers", "Back to Careers Hub")}</span>
        </BackLink>

        <HeaderBox>
          <span className="dep-tag">{job.department}</span>
          <h1>{getLocalizedTitle(job)}</h1>
          <div className="meta-row">
            <span>
              <FaMapMarkerAlt /> {job.location}
            </span>
            <span>•</span>
            <span>
              <FaClock /> {job.type}
            </span>
            <span>•</span>
            <span style={{ color: "#10b981", fontWeight: "bold" }}>
              ● {job.status}
            </span>
          </div>
        </HeaderBox>

        <SectionBlock $isArabic={isArabic}>
          <h2>{t("job_section_mission", "Mission Overview")}</h2>
          <p>{job.mission}</p>
        </SectionBlock>

        <SectionBlock $isArabic={isArabic}>
          <h2>{t("job_section_why", "Why This Role Exists")}</h2>
          <p>{job.whyExists}</p>
        </SectionBlock>

        <SectionBlock $isArabic={isArabic}>
          <h2>{t("job_section_resp", "What You Will Work On")}</h2>
          <ul>
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock $isArabic={isArabic}>
          <h2>{t("job_section_must", "Key Requirements")}</h2>
          <ul>
            {job.mustHave.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </SectionBlock>

        {job.preferred?.length > 0 && (
          <SectionBlock $isArabic={isArabic}>
            <h2>{t("job_section_pref", "Helpful Experience")}</h2>
            <ul>
              {job.preferred.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </SectionBlock>
        )}

        <FormCard id="apply">
          <div className="header">
            <h2>{t("apply_now_title", "Submit Your Application")}</h2>
            <p>
              {t(
                "apply_now_sub_clean",
                "Our team reviews every submission directly. Please share clear details about your practical experience.",
              )}
            </p>
          </div>

          {submissionSuccess ? (
            <SuccessCard>
              <div className="icon">
                <FaCheckCircle />
              </div>
              <h3>{t("careers_success_title", "Application Received")}</h3>
              <p>
                {t(
                  "careers_success_desc_clean",
                  "Thank you for applying. The team will review your background and reach out directly if there is a strong operational fit.",
                )}
              </p>
              <Link
                to="/careers"
                style={{
                  color: "#10b981",
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}
              >
                ← {t("back_to_careers", "Back to Careers Hub")}
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
              {/* Bot trap field */}
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
                    {t("form_full_name", "Full Name")}
                    <span className="req">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Yacine Khelifi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    {t("partnersFormEmail", "Email Address")}
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
                    {t("partnersFormPhone", "Phone Number")}
                    <span className="req">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="05 XX XX XX XX / 07 XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    {t("candidate_location", "Current City / Location")}
                    <span className="opt">({t("optional", "Optional")})</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Béjaïa, Algiers..."
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
                      "Statut Auto-Entrepreneur / Freelance",
                    )}
                    <span className="req">*</span>
                  </Label>
                  <Select
                    value={autoEntrepreneurStatus}
                    onChange={(e) => setAutoEntrepreneurStatus(e.target.value)}
                    required
                  >
                    <option value="YES">
                      {t(
                        "auto_ent_yes",
                        "✅ Oui, j'ai le statut / carte Auto-Entrepreneur (ANAE)",
                      )}
                    </option>
                    <option value="IN_PROGRESS">
                      {t(
                        "auto_ent_in_progress",
                        "⏳ En cours d'obtention / Prêt(e) à l'obtenir",
                      )}
                    </option>
                    <option value="NO">
                      {t(
                        "auto_ent_no",
                        "❌ Non, intéressé(e) uniquement par un contrat salarié",
                      )}
                    </option>
                  </Select>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#10b981",
                      marginTop: "2px",
                    }}
                  >
                    {t(
                      "auto_ent_preferred_hint",
                      "⭐ Nous privilégions le statut auto-entrepreneur pour la souplesse de facturation et de collaboration.",
                    )}
                  </span>
                </FormGroup>

                <FormGroup>
                  <Label>
                    {t("candidate_current_role", "Current / Most Recent Role")}
                    <span className="opt">({t("optional", "Optional")})</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Software Engineer, Operations Lead..."
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>
                    {t("candidate_current_role", "Current / Most Recent Role")}
                    <span className="opt">({t("optional", "Optional")})</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Software Engineer, Operations Lead..."
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    {t("candidate_cv_link", "CV or Portfolio Link")}
                    <span className="opt">({t("optional", "Optional")})</span>
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://drive.google.com/... or personal link"
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>
                  {t("candidate_profiles_title", "Professional Links")}
                  <span className="opt">({t("optional", "Optional")})</span>
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
                      />
                      {profiles.length > 1 && (
                        <IconButton
                          type="button"
                          onClick={() => handleRemoveProfile(idx)}
                          aria-label="Remove link"
                        >
                          <FaTrash />
                        </IconButton>
                      )}
                    </ProfileRow>
                  ))}
                  <AddButton type="button" onClick={handleAddProfile}>
                    <FaPlus /> {t("add_another_profile", "Add another link")}
                  </AddButton>
                </div>
              </FormGroup>

              {job.specificQuestion && (
                <FormGroup>
                  <Label>
                    {job.specificQuestion}
                    <span className="opt">({t("optional", "Optional")})</span>
                  </Label>
                  <TextArea
                    placeholder={job.questionPlaceholder}
                    rows="4"
                    value={roleAnswer}
                    onChange={(e) => setRoleAnswer(e.target.value)}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>
                  {t("candidate_notes", "Additional Notes")}
                  <span className="opt">({t("optional", "Optional")})</span>
                </Label>
                <TextArea
                  placeholder={t(
                    "candidate_notes_placeholder",
                    "Availability constraints, key projects, or questions for our team...",
                  )}
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
                    "Your application details are client-side encrypted before submission and stored securely in accordance with Law 18-07.",
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
                    <span>{t("submit_application", "Submit Application")}</span>
                    {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                  </>
                )}
              </SubmitBtn>
            </form>
          )}
        </FormCard>
      </Container>
    </PageWrapper>
  );
};

export default JobDetailPage;
