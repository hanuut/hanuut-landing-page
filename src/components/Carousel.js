import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const CarouselImage = styled.img`
  max-width: 35%;
  border-radius: ${(props) => props.theme.defaultRadius};
  object-fit: cover;
  position: absolute;

  @media (max-width: 768px) {
    max-width: 30%;
  }
`;

const slide = keyframes`
  0% {
    transform: translateX(-5%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const CenterImage = styled(CarouselImage)`
  z-index: 1;
  transform: translateY(0);
  opacity: 1;
  max-width: 43%;
  animation: ${slide} 0.5s ease;
  @media (max-width: 768px) {
    max-width: 34%;
  }
`;

const BackImage = styled(CarouselImage)`
  z-index: 0;
  opacity: 0.75;
  filter: blur(1px) grayscale(15%) saturate(90%);
  animation: ${slide} 0.5s ease;
`;

const LeftImage = styled(BackImage)`
  transform: translate(-12rem, 1.25rem) rotate(-10deg);
  @media (max-width: 1366px) {
    transform: translate(-6rem, 0) rotate(-5deg);
  }
  @media (max-width: 768px) {
    transform: translate(-4rem, 0) rotate(0deg);
  }
`;

const RightImage = styled(BackImage)`
  transform: translate(12rem, 1.25rem) rotate(10deg);

  @media (max-width: 1366px) {
    transform: translate(6rem, 0) rotate(5deg);
  }
  @media (max-width: 768px) {
    transform: translate(4rem, 0) rotate(0deg);
  }
`;

const Carousel = ({ images }) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(images.length - 1);
  const [rightIndex, setRightIndex] = useState(1);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCenterIndex((centerIndex + 1) % images.length);
      setLeftIndex((leftIndex + 1) % images.length);
      setRightIndex((rightIndex + 1) % images.length);
      setAnimationTrigger(animationTrigger + 1); // Increment the state to trigger the animation
    }, 4000);
    return () => clearInterval(intervalID);
  }, [centerIndex, images.length, leftIndex, rightIndex, animationTrigger]); // Add the animationTrigger state to the dependency array of useEffect

  return (
    <CarouselContainer>
      <LeftImage src={images[leftIndex]} alt="carousel-image" loading="lazy" />
      <CenterImage
        key={centerIndex}
        src={images[centerIndex]}
        alt="carousel-image"
        loading="lazy"
      />{" "}
      {/* Add the key prop */}
      <RightImage
        src={images[rightIndex]}
        alt="carousel-image"
        loading="lazy"
      />
    </CarouselContainer>
  );
};

export default Carousel;
