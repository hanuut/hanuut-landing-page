import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { Helmet } from "react-helmet";

// --- Styled Components ---

const PageWrapper = styled.main`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  box-sizing: border-box;
  font-family: ${(props) => (props.$isArabic ? "'Cairo Variable', sans-serif" : "'Ubuntu', sans-serif")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const Container = styled(motion.div)`
  max-width: 900px;
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InfoSidebar = styled.div`
  background: ${(props) => props.theme.primaryColor || "#39A170"};
  color: #ffffff;
  padding: 3rem 2.5rem;
  flex: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  @media (max-width: 768px) {
    padding: 2rem;
    align-items: center;
    text-align: center;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  font-family: 'Tajawal', sans-serif;
`;

const SidebarText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  opacity: 0.9;
  margin-bottom: 2.5rem;
`;

const EmailCard = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  flex-direction: ${(props) => (props.$isArabic ? "row-reverse" : "row")};

  &:hover {
    background: rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
  }
`;

const FormSection = styled.div`
  flex: 1.2;
  padding: 3.5rem;
  background: #ffffff;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 700;
  color: #3f3f46;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  font-size: 1rem;
  background: #fdfdfd;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor || "#39A170"};
    box-shadow: 0 0 0 4px rgba(57, 161, 112, 0.08);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  font-size: 1rem;
  background: #fdfdfd;
  font-family: inherit;
  cursor: pointer;
  appearance: none; /* Hide default arrow to style it better later or use icon */
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  font-size: 1rem;
  background: #fdfdfd;
  min-height: 140px;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor || "#39A170"};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  background: ${(props) => props.theme.primaryColor || "#39A170"};
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-family: 'Tajawal', sans-serif;
  flex-direction: ${(props) => (props.$isArabic ? "row-reverse" : "row")};

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 10px 25px rgba(57, 161, 112, 0.25);
  }

  &:disabled {
    background: #d1d1d6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.2rem;
  height: 100%;
  min-height: 350px;

  svg { font-size: 4.5rem; color: #39A170; }
  h3 { font-size: 1.8rem; font-weight: 800; color: #111; }
  p { font-size: 1.1rem; color: #71717a; max-width: 300px; line-height: 1.6; }
`;

const SupportPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    userType: "Customer",
    userName: "",
    userPhone: "",
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.userName) {
      setErrorMessage(t("errorFillAllFields"));
      setStatus("error");
      return;
    }

    setStatus("submitting");
    
    const payload = {
      type: "SUPPORT_TICKET",
      sourceType: "website_support",
      userType: formData.userType,
      userName: formData.userName,
      userPhone: formData.userPhone,
      title: formData.title,
      content: formData.content,
      language: i18n.language,
    };

    try {
      const prodUrl = process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";
      await axios.post(`${prodUrl}/feedback`, payload);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(t("errorCouldNotSubscribe"));
    }
  };

  return (
    <PageWrapper $isArabic={isArabic}>
      <Helmet>
        <title>{t("support_title")} | Hanuut</title>
      </Helmet>

      <Container
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <InfoSidebar $isArabic={isArabic}>
          <SidebarTitle>{t("support_title")}</SidebarTitle>
          <SidebarText>{t("support_subtitle")}</SidebarText>
          <EmailCard href="mailto:contact.hanuut@gmail.com" $isArabic={isArabic}>
            <FaEnvelope />
            <span>contact.hanuut@gmail.com</span>
          </EmailCard>
        </InfoSidebar>

        <FormSection $isArabic={isArabic}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <SuccessMessage
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FaCheckCircle />
                <h3>{t("support_success_title")}</h3>
                <p>{t("support_success_desc")}</p>
                <SubmitButton 
                    style={{ marginTop: '1.5rem', width: 'auto', padding: '0.8rem 2.5rem' }} 
                    onClick={() => setStatus("idle")}
                >
                  {t("support_send_another")}
                </SubmitButton>
              </SuccessMessage>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
              >
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: '#111' }}>
                  {t("support_form_title")}
                </h3>

                {status === "error" && <p style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</p>}

                <FormGroup>
                  <Label>{t("support_user_type")}</Label>
                  <Select name="userType" value={formData.userType} onChange={handleChange}>
                    <option value="Customer">{t("support_type_customer")}</option>
                    <option value="Driver">{t("support_type_driver")}</option>
                    <option value="Partner">{t("support_type_partner")}</option>
                    <option value="Other">{t("support_type_other")}</option>
                  </Select>
                </FormGroup>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <FormGroup style={{ flex: 1, minWidth: '200px' }}>
                    <Label>{t("support_name_input")}</Label>
                    <Input name="userName" required value={formData.userName} onChange={handleChange} placeholder="John Doe" />
                  </FormGroup>
                  <FormGroup style={{ flex: 1, minWidth: '200px' }}>
                    <Label>{t("support_contact_input")}</Label>
                    <Input name="userPhone" required value={formData.userPhone} onChange={handleChange} placeholder="contact@email.com" />
                  </FormGroup>
                </div>

                <FormGroup>
                  <Label>{t("support_title_input")}</Label>
                  <Input name="title" required value={formData.title} onChange={handleChange} placeholder={t("support_title_placeholder")} />
                </FormGroup>

                <FormGroup>
                  <Label>{t("support_message_input")}</Label>
                  <TextArea name="content" required value={formData.content} onChange={handleChange} placeholder={t("support_message_placeholder")} />
                </FormGroup>

                <SubmitButton type="submit" disabled={status === "submitting"} $isArabic={isArabic}>
                  {status === "submitting" ? <FaSpinner className="fa-spin" /> : <><FaPaperPlane /> {t("buttonSubmit")}</>}
                </SubmitButton>
              </motion.form>
            )}
          </AnimatePresence>
        </FormSection>
      </Container>
    </PageWrapper>
  );
};

export default SupportPage;