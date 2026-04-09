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
import Seo from "../components/Seo";
// Styled Components
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
  background-color: rgba(217, 64, 77, 0.1);
  border: 1px solid ${props => props.theme.error || '#D9404D'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2.5rem;
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    
    <LegalPageLayout 
      title={t("privacy_policy.title")} 
      lastUpdated={t("privacy_policy.last_updated")}
    >
      <Seo title={`${t("privacy_policy.title")} | Hanuut`} description="Hanuut Express Privacy Policy and Data Protection." url="https://hanuut.com/privacy" />
      {/* Account Deletion Link */}
      <DeleteAccountBox>
        {t("privacy_policy.delete_account_pre")}
        <InlineLink to="/delete_account">
          {t("privacy_policy.delete_account_link")}
        </InlineLink>
      </DeleteAccountBox>

      {/* 1. Introduction */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec1_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec1_text")}</Text>
      </Section>

      {/* 2. Roles & Data Collection */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec2_title")}</SectionTitle>
        
        <SubTitle>{t("privacy_policy.sec2_merchant_title")}</SubTitle>
        <Text>{t("privacy_policy.sec2_merchant_text")}</Text>

        <SubTitle>{t("privacy_policy.sec2_worker_title")}</SubTitle>
        <Text>{t("privacy_policy.sec2_worker_text")}</Text>

        <SubTitle>{t("privacy_policy.sec2_driver_title")}</SubTitle>
        <Text>{t("privacy_policy.sec2_driver_text")}</Text>

        <SubTitle>{t("privacy_policy.sec2_customer_title")}</SubTitle>
        <Text>{t("privacy_policy.sec2_customer_text")}</Text>
      </Section>

      {/* 3. Data Usage */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec3_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec3_text")}</Text>
      </Section>

      {/* 4. Location Data */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec4_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec4_text")}</Text>
      </Section>

      {/* 5. Security & Rooting (Mandatory Compliance Text) */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec5_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec5_text")}</Text>
      </Section>

      {/* 6. Third Party Services (Restored Links) */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec6_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec6_text")}</Text>
        <ul style={{ listStylePosition: 'inside', margin: '10px 0' }}>
          <li>
            <ExternalLink 
              href="https://policies.google.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t("privacy_policy.sec6_google")}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink 
              href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t("privacy_policy.sec6_apple")}
            </ExternalLink>
          </li>
        </ul>
      </Section>

      {/* 7. Sharing & Hosting */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec7_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec7_text")}</Text>
      </Section>

      {/* 8. Retention */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec8_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec8_text")}</Text>
      </Section>

      {/* 9. Rights (Law 18-07) */}
      <Section>
        <SectionTitle>{t("privacy_policy.sec9_title")}</SectionTitle>
        <Text>{t("privacy_policy.sec9_text")}</Text>
      </Section>

      {/* 10. Contact */}
      <ContactBox>
        <SubTitle>{t("privacy_policy.contact_title")}</SubTitle>
        <Text>
          {t("privacy_policy.contact_text")} <br/>
          <strong>contact.hanuut@gmail.com</strong>
        </Text>
      </ContactBox>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;