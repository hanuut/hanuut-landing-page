import React from "react";
import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg) scale(0.8);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  height: 60px;
  @media (max-width: 768px) {
   gap: 0.2rem;
  }
`;

const LoaderDot = styled.div`
  width: 8px;
  height: 12px;
  border-radius: 45%;
  background-color: ${(props) => props.theme.primaryColor};;
  animation: ${spinAnimation} 1.5s linear infinite;
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
  @media (max-width: 768px) {
    width: 6px;
    height: 9px;
  }
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <LoaderDot />
      <LoaderDot />
      <LoaderDot />
    </LoaderWrapper>
  );
};

export default Loader;