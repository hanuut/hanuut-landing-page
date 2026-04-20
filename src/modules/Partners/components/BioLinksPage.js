import React from "react";
import styled, { keyframes, useTheme } from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaGlobe, FaCheckCircle, FaLink } from "react-icons/fa";
import { getImageUrl } from "../../../utils/imageUtils"; 
import HanuutLogo from "../../../assets/hanuutLogo.webp";

// --- Animations ---
const pulseGlow = (color) => keyframes`
  0% { box-shadow: 0 0 0 0 ${color}40; }
  70% { box-shadow: 0 0 0 10px ${color}00; }
  100% { box-shadow: 0 0 0 0 ${color}00; }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Tajawal', 'Cairo', sans-serif;
`;

const CoverImage = styled.div`
  width: 100%;
  height: 250px;
  background-color: ${(props) => props.theme.surface || "#F3F4F6"};
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, ${(props) => props.theme.body} 100%);
  }
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 480px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 2;
  padding: 0 1.5rem 4rem 1.5rem;
  margin-top: 150px; /* Overlap the cover image */
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.surface || "#FFFFFF"};
  border: 4px solid ${(props) => props.theme.body};
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ShopName = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${(props) => props.theme.text};
`;

const Description = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
  max-width: 90%;
  line-height: 1.5;
`;

const SocialRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const SocialIcon = styled.a`
  font-size: 1.8rem;
  color: ${(props) => props.theme.text};
  opacity: 0.8;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    color: ${(props) => props.theme.primaryColor};
    transform: translateY(-3px) scale(1.1);
  }
`;

const LinksList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LinkCard = styled(motion.a)`
  width: 100%;
  padding: 1.2rem;
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  /* Primary vs Standard Styling */
  ${(props) => props.$isPrimary ? `
    background-color: ${props.theme.primaryColor};
    color: ${props.theme.body}; /* Contrast against primary */
    border: none;
    box-shadow: 0 10px 20px ${props.theme.primaryRgba ? `rgba(${props.theme.primaryRgba}, 0.4)` : 'rgba(0,0,0,0.1)'};
    animation: ${pulseGlow(props.theme.primaryColor)} 2s infinite;
  ` : `
    background-color: ${props.theme.surface || 'transparent'};
    color: ${props.theme.text};
    border: 2px solid ${props.theme.primaryColor}50;
    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  `}

  &:hover {
    transform: scale(1.03);
    ${(props) => !props.$isPrimary && `
      border-color: ${props.theme.primaryColor};
    `}
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem 1rem;
  opacity: 0.6;
  
  svg { font-size: 3rem; margin-bottom: 1rem; }
  h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
`;

const FooterBranding = styled.div`
  margin-top: 3rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  opacity: 0.6;
  text-decoration: none;

  img {
    height: 18px;
    filter: grayscale(100%);
    opacity: 0.7;
  }
`;

// --- Component ---
const BioLinksPage = ({ shop }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const bioLinks = shop?.shopSettings?.bioLinks || {};
  const social = bioLinks.social || {};
  const links = bioLinks.links || [];

  const logoUrl = getImageUrl(shop.imageId);
  const coverUrl = getImageUrl(shop.styles?.coverImageId) || "https://hanuut.com/static/default-cover.png";

  const getSocialLink = (platform, value) => {
    if (!value) return null;
    if (platform === "whatsapp") {
      const cleanNum = value.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNum}`;
    }
    return value.startsWith('http') ? value : `https://${value}`;
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <PageWrapper>
      <CoverImage $bgImage={coverUrl} />
      <Container variants={containerVars} initial="hidden" animate="visible">
        
        {/* HEADER */}
        <Header>
          <Avatar variants={itemVars} whileHover={{ scale: 1.05 }}>
            <img 
              src={logoUrl || "https://hanuut.com/static/default-shop.png"} 
              alt={shop.name} 
              onError={(e) => e.target.src = "https://hanuut.com/static/default-shop.png"}
            />
          </Avatar>
          <motion.div variants={itemVars}>
            <ShopName>
              {shop.name}
              {shop.isValidated && <FaCheckCircle color={theme.primaryColor} size={18} title="Verified Shop" />}
            </ShopName>
            {shop.description && <Description>{shop.description}</Description>}
          </motion.div>
        </Header>

        {/* SOCIAL ICONS */}
        <SocialRow variants={itemVars}>
          {social.instagram && <SocialIcon href={getSocialLink('instagram', social.instagram)} target="_blank"><FaInstagram /></SocialIcon>}
          {social.tiktok && <SocialIcon href={getSocialLink('tiktok', social.tiktok)} target="_blank"><FaTiktok /></SocialIcon>}
          {social.facebook && <SocialIcon href={getSocialLink('facebook', social.facebook)} target="_blank"><FaFacebook /></SocialIcon>}
          {social.whatsapp && <SocialIcon href={getSocialLink('whatsapp', social.whatsapp)} target="_blank"><FaWhatsapp /></SocialIcon>}
          {social.website && <SocialIcon href={getSocialLink('website', social.website)} target="_blank"><FaGlobe /></SocialIcon>}
        </SocialRow>

        {/* CUSTOM LINKS OR EMPTY STATE */}
        <LinksList variants={containerVars}>
          {links.length > 0 ? (
            links
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((link, idx) => (
              <LinkCard 
                key={idx} 
                href={link.url} 
                $isPrimary={link.isPrimary}
                target="_blank" 
                rel="noopener noreferrer"
                variants={itemVars}
              >
                {link.title}
              </LinkCard>
            ))
          ) : (
            <EmptyState variants={itemVars}>
              <FaLink />
              <h3>{t("no_links_yet", "No links available")}</h3>
              <p>{t("check_back_later", "Check back later for updates.")}</p>
            </EmptyState>
          )}
        </LinksList>

        <FooterBranding as="a" href="https://hanuut.com">
          Powered by <img src={HanuutLogo} alt="Hanuut" />
        </FooterBranding>

      </Container>
    </PageWrapper>
  );
};

export default BioLinksPage;