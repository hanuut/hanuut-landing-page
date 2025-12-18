import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StepTitle, StepSubtitle, NavButton } from "../WizardComponents";

const IconCircle = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #39a170;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(57, 161, 112, 0.4);
`;

const SuccessView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Animated Checkmark */}
      <IconCircle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <FaCheck />
      </IconCircle>

      <StepTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("wiz_success_title")}
      </StepTitle>

      <StepSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {t("wiz_success_desc")}
      </StepSubtitle>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: "2rem" }}
      >
        <NavButton $primary onClick={() => navigate("/partners")}>
          {t("wiz_btn_home")}
        </NavButton>
      </motion.div>
    </div>
  );
};

export default SuccessView;
