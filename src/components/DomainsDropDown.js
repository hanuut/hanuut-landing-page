import React, { useState } from "react";
import { Domains } from "../data";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ArrowDown from "../assets/arrowDown.svg";

const Container = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  z-index: 99;
  background-color: ${(props) => props.theme.body};
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.smallPadding};
  display: block;
  margin-top: 0.5rem;
  width: 100%;
  max-height: 30vh;
  overflow: scroll;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  padding: ${(props) => props.theme.smallPadding};
  &:hover {
    background-color: rgba(${(props) => props.theme.textRgba}, 0.06);
    border-radius: ${(props) => props.theme.defaultRadius};
  }
`;

const MenuItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  cursor: pointer;
  background-color: transparent;
  padding: ${(props) => props.theme.smallPadding};
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  width: fit-content;
`;

const Icon = styled.img`
  height: 1.2rem;
  width: 1.2rem;
  @media (max-width: 768px) {
    height: 1rem;
    width: 1rem;
  }
`;

const InputContainer = styled.div`
  margin-top: 0.5rem;
`;

const Input = styled.input`
  padding: ${(props) => props.theme.smallPadding};
  width: 70%;
  border-radius: ${(props) => props.theme.smallRadius};
  border: 1px solid rgba(${(props) => props.theme.primaryColorRgba}, 0.5);
  font-size: ${(props) => props.theme.fontxl};
  background-color: transparent;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const DomainsDropDown = ({ onChooseDomain }) => {
  const [domains] = useState(Domains);
  const { t, i18n } = useTranslation();
  const [choosedDomain, setChoosedDomain] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const handleChooseDomain = (value) => {
    setChoosedDomain(value);
    setIsOpen(false);
    setIsOtherSelected(false);
    onChooseDomain(value);
  };

  const handleOther = () => {
    setIsOtherSelected(true);
    setIsOpen(false);
  };

  const handleOtherDomainChange = (event) => {
    onChooseDomain(event.target.value);
  };

  return (
    <Container>
      <MenuItemHeader onClick={() => setIsOpen(!isOpen)}>
        <h3>
          {isOtherSelected
            ? t("partnersFormOther")
            : choosedDomain || t("partnerInputTextForm")}
        </h3>
        <Icon src={ArrowDown} alt="+" />
      </MenuItemHeader>
      {isOpen && (
        <Menu>
          {domains.map((domain) => (
            <MenuItem
              key={domain.domain_code}
              onClick={() =>
                handleChooseDomain(
                  i18n.language === "ar"
                    ? domain.domain_name_ar
                    : i18n.language === "fr"
                    ? domain.domain_name_fr
                    : domain.domain_name_en
                )
              }
            >
              {i18n.language === "ar"
                ? domain.domain_name_ar
                : i18n.language === "fr"
                ? domain.domain_name_fr
                : domain.domain_name_en}
            </MenuItem>
          ))}
          <MenuItem key={"Other"} onClick={handleOther}>
            {t("partnersFormOther")}
          </MenuItem>
        </Menu>
      )}
      {isOtherSelected && (
        <InputContainer>
          <Input
            type="text"
            placeholder={t("partnerInputTextFormOther")}
            onChange={(e) => handleOtherDomainChange(e)}
          />
        </InputContainer>
      )}
    </Container>
  );
};

export default DomainsDropDown;
