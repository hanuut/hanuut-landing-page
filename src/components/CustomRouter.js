import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../modules/HomePage";
import ContactPage from "../modules/ContactPage";
import SolutionsPage from "../modules/SolutionsPage";
import NotFoundPage from "../modules/NotFoundPage";
import PrivacyPolicy from "../modules/PrivacyPolicy";
import TermsAndConditions from "../modules/TermsAndConditions";
import PartnersPage from "../modules/Partners/PartnersPage";
import DeleteAccountPage from "../modules/DeleteAccountPage";
// import ShopPage from "../modules/Partners/components/ShopPage";
import ShopPageWithUsername from "../modules/Partners/components/ShopPageWithUsername";
import Tawsila from "../modules/Tawsila/Tawsila";
import PaymentPage from "../modules/PaymentPage";

// import GetStarted from "../modules/Tawsila/GetStarted";

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/delete account" element={<DeleteAccountPage />} />
      <Route path="/privacy policy" element={<PrivacyPolicy />} />
      <Route path="/terms and conditions" element={<TermsAndConditions />} />
      {/* <Route path="/shop/:shopName" element={<ShopPage/>} /> */}
      <Route path="/shop/:username" element={<ShopPageWithUsername/>} />
      <Route path="/confirmPayment" element={<PaymentPage />} />

      {/* <Route path="/tawsila" element={<Tawsila />} /> */}
      {/* <Route path="/get-started-with-Tawsila" element={<GetStarted />} /> */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default CustomRouter;
