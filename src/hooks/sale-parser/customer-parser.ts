
export const parseCustomer = (normalizedText: string): { customer: string; confidence: number } => {
  let customer = "";
  let confidence = 0;
  
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
    confidence = 0.8;
  } else if (customerBoughtMatch) {
    customer = customerBoughtMatch[1].trim();
    confidence = 0.7;
  } else if (soldToMatch) {
    customer = soldToMatch[1].trim();
    confidence = 0.9;
  } else if (droppedToMatch) {
    customer = droppedToMatch[1].trim();
    confidence = 0.8;
  }
  
  // Multi-word names with descriptors like "Fat Josh" or "Big Mike"
  if (!customer && normalizedText.match(/(?:to|for|sold)\s+(?:fat|big|tall|skinny|old|young)\s+([a-z0-9]+)/i)) {
    const descriptorMatch = normalizedText.match(/(?:to|for|sold)\s+((?:fat|big|tall|skinny|old|young)\s+[a-z0-9]+)/i);
    if (descriptorMatch) {
      customer = descriptorMatch[1].trim();
      confidence = 0.7;
    }
  }
  
  // Capitalize customer name properly
  if (customer) {
    customer = customer
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  return { customer, confidence };
};
