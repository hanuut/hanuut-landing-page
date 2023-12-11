import { jsPDF } from "jspdf";
import emailjs from "@emailjs/browser";

export const responseToPdf = (responseData) => {
  const { OrderNumber, Amount, Pan, expiration, cardholderName } =
    responseData;
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Merchant Name: Hanuut Express", 15, 20);
  doc.text("Merchant Address: Arris, Batna", 15, 30);
  doc.text("Merchant Contact: contact@hanuut.com", 15, 40);
  doc.text("Order Number: " + OrderNumber, 15, 60);
  doc.text("Order Date: " + new Date().toLocaleDateString(), 15, 70);
  doc.text("Payment Details", 15, 90);
  doc.text("Amount: " + Amount / 100 + " dzd", 15, 100);
  doc.text("Card Number: " + (Pan ? Pan : "N/A"), 15, 110);
  doc.text("Expiration: " + (expiration ? expiration : "N/A"), 15, 120);
  doc.text(
    "Cardholder Name: " + (cardholderName ? cardholderName : "N/A"),
    15,
    130
  );
  return doc;
};

export const toPrint = (pdfFileBlob) => {
  if (pdfFileBlob) {
    const url = URL.createObjectURL(pdfFileBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  }
};

export const sendEmail = (data) => {
  const emailRecipient = data.email; // Set the recipient email address
  const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

  const templateParams = {
    from_name: "Hanuut Express",
    to_email: emailRecipient,
    orderNumber: data.orderNumber,
    amount: data.amount,
    cardNumber: data.Pan,
    expiration: data.expiration,
    cardHolderName: data.cardholderName,
  };

  emailjs
    .send(serviceID, templateID, templateParams)
    .then((response) => {
      alert("Email sent successfully!");
    })
    .catch((error) => {
      alert("Failed to send email.");
      console.error(error);
    });
};
