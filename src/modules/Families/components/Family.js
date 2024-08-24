import React from "react";
import styled from "styled-components";

const Section = styled.button`
  min-width: fit-content;
  align-self: center;
  background-color: ${(props) =>
    props.selected ? props.theme.primaryColor : "rgba(255, 255, 255, 0.15);"};
  border: none;
  padding: ${(props) => props.theme.actionButtonPaddingMobile};
  font-size: ${(props) => props.theme.fontxxl};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.smallPadding};
    border-radius: ${(props) => props.theme.smallRadius};
  }
`;

const FamilyName = styled.h5`
  text-align: center;
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;
  font-size: ${(props) =>
    props.selected ? props.theme.fontmd : props.theme.fontsm};
  color: ${(props) =>
    props.selected ? props.theme.body : props.theme.primaryColor};

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const Family = ({ family, onFamilyClick, selectedFamily }) => {
  const handleHeadingClick = () => {
    onFamilyClick(family.id);
  };

  return (
    <Section
      onClick={handleHeadingClick}
      selected={selectedFamily === family.id}
    >
      <FamilyName selected={selectedFamily === family.id}>
        {family.name}
      </FamilyName>
    </Section>
  );
};

export default Family;
