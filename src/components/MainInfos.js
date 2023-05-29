import React from "react";
import styled from "styled-components";

const Section = styled.section`
  width: 100vw;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 0.5rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 2rem;
`;

const Email = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.body};
  transition: all 0.2s ease;
`;

const Address = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.body};
  transition: all 0.2s ease;
`;

const Phone = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.body};
  transition: all 0.2s ease;
`;
const MainInfos = () => {
  return (
    <Section>
      <ContactInfo>
        <InfoItem>
          <Email href="mailto:contact@hanuut.com">contact@hanuut.com</Email>
        </InfoItem>
        <InfoItem>
          <Address href="">
            Arris, Batna Algeria
          </Address>
        </InfoItem>
        <InfoItem>
          <Phone href="tel:+48 508 788 359">0552 93 15 81</Phone>
        </InfoItem>
      </ContactInfo>
    </Section>
  );
};

export default MainInfos;
