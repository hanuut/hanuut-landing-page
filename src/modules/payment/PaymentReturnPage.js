// src/modules/payment/PaymentReturnPage.js

import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import SuccessDisplay from "./components/SuccessDisplay";
import FailureDisplay from "./components/FailureDisplay";

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9ff;
  padding: 1rem;
`;

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();

  // 1. Get parameters returned by the Payment Gateway (SATIM/CIB)
  // 'orderId' is usually passed back.
  // 'ErrorCode' or 'respCode' usually indicates success (0 or 00).
  const orderId = searchParams.get('orderId') || searchParams.get('OrderId');
  const errorCode = searchParams.get('ErrorCode'); 
  const respCode = searchParams.get('respCode');
  const errorMessage = searchParams.get('ErrorMessage');

  // 2. Determine Success/Failure logic
  // SATIM usually returns '0' for success. CIB might return '00'.
  const isSuccess = errorCode === '0' || respCode === '00'; 

  // 3. Construct data object for the display components
  const paymentData = {
    OrderNumber: orderId,
    ErrorCode: errorCode || respCode,
    ErrorMessage: errorMessage
  };

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

export default PaymentReturnPage;