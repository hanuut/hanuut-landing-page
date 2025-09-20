import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerOrder } from "./services/paymentServices";
import Loader from "../../components/Loader";

// --- Styled Components ---

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9ff;
  padding: 1rem;
`;

const PaymentCard = styled.div`
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

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin-bottom: 2rem;
`;

const AmountLabel = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
`;

const AmountDisplay = styled.p`
  font-size: 3rem;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
  margin-bottom: 2.5rem;
`;

const ProceedButton = styled.a`
  display: block;
  width: 100%;
  padding: 1rem 2rem;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 600;
  color: ${(props) => props.theme.body};
  background-color: ${(props) => props.theme.darkGreen};
  border-radius: ${(props) => props.theme.smallRadius};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { opacity: 0.9; }
`;

const ErrorMessage = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.redColor};
  line-height: 1.6;
`;

const PaymentProcessingPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (orderId && amount) {
      const processOrder = async () => {
        try {
          const response = await registerOrder({ orderId, amount });
          // Assuming the API returns the URL in a `formUrl` property
          if (response.data && response.data.formUrl) {
            setPaymentUrl(response.data.formUrl);
          } else {
            setError(t("payment_processing_error_url"));
          }
        } catch (err) {
          setError(t("payment_processing_error_api"));
          console.error("Failed to register order:", err);
        } finally {
          setIsLoading(false);
        }
      };
      processOrder();
    } else {
      setError(t("payment_processing_error_missing_params"));
      setIsLoading(false);
    }
  }, [orderId, amount, t]);

  if (isLoading) {
    return <PageWrapper><Loader /></PageWrapper>;
  }

  return (
    <PageWrapper>
      <PaymentCard>
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <Title>{t("payment_processing_title")}</Title>
            <AmountLabel>{t("payment_amount_label")}</AmountLabel>
            <AmountDisplay>{parseFloat(amount) / 100} {t("dzd")}</AmountDisplay>
            <ProceedButton href={paymentUrl}>
              {t("payment_proceed_button")}
            </ProceedButton>
          </>
        )}
      </PaymentCard>
    </PageWrapper>
  );
};

export default PaymentProcessingPage;