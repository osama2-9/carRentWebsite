import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OCR_SPACE_API_KEY || "K85522612088957";

const performOCR = async (base64Image) => {
  try {
    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      new URLSearchParams({
        base64Image,
        language: "eng",
        isOverlayRequired: "false",
        OCREngine: "2",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apiKey: API_KEY,
        },
        timeout: 30000,
      }
    );

    if (response.data.IsErroredOnProcessing) {
      throw new Error(response.data.ErrorMessage);
    }

    return response.data.ParsedResults?.[0]?.ParsedText || "";
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
};

export { performOCR };
