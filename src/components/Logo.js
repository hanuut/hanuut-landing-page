// src/components/Logo.js

import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// We are replacing the styled h1 with a styled img for the logo.
const LogoImg = styled.img`
  height: 45px;
  width: auto; // 'auto' maintains the aspect ratio.
  
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    height: 40px; // A slightly smaller logo for mobile screens.
  }
`;

// The Logo component no longer needs useTranslation, as it just displays an image.
// It now accepts an 'image' prop, which will be passed down from the Navbar.
const Logo = ({ image }) => {
  return (
    <Link to="/">
      <LogoImg src={image} alt="Hanuut App Logo" />
    </Link>
  );
};

export default Logo;