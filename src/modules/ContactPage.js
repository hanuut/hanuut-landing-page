import React from 'react'
import styled from "styled-components";

const Section = styled.section`
  width: 100vw;
  min-height: 100vh;
  background-color: ${(props) => props.theme.primarycolor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactPage = () => {
  return (
    <Section>ContactPage</Section>
  )
}

export default ContactPage