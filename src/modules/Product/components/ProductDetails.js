import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { AddToCartButton } from "../../../components/ActionButton";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Cart/state/reducers";

const ProductPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  background-color: transparent;
  transition: all 0.2s ease;
  backdrop-filter: blur(50px);
  border-radius: 10px;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    border: 1px solid red;
    align-items: center;
  }
`;

const CloseButton = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const LeftSection = styled.div`
  flex: 1;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightSection = styled.div`
  flex: 1;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImage = styled.div`
  width: 100%;
  height: 500px;
  background-color: #e0e0e0;
  background-image: url(${(props) => props.imageSrc});
  background-size: cover;
  background-position: center;
  border-radius: ${(props) => props.theme.defaultRadius};
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Thumbnail = styled.div`
  width: 25%;
  height: 150px;
  background-color: #c0c0c0;
  background-image: url(${(props) => props.imageSrc});
  background-size: cover;
  background-position: center;
  border-radius: ${(props) => props.theme.smallRadius};
  cursor: pointer;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Category = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.secondaryText};
`;

const ProductName = styled.h2`
  font-size: 2rem;
  margin: 0;
  color: ${(props) => props.theme.primaryText};
`;

const Brand = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.secondaryText};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Star = styled.span`
  color: #ffd700;
  font-size: 1.5rem;
`;

const ReviewCount = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.secondaryText};
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorOption = styled.button`
  background-color: ${(props) => props.color};
  border: ${(props) =>
    props.selected ? `2px solid ${props.theme.primary}` : "1px solid #000"};
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.smallRadius};
  cursor: pointer;
`;

const SizePriceContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SizePriceButton = styled.button`
  background-color: #ffffff;
  border: 1px solid #000;
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.smallRadius};
  cursor: pointer;
`;

const Specifications = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const SpecificationItem = styled.li`
  font-size: 1rem;
  color: ${(props) => props.theme.primaryText};
  margin-bottom: 0.5rem;
  span {
    font-weight: bolder;
  }
`;

const ProductDetails = ({
  selectedCategory,
  selectedProduct,
  setSelectedProduct,
}) => {
  const { name, brand, rating, specifications, numReviews, availabilities } =
    selectedProduct;

  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(
    availabilities[0]?.color || ""
  );
  const [selectedSizeValue, setSelectedSizeValue] = useState("");
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const selectedAvailability = availabilities.find(
      (item) => item.color === selectedColor
    );
    const sizePriceOptions = selectedAvailability
      ? selectedAvailability.sizes.map(
          (size) => `${size.size} - $${size.sellingPrice.toFixed(2)}`
        )
      : [];
    setSizes(sizePriceOptions);
    setSelectedSizeValue(sizePriceOptions[0]?.split(" - ")[0] || ""); // Select the first size by default
  }, [selectedColor, availabilities]);

  const onAddToCartClick = () => {
    const selectedAvailability = selectedProduct.availabilities.find(
      (availability) => availability.color === selectedColor
    );

    if (!selectedAvailability) {
      console.error("Selected color is not available.");
      return;
    }

    const selectedSize = selectedAvailability.sizes.find(
      (size) => size.size === selectedSizeValue
    );

    if (!selectedSize) {
      console.error("Selected size is not available.");
      return;
    }

    // Constructing the cart item

    const cartItem = {
      _id: selectedProduct._id,
      name: selectedProduct.name,
      sellingPrice: selectedSize.sellingPrice,
      shopId: selectedProduct.shopId,
      type: "product", // Assuming this is a product
      brand: selectedProduct.brand,
      unit: selectedProduct.unit,
      color: selectedAvailability.color, // Moved from extraData
      size: selectedSize.size, // Moved from extraData
      imageId: selectedAvailability.imageId, // Moved from extraData
    };
    console.log(cartItem);
    dispatch(addToCart(cartItem));
  };

  return (
    <ProductPageContainer>
      <CloseButton onClick={() => setSelectedProduct(null)}>X</CloseButton>
      <LeftSection>
        <ImageContainer>
          <MainImage
            imageSrc={`path/to/your/image/${
              availabilities.find((item) => item.color === selectedColor)
                ?.imageId
            }.jpg`}
          />
          <ThumbnailContainer>
            {availabilities.map((item, index) =>
              item.sizes.map((size, index) => (
                <Thumbnail
                  key={`${item.imageId}-${size.size}-${index}`}
                  imageSrc={`path/to/your/image/${item.imageId}.jpg`}
                  onClick={() => setSelectedColor(item.color)}
                />
              ))
            )}
          </ThumbnailContainer>
        </ImageContainer>
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
                <Star key={i}>★</Star>
              ))}
            <ReviewCount>{`${rating} (${numReviews} Reviews)`}</ReviewCount>
          </Rating>
          <ColorOptions>
            {availabilities.map((item, index) => (
              <ColorOption
                key={index}
                color={item.color}
                selected={item.color === selectedColor}
                onClick={() => setSelectedColor(item.color)}
              >
                {item.color}
              </ColorOption>
            ))}
          </ColorOptions>
          <SizePriceContainer>
            {sizes.map((option, index) => (
              <SizePriceButton
                key={index}
                onClick={() => setSelectedSizeValue(option.split(" - ")[0])}
                selected={option.split(" - ")[0] === selectedSizeValue}
              >
                {option}
              </SizePriceButton>
            ))}
          </SizePriceContainer>
          <Specifications>
            {specifications.map((spec, index) => (
              <SpecificationItem key={index}>
                <span>{spec.name}</span>: {spec.value}
              </SpecificationItem>
            ))}
          </Specifications>
        </ProductInfo>
        <AddToCartButton key={selectedProduct._id} onClick={onAddToCartClick}>
          Add to Cart
        </AddToCartButton>
      </RightSection>
    </ProductPageContainer>
  );
};

export default ProductDetails;
