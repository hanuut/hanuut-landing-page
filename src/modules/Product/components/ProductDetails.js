import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import { AddToCartButton } from "../../../components/ActionButton";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Cart/state/reducers";
import { fetchImages, selectImages } from "../../Images/state/reducers";
import { useTranslation } from "react-i18next";

const ProductPageContainer = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
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
    align-items: center;
  }
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
  justify-content: flex-start;
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

const ProductDetails = ({ selectedCategory, selectedProduct }) => {
  const { i18n } = useTranslation();
  const { name, brand, rating, specifications, numReviews, availabilities } =
    selectedProduct;

  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(
    availabilities[0]?.color || ""
  );
  const [selectedSizeValue, setSelectedSizeValue] = useState("");
  const [sizes, setSizes] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const { images } = useSelector(selectImages);

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
    setSelectedSizeValue(sizePriceOptions[0]?.split(" - ")[0] || "");
    setProductImages(availabilities.map((item) => item.imageId));
  }, [selectedColor, availabilities]);

  useEffect(() => {
    const loadImages = async () => {
      const newImagesToFetch = productImages.filter(
        (imageId) => !images.some((img) => img.imageId === imageId)
      );
      dispatch(fetchImages(newImagesToFetch));
    };

    if (productImages.length > 0) {
      loadImages();
    }
  }, [productImages]);

  const getImageUrl = (imageId) => {
    const image = images.find((img) => img.imageId === imageId);
    if (image) {
      const bufferData = image.imageData.buffer.data;
      const uint8Array = new Uint8Array(bufferData);
      const blob = new Blob([uint8Array], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    }
    return "";
  };

  return (
    <ProductPageContainer isArabic={i18n.language === "ar"}>
      <LeftSection>
        <ImageContainer>
          <MainImage
            imageSrc={getImageUrl(
              availabilities.find((item) => item.color === selectedColor)
                ?.imageId
            )}
          />
          <ThumbnailContainer>
            {availabilities.map((item) => (
              <Thumbnail
                key={item.imageId}
                imageSrc={getImageUrl(item.imageId)}
                onClick={() => setSelectedColor(item.color)}
              />
            ))}
          </ThumbnailContainer>
        </ImageContainer>
      </LeftSection>
      <RightSection>
        <ProductInfo>
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
        {/* <AddToCartButton key={selectedProduct._id} onClick={onAddToCartClick}>
          Add to Cart
        </AddToCartButton> */}
      </RightSection>
    </ProductPageContainer>
  );
};

export default ProductDetails;
