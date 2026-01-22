import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const PageWrapper = styled.div`
  background-color: #FDF4E3; 
  min-height: 100vh;
  padding: calc(${props => props.theme.navHeight} + 2rem) 0 4rem 0;
  color: #111217;
  direction: ${props => props.isArabic ? 'rtl' : 'ltr'};
`;

const Container = styled.div`
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.primaryColor};
  margin-bottom: 0.5rem;
  font-family: 'Tajawal', sans-serif;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LastUpdated = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111;
  font-family: 'Tajawal', sans-serif;
`;

const SubTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  color: #444;
`;

const Text = styled.p`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #333;
  white-space: pre-line;
  margin-bottom: 1rem;
  font-family: ${props => props.isArabic ? "'Cairo', sans-serif" : "'Ubuntu', sans-serif"};
`;

const ContactBox = styled.div`
  background-color: rgba(57, 161, 112, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 3rem;
  border: 1px solid ${props => props.theme.primaryColor};
`;

const LegalPageLayout = ({ title, lastUpdated, children }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <PageWrapper isArabic={isArabic}>
      <Helmet>
        <title>{title} | Hanuut Express</title>
      </Helmet>
      <Container>
        <Header>
          <Title>{title}</Title>
          <LastUpdated>{lastUpdated}</LastUpdated>
        </Header>
        {children}
      </Container>
    </PageWrapper>
  );
};

export { LegalPageLayout, Section, SectionTitle, SubTitle, Text, ContactBox };