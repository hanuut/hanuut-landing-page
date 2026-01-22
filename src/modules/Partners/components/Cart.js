import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"; // Added
import { closeCart, selectIsCartOpen } from "../../Cart/state/reducers"; // Added

import Loader from "../../../components/Loader";
import AddressesDropDown from "../../../components/AddressesDropDown";
import { FaMapMarkerAlt, FaCheck, FaTimes, FaLocationArrow, FaChevronDown, FaChevronUp } from "react-icons/fa";

// ... (Keep ModalBackdrop, ModalContent, and all other Styled Components EXACTLY as they were) ...
// ... (Removing FloatingButton styled component as it is no longer needed) ...

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  width: 90%;
  max-width: 850px;
  background-color: rgba(24, 24, 27, 0.9); 
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
  color: #FFFFFF;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.08), transparent 40%);
    z-index: 0;
    pointer-events: none;
  }
`;

// Re-declaring used styled components to ensure file completeness
const ContentRelative = styled.div` position: relative; z-index: 1; `;
const FormWrapper = styled.form` display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; width: 100%; @media (max-width: 768px) { grid-template-columns: 1fr; display: flex; flex-direction: column-reverse; } `;
const ItemsColumn = styled.div` display: flex; flex-direction: column; `;
const InputsColumn = styled.div` display: flex; flex-direction: column; gap: 1.5rem; `;
const CartHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 1rem; `;
const CartTitle = styled.h2` font-size: ${(props) => props.theme.fontxl}; font-weight: 600; color: #fff; `;
const CloseButton = styled.button` background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #a1a1aa; &:hover { color: #fff; } `;
const CartItem = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); `;
const ItemInfo = styled.div` display: flex; flex-direction: column; `;
const ItemName = styled.p` font-size: ${(props) => props.theme.fontmd}; font-weight: 500; color: #fff; `;
const ItemVariant = styled.p` font-size: ${props => props.theme.fontsm}; color: #a1a1aa; margin-top: 0.25rem; `;
const ItemPrice = styled.p` font-size: ${(props) => props.theme.fontsm}; color: ${(props) => props.theme.primaryColor}; font-weight: 600; `;
const QuantityControl = styled.div` display: flex; align-items: center; gap: 1rem; `;
const QuantityButton = styled.button` width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); background-color: transparent; color: white; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; &:hover { border-color: #fff; background-color: rgba(255,255,255,0.1); } `;
const ToggleListButton = styled.button` background: transparent; border: none; color: #a1a1aa; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; width: 100%; padding: 0.5rem; margin-bottom: 1.5rem; border-radius: 8px; &:hover { background: rgba(255,255,255,0.05); color: white; } `;
const TotalContainer = styled.div` display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 1.5rem; `;
const TotalLabel = styled.p` font-size: 1.2rem; font-weight: 700; color: white; `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; `;
const InputLabel = styled.label` font-size: 0.85rem; font-weight: 500; color: #a1a1aa; text-align: left; `;
const Input = styled.input` width: 100%; padding: 0.9rem 1rem; font-size: 0.95rem; border: 1px solid rgba(255, 255, 255, 0.1); background-color: rgba(0, 0, 0, 0.3); color: white; border-radius: 12px; box-sizing: border-box; transition: all 0.2s; &:focus { outline: none; border-color: ${(props) => props.theme.primaryColor}; background-color: rgba(0, 0, 0, 0.5); } `;
const TextArea = styled.textarea` width: 100%; padding: 0.9rem 1rem; font-size: 0.95rem; border: 1px solid rgba(255, 255, 255, 0.1); background-color: rgba(0, 0, 0, 0.3); color: white; border-radius: 12px; box-sizing: border-box; resize: vertical; min-height: 80px; &:focus { outline: none; border-color: ${(props) => props.theme.primaryColor}; } `;
const SubmitButton = styled.button` width: 100%; padding: 1.1rem; font-size: 1.1rem; font-weight: 700; color: #111; background-color: ${(props) => props.theme.primaryColor}; border: none; border-radius: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px ${(props) => `${props.theme.primaryColor}40`}; &:hover { transform: translateY(-2px); filter: brightness(1.1); } &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; background-color: #333; color: #777; } `;
const LocationButton = styled.button` display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.9rem; background-color: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; color: #a1a1aa; cursor: pointer; font-size: 0.9rem; transition: all 0.2s ease; &:hover { background-color: rgba(255, 255, 255, 0.1); color: white; border-color: rgba(255, 255, 255, 0.4); } ${props => props.$status === 'success' && css` background-color: rgba(57, 161, 112, 0.15); border-color: #39A170; color: #39A170; `} ${props => props.$status === 'loading' && css` opacity: 0.7; cursor: wait; `} `;
const StatusContainer = styled.div` display: flex; flex-direction: column; align-items: center; text-align: center; padding: 3rem 1rem; `;
const StatusTitle = styled.h2` font-size: 1.5rem; margin-bottom: 0.5rem; color: white; `;
const StatusMessage = styled.p` color: #a1a1aa; `;

const Cart = ({ items, onUpdateQuantity, onSubmitOrder, isSubmitting, shopDomain }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // --- REDUX CONNECTION ---
  const isOpen = useSelector(selectIsCartOpen);
  const onClose = () => dispatch(closeCart());

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null); 
  const [locStatus, setLocStatus] = useState('idle'); 
  const [isListExpanded, setIsListExpanded] = useState(false);

  const modalRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    modalRef.current.style.setProperty("--mouse-x", `${x}px`);
    modalRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleGetLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocStatus('success');
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocStatus('error');
      },
      { enableHighAccuracy: true }
    );
  };

  const totalPrice = items.reduce((sum, item) => {
      // Handle both Menu (dish) and Global (product/sellingPrice) structures
      const price = item.dish ? item.dish.sellingPrice : item.sellingPrice;
      return sum + (parseInt(price, 10) * item.quantity);
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const orderDetails = { customerName, customerPhone, tableNumber, note, address, gpsLocation };
    onSubmitOrder(orderDetails);
  };

  const renderItemDetails = (item) => {
      if(shopDomain === 'food') return <ItemName>{item.dish.name}</ItemName>;
      if(shopDomain === 'global') return <><ItemName>{item.title || item.product.name}</ItemName><ItemVariant>{t('color', 'Color')}: {item.color}, {t('size', 'Size')}: {item.size}</ItemVariant></>;
      return null;
  };

  const renderContent = () => {
    if (isSubmitting === 'submitting') return <StatusContainer><Loader fullscreen={false} /></StatusContainer>;
    if (isSubmitting === 'success') return <StatusContainer><StatusTitle>✅ {t("order_success_title")}</StatusTitle><StatusMessage>{t("order_success_message")}</StatusMessage></StatusContainer>;
    if (isSubmitting === 'error') return <StatusContainer><StatusTitle>❌ {t("order_error_title")}</StatusTitle><StatusMessage>{t("order_error_message")}</StatusMessage></StatusContainer>;

    const visibleItems = isListExpanded ? items : items.slice(0, 3);
    const hiddenCount = items.length - 3;

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <ItemsColumn>
                {visibleItems.map((item) => {
                    const id = item.dish ? item.dish._id : item.variantId;
                    const price = item.dish ? item.dish.sellingPrice : item.sellingPrice;
                    return (
                        <CartItem key={id}>
                          <ItemInfo>{renderItemDetails(item)}<ItemPrice>{parseInt(price)} {t("dzd")}</ItemPrice></ItemInfo>
                          <QuantityControl>
                            <QuantityButton type="button" onClick={() => onUpdateQuantity(id, item.quantity - 1)}>−</QuantityButton>
                            <span style={{color: 'white'}}>{item.quantity}</span>
                            <QuantityButton type="button" onClick={() => onUpdateQuantity(id, item.quantity + 1)}>+</QuantityButton>
                          </QuantityControl>
                        </CartItem>
                    );
                })}
                {items.length > 3 && (
                    <ToggleListButton type="button" onClick={() => setIsListExpanded(!isListExpanded)}>
                        {isListExpanded ? <><FaChevronUp /> {t('show_less', 'Show Less')}</> : <><FaChevronDown /> {t('show_more_items', `+ ${hiddenCount} more items`)}</>}          </ToggleListButton>
                )}
                <FormGroup style={{ marginTop: '1rem' }}>
                    <InputLabel htmlFor="note">{t("form_preparation_note")} ({t("optional")})</InputLabel>
                    <TextArea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("note_placeholder", "Any special instructions?")}/>              </FormGroup>
                <TotalContainer>
                    <TotalLabel>{t("total")}</TotalLabel>
                    <TotalLabel style={{ color: '#39A170', fontSize: '1.5rem' }}>{totalPrice} {t("dzd")}</TotalLabel>
                </TotalContainer>
                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting === 'submitting' ? t("placing_order") : t("place_order_button")}
                </SubmitButton>
            </ItemsColumn>

            <InputsColumn>
                    <FormGroup>
                        <InputLabel htmlFor="name">{t("form_full_name")}</InputLabel>
                        <Input type="text" id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />                </FormGroup>
                    <FormGroup>
                        <InputLabel htmlFor="phone">{t("form_phone_number")}</InputLabel>
                        <Input type="tel" id="phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                    </FormGroup>
                    {shopDomain === 'global' ? (                      <>
                            <AddressesDropDown target="partners" onChooseAddress={setAddress} />
                            <FormGroup>
                                <InputLabel>{t('share_location', 'Exact Location (Optional)')}</InputLabel>
                                <LocationButton type="button" onClick={handleGetLocation} $status={locStatus}>
                                    {locStatus === 'loading' && <span>Locating...</span>}
                                    {locStatus === 'success' && <><FaCheck /> <span>Location Saved</span></>}
                                    {locStatus === 'error' && <><FaTimes /> <span>Failed (Retry)</span></>}
                                    {locStatus === 'idle' && <><FaLocationArrow /> <span>Use My Location</span></>}
                                </LocationButton>
                            </FormGroup>
                        </>
                    ) : (                      <FormGroup>
                            <InputLabel htmlFor="table">{t("form_table_number")} ({t("optional")})</InputLabel>
                            <Input type="text" id="table" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                        </FormGroup>
                    )}
            </InputsColumn>
        </FormWrapper>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <ModalContent ref={modalRef} onMouseMove={handleMouseMove} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <ContentRelative>
              <CartHeader>
                <CartTitle>{t("your_order")}</CartTitle>
                <CloseButton onClick={onClose}>&times;</CloseButton>
              </CartHeader>
              {renderContent()}
            </ContentRelative>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default Cart;