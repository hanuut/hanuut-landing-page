// src/components/AddressesDropDown.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Cities, Wilayas } from "../data";
import { useTranslation } from "react-i18next";

// --- Main container ---
const AddressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// --- Grid Wrapper for Wilaya/Commune ---
const RowGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Stack on small screens */
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// --- Select styles for dark theme ---
const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23AAAAAA%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 0.65rem auto;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }

  &[dir="rtl"] {
    background-position: left 1rem top 50%;
  }
`;

// --- Input styles for dark theme ---
const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const Option = styled.option`
  color: #333;
  background-color: #fff;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #a1a1aa;
  font-weight: 500;
`;

const AddressesDropDown = ({ onChooseAddress }) => {
  const { t, i18n } = useTranslation();

  const [address, setAddress] = useState({
    wilaya: "",
    commune: "",
    addressLine: "",
  });

  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    onChooseAddress(address);
  }, [address, onChooseAddress]);

  const handleStateChange = (event) => {
    const newWilaya = event.target.value;

    // Reset city when state changes
    setAddress({
      wilaya: newWilaya,
      commune: "",
      addressLine: address.addressLine,
    });

    const tempCities = Cities.filter((city) =>
      i18n.language === "ar"
        ? // --- FIX: Use 'wilaya_name' for Cities, not 'wilaya_name_ar' ---
          city.wilaya_name === newWilaya
        : city.wilaya_name_ascii === newWilaya
    ).sort((a, b) => a.commune_name_ascii.localeCompare(b.commune_name_ascii));

    setFilteredCities(tempCities);
  };

  const handleCityChange = (event) => {
    setAddress((prev) => ({ ...prev, commune: event.target.value }));
  };

  const handleAddressLineChange = (event) => {
    setAddress((prev) => ({ ...prev, addressLine: event.target.value }));
  };

  return (
    <AddressContainer>
      <RowGroup>
        <InputWrapper>
          <Label htmlFor="state">{t("partnersFormAddressState")}</Label>
          <Select
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            id="state"
            value={address.wilaya}
            onChange={handleStateChange}
            required
          >
            <Option value="" disabled>
              {t("partnersFormAddressState")}
            </Option>
            {Wilayas.map((element) => (
              <Option
                key={element.wilaya_code}
                value={
                  i18n.language === "ar"
                    ? element.wilaya_name_ar
                    : element.wilaya_name_ascii
                }
              >
                {i18n.language === "ar"
                  ? element.wilaya_name_ar
                  : element.wilaya_name_ascii}
              </Option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Label htmlFor="city">{t("partnersFormAddressCity")}</Label>
          <Select
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            id="city"
            value={address.commune}
            onChange={handleCityChange}
            required
            disabled={!address.wilaya}
          >
            <Option value="" disabled>
              {t("partnersFormAddressCity")}
            </Option>
            {filteredCities.map((element) => (
              <Option
                key={element.id}
                value={
                  i18n.language === "ar"
                    ? element.commune_name
                    : element.commune_name_ascii
                }
              >
                {i18n.language === "ar"
                  ? element.commune_name
                  : element.commune_name_ascii}
              </Option>
            ))}
          </Select>
        </InputWrapper>
      </RowGroup>

      <InputWrapper>
        <Label>{t("partnersFormAddress")}</Label>
        <Input
          type="text"
          placeholder={t(
            "address_line_placeholder",
            "Street Address, Apartment, etc."
          )}
          value={address.addressLine}
          onChange={handleAddressLineChange}
          disabled={!address.commune}
          required
        />
      </InputWrapper>
    </AddressContainer>
  );
};

export default AddressesDropDown;
