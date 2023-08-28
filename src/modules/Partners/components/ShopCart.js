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
  @media (max-width: 768px) {
    width: 90%;
    min-height: 100%;
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  &.headingShopCart {
    width: 80%;
    background-color: ${(props) => props.theme.body};
    @media (max-width: 768px) {
      width: 90%;
      min-height: 100%;
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }
`;

const ShopIcon = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: ${(props) => props.theme.defaultRadius};
  object-fit: cover;
  @media (max-width: 768px) {
    width: auto;
  }
`;

const ShopInfo = styled.div`
  height: 50%;
  width: 72%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const ShopHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const ShopName = styled.h3`
  font-family: "Tajawal", sans-serif;
`;
const Availability = styled.h4`
  padding: 7px 20px;
  color: ${(props) => props.theme.body};
  background-color: ${(props) =>
    props.isOpen ? props.theme.primaryColor : "red"};
  border-radius: 20px;
  line-height: 1;
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
`;
const ClosingTime = styled.h5`
  padding: 2px 10px;
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
          {shop.isOpen ? (
            <Availability isOpen={shop.isOpen}>Open</Availability>
          ) : (
            <Availability isOpen={shop.isOpen}>Closed</Availability>
          )}
        </ShopHeader>
        <ShopBody>
          <ShopDesc>{shop.description}</ShopDesc>
          <ClosingTime>till {shop.closingTime}</ClosingTime>
        </ShopBody>
      </ShopInfo>
    </Container>
  );
};

export default ShopCart;
