import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateContractPDF(data) {
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
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: color,
      borderWidth: 0,
    });
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
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: fillColor,
      borderColor: borderColor,
      borderWidth: borderWidth,
    });
  };

  drawRect(0, height - 120, width, 120, primaryBlue);

  drawRect(40, height - 100, 60, 60, white);
  page.drawText("LOGO", {
    x: 55,
    y: height - 75,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

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

  const contractDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  page.drawText(`Contract Date: ${contractDate}`, {
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

  drawBorderedRect(
    40,
    currentY - 80,
    width - 80,
    80,
    lightBlue,
    primaryBlue,
    2
  );

  page.drawText("CUSTOMER INFORMATION", {
    x: 50,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

  page.drawText(`Full Name: ${data.userName}`, {
    x: 50,
    y: currentY - 40,
    size: 12,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Email Address: ${data.userEmail}`, {
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

  drawBorderedRect(
    40,
    currentY - 120,
    width - 80,
    120,
    lightBlue,
    primaryBlue,
    2
  );

  page.drawText("RENTAL DETAILS", {
    x: 50,
    y: currentY - 20,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

  const startDate = new Date(data.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const endDate = new Date(data.endDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startDateTime = new Date(data.startDate);
  const endDateTime = new Date(data.endDate);
  const durationDays = Math.ceil(
    (endDateTime - startDateTime) / (1000 * 60 * 60 * 24)
  );

  page.drawText(`Pickup Date: ${startDate}`, {
    x: 50,
    y: currentY - 45,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(`Return Date: ${endDate}`, {
    x: 50,
    y: currentY - 65,
    size: 11,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(
    `Duration: ${durationDays} ${durationDays === 1 ? "day" : "days"}`,
    {
      x: 50,
      y: currentY - 85,
      size: 11,
      font: regularFont,
      color: darkGray,
    }
  );

  drawBorderedRect(width - 200, currentY - 110, 150, 90, white, primaryBlue, 2);

  page.drawText("PRICING", {
    x: width - 190,
    y: currentY - 30,
    size: 12,
    font: boldFont,
    color: primaryBlue,
  });

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
    {
      text: "Vehicle Return:",
      detail: "Must be returned with same fuel level as pickup.",
    },
    {
      text: "Late Returns:",
      detail: "Additional charges of $25/hour apply for late returns.",
    },
    {
      text: "Insurance:",
      detail: "Comprehensive coverage included; renter liable for damages.",
    },
    {
      text: "Traffic Violations:",
      detail: "Renter responsible for all fines and penalties.",
    },
    {
      text: "Vehicle Condition:",
      detail: "No smoking, pets, or excessive wear allowed.",
    },
    {
      text: "Geographic Limits:",
      detail: "Vehicle must not leave country without permission.",
    },
    {
      text: "Cleaning:",
      detail: "Vehicle must be returned clean or cleaning fee applies.",
    },
    {
      text: "Damage Inspection:",
      detail: "Report any damage immediately upon pickup.",
    },
  ];

  let termY = currentY - 45;
  terms.forEach((term, index) => {
    if (termY > 120) {
      // Ensure we don't go below signature area
      page.drawText(`${index + 1}. ${term.text}`, {
        x: 50,
        y: termY,
        size: 10,
        font: boldFont,
        color: darkGray,
      });

      page.drawText(`   ${term.detail}`, {
        x: 50,
        y: termY - 15,
        size: 9,
        font: regularFont,
        color: darkGray,
      });

      termY -= 30;
    }
  });

  drawBorderedRect(40, 40, width - 80, 80, white, primaryBlue, 2);

  page.drawText("CUSTOMER ACKNOWLEDGMENT", {
    x: 50,
    y: 100,
    size: 14,
    font: boldFont,
    color: primaryBlue,
  });

  page.drawText(
    "By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions.",
    {
      x: 50,
      y: 80,
      size: 10,
      font: regularFont,
      color: darkGray,
    }
  );

  page.drawLine({
    start: { x: 50, y: 60 },
    end: { x: 250, y: 60 },
    thickness: 1,
    color: darkGray,
  });

  page.drawText("Customer Signature", {
    x: 50,
    y: 45,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 300, y: 60 },
    end: { x: 450, y: 60 },
    thickness: 1,
    color: darkGray,
  });

  page.drawText("Date", {
    x: 300,
    y: 45,
    size: 10,
    font: regularFont,
    color: darkGray,
  });

  page.drawText(
    "EasyDrive Car Rental • Contact: support@easydrive.com • Phone: 1-800-EASYDRIVE",
    {
      x: 50,
      y: 20,
      size: 8,
      font: regularFont,
      color: darkGray,
    }
  );

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export { generateContractPDF };
