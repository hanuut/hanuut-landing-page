import React, { useState } from "react";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  FaShoppingBag, FaUtensils, FaBarcode, FaCheck, FaTimes, FaLink, FaLayerGroup, 
  FaCalculator, FaChartLine, FaImages, FaQrcode, FaTv, FaEyeSlash, FaPalette, FaWifi, FaFileInvoiceDollar, FaBell 
} from "react-icons/fa";

// --- 9 IMAGE MASONRY IMPORTS ---
import ecom_1 from "../../../assets/my_hanuut_features/ecom_1.png";
import ecom_2 from "../../../assets/my_hanuut_features/ecom_2.png";
import ecom_3 from "../../../assets/my_hanuut_features/ecom_3.png";

import food_1 from "../../../assets/my_hanuut_features/food_1.png";
import food_2 from "../../../assets/my_hanuut_features/food_2.png";
import food_3 from "../../../assets/my_hanuut_features/food_3.png";

import grocery_1 from "../../../assets/my_hanuut_features/grocery_1.png";
import grocery_2 from "../../../assets/my_hanuut_features/grocery_2.png";
import grocery_3 from "../../../assets/my_hanuut_features/grocery_3.png";

const Section = styled.section` 
  padding: 6rem 0; background: #050505; color: white; display: flex; justify-content: center; border-bottom: 1px solid #18181b;
`;

const Container = styled.div` width: 90%; max-width: 1250px; `;

const Title = styled.h2` 
  font-size: 2.5rem; font-weight: 800; font-family: 'Tajawal', sans-serif; color: white; text-align: center; margin-bottom: 4rem;
`;

const SelectorGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const DomainCard = styled.div`
  padding: 2rem; border-radius: 20px; cursor: pointer; transition: all 0.3s ease;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-bottom: 4px solid transparent;
  ${props => props.$active && css`
    border-bottom: 4px solid ${props.$color};
    background: ${props.$color}08;
    border-color: ${props.$color}40;
    transform: translateY(-5px);
  `}
  &:hover { background: rgba(255,255,255,0.06); }
  h3 { margin: 10px 0 5px 0; font-size: 1.4rem; font-family: 'Tajawal', sans-serif;}
  p { font-size: 0.95rem; color: #a1a1aa; line-height: 1.5; font-family: 'Cairo', sans-serif;}
`;

const MainContentSplit = styled.div`
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 3rem; }
`;

const VisualColumn = styled.div`
  position: sticky; top: 120px;
  @media (max-width: 1024px) { position: relative; top: 0; }
`;

// --- MOSAIC GRID STYLING ---
const MosaicGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.65fr;
  grid-template-rows: 240px 240px;
  gap: 1rem;
  grid-template-areas:
    "m-main m-top"
    "m-main m-bottom";

  @media (max-width: 1024px) {
    display: flex;
    aspect-ratio: 16 / 9;
    grid-template-areas: none;
    height: auto;
  }
`;

const GridItem = styled(motion.div)`
  grid-area: ${props => props.$area};
  border-radius: 24px;
  overflow: hidden;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${props => props.$pos || 'center'};
  }

  @media (max-width: 1024px) {
    display: ${props => props.$area === 'm-main' ? 'block' : 'none'};
    width: 100%;
  }
`;

const ContentColumn = styled.div` display: flex; flex-direction: column; gap: 2rem; `;

const CompCard = styled.div` 
  padding: 2rem; border-radius: 24px; background: rgba(255,255,255,0.02); 
  border: 1px solid rgba(255,255,255,0.05); border-left: 4px solid ${props => props.$color}; 
  margin-bottom: 1rem;
`;

const CompTitle = styled.h4` font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem; color: #71717a; `;

const CompLine = styled.div`
  display: flex; gap: 0.8rem; margin-bottom: 1.2rem; line-height: 1.4; font-size: 1rem; font-family: 'Cairo', sans-serif;
  svg { flex-shrink: 0; margin-top: 3px; }
  .feat-badge { background: ${props => props.$color}20; color: ${props => props.$color}; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; margin-left: 8px; }
`;

const FeatureGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; `;
const FeatCard = styled.div` 
  padding: 1.2rem; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.04);
  display: flex; align-items: flex-start; gap: 0.8rem;
  svg { color: ${props => props.$color}; opacity: 0.6; font-size: 1.1rem; flex-shrink: 0;}
  h5 { font-size: 0.9rem; margin: 0 0 0.2rem 0; color: white; font-family: 'Tajawal', sans-serif;}
  p { font-size: 0.75rem; color: #71717a; margin: 0; font-family: 'Cairo', sans-serif; line-height: 1.4;}
`;

const DomainSelector = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('global');

  const DOMAINS = {
    global: {
      label: t("domain_global_label"), desc: t("domain_global_desc"), color: "#F07A48", icon: <FaShoppingBag />,
      images: { img1: ecom_1, img2: ecom_2, img3: ecom_3, pos1: 'top' },
      before: [t("global_b1"), t("global_b2"), t("global_b3")],
      after: [{ text: t("global_a1_t"), f: t("global_a1_f") }, { text: t("global_a2_t"), f: t("global_a2_f") }, { text: t("global_a3_t"), f: t("global_a3_f") }],
      feats: [{ n: t("global_f1_n"), d: t("global_f1_d"), i: <FaLink/> }, { n: t("global_f2_n"), d: t("global_f2_d"), i: <FaLayerGroup/> }, { n: t("global_f3_n"), d: t("global_f3_d"), i: <FaCalculator/> }, { n: t("global_f4_n"), d: t("global_f4_d"), i: <FaChartLine/> }]
    },
    food: {
      label: t("domain_food_label"), desc: t("domain_food_desc"), color: "#1D9E75", icon: <FaUtensils />,
      images: { img1: food_1, img2: food_2, img3: food_3, pos1: 'center' },
      before: [t("food_b1"), t("food_b2"), t("food_b3")],
      after: [{ text: t("food_a1_t"), f: t("food_a1_f") }, { text: t("food_a2_t"), f: t("food_a2_f") }, { text: t("food_a3_t"), f: t("food_a3_f") }],
      feats: [{ n: t("food_f1_n"), d: t("food_f1_d"), i: <FaQrcode/> }, { n: t("food_f2_n"), d: t("food_f2_d"), i: <FaTv/> }, { n: t("food_f3_n"), d: t("food_f3_d"), i: <FaEyeSlash/> }, { n: t("food_f4_n"), d: t("food_f4_d"), i: <FaPalette/> }]
    },
    grocery: {
      label: t("domain_grocery_label"), desc: t("domain_grocery_desc"), color: "#397FF9", icon: <FaBarcode />,
      images: { img1: grocery_1, img2: grocery_2, img3: grocery_3, pos1: 'top' },
      before: [t("groc_b1"), t("groc_b2"), t("groc_b3")],
      after: [{ text: t("groc_a1_t"), f: t("groc_a1_f") }, { text: t("groc_a2_t"), f: t("groc_a2_f") }, { text: t("groc_a3_t"), f: t("groc_a3_f") }],
      feats: [{ n: t("groc_f1_n"), d: t("groc_f1_d"), i: <FaWifi/> }, { n: t("groc_f2_n"), d: t("groc_f2_d"), i: <FaBarcode/> }, { n: t("groc_f3_n"), d: t("groc_f3_d"), i: <FaBell/> }, { n: t("groc_f4_n"), d: t("groc_f4_d"), i: <FaFileInvoiceDollar/> }]
    }
  };

  const d = DOMAINS[active];

  return (
    <Section>
      <Container>
        <Title>{t("selector_main_title")}</Title>
        <SelectorGrid>
          {Object.entries(DOMAINS).map(([key, val]) => (
            <DomainCard key={key} $active={active === key} $color={val.color} onClick={() => setActive(key)}>
              <div style={{color: active === key ? val.color : '#52525b', fontSize: '1.8rem'}}>{val.icon}</div>
              <h3>{val.label}</h3>
              <p>{val.desc}</p>
            </DomainCard>
          ))}
        </SelectorGrid>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{ duration: 0.4 }}>
            <MainContentSplit>
              <VisualColumn>
                <MosaicGrid>
                  <GridItem $area="m-main" $pos={d.images.pos1} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <img src={d.images.img1} alt="Mobile Main" />
                  </GridItem>
                  <GridItem $area="m-top" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <img src={d.images.img2} alt="Mobile UI Top" />
                  </GridItem>
                  <GridItem $area="m-bottom" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <img src={d.images.img3} alt="Mobile UI Bottom" />
                  </GridItem>
                </MosaicGrid>
              </VisualColumn>

              <ContentColumn>
                <div>
                   <CompCard $color="#EF4444">
                    <CompTitle>{t("comp_before_title")}</CompTitle>
                    {d.before.map((line, i) => (
                      <CompLine key={i}><FaTimes color="#EF4444"/> <div>{line}</div></CompLine>
                    ))}
                  </CompCard>
                  
                  <CompCard $color={d.color}>
                    <CompTitle>{t("comp_after_title")}</CompTitle>
                    {d.after.map((line, i) => (
                      <CompLine key={i} $color={d.color}>
                        <FaCheck color={d.color} /> 
                        <div>{line.text} <span className="feat-badge">{line.f}</span></div>
                      </CompLine>
                    ))}
                  </CompCard>
                </div>

                <FeatureGrid>
                  {d.feats.map((f, i) => (
                    <FeatCard key={i} $color={d.color}>
                      {f.i}
                      <div>
                        <h5>{f.n}</h5>
                        <p>{f.d}</p>
                      </div>
                    </FeatCard>
                  ))}
                </FeatureGrid>
              </ContentColumn>
            </MainContentSplit>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default DomainSelector;