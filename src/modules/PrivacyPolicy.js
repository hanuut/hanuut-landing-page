import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  LegalPageLayout, 
  Section, 
  SectionTitle, 
  Text, 
  ContactBox,
  SubTitle 
} from '../components/LegalPageLayout';

// Styled Link for the text content
const InlineLink = styled(Link)`
  color: ${props => props.theme.primaryColor};
  font-weight: bold;
  text-decoration: underline;
`;

const ExternalLink = styled.a`
  color: ${props => props.theme.primaryColor};
  font-weight: bold;
  text-decoration: underline;
  display: block;
  margin-top: 0.5rem;
`;

const DeleteAccountBox = styled.div`
  background-color: rgba(217, 64, 77, 0.1); /* Light Red background */
  border: 1px solid ${props => props.theme.error};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
`;

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <LegalPageLayout 
      title={t("legal.privacy_title")} 
      lastUpdated={t("legal.last_updated")}
    >
      {/* Mandatory Account Deletion Link */}
      <DeleteAccountBox>
        {t("legal.privacy_delete_account_pre")}
        <InlineLink to="/delete_account">
          {t("legal.privacy_delete_account_link")}
        </InlineLink>
      </DeleteAccountBox>

      {/* 1. Controller */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec1_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec1_text")}</Text>
      </Section>

      {/* 2. Collection */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec2_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec2_text")}</Text>
      </Section>

      {/* 3. Purpose */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec3_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec3_text")}</Text>
      </Section>

      {/* 4. Security & Rooting (MANDATORY TEXT) */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec4_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec4_text")}</Text>
      </Section>

      {/* 5. Third Party Services (MANDATORY TEXT) */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec5_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec5_text")}</Text>
        <ul style={{ listStylePosition: 'inside', margin: '10px 0' }}>
          <li>
            <ExternalLink 
              href="https://policies.google.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t("legal.privacy_google_play")}
            </ExternalLink>
          </li>
        </ul>
      </Section>

      {/* 6. Sharing */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec6_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec6_text")}</Text>
      </Section>

      {/* 7. Rights */}
      <Section>
        <SectionTitle>{t("legal.privacy_sec7_title")}</SectionTitle>
        <Text>{t("legal.privacy_sec7_text")}</Text>
      </Section>

      <ContactBox>
        <SubTitle>{t("legal.contact_us")}</SubTitle>
        <Text>
          {t("legal.contact_text")} <strong>contact@hanuut.com</strong>
        </Text>
      </ContactBox>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;