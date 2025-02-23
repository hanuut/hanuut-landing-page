import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

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
  padding: 4rem 0;
  z-index: 2;
  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

const RightBox = styled.div`
  position: sticky;
  top: 0;
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
  }
`;

const Feature = styled(motion.div)`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 16px;
  margin: 2rem 0;
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
  object-fit: cover;
`;

const ProgressContainer = styled(motion.div)`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  backdrop-filter: blur(8px);
  z-index: 1000;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
`;

const FeatureScroll = React.forwardRef(({ features }, ref) => {
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
  return (
    <Container>
      <ProgressContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressBar
          style={{ width: `${scrollProgress}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </ProgressContainer>

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
