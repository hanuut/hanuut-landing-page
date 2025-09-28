// src/modules/Blog/component/BlogListPage.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { fetchAllBlogPosts, selectBlog } from '../state/reducers';
import BlogPostCard from './BlogPostCard';
import Loader from '../../../components/Loader';

// --- Styled Components Using the New Theme ---

const BlogSection = styled.div`
  background-color: ${(props) => props.theme.body};
  min-height: calc(100vh - ${(props) => props.theme.navHeight});
  padding: 4rem 0;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontxxxl};
  color: ${(props) => props.theme.text};
  margin-bottom: 2.5rem;
  text-align: center;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
`;

const BlogListPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(selectBlog);

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(fetchAllBlogPosts());
    }
  }, [dispatch, posts]);

  const currentLanguage = i18n.language;
  const seo = {
    title: t('blogSeoTitle', 'Hanuut Blog & Resources'),
    description: t('blogSeoDescription', 'Tips, guides, and resources for local shop owners to grow their business with Hanuut.'),
  };

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href="https://www.hanuut.com/blog" />
      </Helmet>

      <BlogSection>
        <PageContainer>
          <PageTitle>{t('blogPageTitle', 'Hanuut Blog & Resources')}</PageTitle>
          
          {loading && <Loader fullscreen={false} />}

          {error && <StatusMessage>{t('blogError', 'There was an error loading the articles.')}</StatusMessage>}
          
          {!loading && !error && posts.length === 0 && (
            <StatusMessage>{t('blogNoPosts', 'No articles found. Check back soon!')}</StatusMessage>
          )}

          {!loading && !error && posts.length > 0 && (
            <PostsGrid>
              {posts.map((post) => (
                <BlogPostCard
                  key={post._id}
                  slug={post.slug}
                  title={post.title}
                  imageUrl={post.sourceId}
                  author={post.author}
                  createdAt={post.createdAt}
                />
              ))}
            </PostsGrid>
          )}
        </PageContainer>
      </BlogSection>
    </>
  );
};

export default BlogListPage;