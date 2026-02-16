import React, { useMemo, useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { usePalette } from "color-thief-react";

// --- Components ---
import Loader from "../../../components/Loader";
import ShopHeader from "./ShopHeader";
import StickyCategoryNav from "../../Categories/components/StickyCategoryNav"; 
import PremiumDishCard from "../../Dish/components/PremiumDishCard"; 
import Cart from "./Cart";
import PoweredByHanuut from "../../../components/PoweredByHanuut";

// --- Services & Utils ---
import { createPosOrder } from "../services/orderServices";
import { getImageUrl } from "../../../utils/imageUtils";

// --- Redux State ---
import { fetchCategories, selectCategories } from "../../Categories/state/reducers";
import { fetchDishesByCategory, selectDishes } from "../../Dish/state/reducers";
import { 
    addToCart, 
    updateCartQuantity, 
    closeCart, 
    selectCart 
} from "../../Cart/state/reducers"; 

// --- Themes ---
import { partnerTheme } from "../../../config/Themes"; 

// --- Styled Components ---
const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.body}; 
  color: ${(props) => props.theme.text};
  padding-bottom: 6rem;
  padding-top: 0;
  position: relative;
  z-index: 1;
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(${(props) => props.theme.navHeight} + 1rem) 1rem 1rem 1rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-top: calc(${(props) => props.theme.navHeightMobile} + 1rem);
  }
`;

const ContentContainer = styled.div` width: 100%; margin-top: 1rem; `;
const CategorySection = styled.div` margin-bottom: 3rem; scroll-margin-top: 180px; `;
const SectionTitle = styled.h2`
  font-size: 1.5rem; margin-bottom: 1.5rem; color: white; font-family: 'Tajawal', sans-serif; font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem;
`;
const DishesGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const EmptyState = styled.div` padding: 4rem; text-align: center; color: #8E8E93; font-size: 1.2rem; `;

const MenuPage = ({ selectedShop, selectedShopImage, shopDomain }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  // --- Redux Data ---
  const { categories, loading: categoriesLoading } = useSelector(selectCategories);
  const { dishes, loading: dishesLoading } = useSelector(selectDishes);
  const { cart } = useSelector(selectCart); 

  // --- Filter Cart for CURRENT SHOP ---
  const shopCartItems = useMemo(() => {
      if (!selectedShop?._id) return [];
      return cart.filter(item => item.shopId === selectedShop._id);
  }, [cart, selectedShop]);

  const [activeCategory, setActiveCategory] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [fetchedCategories, setFetchedCategories] = useState(new Set());
  
  // --- NEW STATE: Order Success Data ---
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // --- 1. Initial Data Fetching ---
  useEffect(() => {
    if (selectedShop && selectedShop.categories) {
      const validCategories = selectedShop.categories.filter(
        (catId) => !selectedShop.hiddenCategories?.includes(catId)
      );
      dispatch(fetchCategories(validCategories));
    }
  }, [dispatch, selectedShop]);

  useEffect(() => {
    if (categories.length > 0 && selectedShop._id) {
      categories.forEach((cat) => {
        if (!fetchedCategories.has(cat.id)) {
          dispatch(fetchDishesByCategory({ 
            shopId: selectedShop._id, 
            categoryId: cat.id 
          }));
          setFetchedCategories(prev => new Set(prev).add(cat.id));
        }
      });
    }
  }, [dispatch, categories, selectedShop, fetchedCategories]);

  // --- 2. Dynamic Filtering Logic (Phase 2.1) ---
  const categoriesWithDishes = useMemo(() => {
      if (categoriesLoading || dishesLoading) return [];
      return categories.filter(category => {
          if (category.isHidden) return false;
          if (selectedShop.hiddenCategories?.includes(category.id)) return false;
          const hasDishes = dishes.some(d => 
              d.categoryId === category.id && 
              d.shopId === selectedShop._id && 
              d.dish && d.dish.isHidden !== true 
          );
          return hasDishes;
      });
  }, [categories, dishes, selectedShop, categoriesLoading, dishesLoading]);

  // --- 3. Branding ---
  const imageUrl = useMemo(() => getImageUrl(selectedShopImage), [selectedShopImage]);
  const { data: logoPalette } = usePalette(imageUrl, 2, "hex", { crossOrigin: "Anonymous", quality: 10 });

  const brandColors = useMemo(() => ({
    main: selectedShop.styles?.mainColor || logoPalette?.[0] || "#F07A48",
    accent: selectedShop.styles?.secondaryColor || logoPalette?.[1] || "#39A170",
  }), [selectedShop, logoPalette]);

  // --- 4. Cart Logic ---
  const handleAddToCart = (dish) => {
    const cartItemPayload = {
        shopId: selectedShop._id,
        productId: dish._id,
        variantId: dish._id, 
        title: dish.name,
        sellingPrice: dish.sellingPrice,
        quantity: 1,
        dish: dish
    };
    dispatch(addToCart(cartItemPayload));
  };

  const handleUpdateQuantity = (variantId, newQuantity) => {
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));
  };

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;
    setIsSubmitting("submitting");

    if (!customerDetails.customerName) {
       alert(t("form_validation_alert"));
       setIsSubmitting(null);
       return;
    }

    // Determine Delivery Price (for local, usually 0 if dine-in, or calc)
    // Note: createPosOrder payload structure usually takes products + header info
    const orderPayload = {
      shopId: selectedShop._id,
      customerName: customerDetails.customerName,
      customerPhone: customerDetails.customerPhone, // Ensure this is passed
      tableNumber: customerDetails.tableNumber,
      note: customerDetails.note,
      deliveryPricing: customerDetails.deliveryOption?.price || 0, 
      deliveryOptionKeyword: customerDetails.deliveryOption?.type === 'dine_in' ? 'digitalMenu' : 'byShop', // Metadata logic
      products: shopCartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        categoryId: item.dish?.categoryId, 
      })),
    };

    try {
      // API CALL
      const response = await createPosOrder(orderPayload);
      const orderResult = response.data; // Axios wrapper

      // SET SUCCESS DATA FOR MODAL
      setOrderSuccessData({
          orderId: orderResult.orderId,
          customerPhone: customerDetails.customerPhone,
          shopName: selectedShop.name
      });

      setIsSubmitting("success");
      
      // Clear items immediately to prevent re-submission
      shopCartItems.forEach(item => dispatch(updateCartQuantity({ variantId: item.variantId, quantity: 0 })));
      
    } catch (error) {
      console.error("Order Failed:", error);
      setIsSubmitting("error");
      setTimeout(() => setIsSubmitting(null), 3000);
    }
  };

  const handleClearSuccess = () => {
      setIsSubmitting(null);
      setOrderSuccessData(null);
  };

  const handleScrollToCategory = (catId) => {
    setActiveCategory(catId);
    if (!catId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(`category-${catId}`);
    if (element) {
      const yOffset = -180; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!selectedShop || (categoriesLoading && categories.length === 0)) {
    return <Loader fullscreen={true} />;
  }

  return (
    <ThemeProvider theme={partnerTheme}>
      <PageWrapper>
        <MainContainer isArabic={i18n.language === 'ar'}>
          
          <ShopHeader 
            shop={selectedShop} 
            imageData={imageUrl} 
            isSubscribed={true} 
            brandColors={brandColors} 
          />

          <StickyCategoryNav 
            categories={categoriesWithDishes} 
            activeCategory={activeCategory} 
            onSelect={handleScrollToCategory} 
          />

          <ContentContainer>
            {categoriesWithDishes.length > 0 ? (
              categoriesWithDishes.map((category) => {
                const categoryDishes = dishes.filter(
                  (d) => d.categoryId === category.id && d.dish.isHidden !== true
                );

                if (categoryDishes.length === 0) return null; 

                return (
                  <CategorySection key={category.id} id={`category-${category.id}`}>
                    <SectionTitle>
                      {i18n.language === 'ar' ? category.name : (category.nameFr || category.name)}
                    </SectionTitle>
                    
                    <DishesGrid>
                      {categoryDishes.map((dishWrapper) => {
                        const currentDish = dishWrapper.dish;
                        const cartItem = shopCartItems.find(
                          (item) => item.variantId === currentDish._id
                        );

                        return (
                          <PremiumDishCard
                            key={currentDish._id}
                            dish={currentDish}
                            brandColors={brandColors}
                            isShopOpen={selectedShop.isOpen}
                            onAddToCart={() => handleAddToCart(currentDish)}
                            onUpdateQuantity={handleUpdateQuantity}
                            cartItem={cartItem}
                          />
                        );
                      })}
                    </DishesGrid>
                  </CategorySection>
                );
              })
            ) : (
              !dishesLoading && <EmptyState>{t("noDishesAvailable")}</EmptyState>
            )}
          </ContentContainer>

        </MainContainer>

        <Cart 
          items={shopCartItems} 
          onUpdateQuantity={handleUpdateQuantity}
          onSubmitOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
          shopDomain={shopDomain}
          shopId={selectedShop._id}
          
          // --- NEW PROPS FOR TRACKING ---
          orderSuccessData={orderSuccessData}
          onClearSuccess={handleClearSuccess}
        />

        <PoweredByHanuut />

      </PageWrapper>
    </ThemeProvider>
  );
};

export default MenuPage;