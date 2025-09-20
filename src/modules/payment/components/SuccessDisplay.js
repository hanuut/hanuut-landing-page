import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SuccessIllustration from "../../../assets/payment_success.png";


const StatusCard = styled.div`
  width: 90%;
  max-width: 450px;
  padding: 3rem 2rem;
  background-color: #ffffff;
  border-radius: ${(props) => props.theme.defaultRadius};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Illustration = styled.img`
  width: 100%;
  max-width: 250px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Info = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  color: rgba(${(props) => props.theme.textRgba}, 0.5);
`;

const HomeButton = styled(Link)`
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: ${(props) => props.theme.body};
  background-color: ${(props) => props.theme.darkGreen};
  border-radius: ${(props) => props.theme.smallRadius};
  text-decoration: none;
  transition: opacity 0.3s ease;
  &:hover { opacity: 0.9; }
`;

const SuccessDisplay = ({ paymentData }) => {
  const { t } = useTranslation();
  
  return (
    <StatusCard>
      <Illustration src={SuccessIllustration} alt={t("payment_success_title")} />
      <Title>{t("payment_success_title")}</Title>
      <Message>{t("payment_success_message")}</Message>
      <Info>
        {t("payment_order_id")}: {paymentData?.OrderNumber || "N/A"}
      </Info>
      <HomeButton to="/">{t("payment_back_to_home_button")}</HomeButton>
    </StatusCard>
  );
};

export default SuccessDisplay;