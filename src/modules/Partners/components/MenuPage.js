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

// --- Services & Utils ---
import { createPosOrder } from "../services/orderServices";
import { getImageUrl } from "../../../utils/imageUtils"; // The Blob Utility we created

// --- Redux State ---
import { fetchCategories, selectCategories } from "../../Categories/state/reducers";
import { fetchDishesByCategory, selectDishes } from "../../Dish/state/reducers";

// --- Themes ---
import { partnerTheme } from "../../../config/Themes"; 

// --- Styled Components ---

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: #050505; /* Force Deep Dark Background */
  color: white;
  padding-bottom: 120px; /* Extra space for Floating Cart Button */
  position: relative;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  box-sizing: border-box;
`;

const CategorySection = styled.div`
  margin-bottom: 3rem;
  scroll-margin-top: 160px; /* Offset for sticky nav + header */
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: white;
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  border-bottom: 1px solid #27272a;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr; /* Full width cards on mobile */
  }
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: #71717a;
  font-size: 1.2rem;
`;

const MenuPage = ({ selectedShop, selectedShopImage, shopDomain }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  // --- Redux Data ---
  // We fetch categories and dishes from the store
  const { categories, loading: categoriesLoading } = useSelector(selectCategories);
  const { dishes, loading: dishesLoading } = useSelector(selectDishes);

  // --- Local State ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(null);
  
  // Track which categories we have already fetched dishes for to avoid loops
  const [fetchedCategories, setFetchedCategories] = useState(new Set());

  // --- 1. Initial Data Fetching ---
  
  // Fetch Categories when shop loads
  useEffect(() => {
    if (selectedShop && selectedShop.categories) {
      const validCategories = selectedShop.categories.filter(
        (catId) => !selectedShop.hiddenCategories?.includes(catId)
      );
      dispatch(fetchCategories(validCategories));
    }
  }, [dispatch, selectedShop]);

  // Fetch Dishes for ALL visible categories (Waterfall)
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


  // --- 2. Branding & Visuals ---
  
  // Use the new Blob utility for the header image
  const imageUrl = useMemo(() => getImageUrl(selectedShopImage), [selectedShopImage]);
  
  const { data: logoPalette } = usePalette(imageUrl, 2, "hex", { 
    crossOrigin: "Anonymous",
    quality: 10
  });

  const brandColors = useMemo(() => ({
    main: selectedShop.styles?.mainColor || logoPalette?.[0] || "#F07A48",
    accent: selectedShop.styles?.secondaryColor || logoPalette?.[1] || "#39A170",
  }), [selectedShop, logoPalette]);


  // --- 3. Cart Logic ---

  const handleAddToCart = (dish) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.dish._id === dish._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.dish._id === dish._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { dish: dish, quantity: 1 }];
      }
    });
    // Optional: Open cart automatically on first add?
    // setIsCartOpen(true); 
  };

  const handleUpdateQuantity = (dishId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.dish._id !== dishId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.dish._id === dishId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;
    setIsSubmitting("submitting");

    // Basic validation
    if (!customerDetails.customerName) {
       alert(t("form_validation_alert"));
       setIsSubmitting(null);
       return;
    }

    const orderPayload = {
      shopId: selectedShop._id,
      customerName: customerDetails.customerName,
      tableNumber: customerDetails.tableNumber, // Specific to Food
      note: customerDetails.note,
      products: cartItems.map((item) => ({
        productId: item.dish._id,
        title: item.dish.name,
        quantity: item.quantity,
        sellingPrice: item.dish.sellingPrice,
        categoryId: item.dish.categoryId,
      })),
    };

    try {
      await createPosOrder(orderPayload);
      setIsSubmitting("success");
      setTimeout(() => {
        setIsCartOpen(false);
        setCartItems([]);
        setIsSubmitting(null);
      }, 2500);
    } catch (error) {
      console.error("Order Failed:", error);
      setIsSubmitting("error");
      setTimeout(() => setIsSubmitting(null), 3000);
    }
  };


  // --- 4. Navigation Logic ---
  
  const handleScrollToCategory = (catId) => {
    setActiveCategory(catId);
    if (!catId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(`category-${catId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  // --- Render ---

  if (!selectedShop || categoriesLoading && categories.length === 0) {
    return <Loader fullscreen={true} />;
  }

  // Filter out hidden categories for display
  const visibleCategories = categories.filter(c => !c.isHidden);

  return (
    <ThemeProvider theme={partnerTheme}>
      <PageWrapper>
        
        {/* 1. Header */}
        <HeaderContainer>
          <ShopHeader 
            shop={selectedShop} 
            imageData={imageUrl} 
            isSubscribed={true} 
            brandColors={brandColors} 
          />
        </HeaderContainer>

        {/* 2. Sticky Nav */}
        <StickyCategoryNav 
          categories={visibleCategories} 
          activeCategory={activeCategory} 
          onSelect={handleScrollToCategory} 
        />

        {/* 3. Content */}
        <ContentContainer isArabic={i18n.language === 'ar'}>
          
          {visibleCategories.length > 0 ? (
            visibleCategories.map((category) => {
              // Filter dishes from Redux for this specific category
              // Note: Redux dishes array structure is { dish: {...}, categoryId, ... }
              const categoryDishes = dishes.filter(
                (d) => d.categoryId === category.id && d.dish.isHidden !== true
              );

              if (categoryDishes.length === 0) return null; // Don't show empty categories

              return (
                <CategorySection key={category.id} id={`category-${category.id}`}>
                  <SectionTitle>
                    {i18n.language === 'ar' ? category.name : (category.nameFr || category.name)}
                  </SectionTitle>
                  
                  <DishesGrid>
                    {categoryDishes.map((dishWrapper) => {
                      const currentDish = dishWrapper.dish;
                      const cartItem = cartItems.find(
                        (item) => item.dish._id === currentDish._id
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

        {/* 4. Floating Cart */}
        <Cart 
          items={cartItems} 
          isOpen={isCartOpen} 
          onOpen={() => setIsCartOpen(true)} 
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onSubmitOrder={handlePlaceOrder}
          isPremium={true}
          brandColors={brandColors}
          isSubmitting={isSubmitting}
          shopDomain={shopDomain} // "food"
        />

      </PageWrapper>
    </ThemeProvider>
  );
};

export default MenuPage;