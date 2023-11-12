import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Loader from "../../../components/Loader";

const Container = styled.div`
  width: 100%;

  border-radius: ${(props) => props.theme.defaultRadius};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  &.headingShopCart {
    width: 33%;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 0;
    @media (max-width: 768px) {
      width: 100%;
      min-height: 100%;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  box-sizing: border-box; /* Add this line to include padding in the width */
`;
const ShopImage = styled.img`
  width: 4.3rem;
  height: 4.3rem;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
  }
`;

const ShopInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

`;

const ShopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ShopName = styled.h3`
  font-family: "Tajawal", sans-serif;
  font-size: ${(props) => props.theme.fontLargest};
  line-height: 0.5;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxl};
  }
`;

const ShopBody = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShopDesc = styled.p`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "Tajawal", sans-serif;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 100;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const ShopCart = ({ shop, imageData, className }) => {
  const { i18n } = useTranslation();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      try {
        const bufferData = imageData.buffer.data;
        const uint8Array = new Uint8Array(bufferData);
        const blob = new Blob([uint8Array], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error loading image:", error);
        // Handle the error, e.g., display a placeholder image or show an error message
      }
    };

    if (imageData && imageData.buffer) {
      loadImage();
    }
  }, [imageData]);

  return (
    <Container isArabic={i18n.language === "ar"} className={className}>
      {imageSrc ? (
        <>
          <ShopImage src={imageSrc} alt="shop image" loading="lazy" />
          <ShopInfo>
            <ShopHeader>
              <ShopName>{shop.name}</ShopName>
            </ShopHeader>
            <ShopBody>
              <ShopDesc>{shop.description}</ShopDesc>
            </ShopBody>
          </ShopInfo>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default ShopCart;
