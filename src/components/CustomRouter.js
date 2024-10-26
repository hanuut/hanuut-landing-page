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
import ShopPageWithUsername from "../modules/Partners/components/ShopPageWithUsername";
// import ShopPage from "../modules/Partners/components/ShopPage";
import Tawsila from "../modules/Tawsila/Tawsila";
// import PaymentPage from "../modules/payment/PaymentPage";
// import SatimTestPage from "../modules/payment/SatimTestPage";
import GetStarted from "../modules/Tawsila/GetStarted";
import LinksPage from "../modules/LinksPage";
import MyHanuutGuide from "../modules/MyHanuutGuide";
import ProductPage from "../modules/Product/ProductPage";

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/delete_account" element={<DeleteAccountPage />} />
      <Route path="/privacy_policy" element={<PrivacyPolicy />} />
      <Route path="/terms_and_conditions" element={<TermsAndConditions />} />
      <Route path="/:username" element={<ShopPageWithUsername />} />
      <Route path="/tawsila" element={<Tawsila />} />
      <Route path="/links" element={<LinksPage />} />
      <Route path="*" element={<NotFoundPage />} />

      <Route path="/product/:productId" element={<ProductPage />} />
      <Route path="/shop/:username" element={<ShopPageWithUsername />} />

      {/* <Route path="/shop/:shopName" element={<ShopPage/>} /> */}
      {/* <Route path="/confirmPayment" element={<PaymentPage />} /> */}
      {/* <Route path="/testPayment" element={<SatimTestPage />} /> */}
      <Route path="/get-started-with-Tawsila" element={<GetStarted />} />
      {/* <Route path="/my-hanuut-guide" element={<MyHanuutGuide />} /> */}
    </Routes>
  );
};

export default CustomRouter;
