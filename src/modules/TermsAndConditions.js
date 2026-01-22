import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LegalPageLayout, 
  Section, 
  SectionTitle, 
  SubTitle, 
  Text, 
  ContactBox 
} from '../components/LegalPageLayout';

const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <LegalPageLayout 
      title={t("legal.terms_title")} 
      lastUpdated={t("legal.last_updated")}
    >
      {/* 1. Legal Info */}
      <Section>
        <SectionTitle>{t("legal.terms_sec1_title")}</SectionTitle>
        <Text>{t("legal.terms_sec1_text")}</Text>
      </Section>

      {/* 2. Preamble */}
      <Section>
        <SectionTitle>{t("legal.terms_sec2_title")}</SectionTitle>
        <Text>{t("legal.terms_sec2_text")}</Text>
      </Section>

      {/* 3. Services */}
      <Section>
        <SectionTitle>{t("legal.terms_sec3_title")}</SectionTitle>
        
        <SubTitle>{t("legal.terms_sec3_1_title")}</SubTitle>
        <Text>{t("legal.terms_sec3_1_text")}</Text>

        <SubTitle>{t("legal.terms_sec3_2_title")}</SubTitle>
        <Text>{t("legal.terms_sec3_2_text")}</Text>
      </Section>

      {/* 4. Ordering */}
      <Section>
        <SectionTitle>{t("legal.terms_sec4_title")}</SectionTitle>
        <Text>{t("legal.terms_sec4_text")}</Text>
        
        <SubTitle>{t("legal.terms_sec4_sub_title")}</SubTitle>
        <Text>{t("legal.terms_sec4_sub_text")}</Text>
      </Section>

      {/* 5. Obligations */}
      <Section>
        <SectionTitle>{t("legal.terms_sec5_title")}</SectionTitle>
        <Text>{t("legal.terms_sec5_text")}</Text>
      </Section>

      {/* 6. Liability */}
      <Section>
        <SectionTitle>{t("legal.terms_sec6_title")}</SectionTitle>
        <Text>{t("legal.terms_sec6_text")}</Text>
      </Section>

      {/* 7. Jurisdiction */}
      <Section>
        <SectionTitle>{t("legal.terms_sec7_title")}</SectionTitle>
        <Text>{t("legal.terms_sec7_text")}</Text>
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

export default TermsAndConditions;