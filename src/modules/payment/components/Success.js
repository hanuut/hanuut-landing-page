import React, { useEffect, useState } from "react";
import styled from "styled-components";
import celebration from "../../../assets/celebration.svg";
import successful from "../../../assets/successful.svg";
import fireworks from "../../../assets/fireworks.svg";
import SatimLigne from "../../../assets/satimLigne.png";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { responseToPdf, sendEmail } from "../services/utils";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Print from "../../../assets/print.svg";
import Send from "../../../assets/send.svg";
import Pdf from "../../../assets/pdf.svg";
import { light } from "../../../config/Themes";
import { TextButton } from "../../../components/ActionButton";
const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100%;
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${celebration});
  background-size: cover; /* Use "cover" instead of "100%" */
  background-position: center;
  backdrop-filter: blur(10px);
  @media (max-width: 768px) {
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(10px);
  }
`;

const GlassBox = styled.div`
  width: 76%;
  min-height: 70vh;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(7px);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 2px rgba(${(props) => props.theme.primaryColorRgba}, 0.2),
    ${(props) =>
      props.isArabic
        ? `-15px 15px rgba(${props.theme.primaryColorRgba}, 0.75)`
        : `15px 15px rgba(${props.theme.primaryColorRgba}, 0.75)`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 768px) {
    min-height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;

    box-shadow: 0 0 2px rgba(${(props) => props.theme.primaryColorRgba}, 0.2),
      ${(props) =>
        props.isArabic
          ? `-10px 10px rgba(${props.theme.primaryColorRgba}, 0.75)`
          : `10px 10px rgba(${props.theme.primaryColorRgba}, 0.75)`};
  }
`;

const ContentWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const IllustrationWrapper = styled.div`
  width: 40%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Illustration = styled.img`
  max-width: 100%;
  align-items: center;
  justify-content: center;
  align-items: center;
  justify-content: center;
  background-image: url(${fireworks});
  background-size: 100%;
  background-position: top;
  background-repeat: no-repeat;
`;
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const Title = styled.h1`
  margin: 0.5rem 0;
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Description = styled.p`
  margin: 0.5rem 0;
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;
const PaymentInfo = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const PaymentInfoWrapper = styled.div`
  width: 100%;
  color: ${(props) => props.theme.text};
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
`;

const Label = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  &.satimMessage {
    font-size: ${(props) => props.theme.fontxxl};
    color: ${(props) => props.theme.primaryColor};
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  @media (max-width: 768px) {
    max-width: 30%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const ValueWrapper = styled.div`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Value = styled.p`
  line-height: 1;
  overflow: ${(props) => (props.expanded ? "" : "")};
  border-radius: ${(props) => props.theme.defaultRadius};
  width: ${(props) => (props.expanded ? "100%" : "100%")};
  color: ${(props) => props.theme.body};
  background-color: ${(props) => props.theme.primaryColor};
  padding: ${(props) => props.theme.actionButtonPaddingMobile};
  transition: all 0.5s ease;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
    padding: ${(props) => props.theme.smallPadding};
  }
  &.transparentBackground {
    border-radius: 0;
    color: ${(props) => props.theme.text};
    background-color: transparent;
    padding: 0.1rem 0;
    @media (max-width: 768px) {
      font-size: ${(props) => props.theme.fontsm};
    }
  }
`;
const ShowValueIcon = styled.img`
  transform: ${(props) => (props.isArabic ? "rotateY(180deg)" : "none")};
  max-width: 2rem;
  @media (max-width: 768px) {
    max-width: 1.5rem;
  }
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  gap: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Popup = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: 4px;
  z-index: 999;
`;
const PopupButtonWrapper = styled.div`
  gap: 1rem;
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
  margin-top: 20px;
`;
const FormGroup = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
width: 90%;
display; flex;
@media (max-width: 768px) {
  max-width: 75%;
  width: 90%;
}
`;

const InputLabel = styled.label`
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
  margin-top: 1rem;
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
const Success = ({ orderId, successMessage, responseData }) => {
  const { t, i18n } = useTranslation();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileBlob, setPdfFileBlob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [orderValueExpanded, setOrderValueExpanded] = useState(false);
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear()).slice(-2);
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${day}/${month}/20${year}, ${hours}:${minutes}`;

  emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

  const handleShowOrderValue = () => {
    setOrderValueExpanded(!orderValueExpanded);
  };

  const handleDownload = () => {
    if (pdfFile) {
      pdfFile.save(responseData.OrderNumber + ".pdf");
    } else {
      const pdfInstance = responseToPdf(responseData);
      pdfInstance.save(responseData.OrderNumber + ".pdf");
    }
  };

  const handlePrint = () => {
    if (pdfFileBlob) {
      const url = URL.createObjectURL(pdfFileBlob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow.print();
      };
    } else {
      const pdfInstance = responseToPdf(responseData);
      const blob = pdfInstance.output("blob");
      setPdfFileBlob(blob);
    }
  };

  const handleOnEmailClick = () => {
    setShowPopup(true);
  };

  const handleSendEmail = () => {
    if (!email) {
      setShowPopup(true);
    } else {
      const data = {
        orderNumber: responseData.OrderNumber,
        email: email,
        amount: responseData.Amount / 100,
        Pan: responseData.Pan,
        expiration: responseData.expiration,
        cardholderName: responseData.cardholderName,
      };
      sendEmail(data);
    }
  };

  const handleCancelEmail = () => {
    setShowPopup(false);
    setEmail("");
  };

  const handleConfirmEmail = () => {
    handleSendEmail();
    setShowPopup(false);
  };

  useEffect(() => {
    const pdfInstance = responseToPdf(responseData);
    if (pdfInstance) {
      setPdfFile(pdfInstance);
      const blob = pdfInstance.output("blob");
      setPdfFileBlob(blob);
    }
  }, [responseData]);
  console.log(responseData);
  return (
    <Container isArabic={i18n.language === "ar"}>
      <GlassBox>
        <IllustrationWrapper>
          {" "}
          <Illustration src={successful} alt="Illustration" />
        </IllustrationWrapper>
        <ContentWrapper>
          <Content>
            <Title>{t("thankYouForPurchase")}</Title>
            <PaymentInfoWrapper>
              <Label className="satimMessage">Recu de Paiment</Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                <Label>Merchant: SARL Hanuut Express</Label>
              </Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                {" "}
                <Label>Address: Arris, Batna</Label>
              </Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                {" "}
                <Label>email: contact@hanuut.com</Label>
              </Label>
            </PaymentInfoWrapper>
            <PaymentInfoWrapper>
              <Label>
                {" "}
                <Label className="satimMessage">Payment Details</Label>
              </Label>
            </PaymentInfoWrapper>

            <PaymentInfo>
              <PaymentInfoWrapper>
                <Label>Transaction Id</Label>
                <ValueWrapper>
                  <Value expanded={true}>{orderId}</Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Label>Order ID "Order Number"</Label>
                <ValueWrapper>
                  <Value >{responseData.OrderNumber}</Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Label>Time</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {formattedDateTime}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>
              <PaymentInfoWrapper>
                <Label>respCode_desc</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {responseData.params.respCode_desc}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>

              <PaymentInfoWrapper>
                <Label>orderNumber</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {responseData.OrderNumber}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>

              <PaymentInfoWrapper>
                <Label>approvalCode</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {responseData.approvalCode}
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>

              <PaymentInfoWrapper>
                <Label>montant</Label>
                <ValueWrapper>
                  <Value className="transparentBackground" expanded={true}>
                    {responseData.Amount / 100} dzd
                  </Value>
                </ValueWrapper>
              </PaymentInfoWrapper>

              <PaymentInfoWrapper>
                <Label className="expanded">
                  Le mode de paiement : carte CIB/Edhahabia.
                </Label>
              </PaymentInfoWrapper>
              <ButtonsWrapper>
                <ButtonWithIcon
                  image={Pdf}
                  text2="Dowinload"
                  backgroundColor={light.redColor}
                  onClick={handleDownload}
                ></ButtonWithIcon>
                <ButtonWithIcon
                  image={Print}
                  text2="Pring"
                  onClick={handlePrint}
                ></ButtonWithIcon>
                <ButtonWithIcon
                  image={Send}
                  text2="Send Email"
                  onClick={handleOnEmailClick}
                ></ButtonWithIcon>
                {showPopup && (
                  <Popup>
                    <InputLabel>
                      Enter your email here to receive your receipt
                    </InputLabel>
                    <FormGroup>
                      {" "}
                      <InputLabel>Email:</InputLabel>
                      <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormGroup>
                    <PopupButtonWrapper>
                      <TextButton onClick={handleCancelEmail}>
                        Cancel
                      </TextButton>
                      <ButtonWithIcon
                        image={Send}
                        text2="Send Email"
                        onClick={handleConfirmEmail}
                      ></ButtonWithIcon>
                    </PopupButtonWrapper>
                  </Popup>
                )}
              </ButtonsWrapper>

              <PaymentInfoWrapper>
                <Label className="satimMessage">
                  En cas de problème de paiement, veuillez contacter le numéro
                  vert de la SATIM 3020 <img src={SatimLigne}></img>
                </Label>
              </PaymentInfoWrapper>
            </PaymentInfo>
          </Content>
        </ContentWrapper>
      </GlassBox>
    </Container>
  );
};

export default Success;
