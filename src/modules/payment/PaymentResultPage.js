import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { confirmOrder } from "./services/paymentServices";
import { SatimConfirmationErrorCodes } from "./models/paymentErrorCodes.js";

// We will create these two new, clean components next
import SuccessDisplay from "./components/SuccessDisplay";
import FailureDisplay from "./components/FailureDisplay";
import Loader from "../../components/Loader";

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9ff;
`;

const PaymentResultPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Only run if we have an orderId and haven't fetched yet
    if (orderId && isLoading) {
      const fetchPaymentStatus = async () => {
        try {
          const response = await confirmOrder(orderId);
          const responseData = response.data;
          setPaymentData(responseData);

          // Check if the confirmation was successful
          const errorCode = responseData.ErrorCode;
          if (errorCode === "0" || errorCode === "2") { // 0: Success, 2: Already Confirmed
            setIsSuccess(true);
          } else {
            setIsSuccess(false);
          }
        } catch (error) {
          console.error("Payment confirmation failed:", error);
          setIsSuccess(false);
          setPaymentData({ ErrorMessage: "Network or server error." }); // Set a generic error
        } finally {
          setIsLoading(false);
        }
      };
      fetchPaymentStatus();
    } else if (!orderId) {
        setIsLoading(false);
    }
  }, [orderId, isLoading, i18n.language]);

  if (isLoading) {
    return <PageWrapper><Loader /></PageWrapper>;
  }

  if (!orderId) {
    // Optionally, redirect to a 404 page
    return <PageWrapper><h1>Order ID not found.</h1></PageWrapper>;
  }

  return (
    <PageWrapper>
      {isSuccess ? (
        <SuccessDisplay paymentData={paymentData} />
      ) : (
        <FailureDisplay paymentData={paymentData} />
      )}
    </PageWrapper>
  );
};

export default PaymentResultPage;