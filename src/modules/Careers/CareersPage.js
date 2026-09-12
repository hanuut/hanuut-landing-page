// modules/Careers/CareersPage.js
import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaEnvelope,
  FaUsers,
  FaShieldAlt,
  FaLaptopCode,
  FaClock,
} from "react-icons/fa";

import Seo from "../../components/Seo";
import { JOBS_DATA, DEFERRED_ROLES } from "./data/careersData";

// --- Fluid Light Ambient Animation ---
const pulseGlow = keyframes`
  0% { transform: translate(-30%, -20%) scale(1); opacity: 0.45; }
  50% { transform: translate(20%, 20%) scale(1.15); opacity: 0.7; }
  100% { transform: translate(-30%, -20%) scale(1); opacity: 0.45; }
`;

const PageWrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  color: #0f172a;
  padding-bottom: 6rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  font-family: ${(props) =>
    props.$isArabic
      ? "'Cairo', 'Tajawal', sans-serif"
      : "var(--font-primary, 'Tajawal'), sans-serif"};
`;

// --- Hero with Blurred Image Background & Fluid Ambient Lights ---
const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 520px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 2rem);
  padding-bottom: 4rem;
  background-color: #0b1528;
`;

const HeroImageBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("/static/abridh-careers.png");
  background-size: cover;
  background-position: center;
  filter: blur(18px) brightness(0.6);
  transform: scale(1.08);
  z-index: 0;
`;

const FluidLightOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 1;
  pointer-events: none;
  animation: ${pulseGlow} 12s ease-in-out infinite alternate;

  &.orb-emerald {
    top: 15%;
    right: 20%;
    width: 380px;
    height: 380px;
    background: radial-gradient(
      circle,
      rgba(16, 185, 129, 0.45) 0%,
      rgba(16, 185, 129, 0) 70%
    );
  }

  &.orb-blue {
    bottom: 10%;
    left: 15%;
    width: 440px;
    height: 440px;
    background: radial-gradient(
      circle,
      rgba(57, 127, 249, 0.4) 0%,
      rgba(57, 127, 249, 0) 70%
    );
  }
`;

const FrostedGlassLayer = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(11, 21, 40, 0.45);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 820px;
  width: 90%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const Badge = styled.span`
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.35);
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const Title = styled.h1`
  font-size: clamp(2.1rem, 4.5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.25;
  color: #ffffff;
  margin: 0;

  span {
    background: linear-gradient(135deg, #34d399 0%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  color: #e2e8f0;
  line-height: 1.7;
  margin: 0;
  max-width: 720px;
`;

// --- Body Containers in Light Theme ---
const MainContainer = styled.div`
  max-width: 1150px;
  width: 90%;
  margin: -2.5rem auto 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }

  .icon {
    font-size: 2rem;
    color: #059669;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }
`;

const OpeningsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1rem;

  h2 {
    font-size: 1.85rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  span.counter {
    background: #ecfdf5;
    color: #059669;
    font-weight: 800;
    font-size: 0.9rem;
    padding: 4px 14px;
    border-radius: 9999px;
    border: 1px solid #a7f3d0;
  }
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const JobCard = styled(Link)`
  text-decoration: none;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 2.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: #10b981;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.12);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.5rem;
  }
`;

const JobMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .tag-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .dep-tag {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 800;
    color: #2563eb;
    background: #eff6ff;
    padding: 3px 10px;
    border-radius: 6px;
  }

  .auto-badge {
    font-size: 0.75rem;
    font-weight: 800;
    color: #059669;
    background: #ecfdf5;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid #a7f3d0;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  .details {
    display: flex;
    gap: 1rem;
    align-items: center;
    color: #64748b;
    font-size: 0.95rem;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
`;

const ActionArrow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  font-weight: 800;
  font-size: 1rem;
  white-space: nowrap;

  svg {
    transition: transform 0.2s;
  }

  ${JobCard}:hover & svg {
    transform: ${(props) =>
      props.$isArabic ? "translateX(-6px)" : "translateX(6px)"};
  }
`;

const FutureSection = styled.section`
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
`;

const FutureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const FutureItem = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h4 {
    font-size: 1.05rem;
    color: #0f172a;
    margin: 0;
    font-weight: 700;
  }

  span.status {
    color: #d97706;
    font-size: 0.8rem;
    font-weight: 800;
  }
`;

const ContactBox = styled.div`
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
  color: #ffffff;
  border-radius: 24px;
  padding: 2.75rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  box-shadow: 0 10px 30px rgba(6, 78, 59, 0.2);

  .text {
    max-width: 600px;
    h3 {
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }
    p {
      color: #d1fae5;
      font-size: 1rem;
      margin: 0;
      line-height: 1.6;
    }
  }
`;

const EmailButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #ffffff;
  color: #064e3b;
  padding: 0.9rem 2rem;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
  direction: ltr;

  &:hover {
    background-color: #ecfdf5;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

// Helper that safely handles both plain strings and multilingual objects
const getSafeLocalizedText = (field, langKey, fallback = "") => {
  if (!field) return fallback;
  if (typeof field === "string") return field;
  return (
    field[langKey] || field["fr"] || field["en"] || field["ar"] || fallback
  );
};

const CareersPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const langKey = isArabic ? "ar" : i18n.language === "fr" ? "fr" : "en";

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={t("careers_seo_title", "Rejoignez l'équipe | Abridh & Hanuut")}
        description={t(
          "careers_seo_desc",
          "Construisez des solutions concrètes avec un réel impact. Découvrez les opportunités pour le lancement d'Abridh à Béjaïa.",
        )}
        url="https://hanuut.com/careers"
      />

      {/* --- HERO SECTION WITH BLURRED IMAGE & FLUID LIGHTS --- */}
      <HeroWrapper>
        <HeroImageBackground />
        <FluidLightOrb className="orb-emerald" />
        <FluidLightOrb className="orb-blue" />
        <FrostedGlassLayer />

        <HeroContent>
          <Badge>{t("careers_badge", "NOUS RECRUTONS EN ALGÉRIE")}</Badge>
          <Title>
            {t("careers_hero_title_1", "Bâtissez l'avenir de la ")}
            <span>
              {t("careers_hero_title_highlight", "Mobilité & du Commerce")}
            </span>
          </Title>
          <Subtitle>
            {t(
              "careers_hero_sub",
              "Nous sommes une équipe resserrée qui prépare le lancement opérationnel d'Abridh à Béjaïa. Nous privilégions une forte responsabilité personnelle, des architectures logicielles propres et des solutions concrètes pour rendre le quotidien en Algérie plus serein et plus fiable.",
            )}
          </Subtitle>
        </HeroContent>
      </HeroWrapper>

      {/* --- MAIN LIGHT THEME CONTENT --- */}
      <MainContainer>
        <ValueGrid>
          <ValueCard $isArabic={isArabic}>
            <div className="icon">
              <FaLaptopCode />
            </div>
            <h3>
              {t(
                "careers_val_1_title",
                "Un produit réel, ancré sur le terrain",
              )}
            </h3>
            <p>{t("careers_val_1_desc")}</p>
          </ValueCard>
          <ValueCard $isArabic={isArabic}>
            <div className="icon">
              <FaUsers />
            </div>
            <h3>
              {t("careers_val_2_title", "Petite équipe, autonomie totale")}
            </h3>
            <p>{t("careers_val_2_desc")}</p>
          </ValueCard>
          <ValueCard $isArabic={isArabic}>
            <div className="icon">
              <FaShieldAlt />
            </div>
            <h3>
              {t("careers_val_3_title", "Exigence et profondeur technique")}
            </h3>
            <p>{t("careers_val_3_desc")}</p>
          </ValueCard>
        </ValueGrid>

        <OpeningsSection id="openings">
          <SectionHeader>
            <h2>{t("careers_open_roles", "Postes ouverts actuellement")}</h2>
            <span className="counter">
              {JOBS_DATA.length} {t("careers_active_roles", "postes ouverts")}
            </span>
          </SectionHeader>

          <JobList>
            {JOBS_DATA.map((job) => (
              <JobCard key={job.slug} to={`/careers/${job.slug}`}>
                <JobMeta $isArabic={isArabic}>
                  <div className="tag-row">
                    <span className="dep-tag">
                      {getSafeLocalizedText(
                        job.department,
                        langKey,
                        "Engineering",
                      )}
                    </span>
                    <span className="auto-badge">
                      {t("careers_auto_ent_badge", "Auto-Entrepreneur Préféré")}
                    </span>
                  </div>
                  <h3>{getSafeLocalizedText(job.title, langKey, job.slug)}</h3>
                  <div className="details">
                    <span>
                      <FaMapMarkerAlt />{" "}
                      {getSafeLocalizedText(
                        job.location,
                        langKey,
                        "Béjaïa, Algeria",
                      )}
                    </span>
                    <span>•</span>
                    <span>
                      <FaClock />{" "}
                      {getSafeLocalizedText(
                        job.contractType || job.type,
                        langKey,
                        "Freelance / CDI",
                      )}
                    </span>
                  </div>
                </JobMeta>
                <ActionArrow $isArabic={isArabic}>
                  <span>
                    {t("careers_view_role", "Consulter l'offre & Postuler")}
                  </span>
                  {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                </ActionArrow>
              </JobCard>
            ))}
          </JobList>
        </OpeningsSection>

        <FutureSection $isArabic={isArabic}>
          <div>
            <h3
              style={{
                fontSize: "1.3rem",
                color: "#0f172a",
                margin: "0 0 0.5rem 0",
                fontWeight: "800",
              }}
            >
              {t("careers_deferred_title", "Prochains recrutements (À venir)")}
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
              {t("careers_deferred_sub")}
            </p>
          </div>

          <FutureGrid>
            {DEFERRED_ROLES.map((role, idx) => (
              <FutureItem key={idx}>
                <h4>
                  {getSafeLocalizedText(role.title, langKey, role.titleEn)}
                </h4>
                <span className="status">
                  ⏳{" "}
                  {getSafeLocalizedText(role.statusBadge, langKey, "À venir")}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  {getSafeLocalizedText(
                    role.location,
                    langKey,
                    "Béjaïa, Algérie",
                  )}
                </span>
              </FutureItem>
            ))}
          </FutureGrid>
        </FutureSection>

        <ContactBox $isArabic={isArabic}>
          <div className="text">
            <h3>
              {t(
                "careers_contact_title",
                "Vous ne trouvez pas de poste correspondant ?",
              )}
            </h3>
            <p>{t("careers_contact_desc")}</p>
          </div>
          <EmailButton href="mailto:contact.hanuut@gmail.com?subject=Abridh%20Hiring%20-%20General%20Application">
            <FaEnvelope />
            <span>contact.hanuut@gmail.com</span>
          </EmailButton>
        </ContactBox>
      </MainContainer>
    </PageWrapper>
  );
};

export default CareersPage;
