import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ContactPage from "../pages/ContactPage";
import SolutionsPage from "../pages/SolutionsPage";
import NotFoundPage from "../pages/NotFoundPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import PartnersPage from "../pages/PartnersPage";
import DeleteAccountPage from "../pages/DeleteAccountPage";

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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default CustomRouter;
