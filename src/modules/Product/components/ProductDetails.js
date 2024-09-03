import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";

const ProductPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  max-height: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CloseButton = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 20px;
  max-height: 90%;
  overflow-y: scroll;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightSection = styled.div`
  flex: 1;
  padding: 20px;
`;

const MainImage = styled.div`
  width: 100%;
  height: 500px; /* Adjust height based on your needs */
  background-color: #c0c0c0; /* Gray to represent image placeholder */
  margin-bottom: 20px;
  background-image: url(${(props) => props.imageSrc});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Thumbnail = styled.div`
  width: 23%;
  height: 100px; /* Adjust height based on your needs */
  background-color: #c0c0c0; /* Gray to represent image placeholder */
  background-image: url(${(props) => props.imageSrc});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
`;

const ProductInfo = styled.div`
  color: #000;
`;

const Category = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

const ProductName = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const Brand = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Star = styled.span`
  color: #ffd700; /* Gold color for stars */
  font-size: 24px;
`;

const ReviewCount = styled.div`
  margin-left: 10px;
  font-size: 16px;
  color: #888;
`;

const ColorOptions = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const ColorOption = styled.button`
  background-color: ${(props) => props.color || "#ffffff"};
  border: 1px solid #000;
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
`;

const SizePriceContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const SizePriceButton = styled.button`
  background-color: #ffffff; /* White background for button */
  border: 1px solid #000;
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
`;

const Specifications = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SpecificationItem = styled.li`
  font-size: 16px;
  margin-bottom: 10px;
`;

const ProductDetails = ({
  selectedCategory,
  selectedProduct,
  setSelectedProduct,
}) => {
  const {
    name,
    brand,
    rating,
    shortDescription,
    longDescription,
    unit,
    availabilities,
    specifications,
    numReviews,
  } = selectedProduct;

  const [sizes, setSizes] = useState([]);

  const mainImage = availabilities.length > 0 ? availabilities[0].imageId : "";

  // Get color options from availabilities
  const colorOptions = availabilities.map((item) => item.color);

  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const onCloseClick = () => {
    setSelectedProduct(null);
  };
  const onColorOptionClick = (e, color) => {
    e.preventDefault();
    setSelectedColor(color);
  };

  useEffect(() => {
    console.log(selectedColor);

    // Filter availabilities to find the one that matches the selected color
    const selectedAvailability = availabilities.find(
      (item) => item.color === selectedColor
    );

    // If the selected color exists in the availabilities, extract the sizes
    const sizePriceOptions = selectedAvailability
      ? selectedAvailability.sizes.map(
          (size) => `${size.size} - $${size.sellingPrice.toFixed(2)}`
        )
      : [];

    setSizes(sizePriceOptions);
  }, [selectedColor, availabilities]);

  return (
    <ProductPageContainer>
      <CloseButton onClick={onCloseClick}> X </CloseButton>
      <LeftSection>
        <MainImage imageSrc={`path/to/your/image/${mainImage}.jpg`} />
        <ThumbnailContainer>
          {availabilities.flatMap((item) =>
            item.sizes.map((size, index) => (
              <Thumbnail
                key={`${item.imageId}-${size.size}-${index}`}
                imageSrc={`path/to/your/image/${item.imageId}.jpg`}
              />
            ))
          )}
        </ThumbnailContainer>
      </LeftSection>
      <RightSection>
        <ProductInfo>
          <Category>{selectedCategory}</Category>
          <ProductName>{name}</ProductName>
          <Brand>{brand}</Brand>
          <Rating>
            {Array(Math.round(rating))
              .fill()
              .map((_, i) => (
                <Star key={`star-${i}`}>★</Star>
              ))}
            {Array(5 - Math.round(rating))
              .fill()
              .map((_, i) => (
                <Star key={`star-empty-${i}`} style={{ color: "#CCC" }}>
                  ★
                </Star>
              ))}
            <ReviewCount>{`${Math.round(
              rating
            )} (${numReviews} Reviews)`}</ReviewCount>
          </Rating>
          <ColorOptions>
            {colorOptions.map((color, index) => (
              <ColorOption
                onClick={(e) => onColorOptionClick(e, color)}
                key={`${color}-${index}`}
                color={color === selectedColor && "#CCC"}
              >
                {color}
              </ColorOption>
            ))}
          </ColorOptions>
          <SizePriceContainer>
            {sizes.map((option, index) => (
              <SizePriceButton key={`${option}-${index}`}>
                {option}
              </SizePriceButton>
            ))}
          </SizePriceContainer>
          <Specifications>
            {specifications.map((spec, index) => (
              <SpecificationItem key={`${spec.name}-${index}`}>
                {spec.name}: {spec.value}
              </SpecificationItem>
            ))}
          </Specifications>
        </ProductInfo>
      </RightSection>
    </ProductPageContainer>
  );
};

export default ProductDetails;
