import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchClasses, selectClasses } from "../state/reducers";
import Loader from "../../../components/Loader";
import ShopClass from "./ShopClass";
import { fetchFamilies } from "../../Families/state/reducers";
const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Classes = styled.div`
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
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.5em;
  }
`;

const ClassesContainer = ({
  availableClasses,
  selectedClass,
  setSelectedClass,
  loadedClasses,
  setLoadedClasses,
}) => {
  const dispatch = useDispatch();
  const { classes, loading: classesLoading } = useSelector(selectClasses);

  useEffect(() => {
    dispatch(fetchClasses(availableClasses));
  }, [dispatch, availableClasses]);

  const handleClassClick = async (classId) => {
    setSelectedClass(classId);
    if (!loadedClasses.includes(classId)) {
      dispatch(fetchFamilies(classId));
      setLoadedClasses((prevLoadedClasses) => [...prevLoadedClasses, classId]);
    }
  };

  if (classesLoading || !availableClasses)
    return (
      <Section>
        <Loader />
      </Section>
    );

  return (
    <Section>
      <Classes>
        {classes.map((shopClass) => (
          <ShopClass
            key={shopClass.id}
            selectedClass={selectedClass}
            onClassClick={handleClassClick}
            shopClass={shopClass}
          />
        ))}
      </Classes>
    </Section>
  );
};

export default ClassesContainer;
