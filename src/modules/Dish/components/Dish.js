import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  margin-bottom: 8px;
`;

const Name = styled.h5`
  margin-bottom: 8px;
`;

const Ingredients = styled.p`
  margin-bottom: 8px;
`;

const Price = styled.p`
  font-weight: bold;
`;

const Dish = ({ dish, imageData }) => {
  const { name, ingredients, sellingPrice } = dish;
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const bufferData = imageData.buffer.data;
    const uint8Array = new Uint8Array(bufferData);
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);
    setImageSrc(imageUrl);
  }, [dish]);
  return (
    <Card>
      <Image src={imageSrc} alt="" />
      <Name>{name}</Name>
      <Ingredients>{ingredients}</Ingredients>
      <Price>Price: ${sellingPrice}</Price>
    </Card>
  );
};

export default Dish;
