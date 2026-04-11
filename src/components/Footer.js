import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaFacebook,
  FaInstagram,
  FaGooglePlay,
  FaWindows,
  FaEnvelope,
  FaPhoneAlt,
  FaTruck,
  FaRoute,
  FaCar, // For Abridh
  FaQuestionCircle, // For Support
} from "react-icons/fa";

import logoAr from "../assets/logo_ar.webp";
import logoEn from "../assets/logo_en.webp";

// --- STYLED COMPONENTS (No changes here) ---
const FooterWrapper = styled.footer`
  background-color: #09090b;
  color: #f4f4f5;
  padding: 4rem 0 2rem 0;
  width: 100%;
  border-top: 1px solid #27272a;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  font-family: "Tajawal", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// --- GRID FIX: Update to 5 columns for the new Tawsila section ---
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr; /* 5 columns */
  gap: 2.5rem;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;
const LogoImage = styled.img`
  height: 40px;
  width: auto;
  margin-bottom: 0.5rem;
`;
const ColumnTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;
const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

// --- RTL/LTR HOVER FIX ---
const linkStyles = `
  color: #A1A1AA; text-decoration: none; font-size: 0.95rem; transition: all 0.2s ease;
  display: flex; align-items: center; gap: 8px;
  &:hover { 
    color: #F07A48; 
    transform: translateX(${props => props.isArabic ? '-5px' : '5px'});
  }
`;
const StyledLink = styled(Link)`
  ${linkStyles}
`;
const ExternalLink = styled.a`
  ${linkStyles}
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a1a1aa;
  font-size: 0.9rem;
  svg {
    color: #f07a48;
  }
`;
const SocialRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;
const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  &:hover {
    background-color: #f07a48;
    transform: translateY(-3px);
  }
`;
const BottomSection = styled.div`
  border-top: 1px solid #27272a;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;
const CopyrightText = styled.p`
  color: #71717a;
  font-size: 0.85rem;
  margin: 0;
`;

// --- UPDATED FOOTER COMPONENT ---

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const currentLogo = isArabic ? logoAr : logoEn;

  const links = {
    customerApp: process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK || "#",
    abridhApp: process.env.REACT_APP_TAWSILA_DOWNLOAD_LINK || "#",
    partnerWindows:
      process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK || "#",
    facebook: process.env.REACT_APP_FACBOOK_SOCIAL_MEDIA || "#",
    instagram: process.env.REACT_APP_INSTAGRAM_SOCIAL_MEDIA || "#",
    email: "contact.hanuut@gmail.com",
    phone: "0557713440",
  };

  return (
    // --- 1. LANGUAGE BUG FIX: Added 'key' prop to force re-render on language change ---
    <FooterWrapper dir={isArabic ? "rtl" : "ltr"} key={`footer-${i18n.language}`}>
      <Container>
        <TopSection>
          {/* Column 1: Main Info (No changes) */}
          <Column>
            <Link to="/">
              <LogoImage src={currentLogo} alt="Hanuut Logo" />
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <ContactItem><FaEnvelope /> {links.email}</ContactItem>
              <ContactItem><FaPhoneAlt /> {links.phone}</ContactItem>
            </div>
            <SocialRow>
              <SocialIcon href={links.facebook} target="_blank"><FaFacebook /></SocialIcon>
              <SocialIcon href={links.instagram} target="_blank"><FaInstagram /></SocialIcon>
            </SocialRow>
          </Column>

          {/* Column 2: Customers */}
          <Column>
            <ColumnTitle>{t("footer.col_customers")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/esuuq" isArabic={isArabic}>{t("nav_esuuq")}</StyledLink>
              <StyledLink to="/track" isArabic={isArabic}><FaTruck size={14} /> {t("navTrack")}</StyledLink>
              <ExternalLink href={links.customerApp} target="_blank" isArabic={isArabic}>
                <FaGooglePlay size={14} /> {t("footer.link_download_customer")}
              </ExternalLink>
            </LinkList>
          </Column>

          {/* --- 2. NEW COLUMN: Abridh --- */}
          <Column>
            <ColumnTitle>{t("nav_abridh_beta", "Abridh (Beta)")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/abridh">
                 <FaRoute size={14} /> {t("tawsila_btn_ride", "Request a trip")}
              </StyledLink>
              <StyledLink to="/abridh/drive">
                 {t("tawsila_btn_drive", "Join as a Driving Member")}
              </StyledLink>
              <ExternalLink href={links.abridhApp} target="_blank">
                <FaGooglePlay size={14} /> {t("abridh_member_portal", "Driving Member Portal")}
              </ExternalLink>
            </LinkList>
          </Column>

          {/* Column 4: Partners */}
          <Column>
            <ColumnTitle>{t("footer.col_partners")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/partners" isArabic={isArabic}>{t("footer.link_my_hanuut")}</StyledLink>
              <StyledLink to="/partners/onboarding" isArabic={isArabic}>{t("footer.link_join")}</StyledLink>
              <ExternalLink href={links.partnerWindows} target="_blank" isArabic={isArabic}>
                <FaWindows size={14} /> {t("footer.link_download_partner")}
              </ExternalLink>
            </LinkList>
          </Column>

          {/* Column 5: Legal & Support (Added Support Link) */}
          <Column>
            <ColumnTitle>{t("footer.col_legal")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/blog" isArabic={isArabic}>{t("footer.link_blog")}</StyledLink>
              <StyledLink to="/support" isArabic={isArabic}><FaQuestionCircle size={14} /> {t("support_title", "Support")}</StyledLink>
              <StyledLink to="/privacy" isArabic={isArabic}>{t("footer.link_privacy")}</StyledLink>
              <StyledLink to="/terms_and_conditions" isArabic={isArabic}>{t("footer.link_terms")}</StyledLink>
            </LinkList>
          </Column>
        </TopSection>

        <BottomSection>
          <CopyrightText>{t("footer.copyright")}</CopyrightText>
          <CopyrightText>Made with 💚 in Algeria</CopyrightText>
        </BottomSection>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;