import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash, FaLayerGroup, FaBox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { 
  StepTitle, 
  StepSubtitle, 
  BigInput 
} from "../WizardComponents";

// --- Specialized Styles for this Step ---

const CategoryCard = styled(motion.div)`
  background-color: #FAFAFA;
  border: 1px solid #E5E5E5;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #39A170;
    background-color: #FFF;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const CategoryInput = styled(BigInput)`
  font-weight: 700;
  border: none;
  background: transparent;
  padding: 0.5rem 0;
  border-bottom: 2px solid #E5E5E5;
  border-radius: 0;
  font-size: 1.2rem;

  &:focus {
    box-shadow: none;
    transform: none;
    border-color: #39A170;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-left: 1rem;
  border-left: 2px solid #F0F0F0;
`;

const ProductRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ProductInput = styled(BigInput)`
  padding: 0.8rem 1rem;
  font-size: 1rem;
  background-color: #FFF;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.$danger ? "#EF4444" : "#39A170"};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
  font-family: inherit;

  &:hover {
    background-color: ${props => props.$danger ? "rgba(239, 68, 68, 0.1)" : "rgba(57, 161, 112, 0.1)"};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #CCC;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #EF4444;
  }
`;

const AddCategoryButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  border: 2px dashed #E5E5E5;
  border-radius: 16px;
  background: transparent;
  color: #666;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-family: inherit;

  &:hover {
    border-color: #39A170;
    color: #39A170;
    background-color: rgba(57, 161, 112, 0.02);
  }
`;

const Step4Menu = ({ data, update }) => {
  const { t } = useTranslation();
  const categories = data.categories || [];

  // --- Logic ---

  const addCategory = () => {
    if (categories.length >= 5) return;
    const newCats = [...categories, { name: "", products: [""] }];
    update("categories", newCats);
  };

  const removeCategory = (index) => {
    const newCats = [...categories];
    newCats.splice(index, 1);
    update("categories", newCats);
  };

  const updateCategoryName = (index, value) => {
    const newCats = [...categories];
    newCats[index].name = value;
    update("categories", newCats);
  };

  const addProduct = (catIndex) => {
    const newCats = [...categories];
    if (newCats[catIndex].products.length >= 4) return;
    newCats[catIndex].products.push("");
    update("categories", newCats);
  };

  const removeProduct = (catIndex, prodIndex) => {
    const newCats = [...categories];
    newCats[catIndex].products.splice(prodIndex, 1);
    update("categories", newCats);
  };

  const updateProduct = (catIndex, prodIndex, value) => {
    const newCats = [...categories];
    newCats[catIndex].products[prodIndex] = value;
    update("categories", newCats);
  };

  return (
    <>
      <StepTitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("wiz_step4_title")}
      </StepTitle>
      <StepSubtitle>
        {t("wiz_step4_subtitle")}
      </StepSubtitle>

      {/* Categories List */}
      <AnimatePresence>
        {categories.map((cat, catIndex) => (
          <CategoryCard
            key={catIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Card Header: Category Name */}
            <CardHeader>
              <FaLayerGroup style={{ color: "#39A170", fontSize: '1.2rem' }} />
              <CategoryInput 
                placeholder={t("wiz_placeholder_cat") || "Category Name"}
                value={cat.name}
                onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                autoFocus={catIndex === categories.length - 1} // Focus on new cards
              />
              <IconButton onClick={() => removeCategory(catIndex)}>
                <FaTrash />
              </IconButton>
            </CardHeader>

            {/* Products List */}
            <ProductList>
              {cat.products.map((prod, prodIndex) => (
                <ProductRow key={prodIndex}>
                  <FaBox style={{ color: "#DDD", fontSize: "0.8rem" }} />
                  <ProductInput 
                    placeholder={t("wiz_placeholder_prod") || "Product Name"}
                    value={prod}
                    onChange={(e) => updateProduct(catIndex, prodIndex, e.target.value)}
                  />
                  {cat.products.length > 1 && (
                    <IconButton onClick={() => removeProduct(catIndex, prodIndex)}>
                      <FaTrash size={12} />
                    </IconButton>
                  )}
                </ProductRow>
              ))}
              
              {/* Add Product Button */}
              {cat.products.length < 4 && (
                <ActionButton onClick={() => addProduct(catIndex)}>
                  <FaPlus size={10} /> {t("wiz_btn_add_product")}
                </ActionButton>
              )}
            </ProductList>
          </CategoryCard>
        ))}
      </AnimatePresence>

      {/* Add Category Button */}
      {categories.length < 5 && (
        <AddCategoryButton onClick={addCategory}>
          <FaPlus /> {t("wiz_btn_add_category")}
        </AddCategoryButton>
      )}
    </>
  );
};

export default Step4Menu;