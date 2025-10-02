const PATTERNS = {
  passport: {
    number: /P[0-9]{7}|[A-Z]{2}[0-9]{7}|[0-9]{8,9}/i,
    country: /PALESTINE|EGYPT|SPAIN|FRANCE|CANADA|MOROCCO|ALGERIA|ITALY/i,
    keywords: /passport|travel document|issuing authority/i,
  },
  license: {
    number: /[A-Z0-9]{8,15}/i,
    class: /class\s*[A-E]|CDL/i,
    keywords: /driver.{0,10}license|driving license|operator license/i,
  },
};

const extractDates = (text) => {
  const patterns = [
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g,
    /\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/g,
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/gi,
  ];

  const dates = [];
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      dates.push(match[0]);
    }
  });
  return dates;
};

const validatePassport = (text) => {
  const result = { type: "passport", isValid: false, confidence: 0, data: {} };

  if (!PATTERNS.passport.keywords.test(text)) return result;

  result.confidence += 30;

  const number = text.match(PATTERNS.passport.number);
  if (number) {
    result.data.number = number[0];
    result.confidence += 25;
  }

  const country = text.match(PATTERNS.passport.country);
  if (country) {
    result.data.country = country[0];
    result.confidence += 20;
  }

  const dates = extractDates(text);
  if (dates.length >= 2) {
    result.data.issueDate = dates[0];
    result.data.expiryDate = dates[1];
    result.confidence += 15;
  }

  const name = text.match(/(?:name|surname)[:\s]+([A-Z\s]+)/i);
  if (name) {
    result.data.name = name[1].trim();
    result.confidence += 10;
  }

  result.isValid = result.confidence >= 60;
  return result;
};

const validateLicense = (text) => {
  const result = { type: "license", isValid: false, confidence: 0, data: {} };

  if (!PATTERNS.license.keywords.test(text)) return result;

  result.confidence += 35;

  const number = text.match(PATTERNS.license.number);
  if (number) {
    result.data.number = number[0];
    result.confidence += 25;
  }

  const licenseClass = text.match(PATTERNS.license.class);
  if (licenseClass) {
    result.data.class = licenseClass[0];
    result.confidence += 15;
  }

  const dates = extractDates(text);
  if (dates.length >= 1) {
    result.data.expiryDate = dates[dates.length - 1];
    result.confidence += 15;
  }

  const name = text.match(/(?:name|holder)[:\s]+([A-Z\s]+)/i);
  if (name) {
    result.data.name = name[1].trim();
    result.confidence += 10;
  }

  result.isValid = result.confidence >= 60;
  return result;
};

export { validatePassport, validateLicense };
