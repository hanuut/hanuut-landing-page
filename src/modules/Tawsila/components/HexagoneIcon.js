import React from "react";
import styled from "styled-components";

const IconContainer = styled.div`
  position: relative;
  height: 100%;
`;

const Icon = styled.img`
  height: 100%;

`;

const Content = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  z-index: 2;
  color: ${(props) => props.theme.body};
  font-weight: 600;
  font-size: ${(props) => props.theme.fontxxl};
`;
const HexagoneIcon = ({ img, content }) => {
  return (
    <IconContainer>
      <Icon Icont src={img}></Icon>
      <Content>{content}</Content>
    </IconContainer>
  );
};

export default HexagoneIcon;
