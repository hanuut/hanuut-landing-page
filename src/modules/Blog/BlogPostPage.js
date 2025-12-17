import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import parse from 'html-react-parser'; 

import { fetchBlogPostBySlug, clearSelectedPost, selectBlog } from "./state/reducers";
import Loader from "../../components/Loader";
import { partnerTheme } from "../../config/Themes";

// --- STYLED COMPONENTS ---

const PageWrapper = styled.article`
  background-color: #050505;
  min-height: 100vh;
  color: #e4e4e7;
  padding-bottom: 6rem;
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; height: 4px;
  background: #F07A48;
  transform-origin: 0%;
  z-index: 9999;
`;

const HeaderSection = styled.header`
  width: 100%; height: 60vh; position: relative;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 4rem; overflow: hidden;

  &::before {
    content: ''; position: absolute; inset: 0;
    background-image: url(${(props) => props.$bg});
    background-size: cover; background-position: center;
    filter: brightness(0.4); z-index: 0;
  }
  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 0%, #050505 100%);
    z-index: 1;
  }
`;

const HeaderContent = styled.div`
  position: relative; z-index: 2; max-width: 800px; width: 90%; text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; color: white;
  line-height: 1.2; margin-bottom: 1.5rem; font-family: 'Tajawal', sans-serif;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const Meta = styled.div`
  display: flex; justify-content: center; gap: 1rem;
  font-size: 1rem; color: rgba(255,255,255,0.7);
`;

// --- CAROUSEL COMPONENTS ---

const CarouselWrapper = styled.div`
  position: relative; /* Anchor for absolute overlay */
  margin: 3rem auto;
  width: 100%;
  /* Fixed height to prevent 9:16 images from breaking the page */
  height: 55vh; 
  max-height: 800px; 
  min-height: 400px;
  background: #0f0f0f;
  border-radius: 16px;
  border: 1px solid #27272a;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
`;

const MainImageDisplay = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Ensures the whole image is seen within the fixed height */
  display: block;
`;

const ThumbnailsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  
  display: flex;
  justify-content: center; /* Top Center alignment */
  gap: 12px;
  
  padding: 1.5rem 1rem 4rem 1rem; /* Extra bottom padding for gradient fade */
  
  /* Black Transparent Gradient: Dark at top, transparent downwards */
  background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
  
  overflow-x: auto;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Thumbnail = styled.div`
  flex: 0 0 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  
  /* Highlight active thumb */
  border: 2px solid ${props => props.$active ? '#F07A48' : 'rgba(255,255,255,0.3)'};
  opacity: ${props => props.$active ? 1 : 0.6};
  transform: ${props => props.$active ? 'scale(1.1)' : 'scale(1)'};
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin: 0 !important;
    border: none !important;
    display: block !important;
  }
`;

// --- INTERACTIVE CAROUSEL LOGIC ---
const InteractiveCarousel = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <CarouselWrapper>
      {/* Thumbnails Overlay */}
      {images.length > 1 && (
        <ThumbnailsOverlay>
          {images.map((img, idx) => (
            <Thumbnail 
              key={idx} 
              $active={idx === activeIdx}
              onClick={() => setActiveIdx(idx)}
            >
              <img src={img} alt={`thumb-${idx}`} />
            </Thumbnail>
          ))}
        </ThumbnailsOverlay>
      )}

      {/* Main Image */}
      <AnimatePresence mode="wait">
        <MainImageDisplay
          key={activeIdx}
          src={images[activeIdx]}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
    </CarouselWrapper>
  );
};

// --- CONTENT CONTAINER ---
const ContentContainer = styled.div`
  max-width: 800px; width: 90%; margin: 0 auto;
  font-size: 1.2rem; line-height: 1.8; font-family: 'Cairo', sans-serif; 
  overflow-wrap: break-word;

  h1, h2, h3, h4 {
    color: white; margin-top: 3.5rem; margin-bottom: 1.5rem;
    font-weight: 800; line-height: 1.3;
  }
  h2 { font-size: 2.2rem; color: #F07A48; }
  
  p { margin-bottom: 2rem; color: #d4d4d8; }
  
  a { 
    color: #F07A48; text-decoration: none; border-bottom: 1px solid rgba(240, 122, 72, 0.3);
    &:hover { border-color: #F07A48; background-color: rgba(240, 122, 72, 0.1); }
  }

  blockquote {
    border-left: 4px solid #F07A48; background: rgba(255,255,255,0.03);
    padding: 1.5rem 2rem; margin: 2.5rem 0; font-style: italic; color: #fff;
    border-radius: 0 12px 12px 0;
  }

  /* --- Standalone Images (Not inside carousel) --- */
  /* Global safe rule */
  > img {
    display: block; margin: 2.5rem auto; 
    max-width: 100%; height: auto;
    border-radius: 12px; 
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid #27272a;
  }

  /* Limit width of portrait images so they don't fill the screen vertically */
  > img.ratio-9-16, > img.ratio-3-4 {
    max-width: 320px; 
    width: 100%;
  }
  
  > img.ratio-16-9 { width: 100%; }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    /* On mobile, allow portrait images to be wider if needed */
    > img.ratio-9-16 { max-width: 80%; }
  }
`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { selectedPost, selectedPostLoading } = useSelector(selectBlog);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (slug) dispatch(fetchBlogPostBySlug(slug));
    return () => dispatch(clearSelectedPost());
  }, [slug, dispatch]);

  if (selectedPostLoading) return <Loader fullscreen={true} />;
  
  if (!selectedPost && !selectedPostLoading) {
    return (
       <ThemeProvider theme={partnerTheme}>
          <PageWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <h2>{t("postNotFoundSeoTitle")}</h2>
          </PageWrapper>
       </ThemeProvider>
    );
  }

  const { title, content, createdAt, sourceId } = selectedPost;

  // --- HTML PARSER CONFIG ---
  const options = {
    replace: (domNode) => {
      // Detect the Dashboard-generated Carousel Div
      if (domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes('blog-carousel')) {
        const images = [];
        
        // Extract all <img> srcs inside this div
        if (domNode.children) {
          domNode.children.forEach(child => {
            // Remove text nodes (newlines) and check for img tags
            if (child.type === 'tag' && child.name === 'img' && child.attribs && child.attribs.src) {
              images.push(child.attribs.src);
            }
          });
        }

        // Render the React Component instead of the div
        return <InteractiveCarousel images={images} />;
      }
    }
  };

  return (
    <ThemeProvider theme={partnerTheme}>
      <PageWrapper>
        <Helmet>
          <title>{title} | Hanuut</title>
        </Helmet>

        <ProgressBar style={{ scaleX }} />

        <HeaderSection $bg={sourceId}>
           <HeaderContent>
              <Title>{title}</Title>
              <Meta>
                 <span>{new Date(createdAt).toLocaleDateString()}</span>
                 <span>•</span>
                 <span>{selectedPost.author || "Hanuut"}</span>
              </Meta>
           </HeaderContent>
        </HeaderSection>

        {/* Use the parser to render content + components */}
        <ContentContainer>
          {parse(content, options)}
        </ContentContainer>

      </PageWrapper>
    </ThemeProvider>
  );
};

export default BlogPostPage;