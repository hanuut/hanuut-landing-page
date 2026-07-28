import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaCloudUploadAlt, FaSpinner, FaRocket } from "react-icons/fa";
import { sendJoinRequest } from "../../../../Partners/services/feedbackService";

const FormCard = styled(motion.div)`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: start;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #a1a1aa;
  font-family: "Tajawal", sans-serif;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  font-family: "Cairo", sans-serif;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const FileUploadZone = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1.25rem;
  border: 2px dashed rgba(240, 122, 72, 0.4);
  border-radius: 12px;
  background: rgba(240, 122, 72, 0.03);
  color: #d4d4d8;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(240, 122, 72, 0.08);
    border-color: #f07a48;
  }

  input { display: none; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 1.1rem;
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: "Tajawal", sans-serif;
  box-shadow: 0 10px 25px rgba(240, 122, 72, 0.3);

  &:hover { filter: brightness(1.1); }
  &:disabled { background: #27272a; color: #71717a; cursor: not-allowed; }
`;

const SuccessMessageBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 2rem 0;
  svg { font-size: 3.5rem; color: #39A170; }
  h3 { font-size: 1.5rem; font-weight: 800; margin: 0; font-family: "Tajawal"; }
  p { color: #a1a1aa; font-family: "Cairo"; }
`;

const CreatorApplicationForm = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    artistName: "",
    collectionTitle: "",
    phone: "",
    portfolioLink: "",
    sampleFile: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.artistName || !formData.phone || !formData.portfolioLink) {
      setErrorMsg(t("errorFillAllFields", "Please fill in all required fields."));
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        shopName: formData.collectionTitle || "Creator Collection",
        firstName: formData.artistName,
        lastName: "",
        phone: formData.phone,
        email: formData.portfolioLink,
      };

      await sendJoinRequest(payload);
      setSuccess(true);
    } catch (err) {
      console.error("Creator submission failed:", err);
      setErrorMsg(t("errorCouldNotSubscribe", "Submission failed. Try again later."));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <FormCard $isArabic={isArabic} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <SuccessMessageBlock>
          <FaCheckCircle />
          <h3>{t("congratulations", "Success!")}</h3>
          <p>{t("creator_form_success", "Application received! The AURAS LAB team will contact you shortly.")}</p>
        </SuccessMessageBlock>
      </FormCard>
    );
  }

  return (
    <FormCard $isArabic={isArabic} as="form" onSubmit={handleSubmit}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, fontFamily: "Tajawal" }}>
        {t("pod_studio_join_creators_btn", "Join as a Creator")}
      </h3>

      <InputGroup>
        <Label>{t("creator_form_artist_name", "Artistic Alias / Brand Name")}</Label>
        <Input 
          type="text" 
          placeholder="e.g. CyberSmith" 
          value={formData.artistName}
          onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
          required 
        />
      </InputGroup>

      <InputGroup>
        <Label>{t("creator_form_collection_title", "First Collection Title")}</Label>
        <Input 
          type="text" 
          placeholder="e.g. Neon Horizon Drop" 
          value={formData.collectionTitle}
          onChange={(e) => setFormData({ ...formData, collectionTitle: e.target.value })}
        />
      </InputGroup>

      <InputGroup>
        <Label>{t("creator_form_phone", "Contact Phone Number")}</Label>
        <Input 
          type="tel" 
          placeholder="05XXXXXXXX" 
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required 
        />
      </InputGroup>

      <InputGroup>
        <Label>{t("creator_form_portfolio", "Portfolio Link (Instagram / Behance / Drive)")}</Label>
        <Input 
          type="text" 
          placeholder="https://instagram.com/yourbrand" 
          value={formData.portfolioLink}
          onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
          required 
        />
      </InputGroup>

      {errorMsg && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{errorMsg}</p>}

      <SubmitBtn type="submit" disabled={submitting}>
        {submitting ? <FaSpinner className="fa-spin" /> : <><FaRocket /> {t("creator_form_submit", "Submit Application")}</>}
      </SubmitBtn>
    </FormCard>
  );
};

export default CreatorApplicationForm;