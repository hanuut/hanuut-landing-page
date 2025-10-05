// src/components/AddressesDropDown.js

import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Cities, Wilayas } from "../data";
import { useTranslation } from "react-i18next";

// Use a column layout for simplicity and flexibility
const AddressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem; // Spacing between each input field
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  font-size: ${(props) => props.theme.fontlg};
  background-color: rgba(${(props) => props.theme.bodyRgba}, 0.7);
  border: 1px solid #ccc;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.target === "tawsila"
        ? props.theme.secondaryColor
        : props.theme.primaryColor};
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

// A new styled input for the address line
const Input = styled.input`
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    font-size: ${props => props.theme.fontlg};
    background-color: rgba(${props => props.theme.bodyRgba}, 0.7);
    border: 1px solid #ccc;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.primaryColor};
    }

    @media (max-width: 768px) {
        font-size: ${props => props.theme.fontmd};
    }
`;


const Option = styled.option`
  font-size: ${(props) => props.theme.fontlg};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const AddressesDropDown = ({ target, onChooseAddress }) => {
  const { t, i18n } = useTranslation();
  
  // Static data
  const [cities] = useState(Cities);
  const [states] = useState(Wilayas);

  // Component's internal state for the full address object
  const [address, setAddress] = useState({
    wilaya: "",
    commune: "",
    addressLine: "",
  });

  const [filteredCities, setFilteredCities] = useState([]);

  // Use useEffect to notify the parent component whenever the address object changes
  useEffect(() => {
    onChooseAddress(address);
  }, [address, onChooseAddress]);

  const handleStateChange = (event) => {
    const newWilaya = event.target.value;
    
    // Update local state
    setAddress({ wilaya: newWilaya, commune: "", addressLine: "" });

    // Filter cities based on the new wilaya
    const tempCities = cities
      .filter(city => 
        i18n.language === "ar" 
        ? city.wilaya_name === newWilaya 
        : city.wilaya_name_ascii === newWilaya
      )
      .sort((a, b) => a.commune_name_ascii.localeCompare(b.commune_name_ascii));
    
    setFilteredCities(tempCities);
  };

  const handleCityChange = (event) => {
    const newCommune = event.target.value;
    setAddress(prev => ({ ...prev, commune: newCommune }));
  };

  const handleAddressLineChange = (event) => {
    const newAddressLine = event.target.value;
    setAddress(prev => ({ ...prev, addressLine: newAddressLine }));
  };

  return (
    <AddressContainer>
      <InputWrapper>
        <Label htmlFor="address">{t("partnersFormAddress")}</Label>
        <Select id="state" value={address.wilaya} onChange={handleStateChange} required target={target}>
          <Option value="" disabled>{t("partnersFormAddressState")}</Option>
          {states.map((element) => (
            <Option key={element.wilaya_code} value={i18n.language === "ar" ? element.wilaya_name_ar : element.wilaya_name_ascii}>
              {i18n.language === "ar" ? element.wilaya_name_ar : element.wilaya_name_ascii}
            </Option>
          ))}
        </Select>
      </InputWrapper>

      <InputWrapper>
        <Select id="city" value={address.commune} onChange={handleCityChange} required target={target} disabled={!address.wilaya}>
          <Option value="" disabled>{t("partnersFormAddressCity")}</Option>
          {filteredCities.map((element) => (
            <Option key={element.id} value={i18n.language === "ar" ? element.commune_name : element.commune_name_ascii}>
              {i18n.language === "ar" ? element.commune_name : element.commune_name_ascii}
            </Option>
          ))}
        </Select>
      </InputWrapper>

      <InputWrapper>
         <Input 
            type="text"
            placeholder={t('address_line_placeholder', 'Street Address, Apartment, etc.')}
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