import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCheck, FaBox, FaMotorcycle, FaHome, FaArrowLeft, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

// --- Imports ---
import { partnerTheme } from "../../../config/Themes";
import { trackOrder } from "../services/orderServices";
import Loader from "../../../components/Loader";

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #09090b;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(${(props) => props.theme.navHeight} + 2rem);
  font-family: 'Tajawal', sans-serif;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const Container = styled.div`
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #a1a1aa;
  font-size: 1.1rem;
`;

// --- Search Form ---
const SearchCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  backdrop-filter: blur(10px);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #d4d4d8;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-family: inherit;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
    background: rgba(0, 0, 0, 0.5);
  }
`;

const TrackButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  border: none;
  background-color: ${(props) => props.theme.primaryColor};
  color: #111;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  transition: all 0.2s;

  &:hover { transform: scale(1.02); filter: brightness(1.1); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// --- Result Area ---
const ResultCard = styled(motion.div)`
  background: #18181B;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  overflow: hidden;
  position: relative;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1.5rem;
`;

const ShopName = styled.h3`
  font-size: 1.4rem;
  color: white;
  margin: 0;
`;

const OrderIdBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
  color: ${(props) => props.theme.primaryColor};
  letter-spacing: 1px;
`;

const ErrorBanner = styled(motion.div)`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
`;

// --- Timeline Components ---
const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 1rem 0;
  position: relative;
  padding-left: ${(props) => (props.isArabic ? "0" : "1.5rem")};
  padding-right: ${(props) => (props.isArabic ? "1.5rem" : "0")};
  border-left: ${(props) => (props.isArabic ? "none" : "2px solid rgba(255,255,255,0.1)")};
  border-right: ${(props) => (props.isArabic ? "2px solid rgba(255,255,255,0.1)" : "none")};
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 2.5rem;
  padding-left: ${(props) => (props.isArabic ? "0" : "1.5rem")};
  padding-right: ${(props) => (props.isArabic ? "1.5rem" : "0")};
  
  &:last-child { padding-bottom: 0; }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    ${(props) => (props.isArabic ? "right: -9px;" : "left: -9px;")}
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${(props) => (props.$active ? props.theme.primaryColor : "#27272A")};
    border: 3px solid #18181B;
    z-index: 2;
    transition: all 0.5s ease;
    box-shadow: ${(props) => (props.$active ? `0 0 15px ${props.theme.primaryColor}` : "none")};
  }
`;

const ItemTitle = styled.h4`
  font-size: 1.1rem;
  color: ${(props) => (props.$active ? "#FFF" : "#52525B")};
  margin: 0 0 0.3rem 0;
  transition: color 0.3s;
`;

const ItemDesc = styled.p`
  font-size: 0.9rem;
  color: ${(props) => (props.$active ? "#A1A1AA" : "#3F3F46")};
  margin: 0;
`;

const ProductList = styled.ul`
  list-style: none;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
`;

const ProductItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
  &:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  
  span.name { font-weight: 500; color: #E4E4E7; }
  span.price { color: #A1A1AA; }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 1.2rem;
  font-weight: 800;
  color: ${(props) => props.theme.primaryColor};
`;

const TrackingPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [searchId, setSearchId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [orderData, setOrderData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!searchId || !searchPhone) return;

    setStatus("loading");
    setErrorMsg("");
    setOrderData(null);

    try {
      const data = await trackOrder(searchPhone, searchId);
      setOrderData(data);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(t("order_not_found", "Order not found. Please check your ID and Phone number."));
    }
  };

  // Helper to determine active step
  const getStepStatus = (orderState) => {
    const steps = ['pending', 'prepared', 'onDelivery', 'done'];
    const currentIndex = steps.indexOf(orderState);
    if (orderState === 'canceled') return -1;
    // Default to pending if unknown
    return currentIndex === -1 ? 0 : currentIndex;
  };

  const currentStepIndex = orderData ? getStepStatus(orderData.state) : 0;
  const isCanceled = orderData?.state === 'canceled';

  return (
    <ThemeProvider theme={partnerTheme}>
      <PageWrapper isArabic={isArabic}>
        <Container>
          
          <Header>
            <Title>{t("track_order_title", "Track Your Order")}</Title>
            <Subtitle>{t("track_order_subtitle", "Enter your details to see the latest status.")}</Subtitle>
          </Header>

          {/* Search Form */}
          <SearchCard 
             layout
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <form onSubmit={handleTrack}>
                <InputGroup>
                    <Label>{t("payment_order_id", "Order ID")}</Label>
                    <Input 
                        placeholder="e.g. A001" 
                        value={searchId} 
                        onChange={(e) => setSearchId(e.target.value)} 
                        required
                    />
                </InputGroup>
                <div style={{height: '1rem'}}></div>
                <InputGroup>
                    <Label>{t("form_phone_number", "Phone Number")}</Label>
                    <Input 
                        placeholder="e.g. 0550..." 
                        type="tel"
                        value={searchPhone} 
                        onChange={(e) => setSearchPhone(e.target.value)} 
                        required
                    />
                </InputGroup>
                <div style={{height: '2rem'}}></div>
                <TrackButton type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? <Loader fullscreen={false} /> : <><FaSearch /> {t("track_btn", "Track Order")}</>}
                </TrackButton>
            </form>
            
            {status === 'error' && (
                <ErrorBanner initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {errorMsg}
                </ErrorBanner>
            )}
          </SearchCard>

          {/* Result Section */}
          <AnimatePresence>
            {status === 'success' && orderData && (
                <ResultCard
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <OrderHeader>
                        <div>
                            <ShopName>{orderData.shop?.name || t("shop_name", "Shop")}</ShopName>
                            <span style={{color: '#aaa', fontSize: '0.9rem'}}>
                                {new Date(orderData.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <OrderIdBadge>#{orderData.orderId}</OrderIdBadge>
                    </OrderHeader>

                    {isCanceled ? (
                        <ErrorBanner style={{background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none'}}>
                            <FaTimesCircle size={24} style={{marginBottom:'10px'}}/> <br/>
                            {t("order_canceled", "This order has been canceled.")}
                        </ErrorBanner>
                    ) : (
                        <TimelineWrapper isArabic={isArabic}>
                            {/* Step 1: Received */}
                            <TimelineItem $active={currentStepIndex >= 0} isArabic={isArabic}>
                                <ItemTitle $active={currentStepIndex >= 0}>{t("status_pending", "Order Received")}</ItemTitle>
                                <ItemDesc $active={currentStepIndex >= 0}>{t("desc_pending", "The shop has received your order.")}</ItemDesc>
                            </TimelineItem>

                            {/* Step 2: Preparing */}
                            <TimelineItem $active={currentStepIndex >= 1} isArabic={isArabic}>
                                <ItemTitle $active={currentStepIndex >= 1}>{t("status_prepared", "Preparing")}</ItemTitle>
                                <ItemDesc $active={currentStepIndex >= 1}>{t("desc_prepared", "Your items are being packed.")}</ItemDesc>
                            </TimelineItem>

                            {/* Step 3: On Delivery */}
                            <TimelineItem $active={currentStepIndex >= 2} isArabic={isArabic}>
                                <ItemTitle $active={currentStepIndex >= 2}>{t("status_onDelivery", "Out for Delivery")}</ItemTitle>
                                <ItemDesc $active={currentStepIndex >= 2}>{t("desc_onDelivery", "Driver is on the way.")}</ItemDesc>
                            </TimelineItem>

                            {/* Step 4: Done */}
                            <TimelineItem $active={currentStepIndex >= 3} isArabic={isArabic}>
                                <ItemTitle $active={currentStepIndex >= 3}>{t("status_done", "Delivered")}</ItemTitle>
                                <ItemDesc $active={currentStepIndex >= 3}>{t("desc_done", "Enjoy your purchase!")}</ItemDesc>
                            </TimelineItem>
                        </TimelineWrapper>
                    )}

                    <ProductList>
                        {orderData.products.map((p, i) => (
                            <ProductItem key={i}>
                                <span className="name">{p.quantity}x {p.title}</span>
                                <span className="price">{parseInt(p.sellingPrice * p.quantity)} {t("dzd")}</span>
                            </ProductItem>
                        ))}
                         <div style={{display:'flex', justifyContent:'space-between', color: '#888', fontSize: '0.9rem', marginTop: '10px'}}>
                            <span>{t("delivery_fees", "Delivery")}</span>
                            <span>{parseInt(orderData.deliveryPricing || 0)} {t("dzd")}</span>
                        </div>
                        <TotalRow>
                            <span>{t("total", "Total")}</span>
                            <span>{parseInt(orderData.totalPrice + (orderData.deliveryPricing || 0))} {t("dzd")}</span>
                        </TotalRow>
                    </ProductList>

                    <div style={{marginTop: '2rem', textAlign:'center'}}>
                        <Link to="/" style={{color: '#A1A1AA', display:'inline-flex', alignItems:'center', gap:'8px', textDecoration:'none'}}>
                            <FaArrowLeft /> {t("back_home", "Back to Home")}
                        </Link>
                    </div>

                </ResultCard>
            )}
          </AnimatePresence>

        </Container>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default TrackingPage;