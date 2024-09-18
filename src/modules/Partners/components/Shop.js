import React, { useEffect, useState } from "react";
import { ShopCart } from "./ShopCart";
import Loader from "../../../components/Loader";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.png";
import { useTranslation } from "react-i18next";

import ClassesContainer from "../../Classes/components/ClassesContainer";
import { useSelector } from "react-redux";
import { selectFamilies } from "../../Families/state/reducers";
import FamiliesContainer from "../../Families/components/FamiliesContainer";
import { selectCategories } from "../../Categories/state/reducers";
import CategoriesContainerForProducts from "../../Categories/components/CategoriesContainerForProducts";

const ShopContainer = styled.div`
  width: 80%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.smallPadding};
    width: 85%;
  }
`;
const UpperBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;
const OrderAndDownload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-top: 1rem;
    align-items: flex-start;
  }
`;
const Title = styled.p`
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const MenuTitle = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.orangeColor};
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const LowerBox = styled.div`
  margin-top: 1rem;

  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 60vh;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Shop = ({ selectedShop, selectedShopImage }) => {
  const { t, i18n } = useTranslation();
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";

  const { families, loading: loadingFamilies } = useSelector(selectFamilies);
  const { categories, loading: loadingCategories } =
    useSelector(selectCategories);

  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // State for tracking loaded items
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [loadedFamilies, setLoadedFamilies] = useState([]);
  const [loadedClasses, setLoadedClasses] = useState([]);

  const filterAvailableClasses = (classes, hiddenClasses) => {
    const validHiddenClasses = Array.isArray(hiddenClasses)
      ? hiddenClasses
      : [];
    return classes
      ? classes.filter((shopClass) => !validHiddenClasses.includes(shopClass))
      : [];
  };

  const filterAvailableFamilies = (families) => {
    return families.length > 0
      ? families.filter(
          (family) =>
            family.classId === selectedClass && family.family.isHidden !== true
        )
      : [];
  };

  const filterAvailableCategories = (categories) => {
    return categories.length > 0
      ? categories.filter(
          (category) =>
            category.familyId === selectedFamily && category.isHidden !== true
        )
      : [];
  };

  useEffect(() => {
    if (selectedShop && selectedShop.classes) {
      const availableClasses = filterAvailableClasses(
        selectedShop.classes,
        selectedShop.hiddenClasses
      );
      setAvailableClasses(availableClasses);
    }
  }, [selectedShop]);

  useEffect(() => {
    setAvailableFamilies(filterAvailableFamilies(families));
  }, [selectedClass, families]);

  useEffect(() => {
    setSelectedCategory("");
    setAvailableCategories(filterAvailableCategories(categories));
  }, [selectedFamily, categories]);

  useEffect(() => {
    setSelectedFamily("");
    setAvailableCategories([]);
  }, [selectedClass]);

  return (
    <ShopContainer isArabic={i18n.language === "ar"}>
      <UpperBox>
        {selectedShop && selectedShopImage ? (
          <ShopCart
            className="headingShopCart"
            key={selectedShop.id}
            shop={selectedShop}
            imageData={selectedShopImage}
          />
        ) : (
          <Loader />
        )}
        <OrderAndDownload>
          <Title>{t("toOrder")}</Title>
          <Link href={link}>
            <ButtonWithIcon
              image={Playstore}
              backgroundColor="#000000"
              text1={t("getItOn")}
              text2={t("googlePlay")}
            />
          </Link>
        </OrderAndDownload>
      </UpperBox>
      <MenuTitle>{t("productsListTitle")}</MenuTitle>
      <LowerBox>
        {selectedShop ? (
          <>
            {availableClasses.length > 0 ? (
              <ClassesContainer
                availableClasses={availableClasses}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                loadedClasses={loadedClasses} // Pass loadedClasses state
                setLoadedClasses={setLoadedClasses} // Pass setter for loadedClasses
              />
            ) : (
              <Loader />
            )}

            {loadingFamilies ? (
              <Loader />
            ) : availableFamilies.length > 0 ? (
              <FamiliesContainer
                families={availableFamilies}
                selectedFamily={selectedFamily}
                setSelectedFamily={setSelectedFamily}
                loadedFamilies={loadedFamilies} // Pass loadedFamilies state
                setLoadedFamilies={setLoadedFamilies} // Pass setter for loadedFamilies
              />
            ) : null}

            {loadingCategories ? (
              <Loader />
            ) : availableCategories.length > 0 ? (
              <CategoriesContainerForProducts
                categories={availableCategories}
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                shopId={selectedShop._id}
                loadedCategories={loadedCategories} // Pass loadedCategories state
                setLoadedCategories={setLoadedCategories} // Pass setter for loadedCategories
              />
            ) : null}
          </>
        ) : (
          <Loader />
        )}
      </LowerBox>
    </ShopContainer>
  );
};

export default Shop;
