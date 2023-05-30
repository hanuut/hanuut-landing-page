import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ActionButton from '../components/ActionButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: 900;
  color: ${(props) => props.theme.primaryColor};
`;

const Message = styled.p`
font-size: ${(props) => props.theme.fontxl};
  color: #666;
  text-align: center;
`;

const NotFoundPage = () => {
  return (
    <Wrapper>
      <Title>404 - Page Not Found</Title>
      <Message>We couldn't find the page you were looking for.</Message>
      <Link to='/'><ActionButton>
        Go Back To Home
      </ActionButton></Link>
      
    </Wrapper>
  );
}

export default NotFoundPage;