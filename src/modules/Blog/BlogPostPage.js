// src/modules/Blog/BlogPostPage.js

import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  fetchBlogPostBySlug,
  clearSelectedPost,
  selectBlog,
} from "./state/reducers";
import Loader from "../../components/Loader";

const formatDate = (dateString, locale) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(locale, options);
};

const PostSection = styled.article`
  background-color: ${(props) => props.theme.body};
  padding: 4rem 0;
  min-height: calc(100vh - ${(props) => props.theme.navHeight});
`;

const PostContainer = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  background-color: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.surfaceBorder};
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HeaderImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.smallRadius};
  margin-bottom: 2rem;
  background-color: ${(props) => props.theme.surfaceBorder};
`;

const PostTitle = styled.h1`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontxxxl};
  color: ${(props) => props.theme.text};
  line-height: 1.3;
  margin-bottom: 1rem;
`;

const PostMeta = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
  margin-bottom: 2.5rem;
`;

const PostContent = styled.div`
  font-size: ${(props) => props.theme.fontlg};
  line-height: 1.8;
  color: ${(props) => props.theme.text};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${(props) => props.theme.text};
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  p {
    margin-bottom: 1.5rem;
  }
  a {
    color: ${(props) => props.theme.primary};
    text-decoration: underline;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5rem 0;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  flex-direction: column;
  gap: 1rem;
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
`;

const BackLink = styled(Link)`
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { selectedPost, selectedPostLoading, selectedPostError } =
    useSelector(selectBlog);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogPostBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [slug, dispatch]);

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  const generateMetaDescription = (content) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>?/gm, " ");
    return plainText.substring(0, 155).trim() + "...";
  };

  // 1. If we are loading, ALWAYS show the loader.
  if (selectedPostLoading) {
    return (
      <PostSection>
        <StatusContainer>
          <Loader fullscreen={false} />
        </StatusContainer>
      </PostSection>
    );
  }

  // 2. If loading is finished AND there is an error OR there is no post, show the "Not Found" message.
  if (!selectedPostLoading && (selectedPostError || !selectedPost)) {
    return (
      <PostSection>
        <Helmet>
          <title>{t("postNotFoundSeoTitle", "Post Not Found")}</title>
        </Helmet>
        <StatusContainer>
          <StatusMessage>
            {t(
              "blogPostError",
              "The article you are looking for could not be found."
            )}
          </StatusMessage>
          <BackLink to="/blog">{t("backToBlog", "← Back to Blog")}</BackLink>
        </StatusContainer>
      </PostSection>
    );
  }

  // 3. If we've made it this far, loading is finished, there is no error, and we have a post.
  const { title, content, author, createdAt, sourceId } = selectedPost;
  const metaDescription = generateMetaDescription(content);

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{title} | Hanuut</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://www.hanuut.com/blog/${slug}`} />
      </Helmet>

      <PostSection>
        <PostContainer>
          <header>
            <PostTitle>{title}</PostTitle>
            <PostMeta>
              {t("postedBy", "By")} {author} •{" "}
              {formatDate(createdAt, i18n.language)}
            </PostMeta>
            {sourceId && <HeaderImage src={sourceId} alt={title} />}
          </header>
          <PostContent dangerouslySetInnerHTML={createMarkup(content)} />
        </PostContainer>
      </PostSection>
    </>
  );
};

export default BlogPostPage;
