import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// --- Imports ---
import { fetchAllBlogPosts, selectBlog } from '../state/reducers';
import Loader from '../../../components/Loader';
import SpotlightCard from '../../../components/SpotlightCard'; 
import { partnerTheme } from '../../../config/Themes'; 

// --- Styled Components ---

const PageWrapper = styled.div`
  background-color: #050505;
  min-height: 100vh;
  padding: 8rem 0; 
  color: white;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Header = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  font-family: 'Tajawal', sans-serif;
  
  span {
    background: linear-gradient(135deg, #FFFFFF 30%, #F07A48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const PageDesc = styled.p`
  font-size: 1.2rem;
  color: #a1a1aa;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// --- Custom Article Card ---
const ArticleImage = styled.div`
  width: 100%;
  height: 240px;
  background-color: #18181b;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Tag = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  color: #F07A48;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 99px;
  font-weight: 700;
  border: 1px solid rgba(240, 122, 72, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ArticleTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  font-family: 'Tajawal', sans-serif;
  transition: color 0.2s;

  &:hover {
    color: #F07A48;
  }
`;

const ArticleExcerpt = styled.p`
  font-size: 0.95rem;
  color: #a1a1aa;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 0.85rem;
  color: #71717a;
`;

const ReadLink = styled(Link)`
  text-decoration: none;
  display: block;
  height: 100%;
`;

const FeaturedPost = styled.div`
  grid-column: 1 / -1; 
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const BlogListPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(selectBlog);

  useEffect(() => {
    dispatch(fetchAllBlogPosts(i18n.language));
  }, [dispatch, i18n.language]);

  const seo = {
    title: t('blogSeoTitle', 'Hanuut Blog & Resources'),
    description: t('blogSeoDescription'),
  };

  if (loading && posts.length === 0) return <Loader fullscreen={true} />;

  const [heroPost, ...otherPosts] = posts || [];

  return (
    <ThemeProvider theme={partnerTheme}>
      <PageWrapper>
        <Helmet>
          <html lang={i18n.language} />
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
        </Helmet>

        <Container>
          <Header>
            <PageTitle>Hanuut <span>Resources</span></PageTitle>
            <PageDesc>{seo.description}</PageDesc>
          </Header>

          {/* --- Hero Post (Featured) --- */}
          {heroPost && (
             <ReadLink to={`/blog/${heroPost.slug}`}>
                <SpotlightCard>
                   <FeaturedPost>
                      <ArticleImage style={{ height: '400px', marginBottom: 0 }}>
                         {/* DIRECT CLOUDINARY URL */}
                         <img src={heroPost.sourceId} alt={heroPost.title} />
                         <Tag>Featured</Tag>
                      </ArticleImage>
                      <div style={{ padding: '1rem' }}>
                         <ArticleTitle style={{ fontSize: '2.5rem' }}>{heroPost.title}</ArticleTitle>
                         <ArticleExcerpt style={{ fontSize: '1.1rem', WebkitLineClamp: 5 }}>
                            {heroPost.content.replace(/<[^>]*>?/gm, '').substring(0, 250)}...
                         </ArticleExcerpt>
                         <MetaRow>
                            <span>{new Date(heroPost.createdAt).toLocaleDateString()}</span>
                            <span style={{ color: '#F07A48', fontWeight: 'bold' }}>Read Article →</span>
                         </MetaRow>
                      </div>
                   </FeaturedPost>
                </SpotlightCard>
             </ReadLink>
          )}

          {/* --- Grid Posts --- */}
          <Grid>
            {otherPosts.map((post) => (
              <ReadLink to={`/blog/${post.slug}`} key={post._id}>
                <SpotlightCard>
                  <ArticleImage>
                    {/* DIRECT CLOUDINARY URL */}
                    <img src={post.sourceId} alt={post.title} loading="lazy" />
                    <Tag>Guide</Tag>
                  </ArticleImage>
                  <ArticleTitle>{post.title}</ArticleTitle>
                  <ArticleExcerpt>
                    {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </ArticleExcerpt>
                  <MetaRow>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post.author || "Hanuut Team"}</span>
                  </MetaRow>
                </SpotlightCard>
              </ReadLink>
            ))}
          </Grid>

          {posts.length === 0 && !loading && (
             <p style={{ textAlign: 'center', color: '#555' }}>{t("blogNoPosts")}</p>
          )}

        </Container>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default BlogListPage;