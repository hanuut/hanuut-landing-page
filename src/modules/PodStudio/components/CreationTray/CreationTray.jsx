// src/modules/PodStudio/components/CreationTray/CreationTray.jsx

import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaBoxOpen, FaShoppingCart, FaEdit } from "react-icons/fa";
import { cartToCreationTrayAdapter } from "../../adapters/cartToCreationTrayAdapter";
import { removeFile } from "../../utils/indexedDbHelper";
import PodMockupPreview from "../Workspace/PodMockupPreview";

const TrayWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 380px;
  background-color: #0c0c0e;
  border-left: ${(props) =>
    props.$isArabic ? "none" : "1px solid rgba(255, 255, 255, 0.1)"};
  border-right: ${(props) =>
    props.$isArabic ? "1px solid rgba(255, 255, 255, 0.1)" : "none"};
  z-index: 1000;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  ${(props) => (props.$isArabic ? "left: 0;" : "right: 0;")}
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const TrayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
`;

const TrayTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  font-family: "Tajawal", sans-serif;
`;

const ScrollableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  color: #52525b;
`;

const ItemRow = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PreviewsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const DetailsBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: start;
`;

const ItemTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
`;

const MetaText = styled.span`
  font-size: 0.75rem;
  color: #a1a1aa;
`;

const PriceText = styled.span`
  font-size: 0.75rem;
  color: #39a170;
  font-weight: 600;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => (props.$danger ? "#ef4444" : "#a1a1aa")};
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${(props) => (props.$danger ? "#f87171" : "#fff")};
  }
`;

const ProductionButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  background-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  box-shadow: 0 10px 20px rgba(240, 122, 72, 0.25);

  &:hover {
    filter: brightness(1.1);
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
`;

const CreationTray = ({
  cartItems,
  shopId,
  isOpen,
  onClose,
  onDelete,
  onEdit,
  onSubmit,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [zoomConfig, setZoomedConfig] = useState(null);

  const trayItems = useMemo(() => {
    return cartToCreationTrayAdapter(cartItems, shopId);
  }, [cartItems, shopId]);

  const handleDelete = (lineItemId) => {
    removeFile(`${lineItemId}_front`);
    removeFile(`${lineItemId}_back`);
    onDelete(lineItemId);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <TrayWrapper
            $isArabic={isArabic}
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          >
            <TrayHeader>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FaShoppingCart style={{ color: "#F07A48" }} />
                <TrayTitle>{t("pod_studio_tray_title")}</TrayTitle>
              </div>
              <ActionButton onClick={onClose} style={{ fontSize: "1.5rem" }}>
                &times;
              </ActionButton>
            </TrayHeader>

            <ScrollableContainer>
              {trayItems.length > 0 ? (
                trayItems.map((item) => {
                  const hasFront = !!item.customization?.front;
                  const hasBack = !!item.customization?.back;

                  const adaptedItem = {
                    title: item.title,
                    sizeSelected: item.sizeSelected,
                    variantId: item.lineItemId,
                    podCustomization: item.customization
                      ? {
                          printSide: item.customization.printSide || "blank",
                          front: item.customization.front
                            ? {
                                x: item.customization.front.xOffsetPercent,
                                y: item.customization.front.yOffsetPercent,
                                width: item.customization.front.widthPercent,
                                rotation: item.customization.front.rotation,
                                templateUrl: item.customization.front.templateUrl,
                                imageUrl: item.customization.front.artworkUrl,
                              }
                            : null,
                          back: item.customization.back
                            ? {
                                x: item.customization.back.xOffsetPercent,
                                y: item.customization.back.yOffsetPercent,
                                width: item.customization.back.widthPercent,
                                rotation: item.customization.back.rotation,
                                templateUrl: item.customization.back.templateUrl,
                                imageUrl: item.customization.back.artworkUrl,
                              }
                            : null,
                        }
                      : null,
                  };

                  return (
                    <ItemRow key={item.lineItemId}>
                      {item.customization ? (
                        <PreviewsContainer>
                          {hasFront && (
                            <PodMockupPreview
                              item={adaptedItem}
                              side="front"
                              width="64px"
                              height="64px"
                              borderRadius="8px"
                              onClick={() =>
                                setZoomedConfig({
                                  item: adaptedItem,
                                  side: "front",
                                })
                              }
                            />
                          )}
                          {hasBack && (
                            <PodMockupPreview
                              item={adaptedItem}
                              side="back"
                              width="64px"
                              height="64px"
                              borderRadius="8px"
                              onClick={() =>
                                setZoomedConfig({
                                  item: adaptedItem,
                                  side: "back",
                                })
                              }
                            />
                          )}
                        </PreviewsContainer>
                      ) : (
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "8px",
                            background: "#18181b",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.thumbnailImageId ? (
                            <img
                              src={`https://api.hanuut.com/image/raw/${item.thumbnailImageId}`}
                              alt=""
                              style={{
                                width: "90%",
                                height: "90%",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: "1.5rem" }}>👕</span>
                          )}
                        </div>
                      )}

                      <DetailsBlock>
                        <ItemTitle>{item.title}</ItemTitle>
                        <MetaText>
                          {item.colorSelected} / {item.sizeSelected}
                        </MetaText>
                        <MetaText>Qty: {item.quantity}</MetaText>

                        <PriceText>
                          Base: {item.baseCost} {t("dzd")}
                        </PriceText>
                        {item.printCost > 0 && (
                          <PriceText>
                            Print: +{item.printCost} {t("dzd")}
                          </PriceText>
                        )}
                      </DetailsBlock>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        {item.customization && (
                          <ActionButton onClick={() => onEdit(item)}>
                            <FaEdit />
                          </ActionButton>
                        )}
                        <ActionButton
                          $danger
                          onClick={() => handleDelete(item.lineItemId)}
                        >
                          <FaTrash />
                        </ActionButton>
                      </div>
                    </ItemRow>
                  );
                })
              ) : (
                <EmptyState>
                  <FaBoxOpen size={36} />
                  <span>{t("pod_studio_empty_tray")}</span>
                </EmptyState>
              )}
            </ScrollableContainer>

            {trayItems.length > 0 && (
              <ProductionButton onClick={onSubmit}>
                {t("pod_studio_btn_submit_production")}
              </ProductionButton>
            )}
          </TrayWrapper>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomConfig && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedConfig(null)}
          >
            <PodMockupPreview
              item={zoomConfig.item}
              side={zoomConfig.side}
              width="380px"
              height="380px"
              borderRadius="24px"
              onClick={(e) => e.stopPropagation()}
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

CreationTray.propTypes = {
  cartItems: PropTypes.array.isRequired,
  shopId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreationTray;