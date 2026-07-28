import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaPaintBrush, FaShieldAlt, FaTruck, FaCheckCircle } from "react-icons/fa";
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
  padding: 2rem 1.5rem 5rem 1.5rem;
  box-sizing: border-box;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const TopNav = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
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
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const HeroBlock = styled.div`
  text-align: center;
  max-width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 4rem;

  h1 {
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 900;
    font-family: "Tajawal", sans-serif;
    line-height: 1.15;
    margin: 0;
    span { color: ${(props) => props.theme.primaryColor || "#F07A48"}; }
  }

  p {
    font-size: 1.1rem;
    color: #a1a1aa;
    font-family: "Cairo", sans-serif;
    line-height: 1.6;
    margin: 0;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StepCard = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: start;

  .icon-box {
    width: 44px;
    height: 44px;
    background: rgba(240, 122, 72, 0.1);
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 800;
    margin: 0;
    font-family: "Tajawal", sans-serif;
  }

  p {
    font-size: 0.9rem;
    color: #a1a1aa;
    margin: 0;
    font-family: "Cairo", sans-serif;
    line-height: 1.5;
  }
`;

const CreatorCollabPage = ({ shop }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

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

        <HeroBlock>
          <h1>
            {t("creator_collab_hero_title").split(".")[0]}. <br />
            <span>{t("creator_collab_hero_title").split(".")[1]}</span>
          </h1>
          <p>{t("creator_collab_hero_subtitle")}</p>
        </HeroBlock>

        <StepsGrid>
          <StepCard>
            <div className="icon-box"><FaPaintBrush /></div>
            <h3>{t("creator_collab_step1_title")}</h3>
            <p>{t("creator_collab_step1_desc")}</p>
          </StepCard>
          <StepCard>
            <div className="icon-box"><FaShieldAlt /></div>
            <h3>{t("creator_collab_step2_title")}</h3>
            <p>{t("creator_collab_step2_desc")}</p>
          </StepCard>
          <StepCard>
            <div className="icon-box"><FaTruck /></div>
            <h3>{t("creator_collab_step3_title")}</h3>
            <p>{t("creator_collab_step3_desc")}</p>
          </StepCard>
        </StepsGrid>

        <CreatorApplicationForm />
      </PageRoot>
    </ThemeProvider>
  );
};

export default CreatorCollabPage;
