
export const parsePrice = (normalizedText: string): { salePrice: number; confidence: number } => {
  let salePrice = 0;
  let confidence = 0;
  
  // Pattern 1: Dollar sign before amount (e.g., "$50", "$100.50")
  const priceMatch1 = normalizedText.match(/[\$](\d+\.?\d*)/i);
  
  // Pattern 2: "for" followed by amount (e.g., "for 50", "for fifty")
  const priceMatch2 = normalizedText.match(/for\s+(\d+\.?\d*)/i);
  
  // Pattern 3: "sold for" or "price" followed by amount
  const priceMatch3 = normalizedText.match(/(?:sold for|price|cost|paid)\s+(?:[\$])?(\d+\.?\d*)/i);
  
  // Pattern 4: Check for "owes" followed by amount (common in tick sales)
  const owesMatch = normalizedText.match(/(?:owes|owe|owing)\s+(?:[\$]|me\s+[\$]?|me\s+)?(\d+\.?\d*)/i);
  
  if (priceMatch1) {
    salePrice = parseFloat(priceMatch1[1]);
    confidence = 0.9;
  } else if (priceMatch2) {
    salePrice = parseFloat(priceMatch2[1]);
    confidence = 0.8;
  } else if (priceMatch3) {
    salePrice = parseFloat(priceMatch3[1]);
    confidence = 0.7;
  } else if (owesMatch) {
    salePrice = parseFloat(owesMatch[1]);
    confidence = 0.6;
  }
  
  return { salePrice, confidence };
};

// Parse profit information from the text
export const parseProfit = (normalizedText: string, salePrice: number): { profit: number; confidence: number } => {
  let profit = 0;
  let confidence = 0;
  
  // Pattern 1: "profit" or "made" followed by amount
  const profitMatch1 = normalizedText.match(/(?:profit|made)\s+(?:[\$]|dollar|dollars|usd|of\s+)?(\d+\.?\d*)/i);
  
  // Pattern 2: "with" followed by "$X profit"
  const profitMatch2 = normalizedText.match(/with\s+(?:[\$])?(\d+\.?\d*)(?:\s+profit)/i);
  
  if (profitMatch1) {
    profit = parseFloat(profitMatch1[1]);
    confidence = 0.9;
  } else if (profitMatch2) {
    profit = parseFloat(profitMatch2[1]);
    confidence = 0.8;
  } else if (salePrice > 0) {
    // Estimate profit as 60% of sale price if not explicitly stated
    profit = Math.round(salePrice * 0.6);
    confidence = 0.3; // Low confidence since it's estimated
  }
  
  return { profit, confidence };
};

export const parsePaidAmount = (normalizedText: string, isTick: boolean): { paidSoFar: number; confidence: number } => {
  let paidSoFar = 0;
  let confidence = 0;
  
  if (isTick) {
    const paidPatterns = [
      /(?:paid|gave|received|got)\s+(?:[\$]|dollar|dollars|usd|)(\d+\.?\d*)/i,
      /(?:[\$]|dollar|dollars|usd|)(\d+\.?\d*)\s+(?:paid|given|received)/i
    ];
    
    for (const pattern of paidPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        paidSoFar = parseFloat(match[1]);
        confidence = 0.8;
        break;
      }
    }
  }
  
  return { paidSoFar, confidence };
};
