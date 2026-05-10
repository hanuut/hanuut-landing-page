import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { FaCheck, FaTimes, FaMagic, FaDownload, FaWhatsapp } from "react-icons/fa";

import PlatformDownloadButtons from "./PlatformDownloadButtons";
import DigitalMatrixCanvas from "./DigitalMatrixCanvas";

// --- STYLING ---
const PageWrapper = styled.div` background: #050505; color: white; width: 100%; position: relative; `;

const HeroSection = styled.section` 
  position: relative; 
  min-height: 90vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
  background: #050505;
`;

const ContentSection = styled.section` 
  padding: 4rem 0; 
  display: flex; 
  justify-content: center; 
  position: relative; 
  background: #050505; 
`;

const Container = styled.div` width: 90%; max-width: 1000px; z-index: 2; position: relative; `;

const HeroTitle = styled(motion.h1)`
  font-family: var(--font-title), 'KOGhorab', sans-serif !important;
  font-size: clamp(2.5rem, 6vw, 4rem); 
  font-weight: normal; 
  line-height: 1.2; 
  color: white; 
  text-align: center;
  margin: 0 0 1rem 0;
`;

const HeroHighlight = styled(motion.h2)`
  font-family: var(--font-primary) !important;
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 800;
  text-align: center;
  margin: 0 0 2rem 0;
  background: linear-gradient(135deg, #FFFFFF 30%, ${(props) => props.$color} 100%);
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent;
`;

const CtaRow = styled(motion.div)`
  display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; pointer-events: auto; margin-top: 2rem;
`;

const PrimaryButton = styled.button`
  background: ${(props) => props.$color}; color: #111; border: none; padding: 1rem 2.5rem; 
  border-radius: 50px; font-weight: 800; font-size: 1.1rem; cursor: pointer; 
  display: flex; align-items: center; gap: 10px; transition: all 0.2s; font-family: 'Tajawal', sans-serif;
  &:hover { filter: brightness(1.1); transform: translateY(-3px); box-shadow: 0 10px 20px ${(props) => props.$color}40; }
`;

const SecondaryButton = styled.button`
  background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); 
  padding: 1rem 2.5rem; border-radius: 50px; font-weight: 700; font-size: 1.1rem; 
  cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; font-family: 'Tajawal', sans-serif;
  &:hover { background: rgba(255,255,255,0.1); }
`;

const CompGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; @media(max-width: 768px){ grid-template-columns: 1fr;} `;
const CompCard = styled.div` 
  padding: 2.5rem; border-radius: 24px; background: rgba(255,255,255,0.02); 
  border: 1px solid rgba(255,255,255,0.05); border-left: 4px solid ${props => props.$color}; 
`;
const CompTitle = styled.h4` font-size: 0.9rem; font-weight: 800; text-transform: uppercase; margin-bottom: 2rem; color: #71717a; `;
const CompLine = styled.div` display: flex; gap: 1rem; margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.5; color: #e4e4e7; font-family: 'Cairo', sans-serif; svg { margin-top: 4px; flex-shrink: 0; } `;

const FaqGrid = styled.div` display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; margin: 4rem auto 0 auto; `;
const FaqCard = styled.div` padding: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); text-align: ${props => props.$isArabic ? 'right' : 'left'}; direction: ${props => props.$isArabic ? 'rtl' : 'ltr'}; `;
const FaqQ = styled.h4` font-size: 1.15rem; color: white; margin: 0 0 0.5rem 0; font-family: 'Tajawal', sans-serif; font-weight: 700; `;
const FaqA = styled.p` font-size: 1rem; color: #a1a1aa; margin: 0; line-height: 1.6; font-family: 'Cairo', sans-serif; `;

const DownloadSection = styled.div`
  margin-top: 6rem; padding-top: 4rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; display: flex; flex-direction: column; align-items: center;
`;

// --- WHATSAPP FLOATING BUTTON ---
const WhatsAppFAB = styled(motion.a)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  color: white;
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;

  svg {
    font-size: 1.5rem;
    color: #25D366; /* WhatsApp Green */
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #25D366;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.15);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 1rem;
    border-radius: 50%;
    
    span {
      display: none; /* Hide text on mobile */
    }
    
    svg {
      font-size: 1.8rem;
    }
  }
`;

const getDomainConfig = (domain, t) => {
  const configs = {
    food: {
      color: "#1D9E75",
      hook: t("industry_food_hook"), subhook: t("industry_food_subhook"),
      before: [t("food_b1"), t("food_b2"), t("food_b3")],
      after: [t("food_a1_t"), t("food_a2_t"), t("food_a3_t")]
    },
    grocery: {
      color: "#397FF9",
      hook: t("industry_grocery_hook"), subhook: t("industry_grocery_subhook"),
      before: [t("groc_b1"), t("groc_b2"), t("groc_b3")],
      after: [t("groc_a1_t"), t("groc_a2_t"), t("groc_a3_t")]
    },
    global: {
      color: "#F07A48",
      hook: t("industry_global_hook"), subhook: t("industry_global_subhook"),
      before: [t("global_b1"), t("global_b2"), t("global_b3")],
      after: [t("global_a1_t"), t("global_a2_t"), t("global_a3_t")]
    }
  };
  return configs[domain] || configs.global;
};

const IndustryTemplate = ({ domain }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  
  const downloadRef = useRef(null);
  const conf = getDomainConfig(domain, t);

  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Trigger WhatsApp button appearance after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsApp(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToDownload = () => {
    downloadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <PageWrapper>
      <HeroSection>
        <DigitalMatrixCanvas />
        <Container>
          <HeroTitle initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
            {conf.hook}
          </HeroTitle>
          
          <HeroHighlight $color={conf.color} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.1}} style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
            {conf.subhook}
          </HeroHighlight>

          <CtaRow initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.2}}>
            <PrimaryButton $color={conf.color} onClick={() => navigate('/partners/onboarding')}>
               <FaMagic /> {t("cta_onboard_primary")}
            </PrimaryButton>
            <SecondaryButton onClick={scrollToDownload}>
               <FaDownload /> {t("cta_demo_secondary", "Download App")}
            </SecondaryButton>
          </CtaRow>
        </Container>
      </HeroSection>

      <ContentSection>
        <Container>
          <CompGrid style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
            <CompCard $color="#EF4444">
              <CompTitle>{t("comp_before_title")}</CompTitle>
              {conf.before.map((line, i) => (
                <CompLine key={i}><FaTimes color="#EF4444"/> <div>{line}</div></CompLine>
              ))}
            </CompCard>
            <CompCard $color={conf.color}>
              <CompTitle>{t("comp_after_title")}</CompTitle>
              {conf.after.map((line, i) => (
                <CompLine key={i}><FaCheck color={conf.color}/> <div>{line}</div></CompLine>
              ))}
            </CompCard>
          </CompGrid>

          <div style={{ textAlign: 'center', margin: '6rem auto 2rem auto' }}>
            <h3 style={{ fontSize: '2.5rem', fontFamily: 'Tajawal', fontWeight: 800 }}>{t("faq_title")}</h3>
          </div>
          <FaqGrid>
            {[1, 2, 3].map(num => (
              <FaqCard key={num} $isArabic={isArabic}>
                <FaqQ>{t(`faq_${num}_q`)}</FaqQ>
                <FaqA>{t(`faq_${num}_a`)}</FaqA>
              </FaqCard>
            ))}
          </FaqGrid>

          <DownloadSection ref={downloadRef}>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'Tajawal', marginBottom: '0.5rem' }}>{t("cta_download_section_title")}</h3>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>{t("cta_download_section_desc")}</p>
            <PlatformDownloadButtons layout="cta" />
          </DownloadSection>

        </Container>
      </ContentSection>

      {/* DELAYED FLOATING WHATSAPP BUTTON */}
      <AnimatePresence>
        {showWhatsApp && (
          <WhatsAppFAB
            href="https://wa.me/213557713440?text=Bonjour%2C%20je%20veux%20en%20savoir%20plus%20sur%20My%20Hanuut"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <FaWhatsapp />
            <span>Une question ?</span>
          </WhatsAppFAB>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default IndustryTemplate;