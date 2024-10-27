import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../../assets/background.webp";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { light } from "../../config/Themes";
import creditCard from "../../assets/cibLogo.webp";
import { refund, registerOrder } from "./services/paymentServices";
import Loader from "../../components/Loader";
import Recaptcha from "react-google-recaptcha";
import SatimTermsAndConditions from "./components/satimTermsAndConditions";
import { TextButton, ActionButton } from "../../components/ActionButton";

const Section = styled.div`
  height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-position: center;
  padding: 2rem 0;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const ShopPageContainer = styled.div`
  width: 80%;
  height: 100vh;
  padding: 2rem;
  min-height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  overflow: auto;
  background: hsla(147, 45%, 80%, 1);
  background: linear-gradient(
    90deg,
    hsla(147, 45%, 80%, 1) 0%,
    hsla(148, 46%, 92%, 1) 48%,
    hsla(0, 0%, 100%, 1) 100%
  );

  background: -moz-linear-gradient(
    90deg,
    hsla(147, 45%, 80%, 1) 0%,
    hsla(148, 46%, 92%, 1) 48%,
    hsla(0, 0%, 100%, 1) 100%
  );

  background: -webkit-linear-gradient(
    90deg,
    hsla(147, 45%, 80%, 1) 0%,
    hsla(148, 46%, 92%, 1) 48%,
    hsla(0, 0%, 100%, 1) 100%
  );

  filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#B5E3CA", endColorstr="#E1F4EA", GradientType=1 );
  border-radius: ${(props) => props.theme.defaultRadius};
  box-shadow: 0 5px 5px rgba(${(props) => props.theme.primaryColorRgba}, 0.2);
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.smallPadding};
    width: 85%;
  }
`;

const UpperBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

const MenuTitle = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.orangeColor};
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxl};
  }
`;
const LowerBox = styled.div`
  height: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;

    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const RightBox = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;
    text-align: center;
  }
`;
const LeftBox = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormContainer = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormGroup = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;

width: 75%;
display; flex;
@media (max-width: 768px) {
  max-width: 75%;
  width: 90%;
}
`;

const Label = styled.label`
  margin: 0 1rem;
  font-size: ${(props) => props.theme.fontlg};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  font-size: ${(props) => props.theme.fontxl};
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.secondaryColor};
  }
  @media (max-width: 768px) {
    position: static;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const ErrorMessage = styled.p`
  width: 100%;
  text-align: center;
  background-color: #ffbaba;
  color: #d8000c;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.redColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontmd};
`;

const SuccessMessage = styled.p`
  width: 100%;
  text-align: center;
  background-color: rgba(${(props) => props.theme.primaryColorRgba}, 0.2);
  color: ${(props) => props.theme.primaryColor};
  padding: 10px;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontmd};
`;
const FormTitle = styled.p`
  width: 100%;
  text-align: center;
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 600;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
  &.amountText {
    color: ${(props) => props.theme.orangeColor};
    font-weight: 900;
  }
`;

const SubHeading = styled.h2`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;
const TermsPopup = styled.div`
  width: 60%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: 4px;
  z-index: 999;
`;
const TermsPopupConainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TermsPopupButtonWrapper = styled.div`
  gap: 1rem;
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ProductsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  p {
    width: 100%;
    font-size: 2rem;
  }
`;
const Products = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;
const Product = styled.div`
  background-color: white;
  padding: 1rem;
  label {
    margin: 0 0.5rem;
  }
  button {
    margin: 0 0.5rem;
  }
`;

const SatimTestPage = () => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaResponse, setCaptchaResponse] = useState(null);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [selectedForm, setSelectedForm] = useState("registerOrder");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orderId, setOrderId] = useState(generateRandomId(5));
  const [amount, setAmount] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);
  const { t, i18n } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState([]);

  const products = [
    { id: 1, name: "Lait", price: 140 },
    { id: 2, name: "Oeuf", price: 25 },
    { id: 3, name: "Coca Cola ", price: 120 },
    { id: 4, name: "Farine", price: 90 },
    { id: 5, name: "Chocolat", price: 220 },
  ];

  const handleProductSelection = (product) => {
    const selectedProductIndex = selectedProducts.findIndex(
      (prod) => prod.id === product.id
    );

    if (selectedProductIndex !== -1) {
      // Product is already selected, so remove it
      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts.splice(selectedProductIndex, 1);
      setSelectedProducts(updatedSelectedProducts);
    } else {
      // Product is not selected, so add it
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedProducts);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    selectedProducts.forEach((product) => {
      total += product.price;
    });
    setAmount(total);
  };

  function generateRandomId(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  useEffect(() => {
    calculateTotalAmount();
  }, [selectedProducts]);

  const handleRadioChange = (event) => {
    if (event.target.value === "refund") {
      setAmount(0);
      setSelectedProducts([]);
      setOrderId("");
    } else {
      setOrderId(generateRandomId(8));
    }
    setSelectedForm(event.target.value);
  };

  const handleCaptchaResponse = (response) => {
    setCaptchaResponse(response);
  };
  const handleTermsCheckboxChange = () => {
    if (termsChecked) {
      setTermsChecked(false);
    } else {
      setShowTermsPopup(true);
    }
  };

  const handleAcceptTerms = () => {
    setTermsChecked(true);
    setShowTermsPopup(false);
  };

  const handleCancelTerms = () => {
    setShowTermsPopup(false);
  };

  const handleCaptchaCheckboxChange = (event) => {
    event.preventDefault();
    if (!orderId) {
      setErrorMessage(t("errorFillAllFields"));
      return;
    }
    if (!amount) {
      setErrorMessage(t("errorAmountIsZero"));
      return;
    }

    if (amount < 50) {
      setErrorMessage(`${t("errorAmount")} ${t("dzd")}`);
      return;
    }
    setShowCaptcha(true);
  };  
  const handleSubscribe = async (event) => {
    event.preventDefault();

    if (!isSubmitting) {
      if (!orderId) {
        setErrorMessage(t("errorFillAllFields"));
        return;
      }
      if (!amount) {
        setErrorMessage(t("errorAmountIsZero"));
        return;
      }

      if (amount < 50) {
        setErrorMessage(`${t("errorAmount")} ${t("dzd")}`);
        return;
      }

      if (!termsChecked) {
        setErrorMessage(t("testPaymentTermsError"));
        return;
      }
      if (!captchaResponse) {
        setErrorMessage(t("testPaymentCaptchaError"));
        return;
      }

      if (captchaResponse) {
        setErrorMessage("");
        setIsSubmitting(true);

        const data = {
          orderId: orderId,
          amount: amount * 100,
        };

        try {
          if (selectedForm === "registerOrder") {
            const response = await registerOrder(data);
            const responseData = response.data;
            if (responseData) {
              if (responseData.errorCode === "0") {
                setRedirecting(true);
                setTimeout(() => {
                  window.location.href = responseData.formUrl;
                }, 2000);
                return () => {
                  setRedirecting(false);
                };
              } else {
                setErrorMessage(responseData.errorMessage);
              }
            }
          } else {
            const response = await refund(data);
            const responseData = response.data;
            if (responseData) {
              if (responseData.errorCode === "0") {
                setErrorMessage("");
                setSuccessMessage(responseData.errorMessage);
              } else {
                setSuccessMessage("");
                setErrorMessage(responseData.errorMessage);
              }
            }
          }
        } catch (error) {
          console.error(error);
          setErrorMessage(error.message);
        }

        setIsSubmitting(false);
      }
    } else {
      setErrorMessage(t("testPaymentCaptchaError"));
      setIsSubmitting(false);
    }
  };
  return (
    <Section>
      <ShopPageContainer isArabic={i18n.language === "ar"}>
        <UpperBox>
          <MenuTitle>{t("testPayment")}</MenuTitle>
        </UpperBox>
        <LowerBox>
          <LeftBox>
            <SubHeading>{t("testPaymentSubHeading")}</SubHeading>
            <Paragraph>{t("testPaymentParagraph")}</Paragraph>
            <Paragraph> {t("testPaymentParagraph2")} </Paragraph>
            <FormGroup>
              <input
                type="radio"
                id="testRegisterOrder"
                name="testType"
                value="registerOrder"
                checked={selectedForm === "registerOrder"}
                onChange={handleRadioChange}
              />
              <Label for="testRegisterOrder">
                {t("testPaymentRegisterOrder")}
              </Label>
            </FormGroup>

            <FormGroup>
              <input
                type="radio"
                id="testRefund"
                name="testType"
                value="refund"
                checked={selectedForm === "refund"}
                onChange={handleRadioChange}
              />
              <Label for="testRefund">{t("testPaymentRefundOrder")}</Label>
            </FormGroup>

            {selectedForm === "registerOrder" ? (
              <>
                {" "}
                {/* Product Selection */}
                <ProductsContainer>
                  <MenuTitle>Select Products:</MenuTitle>
                  <Products>
                    {products.map((product) => (
                      <Product key={product.id}>
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          onChange={() => handleProductSelection(product)}
                          checked={selectedProducts.some(
                            (selectedProduct) =>
                              selectedProduct.id === product.id
                          )}
                        />
                        <label htmlFor={`product-${product.id}`}>
                          {product.name} - {product.price} dzd
                        </label>
                      </Product>
                    ))}
                  </Products>
                </ProductsContainer>
                {/* Selected Products */}
                <ProductsContainer>
                  <MenuTitle>Selected Products:</MenuTitle>{" "}
                  <Products>
                    {selectedProducts.map((product) => (
                      <Product key={product.id}>
                        {product.name} - {product.price} dzd
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          Remove
                        </button>
                      </Product>
                    ))}
                  </Products>
                </ProductsContainer>
              </>
            ) : (
              ""
            )}
          </LeftBox>

          <RightBox>
            {" "}
            {redirecting ? (
              <>
                <FormTitle>{t("redirecting")}</FormTitle>
                <FormContainer>
                  <Loader />
                </FormContainer>
              </>
            ) : (
              <>
                <FormTitle>
                  {selectedForm === "registerOrder"
                    ? t("testPaymentRegisterOrder")
                    : t("testPaymentRefundOrder")}
                </FormTitle>
                <FormContainer onSubmit={handleSubscribe}>
                  {" "}
                  {selectedForm === "registerOrder" ? (
                    <Label>{t("testPaymentOrder")}</Label>
                  ) : (
                    ""
                  )}
                  <FormGroup>
                    <Input
                      type="text"
                      placeholder={t("testPaymentOrder")}
                      value={orderId}
                      onChange={(event) => setOrderId(event.target.value)}
                      disabled={selectedForm === "registerOrder" ? true : false}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="text"
                      placeholder={t("testPaymentAmount")}
                      value={amount > 0 ? amount : ""}
                      onChange={(event) => setAmount(event.target.value)}
                      disabled={selectedForm === "registerOrder" ? true : false}
                      hidden={selectedForm === "registerOrder" ? true : false}
                    />
                  </FormGroup>
                  {amount > 0 && (
                    <FormGroup>
                      <FormTitle className="amountText">
                        {selectedForm === "registerOrder"
                          ? `${t("testPaymentAmountShow")} ${amount} ${t(
                              "dzd"
                            )}`
                          : `${t("testPaymentAmountShowRefund")} ${amount} ${t(
                              "dzd"
                            )}`}
                      </FormTitle>
                    </FormGroup>
                  )}
                  <FormGroup>
                    <input
                      type="checkbox"
                      checked={termsChecked}
                      onChange={handleTermsCheckboxChange}
                    />
                    <Label>{t("testPaymentTerms")}</Label>
                  </FormGroup>
                  {showTermsPopup && (
                    <TermsPopup>
                      {" "}
                      <TermsPopupConainer>
                        <SatimTermsAndConditions />

                        <TermsPopupButtonWrapper>
                          <TextButton onClick={handleCancelTerms}>
                            Cancel
                          </TextButton>
                          <ActionButton onClick={handleAcceptTerms}>
                            Accept
                          </ActionButton>
                        </TermsPopupButtonWrapper>
                      </TermsPopupConainer>
                    </TermsPopup>
                  )}
                  <FormGroup>
                    <input
                      type="checkbox"
                      checked={showCaptcha}
                      onChange={handleCaptchaCheckboxChange}
                    />
                    <Label>{t("testPaymentCaptcha")}</Label>
                  </FormGroup>
                  {errorMessage ? (
                    <FormGroup>
                      <ErrorMessage>
                        {errorMessage && <p>{errorMessage}</p>}
                      </ErrorMessage>
                    </FormGroup>
                  ) : (
                    ""
                  )}
                  {successMessage ? (
                    <FormGroup>
                      {" "}
                      <SuccessMessage>
                        {successMessage && <p>{successMessage}</p>}
                      </SuccessMessage>
                    </FormGroup>
                  ) : (
                    ""
                  )}
                  {showCaptcha && (
                    <Recaptcha
                      sitekey="6LfckCcpAAAAAOcv_SA3mzHW-zRaoDSPlk9p8SbB"
                      onChange={handleCaptchaResponse}
                    />
                  )}
                  <ButtonWithIcon
                    image={creditCard}
                    backgroundColor={light.primaryColor}
                    text2={
                      isSubmitting
                        ? t("buttonIsSubmitting")
                        : t("testPaymentButton")
                    }
                    disabled={isSubmitting}
                    className={"noFlipIcon"}
                  ></ButtonWithIcon>
                </FormContainer>
              </>
            )}
          </RightBox>
        </LowerBox>
      </ShopPageContainer>
    </Section>
  );
};

export default SatimTestPage;
