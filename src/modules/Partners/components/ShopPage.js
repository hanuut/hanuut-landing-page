import React from "react";
import styled from "styled-components";
import ShopCart from "./ShopCart";
import { useLocation } from "react-router-dom";
import BackgroundImage from "../../../assets/background.png";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;
const ShopPageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
  }
`;
const UpperBox = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${BackgroundImage}) center/cover no-repeat;
  }
`;
const LowerBox = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  }
`;

const ShopPage = () => {
  const location = useLocation();
  const { shopData, shopImage } = location.state;

  return (
    <Section>
      <ShopPageContainer>
        <UpperBox>
          <ShopCart
            className="headingShopCart"
            key={shopData.id}
            shop={shopData}
            imageData={shopImage}
          />
        </UpperBox>
        <LowerBox>
          <CategoriesContainer shopData={shopData} />
        </LowerBox>
      </ShopPageContainer>
    </Section>
  );
};

export default ShopPage;
