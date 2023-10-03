import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
const Card = styled.div`
  width: 45%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// const Image = styled.img`
//   width: 100%;
//   max-width: 200px;
//   height: auto;
//   margin-bottom: 8px;
// `;

const Body = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;
const Name = styled.h5`
  font-family: "Tajawal", sans-serif;
  margin-bottom: 8px;
`;
const Ingredients = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  max-width: 75%;
  flex-wrap: wrap;
`;
const Ingredient = styled.h6`
  font-family: "Tajawal", sans-serif;
  font-weight: 100;
  min-width: fit-content;
`;
const PriceContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isArabic ? "row-reverse" : "row")};
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: bold;
`;
const Price = styled.div`
  font-weight: bold;
`;

const Dish = ({ dish, imageData }) => {
  const { i18n } = useTranslation();
  const { name, sellingPrice } = dish;
  const { ingredients } = dish;
  const filteredIngredients = ingredients.filter((item) => item.trim() !== "");
  // const [imageSrc, setImageSrc] = useState("");
  // useEffect(() => {
  //   const bufferData = imageData.buffer.data;
  //   const uint8Array = new Uint8Array(bufferData);
  //   const blob = new Blob([uint8Array], { type: "image/jpeg" });
  //   const imageUrl = URL.createObjectURL(blob);
  //   setImageSrc(imageUrl);
  // }, [dish]);

  return (
    // <Card>
    //   {/* <Image src={imageSrc} alt="" /> */}
    //   <Name>{name}</Name>
    //   <Ingredients>
    //     {" "}
    //     {ingredients.map((ingredient, index) => (
    //       <Ingredient key={index}> {ingredient} </Ingredient>
    //     ))}
    //   </Ingredients>

    //   <Price>Price: DZD {sellingPrice}</Price>
    // </Card>
    <Card isArabic={i18n.language === "ar"}>
      <Name>{name}</Name>
      <Body>
        {filteredIngredients.length > 0 ? (
          <Ingredients>
            {filteredIngredients.map((ingredient, index) => (
              <Ingredient key={index}>
                {ingredient}
                {index !== filteredIngredients.length - 1 ? " - " : ""}
              </Ingredient>
            ))}
          </Ingredients>
        ) : null}

        <PriceContainer isArabic={i18n.language === "ar"}>
          {t("dzd")}
          <Price>{sellingPrice}</Price>
        </PriceContainer>
      </Body>
    </Card>
  );
};

export default Dish;
