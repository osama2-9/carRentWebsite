import fs from "fs";
import path from "path";
import axios from "axios";
import { validateLicense, validatePassport } from "./validators.js";
import { performOCR } from "../services/performOCR.js";

const getBase64FromUrl = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const buffer = Buffer.from(response.data);
    const ext =
      path.extname(new URL(imageUrl).pathname).toLowerCase() || ".jpg";
    const mimeType =
      ext === ".pdf" ? "application/pdf" : `image/${ext.slice(1) || "jpeg"}`;

    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error(
      `Error downloading image from URL ${imageUrl}:`,
      error.message
    );
    throw new Error(`Failed to download image: ${error.message}`);
  }
};

const getBase64FromFileOrUrl = async (input) => {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return await getBase64FromUrl(input);
  }

  try {
    const fileData = fs.readFileSync(input);
    const ext = path.extname(input).toLowerCase();
    const mimeType =
      ext === ".pdf" ? "application/pdf" : `image/${ext.slice(1)}`;
    return `data:${mimeType};base64,${fileData.toString("base64")}`;
  } catch (error) {
    console.error(`Error reading local file ${input}:`, error);
    throw new Error(`Failed to read file: ${error.message}`);
  }
};

const processDocumentFromInput = async (input, type) => {
  try {
    const base64 = await getBase64FromFileOrUrl(input);

    const text = await performOCR(base64);

    const validation =
      type === "passport" ? validatePassport(text) : validateLicense(text);

    return {
      ...validation,
      cloudinaryUrl: input.startsWith("http") ? input : null,
      ocrText: text,
    };
  } catch (error) {
    console.error(`Error processing ${type} document:`, error);
    return {
      type,
      isValid: false,
      confidence: 0,
      data: {},
      cloudinaryUrl: input.startsWith("http") ? input : null,
      error: error.message,
    };
  }
};

const validateDocumentsFromFiles = async (passportInput, licenseInput) => {
  const result = {
    passport: null,
    drivingLicense: null,
  };

  try {
    if (passportInput) {
      result.passport = await processDocumentFromInput(
        passportInput,
        "passport"
      );
    } else {
      result.passport = {
        type: "passport",
        isValid: false,
        confidence: 0,
        data: {},
        cloudinaryUrl: null,
        error: "No passport provided",
      };
    }

    if (licenseInput) {
      result.drivingLicense = await processDocumentFromInput(
        licenseInput,
        "license"
      );
    } else {
      result.drivingLicense = {
        type: "license",
        isValid: false,
        confidence: 0,
        data: {},
        cloudinaryUrl: null,
        error: "No license provided",
      };
    }

    return result;
  } catch (error) {
    console.error("Error in validateDocumentsFromFiles:", error);
    return {
      passport: {
        type: "passport",
        isValid: false,
        confidence: 0,
        data: {},
        cloudinaryUrl: passportInput?.startsWith("http") ? passportInput : null,
        error: error.message,
      },
      drivingLicense: {
        type: "license",
        isValid: false,
        confidence: 0,
        data: {},
        cloudinaryUrl: licenseInput?.startsWith("http") ? licenseInput : null,
        error: error.message,
      },
    };
  }
};

export { validateDocumentsFromFiles };
