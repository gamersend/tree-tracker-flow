
import { useState } from "react";

// Define common strain names for auto-suggestion
const COMMON_STRAINS = [
  "Gelato", "Zkittlez", "Skywalker OG", "Blue Dream", 
  "Girl Scout Cookies", "OG Kush", "Sour Diesel", 
  "Purple Haze", "Northern Lights", "Pineapple Express",
  "White Widow", "AK-47", "Wedding Cake", "Runtz",
  "Gorilla Glue", "Jack Herer", "Green Crack", "Durban Poison"
];

type ParsedSale = {
  customer: string;
  strain: string;
  date: Date | string;
  quantity: number;
  salePrice: number;
  profit: number;
  isTick: boolean;
  paidSoFar?: number;
  confidence: {
    customer: number;
    strain: number;
    date: number;
    quantity: number;
    salePrice: number;
    profit: number;
  };
};

export function useSaleParser() {
  // Function to find the best matching strain from text
  const findBestStrain = (text: string): { strain: string; confidence: number } => {
    // Normalize input text
    const normalizedText = text.toLowerCase();
    
    // Look for exact matches in common strains
    for (const strain of COMMON_STRAINS) {
      if (normalizedText.includes(strain.toLowerCase())) {
        return { strain, confidence: 1 };
      }
    }
    
    // Try to extract strain-like words from the text
    // This is a simplified approach - in production, you'd use a more sophisticated algorithm
    const words = normalizedText.split(/\s+/);
    for (const word of words) {
      // Skip common words like "to", "for", "on", etc.
      if (word.length < 3 || /^(to|for|on|at|the|and|with|from)$/i.test(word)) continue;
      
      // Check if the word might be a strain name (capitalized word not following common patterns)
      if (/^[A-Z][a-z]+$/.test(word) && !/(sold|paid|gave|got|made|profit|tick|front)/i.test(word)) {
        return { strain: word, confidence: 0.5 };
      }
    }
    
    return { strain: "", confidence: 0 };
  };
  
  // Parse the natural language sale text into structured data
  const parseSaleText = (text: string): ParsedSale => {
    // Normalize text for consistent parsing
    const normalizedText = text.trim().toLowerCase();
    
    try {
      // Initialize confidence levels for each field
      const confidence = {
        customer: 0,
        strain: 0,
        date: 0,
        quantity: 0,
        salePrice: 0,
        profit: 0
      };
      
      // Extract quantity (grams)
      let quantity = 0;
      
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
        confidence.quantity = 0.9;
      } else if (ozMatch) {
        const ozFraction = ozMatch[1].toLowerCase();
        if (ozFraction === 'half' || ozFraction === '1/2') {
          quantity = 14; // Half ounce = 14g
        } else if (ozFraction === 'quarter' || ozFraction === '1/4') {
          quantity = 7; // Quarter ounce = 7g
        } else if (ozFraction === 'eighth' || ozFraction === '1/8') {
          quantity = 3.5; // Eighth = 3.5g
        }
        confidence.quantity = 0.8;
      } else if (numNearGramMatch && normalizedText.match(/(\d+\.?\d*)\s+(?:of|in|for|at)/i)) {
        quantity = parseFloat(normalizedText.match(/(\d+\.?\d*)\s+(?:of|in|for|at)/i)![1]);
        confidence.quantity = 0.7;
      } else if (parenthesisGramMatch) {
        quantity = parseFloat(parenthesisGramMatch[1]);
        confidence.quantity = 0.9;
      }
      
      // Detect common weight keywords
      if (normalizedText.includes('eighth') || normalizedText.includes('8th')) {
        quantity = quantity || 3.5;
        confidence.quantity = Math.max(confidence.quantity, 0.8);
      } else if (normalizedText.includes('quarter') || normalizedText.includes('quad')) {
        quantity = quantity || 7;
        confidence.quantity = Math.max(confidence.quantity, 0.8);
      } else if (normalizedText.includes('half')) {
        quantity = quantity || 14;
        confidence.quantity = Math.max(confidence.quantity, 0.8);
      } else if (normalizedText.includes('ounce') || normalizedText.includes(' oz')) {
        quantity = quantity || 28;
        confidence.quantity = Math.max(confidence.quantity, 0.8);
      }
      
      // Extract customer name
      // Look for patterns like "to [name]", "for [name]", "dropped to [name]", "[name] bought"
      let customer = "";
      
      // Pattern 1: "to [Name]" or "for [Name]" where Name is typically capitalized
      const customerToForMatch = normalizedText.match(/(?:to|for)\s+([a-z0-9][a-z0-9\s]+?)(?=[\s,.;:]|$|\s+on|\s+at|\s+for|\s+\$)/i);
      
      // Pattern 2: "[Name] bought/got/purchased"
      const customerBoughtMatch = normalizedText.match(/^([a-z0-9][a-z0-9\s]+?)(?:\s+bought|\s+got|\s+purchased)/i);
      
      // Pattern 3: "sold [Name]" or "gave [Name]"
      const soldToMatch = normalizedText.match(/(?:sold|gave)\s+([a-z0-9][a-z0-9\s]+?)(?=[\s,.;:]|$|\s+\d|\s+on|\s+at|\s+for|\s+\$)/i);
      
      // Pattern 4: "dropped/fronted/ticked [weight] to [Name]"
      const droppedToMatch = normalizedText.match(/(?:dropped|fronted|ticked)(?:\s+\w+){0,3}\s+to\s+([a-z0-9][a-z0-9\s]+?)(?=[\s,.;:]|$|\s+on|\s+at|\s+for|\s+\$)/i);
      
      if (customerToForMatch) {
        customer = customerToForMatch[1].trim();
        confidence.customer = 0.8;
      } else if (customerBoughtMatch) {
        customer = customerBoughtMatch[1].trim();
        confidence.customer = 0.7;
      } else if (soldToMatch) {
        customer = soldToMatch[1].trim();
        confidence.customer = 0.9;
      } else if (droppedToMatch) {
        customer = droppedToMatch[1].trim();
        confidence.customer = 0.8;
      }
      
      // Multi-word names with descriptors like "Fat Josh" or "Big Mike"
      if (!customer && normalizedText.match(/(?:to|for|sold)\s+(?:fat|big|tall|skinny|old|young)\s+([a-z0-9]+)/i)) {
        const descriptorMatch = normalizedText.match(/(?:to|for|sold)\s+((?:fat|big|tall|skinny|old|young)\s+[a-z0-9]+)/i);
        if (descriptorMatch) {
          customer = descriptorMatch[1].trim();
          confidence.customer = 0.7;
        }
      }
      
      // Capitalize customer name properly
      if (customer) {
        customer = customer
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      
      // Extract strain name
      const { strain, confidence: strainConfidence } = findBestStrain(text);
      confidence.strain = strainConfidence;
      
      // If no strain found by the helper function, try these patterns
      if (!strain) {
        // Pattern 1: After "of" and before "to" (e.g., "3.5g of Blue Dream to Tom")
        const strainMatch1 = normalizedText.match(/(?:of|got)\s+([^,]+?)(?=\s+(?:to|for|from|on|at|-))/i);
        
        // Pattern 2: Before "to" after a weight (e.g., "sold 3.5g Northern Lights to Dave")
        const strainMatch2 = normalizedText.match(/(?:\d+\.?\d*\s*(?:g|gram|grams))\s+([a-zA-Z\s]+?)(?=\s+(?:to|for|from))/i);
        
        // Pattern 3: After "sold" and before a price (e.g., "sold Gelato to Dave for $50")
        const strainMatch3 = normalizedText.match(/(?:sold|fronted|ticked)\s+([a-zA-Z\s]+?)(?=\s+(?:to|for|from))/i);
        
        if (strainMatch1) {
          const extractedStrain = strainMatch1[1].trim();
          // Check if the extracted part looks like a strain (not containing certain keywords)
          if (!/(sold|bought|paid|gave|got|made|profit|tick|front|grams|dollars)/i.test(extractedStrain)) {
            strain = extractedStrain;
            confidence.strain = 0.7;
          }
        } else if (strainMatch2) {
          strain = strainMatch2[1].trim();
          confidence.strain = 0.6;
        } else if (strainMatch3) {
          strain = strainMatch3[1].trim();
          confidence.strain = 0.5;
        }
      }
      
      // Capitalize the strain name
      if (strain) {
        strain = strain
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      
      // Extract sale price
      let salePrice = 0;
      
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
        confidence.salePrice = 0.9;
      } else if (priceMatch2) {
        salePrice = parseFloat(priceMatch2[1]);
        confidence.salePrice = 0.8;
      } else if (priceMatch3) {
        salePrice = parseFloat(priceMatch3[1]);
        confidence.salePrice = 0.7;
      } else if (owesMatch) {
        salePrice = parseFloat(owesMatch[1]);
        confidence.salePrice = 0.6;
      }
      
      // If no sale price found, try to estimate based on quantity using common pricing
      if (salePrice === 0 && quantity > 0) {
        if (quantity === 3.5) salePrice = 50; // Common price for eighth
        else if (quantity === 7) salePrice = 100; // Common price for quarter
        else if (quantity === 14) salePrice = 180; // Common price for half
        else if (quantity === 28) salePrice = 320; // Common price for ounce
        else salePrice = Math.round(quantity * 10); // Rough estimate
        
        confidence.salePrice = 0.3; // Low confidence since it's estimated
      }
      
      // Extract profit
      let profit = 0;
      
      // Pattern 1: "profit" or "made" followed by amount
      const profitMatch1 = normalizedText.match(/(?:profit|made)\s+(?:[\$]|dollar|dollars|usd|of\s+)?(\d+\.?\d*)/i);
      
      // Pattern 2: "with" followed by "$X profit"
      const profitMatch2 = normalizedText.match(/with\s+(?:[\$])?(\d+\.?\d*)(?:\s+profit)/i);
      
      if (profitMatch1) {
        profit = parseFloat(profitMatch1[1]);
        confidence.profit = 0.9;
      } else if (profitMatch2) {
        profit = parseFloat(profitMatch2[1]);
        confidence.profit = 0.8;
      } else if (salePrice > 0) {
        // Estimate profit as 60% of sale price if not explicitly stated
        profit = Math.round(salePrice * 0.6);
        confidence.profit = 0.3; // Low confidence since it's estimated
      }
      
      // Extract date
      let date: Date | string = new Date();
      confidence.date = 0.5; // Default confidence for today's date
      
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
        confidence.date = 0.8;
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
        confidence.date = 0.9;
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
        confidence.date = 0.85;
      } else if (onDateMatch && onDateMatch[1]) {
        // Handle "on" followed by a date - recursive call the date extraction logic
        const dateText = onDateMatch[1];
        const dateMatch = parseSaleText(`The date is ${dateText}`);
        date = dateMatch.date;
        confidence.date = 0.8;
      } else if (specialDateMatch) {
        const specialDate = specialDateMatch[1].toLowerCase();
        const now = new Date();
        
        if (specialDate === 'yesterday') {
          now.setDate(now.getDate() - 1);
          date = now;
          confidence.date = 0.95;
        } else if (specialDate === 'today') {
          date = now;
          confidence.date = 0.95;
        } else if (specialDate === 'tomorrow') {
          now.setDate(now.getDate() + 1);
          date = now;
          confidence.date = 0.95;
        } else if (specialDate === 'last week') {
          now.setDate(now.getDate() - 7);
          date = now;
          confidence.date = 0.7;
        } else if (specialDate === 'this week') {
          date = now;
          confidence.date = 0.6;
        } else if (specialDate === 'next week') {
          now.setDate(now.getDate() + 7);
          date = now;
          confidence.date = 0.7;
        }
      }
      
      // Special case for 4/20
      if (normalizedText.includes('4/20') || normalizedText.includes('4-20')) {
        date = new Date(new Date().getFullYear(), 3, 20); // April 20
        confidence.date = 0.95;
      }
      
      // Check if valid date, if not use current date
      if (date instanceof Date && isNaN(date.getTime())) {
        date = new Date();
        confidence.date = 0.5;
      }
      
      // Detect if it's a tick/front
      const tickPatterns = [
        /(?:tick|ticked|front|fronted)/i,
        /(?:on\s+tick|on\s+credit)/i,
        /(?:credit|no\s+pay|not\s+paid|unpaid)/i,
        /(?:owe|owes|owing)/i,
        /(?:pending|payment\s+pending)/i,
        /(?:\$0\s+paid|paid\s+\$?0|gave\s+\$?0)/i
      ];
      
      const isTick = tickPatterns.some(pattern => pattern.test(normalizedText));
      
      // Extract paid so far amount for ticks
      let paidSoFar = 0;
      if (isTick) {
        const paidPatterns = [
          /(?:paid|gave|received|got)\s+(?:[\$]|dollar|dollars|usd|)(\d+\.?\d*)/i,
          /(?:[\$]|dollar|dollars|usd|)(\d+\.?\d*)\s+(?:paid|given|received)/i
        ];
        
        for (const pattern of paidPatterns) {
          const match = normalizedText.match(pattern);
          if (match) {
            paidSoFar = parseFloat(match[1]);
            break;
          }
        }
      }
      
      // Return the parsed sale
      return {
        customer,
        strain,
        date,
        quantity,
        salePrice,
        profit,
        isTick,
        paidSoFar,
        confidence
      };
    } catch (error) {
      console.error("Error parsing sale text:", error);
      throw new Error("Failed to parse sale text. Please check your input format.");
    }
  };

  // Get suggestions for common strains
  const getStrainSuggestions = () => {
    return COMMON_STRAINS;
  };
  
  return { parseSaleText, getStrainSuggestions };
}
