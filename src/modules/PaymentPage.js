import React from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

const PaymentPage = () => {
  const { orderId } = useParams();
  if (!orderId) {
    return <NotFoundPage />;
  }
  return (
    <div>
      <h1>Payment Page</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
};

export default PaymentPage;
