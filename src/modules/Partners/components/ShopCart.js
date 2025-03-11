import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Loader from "../../../components/Loader";
import DefautShopImage from "../../../assets/app-logo-minimal.webp";

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

const VerticalContainer = styled(Container)`
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 1rem;
`;

const ShopImage = styled.img`
  width: 4.3rem;
  height: 4.3rem;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 3.5rem;
    height: 3.5rem;
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
    font-size: ${(props) => props.theme.fontlg};
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
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const ShopCart = ({ shop, imageData, className }) => {
  const { i18n } = useTranslation();
  const [imageSrc, setImageSrc] = useState(DefautShopImage);

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

const VerticalShopCart = ({ shop, imageData, className }) => {
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
      }
    };

    if (imageData && imageData.buffer) {
      loadImage();
    }
  }, [imageData]);

  return (
    <VerticalContainer isArabic={i18n.language === "ar"} className={className}>
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
    </VerticalContainer>
  );
};

export { ShopCart, VerticalShopCart };
