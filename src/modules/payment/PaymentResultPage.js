import React, { useEffect } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SuccessDisplay from "./components/SuccessDisplay"; // Reusing your existing component
import FailureDisplay from "./components/FailureDisplay"; // Reusing your existing component

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9ff;
`;

const RedirectMessage = styled.p`
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  // These params come from the Dynamic URL we set in the Backend
  const type = searchParams.get("type"); // FLEXY, ORDER, SUBSCRIPTION
  const id = searchParams.get("id");     // Internal ID
  const status = searchParams.get("status"); // Chargily might append this, but we assume success if they land here via success_url

  useEffect(() => {
    // 1. Construct the Deep Link
    // Scheme must match AndroidManifest.xml / Info.plist in Flutter
    // hanuut://payment/success?type=FLEXY&id=...
    const appScheme = `hanuut://payment/success?type=${type}&id=${id}`;
    
    // 2. Attempt to redirect to the app automatically
    if (id && type) {
        setTimeout(() => {
            window.location.href = appScheme;
        }, 1500); // Small delay to let user see "Success"
    }
  }, [type, id]);

  // Construct a dummy data object for SuccessDisplay to render correctly
  const paymentData = {
    OrderNumber: id || "Unknown",
  };

  return (
    <PageWrapper>
      <div>
        <SuccessDisplay paymentData={paymentData} />
        <RedirectMessage>
           {t("redirecting_to_app", "Redirecting back to Hanuut App...")}
        </RedirectMessage>
        {/* Fallback button if auto-redirect fails */}
        <div style={{textAlign: 'center', marginTop: '10px'}}>
             <a 
               href={`hanuut://payment/success?type=${type}&id=${id}`}
               style={{color: '#39A170', fontWeight: 'bold'}}
             >
                {t("click_here_if_not_redirected", "Click here if not redirected")}
             </a>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentReturnPage;