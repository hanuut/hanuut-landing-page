import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";

const Container = styled.div`
  width: 100%;
  height: 7rem;
  padding: 2px 5px;
  border: 2px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  &.headingShopCart {
    width: 33%;
    height: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    border: none;
    border-radius: 0;
    @media (max-width: 768px) {
      width: 90%;
      min-height: 100%;

      align-items: flex-start;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    gap: 0.5rem;
    padding: 0px 10px;
  }
`;

const ShopIcon = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: ${(props) => props.theme.defaultRadius};
  object-fit: cover;
  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
  }
`;

const ShopInfo = styled.div`
  height: 50%;
  width: 72%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ShopHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const ShopName = styled.h2`
  font-family: "Tajawal", sans-serif;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const ShopBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;
const ShopDesc = styled.h5`
  width: 70%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-family: "Tajawal", sans-serif;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
    font-weight: 100;
  }
`;

const ShopCart = ({ shop, imageData, className, isImageLoading }) => {
  const { i18n } = useTranslation();
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const bufferData = imageData.buffer.data;
    const uint8Array = new Uint8Array(bufferData);
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);
    setImageSrc(imageUrl);
  }, [imageData]);

  return (
    <Container isArabic={i18n.language === "ar"} className={className}>
      <ShopIcon src={imageSrc} alt="shop image" />
      <ShopInfo>
        <ShopHeader>
          <ShopName>{shop.name}</ShopName>
        </ShopHeader>
        <ShopBody>
          <ShopDesc>{shop.description}</ShopDesc>
        </ShopBody>
      </ShopInfo>
    </Container>
  );
};

export default ShopCart;
