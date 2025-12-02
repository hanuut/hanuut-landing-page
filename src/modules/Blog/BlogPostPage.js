import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useSpring } from "framer-motion";

import { fetchBlogPostBySlug, clearSelectedPost, selectBlog } from "./state/reducers";
import Loader from "../../components/Loader";
import { partnerTheme } from "../../config/Themes";

const PageWrapper = styled.article`
  background-color: #050505;
  min-height: 100vh;
  color: #e4e4e7; /* Zinc 200 */
  padding-bottom: 6rem;
`;

// Reading Progress Bar
const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #F07A48;
  transform-origin: 0%;
  z-index: 9999;
`;

const HeaderSection = styled.header`
  width: 100%;
  height: 60vh;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4rem;
  overflow: hidden;

  /* Background Image (Cloudinary) with Scrim */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${(props) => props.$bg});
    background-size: cover;
    background-position: center;
    /* Dim the image so text is readable */
    filter: brightness(0.4);
    z-index: 0;
  }
  
  /* Gradient fade into content */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, #050505 100%);
    z-index: 1;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: 90%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  font-family: 'Tajawal', sans-serif;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const Meta = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
`;

const ContentContainer = styled.div`
  max-width: 740px; 
  width: 90%;
  margin: 0 auto;
  font-size: 1.15rem;
  line-height: 1.8;
  font-family: 'Cairo', sans-serif; 

  /* Markdown/HTML Styles for Dark Mode */
  h1, h2, h3, h4 {
    color: white;
    margin-top: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }
  
  h2 { font-size: 2rem; border-left: 4px solid #F07A48; padding-left: 1rem; }
  h3 { font-size: 1.5rem; }
  
  p { margin-bottom: 1.5rem; color: #d4d4d8; }
  
  a { 
    color: #F07A48; 
    text-decoration: none; 
    border-bottom: 1px solid rgba(240, 122, 72, 0.3);
    transition: all 0.2s;
    &:hover { border-color: #F07A48; }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 2rem 0;
    border: 1px solid #27272a;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    color: #d4d4d8;
  }
  
  li { margin-bottom: 0.5rem; }
`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { selectedPost, selectedPostLoading } = useSelector(selectBlog);

  // Hook for the reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

        <ContentContainer dangerouslySetInnerHTML={{ __html: content }} />

      </PageWrapper>
    </ThemeProvider>
  );
};

export default BlogPostPage;