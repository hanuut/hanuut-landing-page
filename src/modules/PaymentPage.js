import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PaymentPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  useEffect(() => {
    // Perform any necessary actions or API calls upon confirming the payment
    // You can use the `orderId` value obtained from the query parameters
  }, [orderId]);

  return (
    <div>
      <h1>Confirm Payment</h1>
      <p>Order ID: {orderId}</p>
      {/* Rest of the component */}
    </div>
  );
}

export default PaymentPage;
