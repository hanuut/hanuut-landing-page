import React, { useRef, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaCopy,
  FaDownload,
  FaTimes,
  FaSearchLocation,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

// --- FIX: Force LTR and Standard Font for Image Generation ---
const ReceiptCard = styled.div`
  background: #fff;
  color: #111;
  width: 100%;
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
  margin: 1.5rem 0;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* FORCE LTR FOR IMAGE GENERATION */
  direction: ltr !important;
  text-align: left !important;
  font-family: "Arial", sans-serif !important;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 10px;
    background: radial-gradient(circle, transparent 50%, #fff 50%) -10px -5px;
    background-size: 20px 20px;
    transform: rotate(180deg);
  }
`;

const SuccessIcon = styled.div`
  font-size: 3.5rem;
  color: #39a170;
  margin-bottom: 0.5rem;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;
const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #a1a1aa;
  margin-top: 0.5rem;
  line-height: 1.4;
`;
const Label = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.05em;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
  font-family: "Arial", sans-serif !important;
`;
const Value = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: #000;
  display: block;
  letter-spacing: 1px;
  font-family: "Arial", sans-serif !important;
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e5e5;
  margin: 0.5rem 0;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;
const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
  ${(props) =>
    props.$primary
      ? `background: #39A170; color: white; grid-column: span 2; font-size: 1rem;`
      : `background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.1); &:hover { background: rgba(255,255,255,0.2); }`}
`;
const CloseIcon = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
`;

const OrderSuccessModal = ({ orderData, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const orderId = orderData?.orderId || "---";
  const phone = orderData?.customerPhone || "---";
  const shopName = orderData?.shopName || "Hanuut Shop";

  const handleCopy = () => {
    const text = `Order ID: ${orderId}\nPhone: ${phone}\nShop: ${shopName}`;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      // useCORS: true allows loading images (like logos) if they are on a CDN
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Hanuut-Order-${orderId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
    }
    setDownloading(false);
  };

  const handleTrack = () => {
    onClose();
    navigate("/track");
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        <Title>{t("payment_success_title", "Order Confirmed!")}</Title>
        <Subtitle>
          {t(
            "payment_success_message",
            "Keep this info safe to track your delivery.",
          )}
        </Subtitle>

        {/* --- RECEIPT CARD (FORCED ENGLISH/LTR) --- */}
        <ReceiptCard ref={receiptRef}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>
              {shopName}
            </span>
          </div>
          <Divider />
          <InfoRow>
            <div style={{ textAlign: "left" }}>
              <Label>ORDER ID</Label>
              <Value style={{ color: "#39A170" }}>{orderId}</Value>
            </div>
            <div style={{ textAlign: "right" }}>
              <Label>PHONE</Label>
              <Value>{phone}</Value>
            </div>
          </InfoRow>
          <Divider />
          <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
            Use the Order ID and Phone Number to track your status on Hanuut.
          </p>
        </ReceiptCard>

        <ActionGrid>
          <Button onClick={handleCopy}>
            <FaCopy /> {t("copy", "Copy")}
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            <FaDownload /> {downloading ? "..." : t("save_image", "Save Image")}
          </Button>
          <Button $primary onClick={handleTrack}>
            <FaSearchLocation /> {t("track_order", "Track Order Now")}
          </Button>
        </ActionGrid>

        <CloseIcon onClick={onClose}>
          <FaTimes />
        </CloseIcon>
      </ModalContainer>
    </Overlay>
  );
};

export default OrderSuccessModal;
