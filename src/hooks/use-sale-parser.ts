
import { useState } from "react";
import { ParsedSale, ConfidenceScores } from "./sale-parser/types";
import { COMMON_STRAINS, findBestStrain } from "./sale-parser/strain-utils";
import { parseQuantity } from "./sale-parser/quantity-parser";
import { parseCustomer } from "./sale-parser/customer-parser";
import { parsePrice, parseProfit, parsePaidAmount } from "./sale-parser/price-parser";
import { parseDate } from "./sale-parser/date-parser";
import { detectTickStatus } from "./sale-parser/tick-parser";

export function useSaleParser() {
  // Parse the natural language sale text into structured data
  const parseSaleText = (text: string): ParsedSale => {
    // Normalize text for consistent parsing
    const normalizedText = text ? text.trim().toLowerCase() : '';
    
    try {
      // Initialize confidence levels for each field
      const confidence: ConfidenceScores = {
        customer: 0,
        strain: 0,
        date: 0,
        quantity: 0,
        salePrice: 0,
        profit: 0
      };
      
      // Extract quantity (grams)
      const { quantity, confidence: quantityConfidence } = parseQuantity(normalizedText);
      confidence.quantity = quantityConfidence;
      
      // Extract customer name
      const { customer, confidence: customerConfidence } = parseCustomer(normalizedText);
      confidence.customer = customerConfidence;
      
      // Extract strain name
      const { strain: initialStrain, confidence: strainConfidence } = findBestStrain(text || '');
      confidence.strain = strainConfidence;
      
      // If no strain found, try additional patterns
      let detectedStrain = initialStrain;
      
      if (!detectedStrain && normalizedText) {
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
            detectedStrain = extractedStrain;
            confidence.strain = 0.7;
          }
        } else if (strainMatch2) {
          detectedStrain = strainMatch2[1].trim();
          confidence.strain = 0.6;
        } else if (strainMatch3) {
          detectedStrain = strainMatch3[1].trim();
          confidence.strain = 0.5;
        }
      }
      
      // Capitalize the strain name
      if (detectedStrain) {
        detectedStrain = detectedStrain
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      
      // Extract sale price
      const { salePrice, confidence: priceConfidence } = parsePrice(normalizedText);
      confidence.salePrice = priceConfidence;
      
      // Extract profit
      const { profit, confidence: profitConfidence } = parseProfit(normalizedText, salePrice);
      confidence.profit = profitConfidence;
      
      // Extract date
      const { date, confidence: dateConfidence } = parseDate(normalizedText);
      confidence.date = dateConfidence;
      
      // Detect if it's a tick/front
      const { isTick } = detectTickStatus(normalizedText);
      
      // Extract paid so far amount for ticks
      const { paidSoFar } = parsePaidAmount(normalizedText, isTick);
      
      // Return the parsed sale with default values for undefined fields
      return {
        customer: customer || '',
        strain: detectedStrain || '',
        date: date || new Date(),
        quantity: quantity || 0,
        salePrice: salePrice || 0,
        profit: profit || 0,
        isTick: isTick || false,
        paidSoFar: paidSoFar || 0,
        confidence
      };
    } catch (error) {
      console.error("Error parsing sale text:", error);
      // Return a default safe object if parsing fails
      return {
        customer: '',
        strain: '',
        date: new Date(),
        quantity: 0,
        salePrice: 0,
        profit: 0,
        isTick: false,
        paidSoFar: 0,
        confidence: {
          customer: 0,
          strain: 0,
          date: 0,
          quantity: 0,
          salePrice: 0,
          profit: 0
        }
      };
    }
  };

  // Get suggestions for common strains
  const getStrainSuggestions = () => {
    return COMMON_STRAINS || [];
  };
  
  return { parseSaleText, getStrainSuggestions };
}
