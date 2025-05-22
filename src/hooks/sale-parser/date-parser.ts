
export const parseDate = (normalizedText: string): { date: Date | string; confidence: number } => {
  let date: Date | string = new Date();
  let confidence = 0.5; // Default confidence for today's date
  
  // Pattern 1: MM/DD or MM/DD/YY or MM/DD/YYYY
  const slashDateMatch = normalizedText.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  
  // Pattern 2: Month name + day (+ optional year)
  const monthNameMatch = normalizedText.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:(?:st|nd|rd|th)?(?:,?\s*|\s+)(\d{2,4}))?/i);
  
  // Pattern 3: Day + Month name (+ optional year)
  const dayMonthMatch = normalizedText.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\.?)(?:,?\s*|\s+)(?:(\d{2,4}))?/i);
  
  // Pattern 4: "on" followed by date
  const onDateMatch = normalizedText.match(/on\s+((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:(?:st|nd|rd|th)?(?:,?\s*|\s+)(?:\d{2,4}))?)/i);
  
  // Pattern 5: Special dates like "4/20" or "yesterday" or "last week"
  const specialDateMatch = normalizedText.match(/\b(yesterday|today|tomorrow|last\s+week|this\s+week|next\s+week)\b/i);
  
  if (slashDateMatch) {
    const month = parseInt(slashDateMatch[1]) - 1; // JS months are 0-indexed
    const day = parseInt(slashDateMatch[2]);
    let year = new Date().getFullYear(); // Default to current year
    
    if (slashDateMatch[3]) {
      const yearStr = slashDateMatch[3];
      year = parseInt(yearStr);
      // Handle 2-digit years
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }
    }
    
    date = new Date(year, month, day);
    confidence = 0.8;
  } else if (monthNameMatch) {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames.findIndex(m => monthNameMatch[1].toLowerCase().startsWith(m));
    const day = parseInt(monthNameMatch[2]);
    let year = new Date().getFullYear();
    
    if (monthNameMatch[3]) {
      const yearStr = monthNameMatch[3];
      year = parseInt(yearStr);
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }
    }
    
    date = new Date(year, month, day);
    confidence = 0.9;
  } else if (dayMonthMatch) {
    const day = parseInt(dayMonthMatch[1]);
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames.findIndex(m => dayMonthMatch[2].toLowerCase().startsWith(m));
    let year = new Date().getFullYear();
    
    if (dayMonthMatch[3]) {
      const yearStr = dayMonthMatch[3];
      year = parseInt(yearStr);
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }
    }
    
    date = new Date(year, month, day);
    confidence = 0.85;
  } else if (specialDateMatch) {
    const specialDate = specialDateMatch[1].toLowerCase();
    const now = new Date();
    
    if (specialDate === 'yesterday') {
      now.setDate(now.getDate() - 1);
      date = now;
      confidence = 0.95;
    } else if (specialDate === 'today') {
      date = now;
      confidence = 0.95;
    } else if (specialDate === 'tomorrow') {
      now.setDate(now.getDate() + 1);
      date = now;
      confidence = 0.95;
    } else if (specialDate === 'last week') {
      now.setDate(now.getDate() - 7);
      date = now;
      confidence = 0.7;
    } else if (specialDate === 'this week') {
      date = now;
      confidence = 0.6;
    } else if (specialDate === 'next week') {
      now.setDate(now.getDate() + 7);
      date = now;
      confidence = 0.7;
    }
  }
  
  // Special case for 4/20
  if (normalizedText.includes('4/20') || normalizedText.includes('4-20')) {
    date = new Date(new Date().getFullYear(), 3, 20); // April 20
    confidence = 0.95;
  }
  
  // Check if valid date, if not use current date
  if (date instanceof Date && isNaN(date.getTime())) {
    date = new Date();
    confidence = 0.5;
  }
  
  return { date, confidence };
};
