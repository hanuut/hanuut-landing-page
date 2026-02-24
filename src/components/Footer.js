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
  FaTruck, // Added FaTruck
} from "react-icons/fa";

import logoAr from "../assets/logo_ar.webp";
import logoEn from "../assets/logo_en.webp";

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

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 2rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
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
const linkStyles = `
  color: #A1A1AA; text-decoration: none; font-size: 0.95rem; transition: all 0.2s ease;
  display: flex; align-items: center; gap: 8px;
  &:hover { color: #F07A48; transform: translateX(5px); }
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

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const currentLogo = isArabic ? logoAr : logoEn;

  const links = {
    customerApp: process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK || "#",
    partnerWindows:
      process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK || "#",
    facebook: process.env.REACT_APP_FACBOOK_SOCIAL_MEDIA || "#",
    instagram: process.env.REACT_APP_INSTAGRAM_SOCIAL_MEDIA || "#",
    email: "contact.hanuut@gmail.com",
    phone: "0557713440",
  };

  return (
    <FooterWrapper isArabic={isArabic}>
      <Container>
        <TopSection>
          <Column>
            <Link to="/">
              <LogoImage src={currentLogo} alt="Hanuut Logo" />
            </Link>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <ContactItem>
                <FaEnvelope /> {links.email}
              </ContactItem>
              <ContactItem>
                <FaPhoneAlt /> {links.phone}
              </ContactItem>
            </div>
            <SocialRow>
              <SocialIcon href={links.facebook} target="_blank">
                <FaFacebook />
              </SocialIcon>
              <SocialIcon href={links.instagram} target="_blank">
                <FaInstagram />
              </SocialIcon>
            </SocialRow>
          </Column>

          {/* Column 2: Customers */}
          <Column>
            <ColumnTitle>{t("footer.col_customers")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/">{t("footer.link_home")}</StyledLink>
              {/* --- NEW: Track Order Link in Footer --- */}
              <StyledLink to="/track">
                <FaTruck size={14} /> {t("navTrack")}
              </StyledLink>
              <ExternalLink href={links.customerApp} target="_blank">
                <FaGooglePlay size={14} /> {t("footer.link_download_customer")}
              </ExternalLink>
            </LinkList>
          </Column>

          {/* Column 3: Partners */}
          <Column>
            <ColumnTitle>{t("footer.col_partners")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/partners">
                {t("footer.link_my_hanuut")}
              </StyledLink>
              <StyledLink to="/partners/onboarding">
                {t("footer.link_join")}
              </StyledLink>
              <ExternalLink href={links.partnerWindows} target="_blank">
                <FaWindows size={14} /> {t("footer.link_download_partner")}
              </ExternalLink>
            </LinkList>
          </Column>

          {/* Column 4: Legal & Resources */}
          <Column>
            <ColumnTitle>{t("footer.col_legal")}</ColumnTitle>
            <LinkList>
              <StyledLink to="/blog">{t("footer.link_blog")}</StyledLink>
              <StyledLink to="/privacy">{t("footer.link_privacy")}</StyledLink>
              <StyledLink to="/terms_and_conditions">
                {t("footer.link_terms")}
              </StyledLink>
              <StyledLink to="/delete_account">
                {t("footer.link_delete")}
              </StyledLink>
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
