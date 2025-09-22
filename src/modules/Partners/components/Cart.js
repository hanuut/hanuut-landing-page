import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader";

// --- (All styled-components are the same) ---
const FloatingButton = styled(motion.button)`/* ... */`;
const ModalBackdrop = styled(motion.div)`/* ... */`;
// ... etc.

const Cart = ({
  items,
  isOpen,
  onOpen,
  onClose,
  onUpdateQuantity,
  onSubmitOrder,
  isPremium,
  brandColors,
  isShopOpen,
  isSubmitting,
}) => {
  const { t } = useTranslation();

  const [customerName, setCustomerName] = useState("");
  // --- FIX: Phone number is now optional and defaults to an empty string ---
  const [customerPhone, setCustomerPhone] = useState(""); 
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseInt(item.dish.sellingPrice, 10) * item.quantity,
    0
  );

  // --- FIX: This function now sends ALL the required data ---
  const handleSubmit = (event) => {
    event.preventDefault();
    // Only validate the customer name now
    if (!customerName) {
      alert(t("form_validation_alert"));
      return;
    }
    const orderDetails = {
      customerName,
      customerPhone, // Will be an empty string
      tableNumber,
      note,
    };
    onSubmitOrder(orderDetails);
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const renderContent = () => {
    if (isSubmitting === "submitting") {
        return <StatusContainer><Loader /></StatusContainer>;
    }
    if (isSubmitting === "success") {
      return (
        <StatusContainer>
          <StatusTitle>✅ {t("order_success_title")}</StatusTitle>
          <StatusMessage>{t("order_success_message")}</StatusMessage>
        </StatusContainer>
      );
    }
    if (isSubmitting === "error") {
      return (
        <StatusContainer>
          <StatusTitle>❌ {t("order_error_title")}</StatusTitle>
          <StatusMessage>{t("order_error_message")}</StatusMessage>
        </StatusContainer>
      );
    }

    return (
      <ModalGrid>
        <ItemsColumn>
          {items.map((item) => (
            <CartItem key={item.dish._id}>
              <ItemInfo>
                <ItemName>{item.dish.name}</ItemName>
                <ItemPrice>{parseInt(item.dish.sellingPrice)} {t("dzd")}</ItemPrice>
              </ItemInfo>
              <QuantityControl>
                <QuantityButton onClick={() => onUpdateQuantity(item.dish._id, item.quantity - 1)}>-</QuantityButton>
                <span>{item.quantity}</span>
                <QuantityButton onClick={() => onUpdateQuantity(item.dish._id, item.quantity + 1)}>+</QuantityButton>
              </QuantityControl>
            </CartItem>
          ))}
          <TotalContainer>
            <TotalLabel>{t("total")}</TotalLabel>
            <TotalLabel>{totalPrice} {t("dzd")}</TotalLabel>
          </TotalContainer>
        </ItemsColumn>
        <FormColumn>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <InputLabel htmlFor="name">{t("form_full_name")}</InputLabel>
              <Input type="text" id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </FormGroup>
            {/* --- FIX: Phone number field is now commented out --- */}
            {/* 
            <FormGroup>
              <InputLabel htmlFor="phone">{t("form_phone_number")}</InputLabel>
              <Input type="tel" id="phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
            </FormGroup> 
            */}
            <FormGroup>
              <InputLabel htmlFor="table">{t("form_table_number")} ({t("optional")})</InputLabel>
              <Input type="text" id="table" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <InputLabel htmlFor="note">{t("form_preparation_note")} ({t("optional")})</InputLabel>
              <TextArea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </FormGroup>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("placing_order") : t("place_order_button")}
            </SubmitButton>
          </Form>
        </FormColumn>
      </ModalGrid>
    );
  };

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && !isOpen && (
          <FloatingButton
            onClick={onOpen}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            $isPremium={isPremium}
            $accentColor={brandColors?.accent}
          >
            <span>🛒 {totalItems} {t("cart_items")}</span>
            <span>{totalPrice} {t("dzd")}</span>
          </FloatingButton>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <ModalBackdrop
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose} // This will now work
          >
            <ModalContent
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <CartHeader>
                <CartTitle>{t("your_order")}</CartTitle>
                <CloseButton onClick={onClose}>&times;</CloseButton> {/* This will now work */}
              </CartHeader>
              {renderContent()}
            </ModalContent>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;