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
} from "../../Cart/state/reducers"; // Import Actions

// --- Themes ---
import { partnerTheme } from "../../../config/Themes"; 

// --- Styled Components (Kept same) ---
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
  const { cart } = useSelector(selectCart); // Get Global Cart

  // --- Filter Cart for CURRENT SHOP ---
  const shopCartItems = useMemo(() => {
      if (!selectedShop?._id) return [];
      return cart.filter(item => item.shopId === selectedShop._id);
  }, [cart, selectedShop]);

  const [activeCategory, setActiveCategory] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [fetchedCategories, setFetchedCategories] = useState(new Set());

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

  // --- 2. Branding ---
  const imageUrl = useMemo(() => getImageUrl(selectedShopImage), [selectedShopImage]);
  const { data: logoPalette } = usePalette(imageUrl, 2, "hex", { crossOrigin: "Anonymous", quality: 10 });

  const brandColors = useMemo(() => ({
    main: selectedShop.styles?.mainColor || logoPalette?.[0] || "#F07A48",
    accent: selectedShop.styles?.secondaryColor || logoPalette?.[1] || "#39A170",
  }), [selectedShop, logoPalette]);

  // --- 3. Cart Logic (Redux Based) ---
  
  const handleAddToCart = (dish) => {
    const cartItemPayload = {
        shopId: selectedShop._id,
        productId: dish._id,
        variantId: dish._id, // Food dishes usually don't have complex variants in this view
        title: dish.name,
        sellingPrice: dish.sellingPrice,
        quantity: 1,
        dish: dish // Store full object for UI rendering if needed
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

    const orderPayload = {
      shopId: selectedShop._id,
      customerName: customerDetails.customerName,
      tableNumber: customerDetails.tableNumber,
      note: customerDetails.note,
      // Use filtered shopItems, not global cart
      products: shopCartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        categoryId: item.dish?.categoryId, 
      })),
    };

    try {
      await createPosOrder(orderPayload);
      setIsSubmitting("success");
      setTimeout(() => {
        dispatch(closeCart()); 
        // We might want to clear ONLY this shop's items, but for now assuming clearCart is acceptable behavior on success
        // Ideally: dispatch(clearShopCart(selectedShop._id))
        // For simplicity based on existing reducers:
        shopCartItems.forEach(item => dispatch(updateCartQuantity({ variantId: item.variantId, quantity: 0 })));
        
        setIsSubmitting(null);
      }, 2500);
    } catch (error) {
      console.error("Order Failed:", error);
      setIsSubmitting("error");
      setTimeout(() => setIsSubmitting(null), 3000);
    }
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

  const visibleCategories = categories.filter(c => !c.isHidden);

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
            categories={visibleCategories} 
            activeCategory={activeCategory} 
            onSelect={handleScrollToCategory} 
          />

          <ContentContainer>
            {visibleCategories.length > 0 ? (
              visibleCategories.map((category) => {
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
                        // Find this specific item in the Redux store
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
              <EmptyState>{t("noCategories")}</EmptyState>
            )}
          </ContentContainer>

        </MainContainer>

        {/* 4. Cart Modal */}
        <Cart 
          items={shopCartItems} // Pass only shop items
          onUpdateQuantity={handleUpdateQuantity}
          onSubmitOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
          shopDomain={shopDomain}
        />

        <PoweredByHanuut />

      </PageWrapper>
    </ThemeProvider>
  );
};

export default MenuPage;