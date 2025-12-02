import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getImageUrl } from "../../../utils/imageUtils"; 
// Import the service to fetch the image buffer
import { getImage } from "../../Images/services/imageServices"; 
import AddToCartControl from "./AddToCartControl";

const CardWrapper = styled(motion.div)`
  background-color: #18181B;
  border: 1px solid #27272A;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  transition: transform 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    transform: translateY(-4px);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  background-color: #09090b;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${CardWrapper}:hover img {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to top, #18181B 0%, transparent 100%);
  }
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const DishName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.3;
  font-family: 'Tajawal', sans-serif;
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  white-space: nowrap;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #A1A1AA;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #18181b 0%, #27272a 50%, #18181b 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const PremiumDishCard = ({ dish, onAddToCart, onUpdateQuantity, cartItem, brandColors, isShopOpen }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  // --- Restore Image Fetching Logic ---
  const [imageBuffer, setImageBuffer] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    if (dish?.imageId) {
      getImage(dish.imageId)
        .then((res) => {
          if (isMounted && res.data) {
             setImageBuffer(res.data);
          }
        })
        .catch((err) => console.error("Img error", err));
    }
    return () => { isMounted = false; };
  }, [dish]);

  // Convert the fetched buffer to a URL using our new utility
  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);

  // Handle Name Localization
  const dishName = !isArabic && dish.nameFr ? dish.nameFr : dish.name;
  const ingredients = dish.ingredients?.filter(i => i).join(" · ");

  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.4 }}
    >
      <ImageContainer>
        {imageUrl ? (
          <img src={imageUrl} alt={dishName} loading="lazy" />
        ) : (
          // Show skeleton or icon while loading
          dish.imageId ? <LoadingSkeleton /> : (
             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '3rem' }}>
               🍽️
            </div>
          )
        )}
      </ImageContainer>

      <Content>
        <TitleRow>
          <DishName>{dishName}</DishName>
          <Price>{parseInt(dish.sellingPrice)} {t("dzd")}</Price>
        </TitleRow>
        
        <Description>
          {dish.description || ingredients}
        </Description>

        <Footer>
           {isShopOpen ? (
             <AddToCartControl 
                dish={dish}
                cartItem={cartItem}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                isPremium={true}
                brandColors={brandColors}
             />
           ) : (
             <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold' }}>
                {t('shop_status_closed')}
             </span>
           )}
        </Footer>
      </Content>
    </CardWrapper>
  );
};

export default PremiumDishCard;