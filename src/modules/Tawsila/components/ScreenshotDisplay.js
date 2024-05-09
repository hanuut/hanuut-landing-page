import React from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    max-height: 90vh;
  }
`;

const Column = styled.div`
  max-height: 80vh;
  width: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ReversedColumn = styled.div`
  max-height: 80vh;
  width: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    align-items: center;
    justify-content: center;
    max-height: 50vh;
    display: none;
    max-height: 0;
    width: 0;
  }
`;

const scrollAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-400%); }
  100% { transform: translateY(0); }
`;

const scrollAnimationReverse = keyframes`
0% { transform: translateY(-400%); }
50% { transform: translateY(0); }
100% { transform: translateY(-400%); }
`;
const Screenshot = styled.img`
  width: 100%;
  animation: ${({ reverse }) =>
      reverse ? scrollAnimationReverse : scrollAnimation}
    60s linear infinite;
  @media (max-width: 768px) {
  }
`;

const ScreenshotDisplay = ({ images }) => {
  return (
    <Container>
      <Column>
        {images.map((screenshot, index) => (
          <Screenshot
            key={index}
            src={screenshot}
            alt={`Screenshot ${index + 1}`}
          />
        ))}
      </Column>
      <ReversedColumn>
        {images.map((screenshot, index) => (
          <Screenshot
            reverse
            key={index}
            src={screenshot}
            alt={`Screenshot ${index + 1}`}
          />
        ))}
      </ReversedColumn>
    </Container>
  );
};

export default ScreenshotDisplay;
