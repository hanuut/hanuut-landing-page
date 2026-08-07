// src/modules/PodStudio/components/storefront/pages/CreatorCollabPage.jsx

import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPaintBrush,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import { partnerTheme } from "../../../../../config/Themes";
import CreatorApplicationForm from "../components/CreatorApplicationForm";
import Seo from "../../../../../components/Seo";

const PageRoot = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #0c0c0e;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1.5rem 5rem 1.5rem;
  box-sizing: border-box;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const TopNav = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const BackBtn = styled(Link)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

// 🔴 TWO-COLUMN SPLIT GRID
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3.5rem;
  width: 100%;
  max-width: 1200px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const LeftInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
`;

const HeroBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  h1 {
    font-size: clamp(2.2rem, 4.5vw, 3.5rem);
    font-weight: 900;
    font-family: "Tajawal", sans-serif;
    line-height: 1.15;
    margin: 0;

    span {
      color: ${(props) => props.theme.primaryColor || "#F07A48"};
    }
  }

  p {
    font-size: 1.1rem;
    color: #a1a1aa;
    font-family: "Cairo", sans-serif;
    line-height: 1.6;
    margin: 0;
  }
`;

const VerticalStepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const StepCard = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: border-color 0.25s, transform 0.25s;

  &:hover {
    border-color: rgba(240, 122, 72, 0.4);
    transform: translateY(-2px);
  }

  .icon-box {
    width: 48px;
    height: 48px;
    background: rgba(240, 122, 72, 0.1);
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    flex-shrink: 0;
  }

  .text-box {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h3 {
      font-size: 1.1rem;
      font-weight: 800;
      margin: 0;
      color: white;
      font-family: "Tajawal", sans-serif;
    }

    p {
      font-size: 0.88rem;
      color: #a1a1aa;
      margin: 0;
      font-family: "Cairo", sans-serif;
      line-height: 1.45;
    }
  }
`;

const RightFormCol = styled.div`
  width: 100%;
  position: sticky;
  top: 100px;
`;

const CreatorCollabPage = ({ shop }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const rawTitle = t("creator_collab_hero_title", "Monetize Your Art. Zero Manufacturing Friction.");
  const titleParts = rawTitle.includes(".") ? rawTitle.split(".") : [rawTitle, ""];

  return (
    <ThemeProvider theme={partnerTheme}>
      <Seo
        title={t("pod_studio_join_creators_btn", "Join as a Creator") + " | AURAS LAB"}
        description={t("creator_collab_hero_subtitle")}
        url="https://hanuut.com/aurasLab/collab"
      />
      <PageRoot $isArabic={isArabic}>
        <TopNav>
          <BackBtn to="/aurasLab">
            {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
            <span>{t("backToShop", "Back to Studio")}</span>
          </BackBtn>
        </TopNav>

        <TwoColumnLayout $isArabic={isArabic}>
          {/* LEFT/RIGHT COLUMN: TEXTS & STEP CARDS */}
          <LeftInfoCol $isArabic={isArabic}>
            <HeroBlock>
              <h1>
                {titleParts[0]}. <br />
                <span>{titleParts[1]}</span>
              </h1>
              <p>{t("creator_collab_hero_subtitle")}</p>
            </HeroBlock>

            <VerticalStepsList>
              <StepCard>
                <div className="icon-box">
                  <FaPaintBrush />
                </div>
                <div className="text-box">
                  <h3>{t("creator_collab_step1_title")}</h3>
                  <p>{t("creator_collab_step1_desc")}</p>
                </div>
              </StepCard>

              <StepCard>
                <div className="icon-box">
                  <FaShieldAlt />
                </div>
                <div className="text-box">
                  <h3>{t("creator_collab_step2_title")}</h3>
                  <p>{t("creator_collab_step2_desc")}</p>
                </div>
              </StepCard>

              <StepCard>
                <div className="icon-box">
                  <FaTruck />
                </div>
                <div className="text-box">
                  <h3>{t("creator_collab_step3_title")}</h3>
                  <p>{t("creator_collab_step3_desc")}</p>
                </div>
              </StepCard>
            </VerticalStepsList>
          </LeftInfoCol>

          {/* RIGHT/LEFT COLUMN: APPLICATION FORM */}
          <RightFormCol>
            <CreatorApplicationForm />
          </RightFormCol>
        </TwoColumnLayout>
      </PageRoot>
    </ThemeProvider>
  );
};

export default CreatorCollabPage;