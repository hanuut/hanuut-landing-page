import React from 'react'
import styled from "styled-components";
import { useTranslation } from 'react-i18next';

const Section = styled.h1`
    font-size: ${(props) => props.theme.fontLargest};
    font-weight: 900;
    letter-spacing: 1px;
    color: ${(props) => props.theme.primaryColor}; 
    cursor: default;
`;

const Logo = () => {
  const {t, i18n} = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Section issArabic={isArabic} href='/'>
        {t('appTitle')}
    </Section>
  )
}

export default Logo