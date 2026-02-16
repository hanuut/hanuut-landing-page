import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { WILAYAS, COMMUNES } from "../data/algeria_locations"; // New Source
import { useTranslation } from "react-i18next";

const AddressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  appearance: none;
  /* Custom Arrow */
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23AAAAAA%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 0.65rem auto;

  &:focus { outline: none; border-color: ${(props) => props.theme.primaryColor}; }
  &[dir="rtl"] { background-position: left 1rem top 50%; }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  box-sizing: border-box;
  &:focus { outline: none; border-color: ${(props) => props.theme.primaryColor}; }
`;

const Option = styled.option`
  color: #333;
  background-color: #fff;
`;

const Label = styled.label`
  font-size: 0.85rem;
  color: #a1a1aa;
  font-weight: 500;
`;

const AddressesDropDown = ({ onChooseAddress, initialAddress }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [selectedWilayaCode, setSelectedWilayaCode] = useState(initialAddress?.wilayaCode || "");
  const [selectedCommune, setSelectedCommune] = useState(initialAddress?.commune || "");
  const [addressLine, setAddressLine] = useState(initialAddress?.addressLine || "");
  const [filteredCommunes, setFilteredCommunes] = useState([]);

  // Filter Communes when Wilaya Changes
  useEffect(() => {
    if (selectedWilayaCode) {
      // Assuming COMMUNES has 'wilaya_code' field matching '01', '16', etc.
      // If COMMUNES is empty in your local file yet, this will just be empty.
      const list = COMMUNES.filter(c => c.wilaya_code === selectedWilayaCode);
      
      // Sort alphabetically
      list.sort((a, b) => {
        const nameA = isArabic ? a.commune_name : a.commune_name_ascii;
        const nameB = isArabic ? b.commune_name : b.commune_name_ascii;
        return nameA.localeCompare(nameB);
      });
      
      setFilteredCommunes(list);
    } else {
      setFilteredCommunes([]);
    }
  }, [selectedWilayaCode, isArabic]);

  // Notify Parent
  useEffect(() => {
    const wilayaObj = WILAYAS.find(w => w.code === selectedWilayaCode);
    const wilayaName = wilayaObj ? (isArabic ? wilayaObj.ar_name : wilayaObj.name) : "";

    onChooseAddress({
      wilayaCode: selectedWilayaCode,
      wilaya: wilayaName, // Display Name
      commune: selectedCommune,
      addressLine: addressLine
    });
  }, [selectedWilayaCode, selectedCommune, addressLine, onChooseAddress, isArabic]);

  return (
    <AddressContainer>
      <RowGroup>
        <InputWrapper>
          <Label>{t("wiz_label_wilaya", "Wilaya")}</Label>
          <Select
            dir={isArabic ? "rtl" : "ltr"}
            value={selectedWilayaCode}
            onChange={(e) => {
                setSelectedWilayaCode(e.target.value);
                setSelectedCommune(""); // Reset commune on wilaya change
            }}
            required
          >
            <Option value="" disabled>{t("partnersFormAddressState", "Select Wilaya")}</Option>
            {WILAYAS.map((w) => (
              <Option key={w.code} value={w.code}>
                {w.code} - {isArabic ? w.ar_name : w.name}
              </Option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Label>{t("wiz_label_commune", "Commune")}</Label>
          <Select
            dir={isArabic ? "rtl" : "ltr"}
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            required
            disabled={!selectedWilayaCode}
          >
            <Option value="" disabled>{t("partnersFormAddressCity", "Select Commune")}</Option>
            {filteredCommunes.map((c) => (
              <Option key={c.id} value={isArabic ? c.commune_name : c.commune_name_ascii}>
                {isArabic ? c.commune_name : c.commune_name_ascii}
              </Option>
            ))}
          </Select>
        </InputWrapper>
      </RowGroup>

      <InputWrapper>
        <Label>{t("partnersFormAddress", "Address Line")}</Label>
        <Input
          type="text"
          placeholder={t("address_line_placeholder", "Street, Building, etc.")}
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          required
        />
      </InputWrapper>
    </AddressContainer>
  );
};

export default AddressesDropDown;