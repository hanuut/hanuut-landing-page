// src/modules/Blog/component/BlogPostCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const formatDate = (dateString, locale) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(locale, options);
};

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const CardWrapper = styled.div`
  background-color: ${(props) => props.theme.surface};
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid ${(props) => props.theme.surfaceBorder};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    ${(props) => props.theme.cardHoverEffect};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${(props) => props.theme.surfaceBorder};
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-weight: 600;
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const MetaContainer = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
  margin: 0;
`;

const BlogPostCard = ({ title, imageUrl, author, createdAt, slug }) => {
  const { t, i18n } = useTranslation();
  
  // Use a placeholder if the image URL is missing
  const fullImageUrl = imageUrl || "https://via.placeholder.com/400x250";

  return (
    <CardLink to={`/blog/${slug}`}>
      <CardWrapper>
        <ImageContainer>
          <CardImage src={fullImageUrl} alt={title} loading="lazy" />
        </ImageContainer>
        <ContentContainer>
          <CardTitle>{title}</CardTitle>
          <MetaContainer>
            {author ? `${t('by', 'By')} ${author} • ` : ''}
            {formatDate(createdAt, i18n.language)}
          </MetaContainer>
        </ContentContainer>
      </CardWrapper>
    </CardLink>
  );
};

BlogPostCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
  createdAt: PropTypes.string,
  slug: PropTypes.string.isRequired,
};

export default BlogPostCard;