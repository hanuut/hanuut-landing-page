import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader";
import AddressesDropDown from "../../../components/AddressesDropDown";

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ $isPremium, $accentColor, theme }) => 
    $isPremium ? ($accentColor || '#FFFFFF') : theme.primaryColor};
  color: ${({ $isPremium }) => ($isPremium ? '#1E1E1E' : '#FFFFFF')};
  padding: 1rem 2rem;
  border-radius: 50px;
  border: none;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 999;
  display: flex;
  gap: 1rem;
`;

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  width: 90%;
  max-width: 800px;
  background-color: #FFFFFF;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ItemsColumn = styled.div``;
const FormColumn = styled.div``;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #EAEAEA;
  padding-bottom: 1rem;
`;

const CartTitle = styled.h2`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  font-weight: 500;
`;

const ItemVariant = styled.p`
    font-size: ${props => props.theme.fontsm};
    color: rgba(${props => props.theme.textRgba}, 0.6);
    margin-top: 0.25rem;
`;

const ItemPrice = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: ${(props) => props.theme.secondaryText};
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #EAEAEA;
  background-color: transparent;
  font-size: 1.2rem;
  cursor: pointer;
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #EAEAEA;
`;

const TotalLabel = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-size: ${(props) => props.theme.fontsm};
  font-weight: 500;
  color: ${(props) => props.theme.secondaryText};
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: ${(props) => props.theme.fontmd};
  border: 1px solid #EAEAEA;
  border-radius: ${(props) => props.theme.smallRadius};
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: ${(props) => props.theme.fontmd};
  border: 1px solid #EAEAEA;
  border-radius: ${(props) => props.theme.smallRadius};
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  margin-top: 1rem;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: #FFFFFF;
  background-color: ${(props) => props.theme.primaryColor};
  border: none;
  border-radius: ${(props) => props.theme.smallRadius};
  cursor: pointer;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
`;

const StatusTitle = styled.h2`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 600;
  margin-bottom: 1rem;
`;

const StatusMessage = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.secondaryText};
`;

const Cart = ({ items, isOpen, onOpen, onClose, onUpdateQuantity, onSubmitOrder, isPremium, brandColors, isSubmitting,shopDomain }) => {
  const { t } = useTranslation();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
      const price = item.dish ? item.dish.sellingPrice : item.sellingPrice;
      return sum + (parseInt(price, 10) * item.quantity);
  }, 0);
  const [address, setAddress] = useState(null);
  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const orderDetails = {
      customerName,
      customerPhone,
      tableNumber,
      note,
      address,
    };
    onSubmitOrder(orderDetails);
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } } };

const renderItemDetails = (item) => {
      
      if(shopDomain === 'food') {
          return <ItemName>{item.dish.name}</ItemName>;
      }
      
      if(shopDomain === 'global') {
          return (
              <>
                <ItemName>{item.product.name}</ItemName>
                <ItemVariant>{t('color', 'Color')}: {item.color}, {t('size', 'Size')}: {item.size}</ItemVariant>
              </>
          );
      }
      return null;
  };

  const renderContent = () => {
    if (isSubmitting === 'submitting') {
      return (
        <StatusContainer>
          <Loader fullscreen={false} />
        </StatusContainer>
      );
    }

    if (isSubmitting === 'success') {
      return (
        <StatusContainer>
          <StatusTitle>✅ {t("order_success_title")}</StatusTitle>
          <StatusMessage>{t("order_success_message")}</StatusMessage>
        </StatusContainer>
      );
    }

    if (isSubmitting === 'error') {
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
                {items.map((item) => {
                    const id = item.dish ? item.dish._id : item.variantId;
                    const price = item.dish ? item.dish.sellingPrice : item.sellingPrice;

                    return (
                        <CartItem key={id}>
                          <ItemInfo>
                            {renderItemDetails(item)}
                            <ItemPrice>{parseInt(price)} {t("dzd")}</ItemPrice>
                          </ItemInfo>
                          <QuantityControl>
                            {/* ***** UPDATE onUpdateQuantity CALL ***** */}
                            <QuantityButton onClick={() => onUpdateQuantity(id, item.quantity - 1)}>−</QuantityButton>
                            <span>{item.quantity}</span>
                            <QuantityButton onClick={() => onUpdateQuantity(id, item.quantity + 1)}>+</QuantityButton>
                          </QuantityControl>
                        </CartItem>
                    );
                })}
                <TotalContainer>
                    <TotalLabel>{t("total")}</TotalLabel>
                    <TotalLabel>{totalPrice} {t("dzd")}</TotalLabel>
                </TotalContainer>
            </ItemsColumn>
            <FormColumn>
    <Form onSubmit={handleSubmit}>
        {/* CONDITIONAL RENDERING BASED ON DOMAIN */}
        {shopDomain === 'global' ? (
            <>
                {/* --- E-COMMERCE FORM --- */}
                <FormGroup>
                    <InputLabel htmlFor="name">{t("form_full_name")}</InputLabel>
                    <Input type="text" id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                </FormGroup>
                
                <FormGroup>
                    <InputLabel htmlFor="phone">{t("form_phone_number")}</InputLabel>
                    <Input type="tel" id="phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                </FormGroup>

                <AddressesDropDown
                    target="partners" // Use 'partners' or 'tawsila' style, adjust if needed
                    onChooseAddress={handleAddressChange}
                />

                <FormGroup>
                    <InputLabel htmlFor="note">{t("form_preparation_note")} ({t("optional")})</InputLabel>
                    <TextArea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
                </FormGroup>
            </>
        ) : (
            <>
                {/* --- FOOD (POS) FORM --- */}
                <FormGroup>
                    <InputLabel htmlFor="name">{t("form_full_name")}</InputLabel>
                    <Input type="text" id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                </FormGroup>

                <FormGroup>
                    <InputLabel htmlFor="table">{t("form_table_number")} ({t("optional")})</InputLabel>
                    <Input type="text" id="table" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                </FormGroup>

                <FormGroup>
                    <InputLabel htmlFor="note">{t("form_preparation_note")} ({t("optional")})</InputLabel>
                    <TextArea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
                </FormGroup>
            </>
        )}

        <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting === 'submitting' ? t("placing_order") : t("place_order_button")}
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
            onClick={onClose}
          >
            <ModalContent
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <CartHeader>
                <CartTitle>{t("your_order")}</CartTitle>
                <CloseButton onClick={onClose}>&times;</CloseButton>
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