import React, { useState } from "react";
import { styled } from "styled-components";
import { Cities, Wilayas } from "../data";
import { useTranslation } from "react-i18next";

const AddressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  position: relative;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

const InputWrapper = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin-bottom: 1Opx;
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Select = styled.select`
padding: 10px;
border-radius: 5px;
font-size: ${(props) => props.theme.fontxl};
  background-color: rgba(${(props) => props.theme.bodyRgba}, 0.7);
  font-size: ${(props) => props.theme.fontlg};
  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.target === "tawsila"
        ? props.theme.secondaryColor
        : props.theme.primaryColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Option = styled.option`
  font-size: ${(props) => props.theme.fontlg};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Label = styled.label`
  margin: 0.5rem 0;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;
const AddressesDropDown = ({ target, onChooseAddress }) => {
  const { t, i18n } = useTranslation();
  const [cities] = useState(Cities);
  const [states] = useState(Wilayas);
  const [filteredCities, setFilteredCities] = useState([]);
  const [choosedState, setChoosedState] = useState("");
  const [choosedCity, setChoosedCity] = useState("");

  const handleChoosedState = (event) => {
    setChoosedState(event.target.value);
    setChoosedCity("");
    let tempCities = [];
    if (i18n.language === "ar") {
      cities.forEach((city) => {
        if (city.wilaya_name === event.target.value) tempCities.push(city);
      });
    }
    cities.forEach((city) => {
      if (city.wilaya_name_ascii === event.target.value) tempCities.push(city);
    });

    const sortedArray = tempCities.sort((a, b) => {
      if (a.commune_name_ascii < b.commune_name_ascii) {
        return -1;
      }
      if (a.commune_name_ascii > b.commune_name_ascii) {
        return 1;
      }
      return 0;
    });

    setFilteredCities(sortedArray);
    onChooseAddress({ wilaya: event.target.value, commune: choosedCity });
  };

  const handleChoosedCity = (event) => {
    setChoosedCity(event.target.value);
    onChooseAddress({ wilaya: choosedState, commune: event.target.value });
  };

  return (
    <AddressContainer>
      <InputWrapper>
        <Label htmlFor="address">{t("partnersFormAddress")}</Label>
        <Select
          id="state"
          value=""
          onChange={handleChoosedState}
          required
          target={target}
        >
          <Option value="" disabled>
            {choosedState === "" ? t("partnersFormAddressState") : choosedState}
          </Option>

          {states.map((element) => (
            <Option
              key={element.wilaya_code}
              value={
                i18n.language === "ar"
                  ? element.wilaya_name_ar
                  : element.wilaya_name_ascii
              }
              className="customOption"
            >
              {i18n.language === "ar"
                ? element.wilaya_name_ar
                : element.wilaya_name_ascii}
            </Option>
          ))}
        </Select>
      </InputWrapper>

      <InputWrapper>
        <Select
          id="city"
          value=""
          onChange={handleChoosedCity}
          required
          target={target}
        >
          <Option value="" disabled>
            {choosedCity === "" ? t("partnersFormAddressCity") : choosedCity}
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
    </AddressContainer>
  );
};

export default AddressesDropDown;
