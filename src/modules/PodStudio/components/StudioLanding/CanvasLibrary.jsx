import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPalette } from "react-icons/fa";
import { fetchPaginatedProducts, selectProducts } from "../../../Product/state/reducers";
import { selectCategories } from "../../../Categories/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import Loader from "../../../../components/Loader";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";

const parseBilingualText = (text, targetLang) => {
  if (!text) return "";
  
  const words = text.split(/(\s+)/);
  const arabicRegex = /[\u0600-\u06FF]/;
  
  const arabicSegments = [];
  const latinSegments = [];
  
  let currentSegment = [];
  let isCurrentArabic = null;
  
  words.forEach(word => {
    if (word.trim() === "") {
      currentSegment.push(word);
      return;
    }
    
    const isArabic = arabicRegex.test(word);
    if (isCurrentArabic === null) {
      isCurrentArabic = isArabic;
    }
    
    if (isArabic !== isCurrentArabic) {
      const segmentText = currentSegment.join("");
      if (isCurrentArabic) {
        arabicSegments.push(segmentText);
      } else {
        latinSegments.push(segmentText);
      }
      currentSegment = [word];
      isCurrentArabic = isArabic;
    } else {
      currentSegment.push(word);
    }
  });
  
  if (currentSegment.length > 0) {
    const segmentText = currentSegment.join("");
    if (isCurrentArabic) {
      arabicSegments.push(segmentText);
    } else {
      latinSegments.push(segmentText);
    }
  }
  
  if (targetLang === "ar") {
    const result = arabicSegments.join(" ").replace(/\s+/g, ' ').trim();
    return result || text;
  } else {
    const result = latinSegments.join(" ").replace(/\s+/g, ' ').trim();
    return result.replace(/^[\s/|.-]+|[\s/|.-]+$/g, '').trim() || text;
  }
};

const LibraryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
    font-family: 'Tajawal', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), transparent);
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const CategoriesWrap = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

const FilterPill = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: ${(props) => props.$active ? "rgba(240, 122, 72, 0.15)" : "rgba(255,255,255,0.02)"};
  border: 1px solid ${(props) => props.$active ? props.theme.primaryColor || "#F07A48" : "rgba(255,255,255,0.08)"};
  color: ${(props) => props.$active ? props.theme.primaryColor || "#F07A48" : "#a1a1aa"};
  font-family: 'Tajawal', sans-serif;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;

  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    background: rgba(24, 24, 27, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    outline: none;
    font-family: 'Tajawal', sans-serif;

    &:focus {
      border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #52525b;
    font-size: 0.9rem;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 120px 2fr 1.5fr auto;
  padding: 0 1.5rem 0.5rem 1.5rem;
  color: #71717a;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: monospace;
  text-align: start;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 80px 120px 2fr 1.5fr auto;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.$active ? "rgba(255, 255, 255, 0.05)" : "rgba(24, 24, 27, 0.3)"};
  border: 1px solid ${(props) => props.$active ? (props.theme.primaryColor || "#F07A48") : "rgba(255, 255, 255, 0.05)"};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
`;

const RowPreviewCell = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.35);
  flex-shrink: 0;
  @media (max-width: 768px) { margin: 0 auto; }
`;

const CellSpotlight = styled.div`
  position: absolute;
  inset: -10%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(240, 122, 72, 0.15) 50%, transparent 80%);
  filter: blur(15px);
  z-index: 0;
`;

const CellStackedImages = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const SkuCol = styled.div`
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  font-family: monospace;
  font-weight: 700;
  font-size: 0.85rem;
  text-align: start;
  @media (max-width: 768px) { text-align: center; }
`;

const IdentityCol = styled.div`
  color: #ffffff;
  font-weight: 800;
  font-size: 1.05rem;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: 0.5px;
  text-align: start;
  @media (max-width: 768px) { text-align: center; }
`;

const TechCol = styled.div`
  color: #a1a1aa;
  font-size: 0.8rem;
  font-family: 'Cairo', sans-serif;
  text-align: start;
  @media (max-width: 768px) { text-align: center; }
`;

const ActionCol = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) { justify-content: center; }
`;

const SelectTextButton = styled.button`
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: 'Tajawal', sans-serif;
  transition: transform 0.2s;
  
  &:hover { transform: scale(1.02); }
`;

const SelectIconButton = styled.button`
  background: rgba(255,255,255,0.03);
  color: #a1a1aa;
  border: 1px solid rgba(255,255,255,0.08);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
    border-color: transparent;
  }
`;

const SidePanel = styled(motion.div)`
  background: rgba(24, 24, 27, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 1.5rem;
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 40px 80px rgba(0,0,0,0.55);
`;

const PanelHeader = styled.div`
  h4 {
    margin: 0;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 800;
    font-family: 'Tajawal', sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
`;

const BlueprintPreview = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #050505;
  border-radius: 16px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const BlueprintSpotlight = styled.div`
  position: absolute;
  inset: -10%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(240, 122, 72, 0.18) 50%, transparent 80%);
  filter: blur(35px);
  z-index: 0;
`;

const TechList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const TechRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.4rem;

  .label {
    font-size: 0.75rem;
    color: #71717a;
    font-weight: 800;
    text-transform: uppercase;
    font-family: 'Tajawal', sans-serif;
  }

  .value {
    font-size: 0.8rem;
    color: #e4e4e7;
    font-weight: 700;
    font-family: monospace;
  }
`;

const RichTextContainer = styled.section`
  width: 100%;
  padding: 3rem 2rem;
  background: rgba(24, 24, 27, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  margin-top: 4rem;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  text-align: start;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProtocolCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    font-family: 'Tajawal', sans-serif;
    margin: 0;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 0.95rem;
    color: #a1a1aa;
    line-height: 1.6;
    font-family: 'Cairo', sans-serif;
    margin: 0;
  }
`;

const CustomRotatingMockup = ({ colorObj, title, isLarge = false, isHovered = false }) => {
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [isFrontActive, setIsFrontActive] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (colorObj?.podFrontTemplateId) {
      getImage(colorObj.podFrontTemplateId).then(res => {
        if (isMounted && res.data) setFrontUrl(getImageUrl(res.data));
      });
    }
    if (colorObj?.podBackTemplateId) {
      getImage(colorObj.podBackTemplateId).then(res => {
        if (isMounted && res.data) setBackUrl(getImageUrl(res.data));
      });
    }
    return () => { isMounted = false; };
  }, [colorObj]);

  useEffect(() => {
    if (!backUrl || (!isHovered && !isLarge)) {
      setIsFrontActive(true);
      return;
    }
    
    const timer = setInterval(() => {
      setIsFrontActive(prev => !prev);
    }, 2600);
    return () => clearInterval(timer);
  }, [backUrl, isHovered, isLarge]);

  const hasBack = !!backUrl;

  return (
    <CellStackedImages>
      {frontUrl ? (
        <motion.img
          src={frontUrl}
          alt={title}
          animate={{
            zIndex: isFrontActive ? 3 : 1,
            scale: isFrontActive ? 1.05 : 0.88,
            rotate: isFrontActive ? (isLarge ? 8 : 4) : (isLarge ? -4 : -2),
            x: isFrontActive ? 0 : (isLarge ? -15 : -8),
            opacity: isFrontActive ? 1.0 : 0.75
          }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            width: isLarge ? '85%' : '80%',
            height: isLarge ? '85%' : '80%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.45))'
          }}
        />
      ) : (
        <div style={{ zIndex: 3, fontSize: isLarge ? "4rem" : "1.5rem" }}>👕</div>
      )}
      {hasBack && (
        <motion.img
          src={backUrl}
          alt={title}
          animate={{
            zIndex: isFrontActive ? 1 : 3,
            scale: isFrontActive ? 0.88 : 1.05,
            rotate: isFrontActive ? (isLarge ? -12 : -6) : (isLarge ? 8 : 4),
            x: isFrontActive ? (isLarge ? 15 : 8) : 0,
            opacity: isFrontActive ? 0.75 : 1.0
          }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            width: isLarge ? '85%' : '80%',
            height: isLarge ? '85%' : '80%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.45))'
          }}
        />
      )}
    </CellStackedImages>
  );
};

const CanvasLibrary = ({ shopId, onSelectCanvas, shop }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { paginatedProducts, paginationLoading } = useSelector(selectProducts);
  const { categories } = useSelector(selectCategories);
  
  const [hoveredCanvas, setHoveredCanvas] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get active paginated products list
  useEffect(() => {
    dispatch(
      fetchPaginatedProducts({
        shopId,
        page: 1,
        limit: 24,
        categoryId: "",
        search: "",
        isNewFilter: true,
        printOnDemand: true
      })
    );
  }, [dispatch, shopId]);

  // Robust parsing of shop.categories to prevent populated object crash
  const shopCategoryIds = useMemo(() => {
    if (!shop?.categories) return [];
    return shop.categories.map(cat => (typeof cat === 'object' ? (cat._id || cat.id) : cat));
  }, [shop]);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => shopCategoryIds.includes(cat.id || cat._id));
  }, [categories, shopCategoryIds]);

  const canvasList = useMemo(() => {
    if (!Array.isArray(paginatedProducts)) return [];
    return paginatedProducts.map(p => {
      const mapped = productToCanvasAdapter(p);
      if (!mapped) return null;
      return {
        ...mapped,
        sku: p.sku || String(p._id || p.id).substring(0, 5).toUpperCase(),
        rawCategory: p.categoryId,
        shortDescription: p.shortDescription || ""
      };
    }).filter(Boolean);
  }, [paginatedProducts]);

  const filteredList = useMemo(() => {
    return canvasList.filter(canvas => {
      const canvasCatId = canvas.rawCategory?.id || canvas.rawCategory?._id || canvas.rawCategory;
      const matchesCategory = !selectedCategory || canvasCatId === selectedCategory;
      const matchesSearch = !searchQuery || canvas.title.toLowerCase().includes(searchQuery.toLowerCase()) || canvas.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [canvasList, selectedCategory, searchQuery]);

  useEffect(() => {
    if (filteredList.length > 0 && !filteredList.some(item => item.canvasId === hoveredCanvas?.canvasId)) {
      setHoveredCanvas(filteredList[0]);
    }
  }, [filteredList, hoveredCanvas]);

  if (paginationLoading && canvasList.length === 0) {
    return <Loader fullscreen={false} />;
  }

  return (
    <LibraryContainer>
      <SectionHeader>
        <h3>{t("pod_studio.blank_catalog_title")}</h3>
        <div className="line" />
      </SectionHeader>

      <FilterRow $isArabic={isArabic}>
        <CategoriesWrap>
          <FilterPill $active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
            {t("all_products")}
          </FilterPill>
          {filteredCategories.map((cat) => (
            <FilterPill 
              key={cat.id || cat._id} 
              $active={selectedCategory === (cat.id || cat._id)} 
              onClick={() => setSelectedCategory(cat.id || cat._id)}
            >
              {isArabic ? cat.name : (cat.nameFr || cat.name)}
            </FilterPill>
          ))}
        </CategoriesWrap>

        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder={t("search_products")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
      </FilterRow>

      <LayoutGrid>
        <TableWrapper>
          <TableHeader>
            <div style={{ paddingLeft: "15px" }}>MOCKUP</div>
            <div>{t("pod_studio.id_header", "ID")}</div>
            <div>{t("pod_studio.canvas_identity_header", "Canvas Identity")}</div>
            <div>{t("pod_studio.weight_composition_header", "Weight & Composition")}</div>
            <div style={{ textAlign: 'right' }}>{t("pod_studio.action_header", "Action")}</div>
          </TableHeader>
          {filteredList.map((canvas) => {
            const isActive = hoveredCanvas?.canvasId === canvas.canvasId;
            const hasSpecs = !!(canvas.specifications.gsm && canvas.specifications.composition);
            
            const parsedSpecs = hasSpecs
              ? `GSM ${canvas.specifications.gsm} // ${canvas.specifications.composition.toUpperCase()}`
              : parseBilingualText(canvas.shortDescription, i18n.language);

            return (
              <TableRow 
                key={canvas.canvasId}
                $active={isActive}
                onMouseEnter={() => setHoveredCanvas(canvas)}
                onClick={() => onSelectCanvas(canvas)}
              >
                <RowPreviewCell>
                  <CellSpotlight />
                  <CustomRotatingMockup 
                    colorObj={canvas.availableColors?.[0]} 
                    title={canvas.title} 
                    isLarge={false} 
                    isHovered={isActive}
                  />
                </RowPreviewCell>

                <SkuCol>{canvas.sku}</SkuCol>
                <IdentityCol>{canvas.title.toUpperCase()}</IdentityCol>
                <TechCol>{parsedSpecs}</TechCol>
                <ActionCol>
                  {isActive ? (
                    <SelectTextButton onClick={(e) => { e.stopPropagation(); onSelectCanvas(canvas); }}>
                      {t("pod_studio.start_designing_cta")}
                    </SelectTextButton>
                  ) : (
                    <SelectIconButton onClick={(e) => { e.stopPropagation(); onSelectCanvas(canvas); }}>
                      <FaPalette />
                    </SelectIconButton>
                  )}
                </ActionCol>
              </TableRow>
            );
          })}
        </TableWrapper>

        <AnimatePresence mode="wait">
          {hoveredCanvas && (
            <SidePanel
              key={hoveredCanvas.canvasId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <PanelHeader>
                <h4>{t("pod_studio.blank_specifications")}</h4>
              </PanelHeader>

              <BlueprintPreview>
                <BlueprintSpotlight />
                <CustomRotatingMockup 
                  colorObj={hoveredCanvas.availableColors?.[0]} 
                  title={hoveredCanvas.title} 
                  isLarge={true} 
                  isHovered={true}
                />
              </BlueprintPreview>
              
              <TechList>
                {hoveredCanvas.specifications.gsm ? (
                  <>
                    <TechRow>
                      <span className="label">Fabric Weight</span>
                      <span className="value">{hoveredCanvas.specifications.gsm} GSM</span>
                    </TechRow>
                    <TechRow>
                      <span className="label">Cut Type</span>
                      <span className="value">{hoveredCanvas.specifications.fit}</span>
                    </TechRow>
                    <TechRow>
                      <span className="label">Print Zones</span>
                      <span className="value">{hoveredCanvas.specifications.printableSurfaces.join(" & ").toUpperCase()}</span>
                    </TechRow>
                  </>
                ) : (
                  <div style={{ textAlign: "start" }}>
                    <span className="label" style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: "800" }}>
                      DESCRIPTION
                    </span>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#e4e4e7", lineHeight: "1.5", fontFamily: "Cairo, sans-serif" }}>
                      {parseBilingualText(hoveredCanvas.shortDescription, i18n.language)}
                    </p>
                  </div>
                )}
              </TechList>
            </SidePanel>
          )}
        </AnimatePresence>
      </LayoutGrid>

      <RichTextContainer $isArabic={isArabic}>
        <ProtocolCol>
          <h2>{isArabic ? "بروتوكول التصنيع الرقمي" : "SYNTHESIS & FABRICATION PROTOCOL"}</h2>
          <p>
            {isArabic 
              ? "أهلاً بك في معمل أوراس فورج بود لابد لتصميم وتجهيز الملابس الفاخرة المخصصة بالجزائر. نستخدم في هذا الاستوديو خوانت ومواد خام مصممة لتستمر طويلاً وتبرز أفكارك. قم برفع تصاميمك المخصصة على قمصان ثقيلة الوزن، كنزات قطنية متينة، وحقائب قماشية صديقة للبيئة. دقة متناهية وشحن فوري لكافة الولايات." 
              : "Welcome to AF POD Lab, the premium print-on-demand custom streetwear laboratory in Algeria. Every canvas is selected to ensure structural integrity and dynamic color balance. Design and build your custom apparel collections with precision-grade digital sublimation on organic heavy-weight cotton, tailored substrates, hoodies, and eco-friendly tote bags."}
          </p>
        </ProtocolCol>
        <ProtocolCol>
          <h2>{isArabic ? "مواصفات الخامات الممتازة" : "MATERIAL CORE SPECIFICATIONS"}</h2>
          <p>
            {isArabic 
              ? "تتميز جميع القطع الأساسية لدينا بالمتانة والراحة العالية. قمصان ثقيلة الوزن بوزن 260 غرام/متر مربع، وكنزات كنزات مريحة بوزن 400 غرام/متر مربع من القطن العضوي منسوجة خصيصاً لتناسب أحدث صيحات الموضة والملابس المريحة. جميع الألوان مفحوصة بدقة لضمان ثبات الطباعة والرسومات المخصصة." 
              : "Our premium blanks feature heavy open-end combed cotton, double-needle lockstitching, and drop-shoulder streetwear cuts. Enjoy uncompromised design freedom on 260 GSM custom tees and 400 GSM loopback French Terry hoodies. Every coordinate is calibrated to mirror the highest quality control standards."}
          </p>
        </ProtocolCol>
      </RichTextContainer>
    </LibraryContainer>
  );
};

CanvasLibrary.propTypes = {
  shopId: PropTypes.string.isRequired,
  onSelectCanvas: PropTypes.func.isRequired,
  shop: PropTypes.object.isRequired,
};

export default CanvasLibrary;