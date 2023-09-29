import React from "react";
import styled from "styled-components";

const Section = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    color: ${(props) => props.theme.text};
    font-size: ${(props) => props.theme.fontxxl};
    text-align: center;
  }
  a {
    margin-top: 3px;
    color: ${(props) => props.theme.secondaryColor};
    font-size: ${(props) => props.theme.fontxxxl};
    text-align: center;
  }
`;
const MessageWithLink = ({ message, link, linkText }) => {
  return (
    <Section>
      <p>{message}</p>
      <a href={link + ""}>{linkText}</a>
    </Section>
  );
};

export default MessageWithLink;
