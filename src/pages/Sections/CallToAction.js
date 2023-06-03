import styled from "styled-components";

const CtaSection = styled.section`
  background-color: #f8f8f8;
  padding: 50px;
`;

const CtaTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const CtaSubTitle = styled.p`
  font-size: 20px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 40px;
  text-align: center;
`;

const CtaButton = styled.button`
  background-color: #ff5a5f;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  padding: 15px 30px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #e04043;
  }
`;

function CallToAction() {
  return (
    <CtaSection>
      <CtaTitle>Join Our Community</CtaTitle>
      <CtaSubTitle>
        Sign up today to get access to exclusive features and join our growing
        community of like-minded individuals.
      </CtaSubTitle>{" "}
      <CtaButton>Sign Up Now</CtaButton>
    </CtaSection>
  );
}

export default CallToAction;
