
export const detectTickStatus = (normalizedText: string): { isTick: boolean; confidence: number } => {
  const tickPatterns = [
    /(?:tick|ticked|front|fronted)/i,
    /(?:on\s+tick|on\s+credit)/i,
    /(?:credit|no\s+pay|not\s+paid|unpaid)/i,
    /(?:owe|owes|owing)/i,
    /(?:pending|payment\s+pending)/i,
    /(?:\$0\s+paid|paid\s+\$?0|gave\s+\$?0)/i
  ];
  
  const isTick = tickPatterns.some(pattern => pattern.test(normalizedText));
  const confidence = isTick ? 0.9 : 0.7;
  
  return { isTick, confidence };
};
