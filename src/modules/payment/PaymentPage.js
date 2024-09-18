import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { confirmOrder } from "./services/paymentServices";
import Loader from "../../components/Loader";
import { SatimConfirmationErrorCodes } from "./models/paymentErrorCodes.js";
import NotFoundPage from "../NotFoundPage";
import Success from "./components/Success.js";
import Failed from "./components/Failed.js";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    min-height: 100vh;
    justify-content: flex-start;
  }
`;

const PaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(false);
  const { i18n } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const errorCodes = SatimConfirmationErrorCodes;

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await confirmOrder(orderId);
        const responseData = response.data;
        setData(responseData);

        if (response) {
          const errorCodeDescription = errorCodes[responseData.ErrorCode];
          if (
            errorCodeDescription.code === errorCodes[0].code ||
            errorCodeDescription.code === errorCodes[2].code
          ) {
            setSuccess(true);
            setPaymentStatus({
              ...responseData,
              successMessage: errorCodeDescription.description[i18n.language],
            });
          } else {
            setSuccess(false);
            if (responseData.ErrorCode === "0") {
              setPaymentStatus({
                errorCode: responseData.ErrorCode,
                errorMessage: responseData.ErrorMessage,
                errorCodeDescription:
                  "Votre transaction a été rejetée/ Your transaction was rejected/ تم رفض معاملتك",
              });
            } else {
              setPaymentStatus({
                errorCode: responseData.ErrorCode,
                errorMessage: responseData.ErrorMessage,
                errorCodeDescription: responseData.ErrorMessage,
              });
            }
          }
        }
      } catch (error) {

        setPaymentStatus({
          errorMessage: error,
        });
      }
    };

    if (orderId && !paymentStatus) {
      fetchPaymentStatus();
    }
  }, [orderId, paymentStatus, errorCodes]);

  if (!orderId) return <NotFoundPage />;

  if (!orderId || !paymentStatus) {
    return (
      <Section>
        <Loader />
      </Section>
    );
  }
  return (
    <Section>
      {!success ? (
        <Failed
          orderId={orderId}
          responseData={data}
          error={paymentStatus.errorCodeDescription}
        ></Failed>
      ) : (
        <Success
          orderId={orderId}
          depositeAmount={parseFloat(paymentStatus.Amount) / 100}
          successMessage={paymentStatus.successMessage}
          responseData={data}
        ></Success>
      )}
    </Section>
  );
};

export default PaymentPage;
