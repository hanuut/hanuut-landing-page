import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaintBrush, FaShieldAlt, FaTruck, FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import Seo from "../../../../../components/Seo";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #050505;
  color: #ffffff;
  font-family: "Tajawal", "Cairo", sans-serif;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  padding: 8rem 1.5rem 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const Badge = styled.span`
  background: rgba(240, 122, 72, 0.1);
  border: 1px solid rgba(240, 122, 72, 0.3);
  color: #F07A48;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
`;

const MainHeading = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 1.5rem 0;
  span {
    color: #F07A48;
  }
`;

const SubHeading = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: #a1a1aa;
  max-width: 650px;
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
`;

const PrimaryCta = styled(Link)`
  background: #F07A48;
  color: #050505;
  padding: 1.25rem 2.8rem;
  border-radius: 50px;
  font-size: 1.15rem;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 12px 30px rgba(240, 122, 72, 0.35);
  transition: transform 0.2s, filter 0.2s;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

const ValuePropGrid = styled.section`
  max-width: 1200px;
  margin: 0 auto 6rem auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: start;

  .icon {
    font-size: 2rem;
    color: #F07A48;
  }
  h3 {
    font-size: 1.25rem;
    margin: 0;
    font-weight: 800;
  }
  p {
    color: #a1a1aa;
    margin: 0;
    line-height: 1.5;
    font-size: 0.95rem;
  }
`;

const AurasLabLandingPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={isArabic ? "أوراس لاب | استوديو الطباعة حسب الطلب" : "AURAS LAB | Custom Streetwear Studio"}
        description={isArabic ? "صمم ملابسك الخاصة على خامات قطنية عالية الجودة مع الشحن لكافة الولايات." : "Design custom streetwear on organic cotton blanks. Shipped across Algeria."}
        url="https://hanuut.com/aurasLab"
      />

      <HeroSection>
        <Badge>{isArabic ? "مختبر التصميم الحر" : "CUSTOM STREETWEAR LAB"}</Badge>
        <MainHeading>
          {isArabic ? (
            <>صمّم ملابسك بنفسك. <br /><span>بجودة استثنائية.</span></>
          ) : (
            <>Design Your Own Apparel. <br /><span>Premium Quality.</span></>
          )}
        </MainHeading>
        <SubHeading>
          {isArabic
            ? "خامات قطنية ثقيلة 100%، طباعة عالية الدقة، وتوصيل سريع لكافة الـ 58 ولاية."
            : "100% Heavyweight organic cotton, high-definition prints, and fast delivery to all 58 Wilayas."}
        </SubHeading>

        <PrimaryCta to="/aurasLab/studio">
          <FaPaintBrush />
          <span>{isArabic ? "الدخول إلى استوديو التصميم" : "Enter Design Studio"}</span>
          {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
        </PrimaryCta>
      </HeroSection>

      <ValuePropGrid>
        <ValueCard>
          <div className="icon"><FaCheck /></div>
          <h3>{isArabic ? "خامات قطنية 100%" : "100% Premium Cotton"}</h3>
          <p>{isArabic ? "خامات ثقيلة ومريحة تدوم مع الغسيل المتكرر." : "Heavyweight, durable fabrics engineered for maximum comfort."}</p>
        </ValueCard>

        <ValueCard>
          <div className="icon"><FaShieldAlt /></div>
          <h3>{isArabic ? "طباعة دقيقة وثابتة" : "High-Definition Printing"}</h3>
          <p>{isArabic ? "تقنيات طباعة حديثة تضمن ثبات الألوان وتفاصيل التصميم." : "State-of-the-art print technology ensuring vivid color accuracy."}</p>
        </ValueCard>

        <ValueCard>
          <div className="icon"><FaTruck /></div>
          <h3>{isArabic ? "توصيل لـ 58 ولاية" : "58 Wilayas Shipping"}</h3>
          <p>{isArabic ? "توصيل سريع مع خيارات الدفع عند الاستلام." : "Fast home and stop-desk delivery options available nationwide."}</p>
        </ValueCard>
      </ValuePropGrid>
    </PageWrapper>
  );
};

export default AurasLabLandingPage;