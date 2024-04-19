import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LanguagesDropDown from "./LanguagesDropDown";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

const Section = styled.section`
  position: sticky;
  top: 0;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  height: ${(props) => props.theme.navHeight};
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    position: relative;
    height: ${(props) => props.theme.navHeightMobile};
  }
`;

const Navigation = styled.nav`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Menu = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  @media (max-width: 768px) {
    position: absolute;
    top: ${(props) => props.theme.navHeight};
    border-radius: ${(props) => props.theme.smallRadius};
    width: 90%;
    height: calc(100vh - ${(props) => props.theme.navHeight});
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    background-color: ${(props) => props.theme.body};
    transform: ${(props) =>
      props.show ? "translateY(0px)" : "translateY(-150%)"};
    transition: transform 0.5s ease-in-out;
    z-index: 2;
  }
`;

const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  &::after {
    content: " ";
    display: block;
    width: 0%;
    height: 2px;
    border-radius: 2px;
    transition: width 0.5s ease;
    background-color: ${(props) => props.theme.text};
  }
  &:hover::after {
    width: 100%;
  }
  @media (max-width: 768px) {
    margin: 0;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const LanguageMenuItem = styled.li`
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  @media (max-width: 768px) {
    margin: 0;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const HamburgerMenuContainer = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  padding: 2px;
  display: flex; /* Add display: flex */
  align-items: center; /* Add align-items: center */
  justify-content: center; /* Add justify-content: center */
`;

const HamburgerMenu = styled.span`
  width: 1.5rem;
  height: 2px;
  background-color: ${(props) => props.theme.text};
  position: absolute;
  top: 50%; /* Change top: 2.5rem to top: 50% */
  right: ${(props) => (props.isArabic ? "80%" : "0")};
  transform: translate(
    -100%,
    -50%
  ); /* Change transform: translateX(-100%) to transform: translate(-100%, -50%) */
  display: none;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease;
  cursor: pointer;

  @media (max-width: 768px) {
    top: 50%; /* Change top: 2.4rem to top: 50% */
    display: flex;
  }

  &::after,
  &::before {
    content: "  ";
    width: 1.5rem;
    height: 2px;
    background-color: ${(props) => props.theme.text};
    position: absolute;
    transition: transform 0.5s ease;
  }

  &::after {
    top: 0.5rem;
  }

  &::before {
    bottom: 0.5rem;
  }

  &.active {
    transform: translateX(-100%) rotate(180deg);
    height: 0px;
    &::after {
      transform: translateY(-0.65rem) rotate(-45deg);
    }
    &::before {
      transform: translateY(0.5rem) rotate(45deg);
    }
  }
`;
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const handleMenuItemClick = () => {
    setIsActive(false);
  };

  return (
    <Section>
      <Navigation isArabic={i18n.language === "ar"}>
        <Logo className="partnerLogo" />
        <HamburgerMenuContainer onClick={handleClick}>
          <HamburgerMenu
            isArabic={i18n.language === "ar"}
            className={isActive ? "active" : ""}
          />
        </HamburgerMenuContainer>
        <Menu show={isActive} isArabic={i18n.language === "ar"}>
          <MenuItem>
            <Link to="/" onClick={handleMenuItemClick}>
              {t("navHome")}
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/partners" onClick={handleMenuItemClick}>
              {t("navPartners")}
            </Link>
          </MenuItem>
          {/* <MenuItem>
             <Link to="/solutions" onClick={handleMenuItemClick}>
             {t('navSolution')}
            </Link>
          </MenuItem> */}
          {/* <MenuItem>
          <Link to="/contact" onClick={handleMenuItemClick}>
          {t('navContact')}
            </Link>
          </MenuItem> */}
          <MenuItem>
            <Link to="/tawsila" onClick={handleMenuItemClick}>
              {t("navTawsila")}
            </Link>
          </MenuItem>
          <LanguageMenuItem>
            <LanguagesDropDown
              className="languageMenuItem"
              handleChooseLanguage={handleMenuItemClick}
            />
          </LanguageMenuItem>
        </Menu>
      </Navigation>
    </Section>
  );
};

export default Navbar;
