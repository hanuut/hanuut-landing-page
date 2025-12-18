import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AddressesDropDown from "../../../../../components/AddressesDropDown"; 
import { 
  StepTitle, 
  StepSubtitle, 
  InputGroup, 
  Label, 
  BigInput 
} from "../WizardComponents";

const StyledAddressWrapper = styled.div`
  width: 100%;
  select {
    width: 100%;
    padding: 1.2rem;
    font-size: 1.1rem;
    border-radius: 16px;
    border: 2px solid #E5E5E5;
    background-color: #FAFAFA;
    margin-bottom: 1rem;
    color: #111;
    font-family: inherit;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem top 50%;
    background-size: 0.65rem auto;

    &:focus {
      outline: none;
      border-color: #39A170;
      background-color: #FFF;
    }
  }
`;

const Step3Location = ({ data, update }) => {
  const { t } = useTranslation();

  const handleAddressChange = (addressObj) => {
    if (addressObj.wilaya) update("wilaya", addressObj.wilaya);
    if (addressObj.commune) update("commune", addressObj.commune);
  };

  return (
    <>
      <StepTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("wiz_step3_title")}
      </StepTitle>
      <StepSubtitle>
        {t("wiz_step3_subtitle")}
      </StepSubtitle>

      <InputGroup>
        <StyledAddressWrapper>
           {/* If AddressesDropDown is the cause of the crash, check its export in its own file */}
           <AddressesDropDown target="partners" onChooseAddress={handleAddressChange} />
        </StyledAddressWrapper>
      </InputGroup>

      <InputGroup>
        <Label>{t("wiz_label_district")}</Label>
        <BigInput 
          type="text" 
          placeholder={t("partnersFormAddress")} 
          value={data.district}
          onChange={(e) => update("district", e.target.value)}
        />
      </InputGroup>
    </>
  );
};

// --- CRITICAL: MUST BE DEFAULT EXPORT ---
export default Step3Location;