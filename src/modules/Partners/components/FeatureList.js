import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: ${(props) => props.theme.background};
  isolation: isolate;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    min-height: auto;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftBox = styled.div`
  padding: 1rem 3rem;
  z-index: 2;
  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

const RightBox = styled.div`
  position: sticky;
  top: 0;
  padding: 10rem 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-left: 1px solid rgba(255, 255, 255, 0.1);
  @media (max-width: 768px) {
    width: 100%;
    height: 60vh;
    position: relative;
    padding: 0 0;
  }
`;

const Feature = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 16px;
  margin: 2rem 0;

  @media (max-width: 768px) {
    min-height: 50vh;
  }
`;

const FeatureTitle = styled(motion.h2)`
  font-size: 3.5rem;
  color: ${(props) => props.theme.primaryColor};
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(${(props) => props.theme.orangeColorRgba}, 0.4);
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const FeatureDescription = styled(motion.p)`
  font-size: 1.25rem;
  color: ${(props) => props.theme.text};
  line-height: 1.8;
  max-width: 800px;
  font-weight: 500;
  opacity: 0.9;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FeatureImage = styled(motion.img)`
  margin-top: 2rem;
  width: 100%;
  max-height: 70vh;
  object-fit: cover;
`;

const FeaturesContainer = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FeatureSection = styled.div`
  padding: 0.5rem;
`;

const FeatureStepTitle = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.primaryColor};
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const FeatureParagraph = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.text};
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const FeatureScroll = React.forwardRef(({ features, selectedFeature }, ref) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const featureRefs = useRef([]);
  const containerRef = useRef();

  // Reset refs when features change
  useEffect(() => {
    featureRefs.current = features.map(
      (_, i) => featureRefs.current[i] ?? null
    );
  }, [features]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
      }
    };

    const currentContainer = containerRef.current;
    currentContainer?.addEventListener("scroll", handleScroll);
    return () => currentContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) setActiveFeatureIndex(index);
          }
        });
      },
      { root: null, threshold: 0.5 }
    );

    // Filter out null refs before observing
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [features]);

  // Add this to ensure proper cleanup
  useEffect(() => {
    return () => {
      featureRefs.current = [];
    };
  }, []);

  const { t, i18n } = useTranslation();

  // Domain content from l18n
  const domainContent = {
    features: {
      supermarkets: t("myHanuutFeatures.grocerySections", {
        returnObjects: true,
      }),
      foodShops: t("myHanuutFeatures.foodSections", { returnObjects: true }),
      globalShops: t("myHanuutFeatures.ecomSections", { returnObjects: true }),
    },
  };

  // Get the appropriate sections for the selected category
  const currentFeaturesSteps = domainContent.features[selectedFeature] || [];
  const generateSteps = (indx) => {
    return selectedFeature === "supermarkets"
      ? indx === 0
        ? currentFeaturesSteps.slice(1, 3)
        : indx === 1
        ? currentFeaturesSteps.slice(3, 5)
        : currentFeaturesSteps.slice(5, 7)
      : selectedFeature === "foodShops"
      ? indx === 0
        ? currentFeaturesSteps.slice(1, 3)
        : indx === 1
        ? currentFeaturesSteps.slice(3, 5)
        : currentFeaturesSteps.slice(5, 6)
      : indx === 0
      ? currentFeaturesSteps.slice(1, 2)
      : indx === 1
      ? currentFeaturesSteps.slice(2, 3)
      : currentFeaturesSteps.slice(3, 4);
  };

  return (
    <Container>
      <ContentWrapper ref={containerRef}>
        <LeftBox ref={ref}>
          {features.map((feature, index) => (
            <Feature
              key={feature.title}
              ref={(el) => (featureRefs.current[index] = el)}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.5 }}
            >
              <FeatureTitle
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {feature.title}
              </FeatureTitle>
              <FeatureDescription
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {feature.description}
              </FeatureDescription>

              <FeaturesContainer>
                {generateSteps(index).map((section, indexS) => (
                  <FeatureSection key={indexS}>
                    <FeatureStepTitle>{section.title}</FeatureStepTitle>
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <FeatureParagraph key={pIndex}>
                        {paragraph}
                      </FeatureParagraph>
                    ))}
                  </FeatureSection>
                ))}
              </FeaturesContainer>
            </Feature>
          ))}
        </LeftBox>

        <RightBox>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <FeatureImage
                src={features[activeFeatureIndex].image}
                alt={features[activeFeatureIndex].title}
              />
            </motion.div>
          </AnimatePresence>
        </RightBox>
      </ContentWrapper>
    </Container>
  );
});

export default FeatureScroll;
