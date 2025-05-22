
export const parseQuantity = (normalizedText: string): { quantity: number; confidence: number } => {
  let quantity = 0;
  let confidence = 0;
  
  // Pattern 1: Standard gram notation (e.g., "3.5g", "7 grams")
  const gramMatch = normalizedText.match(/(\d+\.?\d*)(?:\s?)(g|gram|grams)/i);
  
  // Pattern 2: Ounce fractions (e.g., "half oz", "quarter ounce")
  const ozMatch = normalizedText.match(/(half|quarter|eighth|1\/2|1\/4|1\/8)(?:\s?)(oz|ounce)/i);
  
  // Pattern 3: Just the number with g/gram nearby (e.g., "Sold Dave 3.5 of Gelato")
  const numNearGramMatch = normalizedText.match(/(\d+\.?\d*)\s+(?:of|in|for|at)/i) && 
                            normalizedText.includes('g');
  
  // Pattern 4: Numbers in parentheses with g (e.g., "Zkittlez (7g) to Tommy")
  const parenthesisGramMatch = normalizedText.match(/\((\d+\.?\d*)g\)/i);
  
  if (gramMatch) {
    quantity = parseFloat(gramMatch[1]);
    confidence = 0.9;
  } else if (ozMatch) {
    const ozFraction = ozMatch[1].toLowerCase();
    if (ozFraction === 'half' || ozFraction === '1/2') {
      quantity = 14; // Half ounce = 14g
    } else if (ozFraction === 'quarter' || ozFraction === '1/4') {
      quantity = 7; // Quarter ounce = 7g
    } else if (ozFraction === 'eighth' || ozFraction === '1/8') {
      quantity = 3.5; // Eighth = 3.5g
    }
    confidence = 0.8;
  } else if (numNearGramMatch && normalizedText.match(/(\d+\.?\d*)\s+(?:of|in|for|at)/i)) {
    quantity = parseFloat(normalizedText.match(/(\d+\.?\d*)\s+(?:of|in|for|at)/i)![1]);
    confidence = 0.7;
  } else if (parenthesisGramMatch) {
    quantity = parseFloat(parenthesisGramMatch[1]);
    confidence = 0.9;
  }
  
  // Detect common weight keywords
  if (normalizedText.includes('eighth') || normalizedText.includes('8th')) {
    quantity = quantity || 3.5;
    confidence = Math.max(confidence, 0.8);
  } else if (normalizedText.includes('quarter') || normalizedText.includes('quad')) {
    quantity = quantity || 7;
    confidence = Math.max(confidence, 0.8);
  } else if (normalizedText.includes('half')) {
    quantity = quantity || 14;
    confidence = Math.max(confidence, 0.8);
  } else if (normalizedText.includes('ounce') || normalizedText.includes(' oz')) {
    quantity = quantity || 28;
    confidence = Math.max(confidence, 0.8);
  }
  
  return { quantity, confidence };
};
