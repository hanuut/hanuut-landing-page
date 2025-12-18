import React from "react";
import { useTranslation } from "react-i18next";
import { 
  StepTitle, 
  StepSubtitle, 
  InputGroup, 
  Label, 
  BigInput,
  FormRow 
} from "../WizardComponents";

const Step1Contact = ({ data, update }) => {
  const { t } = useTranslation();

  return (
    <>
      <StepTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("wiz_step1_title")}
      </StepTitle>
      <StepSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t("wiz_step1_subtitle")}
      </StepSubtitle>

      {/* Replaced inline div with FormRow for consistent spacing */}
      <FormRow>
        <InputGroup>
          <Label>{t("wiz_label_lastname")}</Label>
          <BigInput 
            type="text" 
            placeholder="Benali"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            autoFocus
          />
        </InputGroup>
        <InputGroup>
          <Label>{t("wiz_label_firstname")}</Label>
          <BigInput 
            type="text" 
            placeholder="Mohamed"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </InputGroup>
      </FormRow>

      <InputGroup>
        <Label>{t("wiz_label_phone")}</Label>
        <BigInput 
          type="tel" 
          placeholder="05 XX XX XX XX"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <Label>{t("partnersFormEmail")}</Label> {/* Used generic "Email" key instead of "Email (Optional)" */}
        <BigInput 
          type="email" 
          placeholder="contact@shop.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </InputGroup>
    </>
  );
};

export default Step1Contact;