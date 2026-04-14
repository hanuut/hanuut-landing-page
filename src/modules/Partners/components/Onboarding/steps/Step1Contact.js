import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { 
  StepTitle, 
  StepSubtitle, 
  InputGroup, 
  Label, 
  BigInput,
  FormRow 
} from "../WizardComponents";

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(57, 161, 112, 0.05);
  border: 1px solid rgba(57, 161, 112, 0.2);
  border-radius: 12px;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: #39A170;
    cursor: pointer;
  }

  label {
    font-size: 0.9rem;
    color: #52525b;
    line-height: 1.5;
    cursor: pointer;

    a {
      color: #39A170;
      font-weight: 700;
      text-decoration: underline;
    }
  }
`;

const Step1Contact = ({ data, update }) => {
  const { t } = useTranslation();

  return (
    <>
      <StepTitle>{t("wiz_step1_title")}</StepTitle>
      <StepSubtitle>{t("wiz_step1_subtitle")}</StepSubtitle>

      <FormRow>
        <InputGroup>
          <Label>{t("wiz_label_firstname")}</Label>
          <BigInput 
            type="text" 
            placeholder="Mohamed"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            autoFocus
          />
        </InputGroup>
        <InputGroup>
          <Label>{t("wiz_label_lastname")}</Label>
          <BigInput 
            type="text" 
            placeholder="Benali"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </InputGroup>
      </FormRow>

      <InputGroup>
        <Label>{t("partnersFormEmail")}</Label>
        <BigInput 
          type="email" 
          placeholder="contact@shop.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <Label>{t("partnersFormPhone")}</Label>
        <BigInput 
          type="tel" 
          placeholder="05 XX XX XX XX"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </InputGroup>
      
      <InputGroup>
        <Label>{t("deleteAccountPassword")}</Label>
        <BigInput 
          type="password" 
          placeholder="Min. 6 characters"
          value={data.password}
          onChange={(e) => update("password", e.target.value)}
        />
      </InputGroup>

      {/* MANDATORY CONSENT CHECKBOX */}
      <CheckboxContainer>
        <input 
          type="checkbox" 
          id="legal-consent"
          checked={data.hasConsented}
          onChange={(e) => update("hasConsented", e.target.checked)}
        />
        <label htmlFor="legal-consent">
          {t("consent_pre")}
          <Link to="/terms_and_conditions" target="_blank">{t("consent_terms")}</Link>
          {t("consent_and")}
          <Link to="/privacy" target="_blank">{t("consent_privacy")}</Link>.
        </label>
      </CheckboxContainer>
    </>
  );
};

export default Step1Contact;