import React from "react";
import styled from "styled-components";
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

const PageWrapper = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: #090a0d;
  color: #f4f4f5;
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 2.5rem);
  padding-bottom: 6rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  font-family: ${(props) =>
    props.$isArabic
      ? "'Cairo', 'Tajawal', sans-serif"
      : "var(--font-primary, 'Tajawal'), sans-serif"};
`;

const Container = styled.div`
  max-width: 1150px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Hero = styled.section`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 820px;
  margin: 0 auto;
`;

const Badge = styled.span`
  background: rgba(0, 135, 95, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.25;
  color: #ffffff;
  margin: 0;

  span {
    background: linear-gradient(135deg, #10b981 0%, #397ff9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  color: #a1a1aa;
  line-height: 1.7;
  margin: 0;
  max-width: 720px;
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .icon {
    font-size: 1.8rem;
    color: #10b981;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  p {
    font-size: 0.95rem;
    color: #a1a1aa;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }

  span {
    color: #10b981;
    font-weight: 700;
  }
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JobCard = styled(Link)`
  text-decoration: none;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #10b981;
    transform: translateY(-3px);
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
  gap: 0.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .dep-tag {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    color: #397ff9;
  }

  h3 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  .details {
    display: flex;
    gap: 1rem;
    align-items: center;
    color: #a1a1aa;
    font-size: 0.9rem;

    span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
`;

const ActionArrow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
  font-weight: 700;
  font-size: 1rem;

  svg {
    transition: transform 0.2s;
  }

  ${JobCard}:hover & svg {
    transform: ${(props) =>
      props.$isArabic ? "translateX(-5px)" : "translateX(5px)"};
  }
`;

const FutureSection = styled.section`
  background: rgba(255, 255, 255, 0.015);
  border: 1px dashed rgba(255, 255, 255, 0.12);
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

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const FutureItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h4 {
    font-size: 1.05rem;
    color: #e4e4e7;
    margin: 0;
    font-weight: 600;
  }

  span.status {
    color: #eab308;
    font-size: 0.8rem;
    font-weight: 700;
  }
`;

const ContactBox = styled.div`
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  padding: 2.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .text {
    max-width: 600px;
    h3 {
      font-size: 1.3rem;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }
    p {
      color: #a1a1aa;
      font-size: 0.95rem;
      margin: 0;
      line-height: 1.6;
    }
  }
`;

const EmailButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #10b981;
  color: #050505;
  padding: 0.9rem 1.8rem;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
  direction: ltr;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }
`;

const CareersPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const getLocalizedTitle = (job) => {
    if (isArabic) return job.titleAr;
    if (i18n.language === "fr") return job.titleFr;
    return job.titleEn;
  };

  const getLocalizedDepartment = (dep) => {
    if (dep === "Engineering")
      return t("careers_dep_engineering", "Engineering");
    if (dep === "Operations") return t("careers_dep_operations", "Operations");
    if (dep === "Growth") return t("careers_dep_growth", "Growth");
    return dep;
  };

  const getLocalizedLocation = (loc) => {
    if (loc.includes("Remote")) return t("careers_location_bejaia_remote", loc);
    if (loc.includes("On-Site"))
      return t("careers_location_bejaia_onsite", loc);
    return loc;
  };

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={t("careers_seo_title", "انضم إلى الفريق | أبريذ وحانووت")}
        description={t(
          "careers_seo_desc",
          "فرص عمل في الهندسة والعمليات لإطلاق منصة أبريذ في بجاية، الجزائر.",
        )}
        url="https://hanuut.com/careers"
      />

      <Container>
        <Hero>
          <Badge>{t("careers_badge", "نوظف حالياً في الجزائر")}</Badge>
          <Title>
            {t("careers_hero_title_1", "ابنِ مستقبل ")}
            <span>{t("careers_hero_title_highlight", "التنقل والتجارة")}</span>
          </Title>
          <Subtitle>
            {t(
              "careers_hero_sub",
              "نحن فريق صغير ومركّز نتحضر للإطلاق الميداني لمنصة أبريذ في بجاية. نقدّر روح المسؤولية العالية، الأنظمة البرمجية النظيفة، وتقديم حلول تجعل الحياة اليومية في الجزائر أكثر هدوءاً وموثوقية.",
            )}
          </Subtitle>
        </Hero>

        <ValueGrid>
          <ValueCard $isArabic={isArabic}>
            <div className="icon">
              <FaLaptopCode />
            </div>
            <h3>{t("careers_val_1_title", "منتج حقيقي على أرض الواقع")}</h3>
            <p>
              {t(
                "careers_val_1_desc",
                "بعيداً عن الأرقام التسويقية الوهمية، ستعمل على برمجيات وأنظمة تعمل مباشرة على مركبات وهواتف في شوارع الجزائر، لحل مشاكل حقيقية تواجه المواطنين والتجار.",
              )}
            </p>
          </ValueCard>
          <ValueCard $isArabic={isArabic}>
            <div className="icon">
              <FaUsers />
            </div>
            <h3>{t("careers_val_2_title", "فريق صغير ومسؤولية كاملة")}</h3>
            <p>
              {t(
                "careers_val_2_desc",
                "بدون أي بيروقراطية. ستعمل جنباً إلى جنب مع المؤسسين والقيادة التقنية، حيث يكون لقراراتك الهندسية والميدانية أثر فوري ومباشر.",
              )}
            </p>
          </ValueCard>
          <ValueCard $isArabic={isArabic}>
            <div className="icon">
              <FaShieldAlt />
            </div>
            <h3>{t("careers_val_3_title", "عمق تقني حقيقي")}</h3>
            <p>
              {t(
                "careers_val_3_desc",
                "نستعين بأحدث الأدوات والذكاء الاصطناعي لرفع سرعة الإنجاز، لكننا نبحث عن مهندسين يفهمون فعلاً إدارة الذاكرة، مآخذ الشبكة، وحالات التزامن وأنظمة التشغيل.",
              )}
            </p>
          </ValueCard>
        </ValueGrid>

        <OpeningsSection id="openings">
          <SectionHeader>
            <h2>{t("careers_open_roles", "الوظائف المتاحة حالياً")}</h2>
            <span>
              {JOBS_DATA.length} {t("careers_active_roles", "شواغر مفتوحة")}
            </span>
          </SectionHeader>

          <JobList>
            {JOBS_DATA.map((job) => (
              <JobCard key={job.slug} to={`/careers/${job.slug}`}>
                <JobMeta $isArabic={isArabic}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span className="dep-tag">
                      {getLocalizedDepartment(job.department)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontWeight: "700",
                      }}
                    >
                      {t("careers_auto_ent_badge", "Auto-Entrepreneur Préféré")}
                    </span>
                  </div>
                  <h3>{getLocalizedTitle(job)}</h3>
                  <div className="details">
                    <span>
                      <FaMapMarkerAlt /> {getLocalizedLocation(job.location)}
                    </span>
                    <span>•</span>
                    <span>
                      <FaClock />{" "}
                      {t(
                        "careers_freelance_preferred",
                        "Freelance / Auto-entrepreneur (Préféré)",
                      )}
                    </span>
                  </div>
                </JobMeta>

                <ActionArrow $isArabic={isArabic}>
                  <span>
                    {t("careers_view_role", "تفاصيل الوظيفة والتقديم")}
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
                color: "#ffffff",
                margin: "0 0 0.5rem 0",
              }}
            >
              {t("careers_deferred_title", "وظائف قادمة قريباً")}
            </h3>
            <p style={{ color: "#a1a1aa", fontSize: "0.95rem", margin: 0 }}>
              {t(
                "careers_deferred_sub",
                "سيتم فتح هذه الشواغر تدريجياً مع توسعنا الميداني في بجاية. إذا كان ملفك يتطابق معها، يسعدنا تواصلك معنا.",
              )}
            </p>
          </div>

          <FutureGrid>
            {DEFERRED_ROLES.map((role, idx) => (
              <FutureItem key={idx}>
                <h4>
                  {isArabic
                    ? role.titleAr
                    : i18n.language === "fr"
                      ? role.titleFr
                      : role.titleEn}
                </h4>
                <span className="status">
                  ⏳ {t("careers_status_not_open", "غير مفتوحة حالياً")}
                </span>
                <span style={{ color: "#71717a", fontSize: "0.85rem" }}>
                  {getLocalizedLocation(role.location)}
                </span>
              </FutureItem>
            ))}
          </FutureGrid>
        </FutureSection>

        <ContactBox $isArabic={isArabic}>
          <div className="text">
            <h3>{t("careers_contact_title", "لم تجد الوظيفة المناسبة؟")}</h3>
            <p>
              {t(
                "careers_contact_desc",
                "يسعدنا دائماً انضمام الكفاءات الهندسية والميدانية الاستثنائية. راسلنا مباشرة بسيرتك الذاتية ومشاريعك عبر البريد الإلكتروني.",
              )}
            </p>
          </div>
          <EmailButton href="mailto:contact.hanuut@gmail.com?subject=Abridh%20Hiring%20-%20General%20Application">
            <FaEnvelope />
            <span>contact.hanuut@gmail.com</span>
          </EmailButton>
        </ContactBox>
      </Container>
    </PageWrapper>
  );
};

export default CareersPage;
