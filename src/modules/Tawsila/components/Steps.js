import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Section = styled.section`
      direction: ${props => (props.isArabic ? "rtl" : "ltr")};
      text-direction: ${props => (props.isArabic ? "rtl" : "ltr")};
      width: 80%;
    `;

    const StepsContainer = styled.div`
      display: grid;
      grid-template-columns: repeat(${props => (props.nbSteps !=null ? props.nbSteps : 3)}, 1fr);
      gap: 20px;
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    `;

    const StepCart = styled.div`
  position: relative;
  background-color: ${props => props.backGroundColor != null ? props.backGroundColor : 'white'};
  border-radius: 20px;
  overflow: hidden;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
      width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
position: relative;
z-index: 1;
padding: 20px;
border-radius: 20px;
text-align: center;
color: ${props => props.textColor !=null ? props.textColor : 'black'};
`;

    const StepImage = styled.img`
      width: 100%;
      border-radius: 20px;
      height: auto;
    `;

    const StepText = styled.p`
      margin-top: 10px;
      font-size: ${props => props.subtext !=null ? '1.6rem' : '1.4rem'};
      font-weight: bold;
      text-align: center;
    `;

    const StepSubText = styled.p`
      margin-top: 10px;
      font-size: 1.8rem;
      font-weight: normal;
      text-align: center;
      color: ${props => props.textColor !=null ? props.textColor : 'black'};
    `;

    const Steps = ({ title, steps, isArabic }) => {
      return (
        <Section isArabic={isArabic}>
          <StepsContainer nbSteps={steps.length}>
            {steps.map((step, index) => (
              <StepCart key={index} backgroundImage={step.backgroundImage} backGroundColor={step.backGroundColor}>
                {step.image && <StepImage src={step.image} alt={`Step ${index + 1}`} />}
                <ContentWrapper hasBackgroundImage={!!step.backgroundImage} textColor={step.textColor}>
                
                  {/* <StepNumber>{index + 1}</StepNumber> */}

                  <StepText subtext = {step.subtext}>{step.text}</StepText>
                  <StepSubText textColor={step.textColor}>{step.subtext}</StepSubText>
                </ContentWrapper>
              </StepCart>
            ))}
          </StepsContainer>
        </Section>
      );
    };

export default Steps;