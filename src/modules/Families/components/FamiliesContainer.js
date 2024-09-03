import React, { useState } from "react";
import { fetchCategoriesByFamilyId } from "../../Categories/state/reducers";

import { useDispatch } from "react-redux";
import styled from "styled-components";

import Family from "./Family";

const Section = styled.div`
  margin-top: 1rem;

  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Families = styled.div`
  max-width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap; /* Change flex-wrap to nowrap */
  gap: 1em;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.5em;
  }
`;

const FamiliesContainer = ({
  families,
  selectedFamily,
  setSelectedFamily,
  loadedFamilies,
  setLoadedFamilies,
}) => {
  const dispatch = useDispatch();

  const handleFamilyClick = async (familyId) => {
    setSelectedFamily(familyId);
    if (!loadedFamilies.includes(familyId)) {
      dispatch(fetchCategoriesByFamilyId(familyId));
      setLoadedFamilies((prevLoadedClasses) => [
        ...prevLoadedClasses,
        familyId,
      ]);
    }
  };

  return (
    <Section>
      <Families>
        {families.map((family) => (
          <Family
            key={family.family.id}
            selectedFamily={selectedFamily}
            onFamilyClick={handleFamilyClick}
            family={family.family}
          />
        ))}
      </Families>
    </Section>
  );
};

export default FamiliesContainer;
