import React, { useState, useRef, useEffect ,useMemo} from "react";
import styled, { keyframes } from "styled-components";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
// ... imports ...
import { getImageUrl } from "../../../utils/imageUtils"; // <--- IMPORT THIS

// --- Imports ---
import BorderBeamButton from "../../../components/BorderBeamButton"; // The Special Button
import Playstore from "../../../assets/playstore.webp";
import GroceryIllustration from "../../../assets/grocery-illustration.webp"; // The "Old" Image
import ScanImage from "../../../assets/my_hanuut_features/grocery_1.png"; 
import CartImage from "../../../assets/my_hanuut_features/grocery_2.png"; 
import AppIcon from "../../../assets/hanuutLogo.webp"; 

// --- Styled Components ---

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #050505;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  z-index: 1000; /* Ensure it sits on top of everything */

  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ProgressContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 0;
  width: 100%;
  padding: 0 12px;
  z-index: 10;
  display: flex;
  gap: 6px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: white;
    width: ${(props) => (props.$active ? "100%" : "0%")};
    transition: width 0.4s ease;
  }
`;

const SlideWrapper = styled.section`
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  box-sizing: border-box;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* THE FIX: Blur low-quality images and darken them for text contrast */
    filter: blur(6px) brightness(0.6); 
    transform: scale(1.1); /* Scale up slightly to avoid blur edges */
  }

  /* Heavy gradient at bottom for text readability */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.1) 0%,
      rgba(0,0,0,0.2) 40%,
      rgba(0,0,0,0.8) 80%,
      rgba(0,0,0,0.95) 100%
    );
  }
`;

const ContentLayer = styled(motion.div)`
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

// Small circular shop logo
const ShopLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%; /* Circular */
  border: 2px solid rgba(255,255,255,0.8);
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
  object-fit: cover;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  font-family: 'Tajawal', sans-serif;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  
  span {
    color: ${(props) => props.theme.primaryColor || "#39A170"}; 
    /* Optional: Add a background highlight to the span */
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 90%;
  line-height: 1.6;
  font-family: 'Cairo Variable', sans-serif;
`;

const SwipeIndicator = styled(motion.div)`
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-weight: 600;

  &::after {
    content: '↑';
    font-size: 1.4rem;
  }
`;

const Icon = styled.img`
  height: 1.5rem;
  filter: invert(1);
  margin-right: 8px;
`;

// --- Slide Sub-Component ---
const StorySlide = ({ image, logo, title, desc, cta, index, setIndex }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 }); 

  useEffect(() => {
    if (isInView) {
      setIndex(index);
    }
  }, [isInView, index, setIndex]);

  return (
    <SlideWrapper ref={ref}>
      <BackgroundLayer>
        <img src={image} alt="Story Background" />
      </BackgroundLayer>

      <ContentLayer
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {logo && <ShopLogo src={logo} alt="Shop Logo" />}
        <Title dangerouslySetInnerHTML={{ __html: title }} />
        <Description>{desc}</Description>
        {cta}
      </ContentLayer>
      
      {index < 2 && (
        <SwipeIndicator
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* You can add text here if needed like "Swipe" */}
        </SwipeIndicator>
      )}
    </SlideWrapper>
  );
};

const ShopStoryView = ({ shop, shopImage, appLink }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
 const imageUrl = useMemo(() => getImageUrl(shopImage), [shopImage]);
  const slides = [
    {
      // Slide 1: Welcome / Identity
      // Using the "Old Image" (Illustration) as background + Small Shop Logo
      image: GroceryIllustration, 
      logo: imageUrl || AppIcon,
      title: `${t("story_slide1_title")} <br/> <span>${shop.name}</span>`,
      desc: t("grocery_page_info"), 
      cta: null 
    },
    {
      // Slide 2: Feature (Scan)
      image: ScanImage, // Blurred scan image
      logo: null,
      title: t("story_slide2_title"),
      desc: t("story_slide2_desc"),
      cta: null
    },
    {
      // Slide 3: Feature (Cart) + Special Button
      image: CartImage, // Blurred cart image
      logo: null,
      title: t("story_slide3_title"),
      desc: t("story_slide3_desc"),
      cta: (
        <div style={{ marginTop: '1rem' }}>
          <BorderBeamButton onClick={() => window.open(appLink, "_blank")}>
             <Icon src={Playstore} alt="Google Play" />
             <span>{t("story_cta_button")}</span>
          </BorderBeamButton>
        </div>
      )
    }
  ];

  return (
    <Container>
      <ProgressContainer>
        {slides.map((_, i) => (
          <ProgressBar key={i} $active={i <= activeIndex} />
        ))}
      </ProgressContainer>

      {slides.map((slide, i) => (
        <StorySlide
          key={i}
          index={i}
          setIndex={setActiveIndex}
          {...slide}
        />
      ))}
    </Container>
  );
};

export default ShopStoryView;