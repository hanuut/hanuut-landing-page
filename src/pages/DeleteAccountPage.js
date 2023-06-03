import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Section = styled.section`
min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
background-color: ${(props) => props.theme.body};
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
@media (max-width: 768px) {
  min-height: 100vh;
}
`;
const Container = styled.div`
direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 768px) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 40%;
  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: ${(props) => props.theme.fontlg};
  margin-bottom: 5px;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: ${(props) => props.theme.fontxl};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: ${(props) => props.theme.fontlg};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Option = styled.option`
  font-size: ${(props) => props.theme.fontlg};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: ${(props) => props.theme.fontlg};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Button = styled.button`
background-color: ${(props) => props.theme.primaryColor};
color: #fff;
border: none;
border-radius: 5px;
padding: ${(props) => props.theme.actionButtonPadding};
font-size: ${(props) => props.theme.fontxl};
cursor: pointer;
transition: all 0.5s ease;

&:hover {
  transform: scale(1.03);
}

@media (max-width: 768px) {
  font-size: ${(props) => props.theme.fontlg};
  padding: ${(props) => props.theme.actionButtonPaddingMobile};
}
`;

const Message = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  margin-top: 20px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
    padding: 20px;
  }
`;

const DeleteAccountPage = () => {
  const { t, i18n } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [reasonDescription, setReasonDescription] = useState("");

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    setReasonDescription("");
  };

  const handleReasonDescriptionChange = (event) => {
    setReasonDescription(event.target.value);
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    const data = {
      fullName,
      phoneNumber,
      password,
      reason,
      reasonDescription
    };
    try {
      const response = await fetch('https://hanuut.cyclic.app/deleteRequest', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
  
    } catch (error) {
      console.log('notSubbmitted');
      console.error('Error sending request:', error);
    }
  };
  return (
    <Section>
    <Container isArabic={i18n.language === "ar"}>
      <Title>{t('detleteAccountTitle')}</Title>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label htmlFor="fullName">{t('deleteAccountFullName')}</Label>
          <Input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="phoneNumber">{t('deleteAccountPhone')}</Label>
          <Input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="password">{t('deleteAccountPassword')}</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="reason">{t('deleteAccountReason')}</Label>
          <Select
            id="reason"
            value={reason}
            onChange={handleReasonChange}
            required
          >
            <Option value="" disabled>
            {t('deleteAccountReasonHeader')}
            </Option>
            <Option value="No longer need the account">
            {t('reasonNoLongerNeedAccount')}
            </Option>
            <Option value="Privacy concerns">{t('reasonPrivacy')}</Option>
            <Option value="Not satisfied with the service">
            {t('deleteAccountNotSatisfied')}
            </Option>{" "}
            <Option value="Other">{t('deleteAccountreasonOther')}</Option>
          </Select>
        </InputWrapper>
        {reason === "Other" && (
          <InputWrapper>
            <Label htmlFor="reasonDescription">{t('deleteAccountOtherReasonsDescription')}</Label>
            <TextArea
              id="reasonDescription"
              value={reasonDescription}
              onChange={handleReasonDescriptionChange}
              required
            />
          </InputWrapper>
        )}
        <Button type="submit">{t('deleteAccountButton')}</Button>
      </Form>
      <Message>
      {t('deleteAccountMessage')}
      </Message>
    </Container>
    </Section>
  );
};

export default DeleteAccountPage;
