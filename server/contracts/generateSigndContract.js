import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateSignedContractPDF(data, signatureData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const primaryBlue = rgb(0.2, 0.4, 0.8);
  const lightBlue = rgb(0.9, 0.95, 1);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.95, 0.95, 0.95);
  const white = rgb(1, 1, 1);

  const drawRect = (x, y, w, h, color) => {
    page.drawRectangle({ x, y, width: w, height: h, color });
  };

  const drawBorderedRect = (
    x,
    y,
    w,
    h,
    fillColor,
    borderColor = darkGray,
    borderWidth = 1
  ) => {
    page.drawRectangle({ x, y, width: w, height: h, color: fillColor, borderColor, borderWidth });
  };

  drawRect(0, height - 120, width, 120, primaryBlue);
  drawRect(40, height - 100, 60, 60, white);
  page.drawText("LOGO", { x: 55, y: height - 75, size: 14, font: boldFont, color: primaryBlue });

  page.drawText("EasyDrive Car Rental", {
    x: 120,
    y: height - 45,
    size: 24,
    font: boldFont,
    color: white,
  });

  page.drawText("Premium Car Rental Services", {
    x: 120,
    y: height - 70,
    size: 12,
    font: regularFont,
    color: white,
  });

  page.drawText("RENTAL AGREEMENT CONTRACT", {
    x: 120,
    y: height - 90,
    size: 16,
    font: boldFont,
    color: white,
  });

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  page.drawText(`Contract Date: ${todayDate}`, {
    x: width - 200,
    y: height - 45,
    size: 10,
    font: regularFont,
    color: white,
  });

  page.drawText(
    `Contract ID: #${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    {
      x: width - 200,
      y: height - 60,
      size: 10,
      font: regularFont,
      color: white,
    }
  );

  let currentY = height - 150;
  drawBorderedRect(40, currentY - 80, width - 80, 80, lightBlue, primaryBlue, 2);
  page.drawText("CUSTOMER INFORMATION", {
    x: 50,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

  page.drawText(`Full Name: ${data.userName || signatureData.signerName}`, {
    x: 50,
    y: currentY - 40,
    size: 12,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Email Address: ${data.userEmail || signatureData.signerEmail}`, {
    x: 50,
    y: currentY - 60,
    size: 12,
    font: regularFont,
    color: darkGray,
  });

  currentY -= 110;
  drawBorderedRect(40, currentY - 80, width - 80, 80, lightGray, darkGray, 1);
  page.drawText("VEHICLE INFORMATION", {
    x: 50,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: darkGray,
  });

  page.drawText(`Vehicle: ${data.carMake} ${data.carModel}`, {
    x: 50,
    y: currentY - 40,
    size: 12,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`License Plate: ${data.licensePlate}`, {
    x: 50,
    y: currentY - 60,
    size: 12,
    font: regularFont,
    color: darkGray,
  });

  currentY -= 110;
  drawBorderedRect(40, currentY - 120, width - 80, 120, lightBlue, primaryBlue, 2);
  page.drawText("RENTAL DETAILS", {
    x: 50,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  page.drawText(`Pickup Date: ${start.toDateString()}`, {
    x: 50,
    y: currentY - 45,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Return Date: ${end.toDateString()}`, {
    x: 50,
    y: currentY - 65,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Duration: ${durationDays} ${durationDays === 1 ? "day" : "days"}`, {
    x: 50,
    y: currentY - 85,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  drawBorderedRect(width - 200, currentY - 110, 150, 90, white, primaryBlue, 2);
  page.drawText("PRICING", { x: width - 190, y: currentY - 30, size: 12, font: boldFont, color: primaryBlue });

  page.drawText(`Daily Rate: $${data.dailyRate.toFixed(2)}`, {
    x: width - 190,
    y: currentY - 50,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Subtotal: $${(data.dailyRate * durationDays).toFixed(2)}`, {
    x: width - 190,
    y: currentY - 70,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`TOTAL: $${data.totalCost.toFixed(2)}`, {
    x: width - 190,
    y: currentY - 95,
    size: 12,
    font: boldFont,
    color: primaryBlue,
  });

  currentY -= 150;
  drawBorderedRect(40, currentY - 200, width - 80, 200, lightGray, darkGray, 1);
  page.drawText("TERMS & CONDITIONS", {
    x: 50,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: darkGray,
  });

  const terms = [
    { text: "Vehicle Return", detail: "Must be returned with same fuel level as pickup." },
    { text: "Late Returns", detail: "$25/hour charge applies for late returns." },
    { text: "Insurance", detail: "Coverage included; renter liable for damages." },
    { text: "Traffic Violations", detail: "Renter responsible for all fines." },
    { text: "Vehicle Condition", detail: "No smoking, pets, or excessive wear allowed." },
    { text: "Geographic Limits", detail: "Do not leave the country without permission." },
    { text: "Cleaning", detail: "Return clean or a cleaning fee applies." },
    { text: "Damage Inspection", detail: "Report damage immediately on pickup." },
  ];

  let termY = currentY - 45;
  terms.forEach((term, i) => {
    if (termY > 120) {
      page.drawText(`${i + 1}. ${term.text}`, { x: 50, y: termY, size: 10, font: boldFont, color: darkGray });
      page.drawText(`   ${term.detail}`, { x: 50, y: termY - 15, size: 9, font: regularFont, color: darkGray });
      termY -= 30;
    }
  });

  drawBorderedRect(40, 40, width - 80, 100, white, primaryBlue, 2);
  page.drawText("CUSTOMER ACKNOWLEDGMENT - SIGNED", {
    x: 50,
    y: 120,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

  page.drawText(
    "By clicking the confirmation link, I acknowledge that I have read and agree to all terms and conditions.",
    {
      x: 50,
      y: 100,
      size: 10,
      font: regularFont,
      color: darkGray,
    }
  );

  page.drawText(`Digitally Signed by: ${signatureData.signerName} (${signatureData.signerEmail})`, {
    x: 50,
    y: 85,
    size: 10,
    font: boldFont,
    color: rgb(0, 0.6, 0),
  });

  const todayShort = new Date().toLocaleDateString("en-US");
  page.drawText(`Date: ${todayShort}`, {
    x: 50,
    y: 65,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  page.drawText("EasyDrive Car Rental • support@easydrive.com • 1-800-EASYDRIVE", {
    x: 50,
    y: 20,
    size: 8,
    font: regularFont,
    color: darkGray,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}


export { generateSignedContractPDF };
