import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// --- Styled Components for a clean, readable text page ---

const PageWrapper = styled.main`
  width: 100%;
  padding: 4rem 0;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 90%;
  max-width: 800px; /* Optimal width for reading long text */
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const MainTitle = styled.h1`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.75);
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  list-style-position: inside;
  padding-left: ${(props) => (props.isArabic ? "0" : "1rem")};
  padding-right: ${(props) => (props.isArabic ? "1rem" : "0")};
`;

const ListItem = styled.li`
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.75);
  line-height: 1.7;
  margin-bottom: 0.5rem;
`;

const SatimTermsAndConditions = () => {
  const { t, i18n } = useTranslation();

  // This one line fetches the entire structured object from your JSON file
  const content = t("satim_terms", { returnObjects: true });

  return (
    <PageWrapper>
      <ContentContainer isArabic={i18n.language === "ar"}>
        <MainTitle>{content.main_title}</MainTitle>

        {/* We now map over the structured data instead of hardcoding text */}
        {content.sections.map((section, index) => (
          <Section key={index}>
            <SectionTitle>{section.title}</SectionTitle>
            
            {section.paragraphs?.map((p, pIndex) => (
              <Paragraph key={pIndex}>{p}</Paragraph>
            ))}

            {section.list_items && (
              <List isArabic={i18n.language === "ar"}>
                {section.list_items.map((item, itemIndex) => (
                  <ListItem key={itemIndex}>{item}</ListItem>
                ))}
              </List>
            )}
          </Section>
        ))}
      </ContentContainer>
    </PageWrapper>
  );
};

export default SatimTermsAndConditions;