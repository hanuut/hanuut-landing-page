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
import ShopPage from "../modules/Partners/components/ShopPage";

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
      <Route path="/shop/:shopName" element={<ShopPage/>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default CustomRouter;
