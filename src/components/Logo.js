import React from "react";
import styled from "styled-components";

const LogoImg = styled.img`
  height: 30px;
  width: auto; 
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    height: 25px; 
  }
`;

// Removed the <Link> wrapper since it is already wrapped in Navbar.js
const Logo = ({ image }) => {
  return <LogoImg src={image} alt="Hanuut App Logo" />;
};

export default Logo;