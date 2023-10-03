import React from "react";
import styled from "styled-components";
import SignUpImage from "../../assets/convenience.svg";
import DeliveryImage from "../../assets/convenience.svg";
import OnboardingImage from "../../assets/convenience.svg";

const Section = styled.section`
  height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;
const Container = styled.div`
  height: 90%;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6rem;
  overflow-y: scroll;
  overflow-x: hidden;



  @media (max-width: 768px) {
    height: 90%;
    width: 90%;
  }
`;

const StepContainer = styled.div`
  width: 100%;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;
const StepConent = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StepNumber = styled.div`
  background-color: ${(props) => props.theme.secondaryColor};
  color: ${(props) => props.theme.body};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const StepDescription = styled.p`
  font-size: 16px;
  margin: 0;

  @media (max-width: 768px) {
    margin-left: 70px;
  }
`;

const ImageStepContainer = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
  @media (max-width: 768px) {
    width: auto;
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.secondaryColor};
  color: ${(props) => props.theme.body};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.03);
  }

  &:active {
    background-color: ${(props) => props.theme.secondaryColor};
  }
`;

const GetStarted = () => {
  return (
    <Section>
      <Container>
        <StepContainer>
          <StepConent>
            <Title>Subscribe request</Title>
            <SubTitle>Create an Account</SubTitle>
            <Description>
              Sign up for a new account to get started with our delivery app.
              It's quick and easy!
            </Description>
            <Button>Sign Up Now</Button>
          </StepConent>
          <ImageStepContainer>
            <Image src={SignUpImage} alt="Sign Up" />
          </ImageStepContainer>
        </StepContainer>

        <StepContainer>
          <ImageStepContainer>
            <Image src={DeliveryImage} alt="Personal Details" />
          </ImageStepContainer>
          <StepConent>
            <SubTitle>Provide Personal Details</SubTitle>
            <Description>
              Complete your profile by providing your personal details,
              including your address and contact information.
            </Description>
            <Step>
              <StepNumber>1</StepNumber>
              <StepDescription>
                Enter your address and contact details.
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>2</StepNumber>
              <StepDescription>
                Add your preferred delivery locations.
              </StepDescription>
            </Step>
          </StepConent>
        </StepContainer>

        <StepContainer>
          <StepConent>
            <SubTitle>Onboarding Process</SubTitle>
            <Description>
              Our onboarding process ensures a smooth start for delivery
              partners. Here's what you can expect:
            </Description>
            <Step>
              <StepNumber>1</StepNumber>
              <StepDescription>
                Background checks and verifications.
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>2</StepNumber>
              <StepDescription>
                Vehicle inspections, if applicable.
              </StepDescription>
            </Step>
            <Step>
              <StepNumber>3</StepNumber>
              <StepDescription>
                Training sessions to familiarize with the app.
              </StepDescription>
            </Step>
          </StepConent>
          <ImageStepContainer>
            <Image src={OnboardingImage} alt="Onboarding Process" />
          </ImageStepContainer>
        </StepContainer>
      </Container>
    </Section>
  );
};

export default GetStarted;
