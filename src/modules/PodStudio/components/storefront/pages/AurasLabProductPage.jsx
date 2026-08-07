// src/modules/PodStudio/components/storefront/pages/AurasLabProductPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaPaintBrush, FaArrowRight, FaArrowLeft, FaExclamationTriangle, FaStore } from "react-icons/fa";
import Seo from "../../../../../components/Seo";
import Loader from "../../../../../components/Loader";
import { resolveColorData } from "../../../../../utils/colorUtils";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #0c0c0e;
  color: #ffffff;
  padding: 6rem 1.5rem 4rem 1.5rem;
  box-sizing: border-box;
  font-family: "Tajawal", "Cairo", sans-serif;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: center;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const GalleryStage = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2rem;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.6));
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: start;
`;

const SkuTag = styled.span`
  color: #F07A48;
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
`;

const ProductTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0;
`;

const PriceTag = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #39A170;
`;

const SpecBadgeRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #a1a1aa;
`;

const ColorSwatches = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SwatchCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.$active ? "#F07A48" : "rgba(255, 255, 255, 0.2)")};
  background-color: ${(props) => props.$bg};
  cursor: pointer;
`;

const CustomizeCta = styled(Link)`
  background: #F07A48;
  color: #050505;
  padding: 1.1rem 2rem;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 800;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;
  transition: transform 0.2s, filter 0.2s;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;

  svg {
    font-size: 3.5rem;
    color: #F07A48;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
  }

  p {
    color: #a1a1aa;
    margin: 0;
    line-height: 1.6;
  }
`;

const AurasLabProductPage = () => {
  const { ProductSku } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");

  const API_URL = process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

  // src/modules/PodStudio/components/storefront/pages/AurasLabProductPage.jsx

useEffect(() => {
  if (!ProductSku) return;

  setLoading(true);
  const cleanSku = ProductSku.trim();

  // Primary: Fetch via new dedicated SKU endpoint
  axios
    .get(`${API_URL}/global-product/sku/${encodeURIComponent(cleanSku)}`)
    .then((res) => {
      if (res.data) {
        setProduct(res.data);
        if (res.data?.availabilities?.[0]) {
          setSelectedColor(res.data.availabilities[0].color);
        }
        setLoading(false);
      }
    })
    .catch(() => {
      // Fallback: Fetch by direct Mongo ID
      axios
        .get(`${API_URL}/global-product/findById/${encodeURIComponent(cleanSku)}`)
        .then((res) => {
          if (res.data) {
            setProduct(res.data);
            if (res.data?.availabilities?.[0]) {
              setSelectedColor(res.data.availabilities[0].color);
            }
          }
        })
        .catch((err) => {
          console.error("Product lookup failed across both SKU & ID:", err);
        })
        .finally(() => setLoading(false));
    });
}, [ProductSku, API_URL]);

  const activeImageId = useMemo(() => {
    if (!product) return null;
    const avail = product.availabilities?.find((a) => a.color === selectedColor);
    return avail?.imageId || product.images?.[0];
  }, [product, selectedColor]);

  if (loading) return <Loader fullscreen={true} />;

  if (!product) {
    return (
      <PageWrapper $isArabic={isArabic}>
        <NotFoundWrapper>
          <FaExclamationTriangle />
          <h2>{isArabic ? "المنتج غير متوفر حالياً" : "Product Currently Unavailable"}</h2>
          <p>
            {isArabic
              ? "المنتج الذي تبحث عنه غير موجود أو تم تعديل السلسلة التعريفية الخاصة به."
              : "The custom blank canvas you are looking for does not exist or has been updated."}
          </p>
          <CustomizeCta to="/aurasLab/studio">
            <FaStore />
            <span>{isArabic ? "تصفح كافة الخامات في الاستوديو" : "Explore Studio Canvas Library"}</span>
          </CustomizeCta>
        </NotFoundWrapper>
      </PageWrapper>
    );
  }

  const price = product.availabilities?.[0]?.sizes?.[0]?.sellingPrice || 0;
  const imageUrl = activeImageId ? `${API_URL}/image/raw/${activeImageId}` : "/logoPic.png";

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={`${product.name} | AURAS LAB`}
        description={product.shortDescription || `${product.name} - Custom print-on-demand streetwear.`}
        image={imageUrl}
        url={`https://hanuut.com/aurasLab/${ProductSku}`}
      />

      <Container>
        <GalleryStage>
          <img src={imageUrl} alt={product.name} />
        </GalleryStage>

        <ProductDetails>
          <SkuTag>{product.sku || ProductSku}</SkuTag>
          <ProductTitle>{product.name}</ProductTitle>
          <PriceTag>{price} DZD</PriceTag>

          <SpecBadgeRow>
            {product.specifications?.map((spec, idx) => (
              <Badge key={idx}>{spec.name}: {spec.value}</Badge>
            ))}
          </SpecBadgeRow>

          <div>
            <span style={{ fontSize: "0.85rem", color: "#a1a1aa", display: "block", marginBottom: "8px" }}>
              {isArabic ? "الألوان المتاحة" : "Available Colors"}
            </span>
            <ColorSwatches>
              {product.availabilities?.map((av, idx) => {
                const colorInfo = resolveColorData(product, av.color, i18n.language);
                return (
                  <SwatchCircle
                    key={idx}
                    $active={selectedColor === av.color}
                    $bg={colorInfo.hex}
                    onClick={() => setSelectedColor(av.color)}
                    title={colorInfo.label}
                  />
                );
              })}
            </ColorSwatches>
          </div>

          <p style={{ color: "#a1a1aa", lineHeight: 1.6, margin: 0 }}>
            {product.longDescription || product.shortDescription}
          </p>

          <CustomizeCta to={`/aurasLab/studio/${ProductSku}`}>
            <FaPaintBrush />
            <span>{isArabic ? "صمم هذا المنتج الآن" : "Customize This Product"}</span>
            {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
          </CustomizeCta>
        </ProductDetails>
      </Container>
    </PageWrapper>
  );
};

export default AurasLabProductPage;