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
</>
);
};
export default Step1Contact;