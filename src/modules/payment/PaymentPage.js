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

const Title = styled.h1`
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontLargest};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const SubTitle = styled.h2`
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontxxxl};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const Button = styled.button`
  margin-top: 1rem;
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.body};
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
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
const PaymentPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const errorCodes = SatimConfirmationErrorCodes;

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await confirmOrder(orderId);
        const responseData = response.data;
        if (response) {
          if (
            responseData.ErrorCode === errorCodes.SUCCESS ||
            responseData.ErrorCode === errorCodes.ALREADY_CONFIRMED
          ) {
            setPaymentStatus(responseData);
          } else {
            setPaymentStatus({
              errorCode: responseData.ErrorCode,
              errorMessage: responseData.ErrorMessage,
            });
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

  const { errorCode, errorMessage } = paymentStatus;

  return (
    <Section>
      {errorMessage ? (
        <Failed orderId={orderId} error={errorMessage}></Failed>
      ) : (
        <Success
          orderId={orderId}
          depositeAmount={parseFloat(paymentStatus.depositAmount) / 100}
        ></Success>
      )}
    </Section>
    // <Section>
    //   <Title isArabic={i18n.language === "ar"}>Payment Check</Title>
    //   <Row>
    //     <LeftBox>
    //       {/* Render the illustration based on errorMessage */}
    //       {errorMessage ? (
    //         // Render the illustration for error
    //         <img src={failure} alt="Error Illustration" />
    //       ) : (
    //         // Render the illustration for success
    //         <img src={successful} alt="Success Illustration" />
    //       )}
    //     </LeftBox>
    //     <RightBox>
    //       {errorMessage ? (
    //         <>
    //           <SubTitle>ERROR</SubTitle>
    //           <SubTitle className="error-message">
    //             Error: {errorMessage}
    //           </SubTitle>
    //         </>
    //       ) : (
    //         <>
    //           <Title>Congratulation</Title>
    //           <SubTitle isArabic={i18n.language === "ar"}>
    //             Order: <span>{orderId}</span>
    //           </SubTitle>
    //           <SubTitle isArabic={i18n.language === "ar"}>
    //             <span>{paymentStatus.cardholderName}</span>
    //           </SubTitle>
    //           <SubTitle isArabic={i18n.language === "ar"}>
    //             <span>
    //               {parseFloat(paymentStatus.depositAmount) / 100} {t("dzd")}
    //             </span>
    //           </SubTitle>
    //           <SubTitle isArabic={i18n.language === "ar"}>
    //             <span>{paymentStatus.actionCodeDescription}</span>
    //           </SubTitle>
    //         </>
    //       )}
    //       <Link to={"/"}>
    //         <Button> {t("404Button")} </Button>
    //       </Link>
    //     </RightBox>
    //   </Row>
    // </Section>
  );
};

export default PaymentPage;
