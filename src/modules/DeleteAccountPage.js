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
  gap: 0.25rem;
  width: 100%;
  max-width: 40%;
  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
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
  margin-top: 10px;
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;
  &.submitting {
    background-color: #eee;
  }
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
const Checkbox = styled.input`
  margin: 0 10px;
`;

const DeleteAccountPage = () => {
  const { t, i18n } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [reasonDescription, setReasonDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDataOnly, setDeleteDataOnly] = useState(false);
  const [deleteAccountWithData, setDeleteAccountWithData] = useState(false);

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    setReasonDescription("");
  };

  const handleReasonDescriptionChange = (event) => {
    setReasonDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const data = {
      fullName,
      phoneNumber,
      password,
      reason,
      reasonDescription,
      deleteDataOnly,
      deleteAccountWithData,
    };
    //const testUrl = process.env.REACT_APP_API_TEST_URL;
    const prodUrl = process.env.REACT_APP_API_PROD_URL;
    try {
      const response = await fetch(prodUrl + "/deleteRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error sending request:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <Title>{t("detleteAccountTitle")}</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Label htmlFor="fullName">{t("deleteAccountFullName")}</Label>
            <Input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="phoneNumber">{t("deleteAccountPhone")}</Label>
            <Input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="password">{t("deleteAccountPassword")}</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="reason">{t("deleteAccountReason")}</Label>
            <Select id="reason" value={reason} onChange={handleReasonChange}>
              <Option value="" disabled>
                {t("deleteAccountReasonHeader")}
              </Option>
              <Option value="No longer need the account">
                {t("reasonNoLongerNeedAccount")}
              </Option>
              <Option value="Privacy concerns">{t("reasonPrivacy")}</Option>
              <Option value="Not satisfied with the service">
                {t("deleteAccountNotSatisfied")}
              </Option>{" "}
              <Option value="Other">{t("deleteAccountreasonOther")}</Option>
            </Select>
          </InputWrapper>
          {reason === "Other" && (
            <InputWrapper>
              <Label htmlFor="reasonDescription">
                {t("deleteAccountOtherReasonsDescription")}
              </Label>
              <TextArea
                id="reasonDescription"
                value={reasonDescription}
                onChange={handleReasonDescriptionChange}
              />
            </InputWrapper>
          )}
          <Label>
            <Checkbox
              type="checkbox"
              checked={deleteDataOnly}
              onChange={(event) => setDeleteDataOnly(event.target.checked)}
            />
            {t("deleteDataOnly")}
          </Label>
          <Label>
            <Checkbox
              type="checkbox"
              checked={deleteAccountWithData}
              onChange={(event) =>
                setDeleteAccountWithData(event.target.checked)
              }
            />
            {t("deleteAccountWithData")}
          </Label>
          <Button
            type="submit"
            className={isSubmitting ? "submitting" : ""}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("buttonIsSubmitting") : t("buttonSubmit")}
          </Button>
        </Form>
        <Message>{t("deleteAccountMessage")}</Message>
      </Container>
    </Section>
  );
};

export default DeleteAccountPage;
