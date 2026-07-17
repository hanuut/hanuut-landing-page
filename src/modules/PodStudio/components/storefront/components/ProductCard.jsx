import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";

const CardWrapper = styled.div`
  background-color: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 280px;
  width: 280px;
  scroll-snap-align: start;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(240, 122, 72, 0.4);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }
`;

const ImageStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 85%);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.45));
    transition: transform 0.4s ease;
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.04);
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: start;
`;

const CategoryBadge = styled.span`
  font-family: monospace;
  font-size: 0.7rem;
  color: #71717a;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductName = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  font-family: 'Tajawal', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpecRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const SpecBadge = styled.span`
  font-size: 0.72rem;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #a1a1aa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Cairo', sans-serif;
`;

const PricingActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const PriceValue = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
`;

const CustomizeBtn = styled.button`
  background-color: #f07a48;
  color: #050505;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 800;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: 'Tajawal', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.15);
    transform: scale(1.02);
  }
`;

const ProductCard = ({ product, index, onSelect }) => {
  const { t } = useTranslation();
  const [imageBuffer, setImageBuffer] = useState(null);

  const defaultAvailability = product?.availabilities?.[0];
  const defaultSize = defaultAvailability?.sizes?.[0];
  const imageId = defaultAvailability?.imageId;

  useEffect(() => {
    let isMounted = true;
    if (imageId) {
      getImage(imageId).then((res) => {
        if (isMounted && res?.data) {
          setImageBuffer(res.data);
        }
      }).catch((err) => console.error("Error loading substrate image:", err));
    }
    return () => { isMounted = false; };
  }, [imageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);

  // --- ARRAYS TYPE PROTECTION ENFORCED ---
  const gsmValue = useMemo(() => {
    if (!product.specifications || !Array.isArray(product.specifications)) return null;
    return product.specifications.find(spec => spec.name?.toLowerCase() === "gsm")?.value || null;
  }, [product.specifications]);

  const materialValue = useMemo(() => {
    if (!product.specifications || !Array.isArray(product.specifications)) return null;
    return product.specifications.find(spec => spec.name?.toLowerCase() === "material")?.value || null;
  }, [product.specifications]);

  return (
    <CardWrapper className="pod-card-wrapper">
      <ImageStage onClick={onSelect}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div style={{ fontSize: "2.5rem" }}>👕</div>
        )}
      </ImageStage>
      <InfoBlock>
        <CategoryBadge>
          {t("pod_store.base_label", "CANVAS")} / {String(index + 1).padStart(3, "0")}
        </CategoryBadge>
        <ProductName onClick={onSelect}>{product.name}</ProductName>
        <SpecRow>
          {gsmValue && <SpecBadge>{gsmValue} GSM</SpecBadge>}
          {materialValue && <SpecBadge>{materialValue}</SpecBadge>}
          {product.hasBackPrintSurface && <SpecBadge>{t("pod_store.double_sided", "Double-Sided")}</SpecBadge>}
        </SpecRow>
      </InfoBlock>
      <PricingActionRow>
        <PriceValue>
          {parseInt(defaultSize?.sellingPrice || 0)} {t("dzd", "DA")}
        </PriceValue>
        <CustomizeBtn onClick={onSelect}>
          {t("pod_store.start_designing_btn", "Design")}
        </CustomizeBtn>
      </PricingActionRow>
    </CardWrapper>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default ProductCard;