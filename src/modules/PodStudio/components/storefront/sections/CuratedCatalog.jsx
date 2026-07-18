import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";

// ROBUST GETTER: Safely handles both raw API arrays and adapted Objects
const getSpec = (prod, key) => {
  if (!prod.specifications) return null;
  if (Array.isArray(prod.specifications)) {
    return (
      prod.specifications.find((s) => s.name?.toLowerCase() === key)?.value ||
      null
    );
  }
  return prod.specifications[key] || null;
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 280px;

  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    background: #111214;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #f07a48;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a1a1aa;
  }
`;

const BentoCard = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #f07a48;
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  }
`;

const ImageArea = styled.div`
  flex: 1;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  min-height: 250px;

  img {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.5));
    transition: transform 0.4s ease;
  }

  ${BentoCard}:hover & img {
    transform: scale(1.05);
  }
`;

const InfoArea = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const ProductVisual = ({ product }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const imgId = product.availabilities?.[0]?.imageId || product.imageId;
    if (imgId) {
      getImage(imgId)
        .then((res) => {
          if (res.data) setUrl(getImageUrl(res.data));
        })
        .catch(() => {});
    }
  }, [product]);

  return url ? (
    <img src={url} alt={product.name} loading="lazy" />
  ) : (
    <span style={{ fontSize: "3rem" }}>👕</span>
  );
};

const CuratedCatalog = ({ products, categories, onSelectCanvas }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState("");

  const displayList = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCat =
        !activeCat ||
        p.categoryId === activeCat ||
        p.categoryId?._id === activeCat;
      const matchSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCat, search]);

  return (
    <Section>
      <TopBar style={{ direction: isArabic ? "rtl" : "ltr" }}>
        <SectionTitle>
          {t("pod_studio_catalog_heading", "Explore Blank C")}
        </SectionTitle>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder={t("search_products", "Search products...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
      </TopBar>

      <div
        className="category-pills-rail"
        style={{ direction: isArabic ? "rtl" : "ltr" }}
      >
        <button
          className={`auras-category-pill ${activeCat === null ? "active" : ""}`}
          onClick={() => setActiveCat(null)}
        >
          {t("all_products", "All")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`auras-category-pill ${activeCat === cat.id ? "active" : ""}`}
            onClick={() => setActiveCat(cat.id)}
          >
            {isArabic ? cat.name : cat.nameFr || cat.name}
          </button>
        ))}
      </div>

      <div
        className="editorial-bento-grid bento-card"
        style={{ direction: isArabic ? "rtl" : "ltr" }}
      >
        {displayList.map((prod) => {
          const defaultSize = prod.availabilities?.[0]?.sizes?.[0];

          return (
            <BentoCard
              key={prod._id || prod.id}
              onClick={() => onSelectCanvas(prod)}
              className="bento-card"
            >
              <ImageArea>
                <ProductVisual product={prod} />
              </ImageArea>
              <InfoArea>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#71717a",
                    fontFamily: "monospace",
                  }}
                >
                  {prod.sku || "CANVAS"}
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    color: "white",
                    fontFamily: "Tajawal",
                  }}
                >
                  {prod.name}
                </h3>
                <SpecRow>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    {parseInt(defaultSize?.sellingPrice || 0)} {t("dzd", "DA")}
                  </span>
                  <button
                    style={{
                      background: "#F07A48",
                      color: "#000",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontFamily: "Tajawal",
                    }}
                  >
                    {t("pod_store_start_designing_btn", "Design")}
                  </button>
                </SpecRow>
              </InfoArea>
            </BentoCard>
          );
        })}
      </div>
    </Section>
  );
};

export default CuratedCatalog;
