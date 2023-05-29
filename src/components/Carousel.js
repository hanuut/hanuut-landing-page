import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";



const CarouselContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const CarouselImage = styled.img`
  max-width: 30%;
  border-radius: 10px;
  object-fit: cover;
  position: absolute;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
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
  max-width: 42%;
  animation: ${slide} 0.5s ease;
`;

const BackImage = styled(CarouselImage)`
  z-index: 0;
  opacity: 0.75;
  filter:  blur(1px) grayscale(15%) saturate(90%);
  animation: ${slide} 0.5s ease;
`;

const LeftImage = styled(BackImage)`
  transform: translate(-10.5rem, 1.25rem) rotate(-15deg);
`;

const RightImage = styled(BackImage)`
  transform: translate(10.5rem, 1.25rem) rotate(15deg);
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
      <LeftImage src={images[leftIndex]} />
      <CenterImage key={centerIndex} src={images[centerIndex]} /> {/* Add the key prop */}
      <RightImage src={images[rightIndex]} />
    </CarouselContainer>
  );
};

export default Carousel;