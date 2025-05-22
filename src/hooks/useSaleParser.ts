
import { useState } from "react";

type ParsedSale = {
  customer: string;
  strain: string;
  date: Date | string;
  quantity: number;
  salePrice: number;
  profit: number;
  isTick: boolean;
  paidSoFar?: number;
};

export function useSaleParser() {
  // Parse the natural language sale text into structured data
  const parseSaleText = (text: string): ParsedSale => {
    // Normalize text for consistent parsing
    const normalizedText = text.trim().toLowerCase();
    
    try {
      // Extract quantity (grams)
      let quantity = 0;
      const gramMatch = normalizedText.match(/(\d+\.?\d*)(?:\s?)(g|gram|grams)/);
      if (gramMatch) {
        quantity = parseFloat(gramMatch[1]);
      }
      
      // Extract customer name
      // Look for patterns like "to [name]" or "for [name]"
      let customer = "";
      const customerMatch = normalizedText.match(/(?:to|for)\s+([a-z0-9]+(?:\s[a-z0-9]+)?)/i);
      if (customerMatch) {
        customer = customerMatch[1].trim();
        // Capitalize first letter of each word in the customer name
        customer = customer.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      
      // Extract strain name (usually after "of" and before "to")
      let strain = "";
      const strainMatch = normalizedText.match(/(?:of|got)\s+([^,]+?)(?=\s+(?:to|for|on|at|from|-))/i);
      if (strainMatch) {
        strain = strainMatch[1].trim();
        // Capitalize the strain name
        strain = strain.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      
      // Extract sale price
      let salePrice = 0;
      const priceMatch = normalizedText.match(/(?:for\s+)?(?:[\$]|dollar|dollars|usd|for\s+)(\d+\.?\d*)/i);
      if (priceMatch) {
        salePrice = parseFloat(priceMatch[1]);
      }
      
      // Extract profit
      let profit = 0;
      const profitMatch = normalizedText.match(/(?:profit|made)\s+(?:[\$]|dollar|dollars|usd|of\s+)(\d+\.?\d*)/i);
      if (profitMatch) {
        profit = parseFloat(profitMatch[1]);
      } else if (salePrice > 0) {
        // Estimate profit as 60% of sale price if not explicitly stated
        profit = Math.round(salePrice * 0.6);
      }
      
      // Extract date
      let date: Date | string = new Date();
      
      // Try various date formats
      // Format: MM/DD or MM/DD/YY or MM/DD/YYYY
      const slashDateMatch = normalizedText.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
      
      // Format: Month name + day (+ optional year)
      const monthNameMatch = normalizedText.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:(?:st|nd|rd|th)?(?:,?\s*|\s+)(\d{2,4}))?/i);
      
      // Format: Day + Month name (+ optional year)
      const dayMonthMatch = normalizedText.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\.?)(?:,?\s*|\s+)(?:(\d{2,4}))?/i);
      
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
      }
      
      // Check if valid date, if not use current date
      if (isNaN(date.getTime())) {
        date = new Date();
      }
      
      // Detect if it's a tick/front
      const isTick = /(?:tick|front|fronted|credit|no\s+pay|not\s+paid|unpaid|owe|owes|owing|pending|payment\s+pending)/i.test(normalizedText);
      
      // Extract paid so far amount for ticks
      let paidSoFar = 0;
      if (isTick) {
        const paidMatch = normalizedText.match(/(?:paid|gave|received|got)\s+(?:[\$]|dollar|dollars|usd|)(\d+\.?\d*)/i);
        if (paidMatch) {
          paidSoFar = parseFloat(paidMatch[1]);
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
        paidSoFar
      };
    } catch (error) {
      console.error("Error parsing sale text:", error);
      throw new Error("Failed to parse sale text. Please check your input format.");
    }
  };
  
  return { parseSaleText };
}
