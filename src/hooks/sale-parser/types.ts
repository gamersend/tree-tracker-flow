
export type ParsedSale = {
  id?: string;
  customer: string;
  strain: string;
  date: Date | string;
  quantity: number;
  salePrice: number;
  profit: number;
  isTick: boolean;
  paidSoFar?: number;
  rawInput?: string;
  confidence?: {
    customer: number;
    strain: number;
    date: number;
    quantity: number;
    salePrice: number;
    profit: number;
  };
};

export type StrainMatch = {
  strain: string;
  confidence: number;
};

export type ConfidenceScores = {
  customer: number;
  strain: number;
  date: number;
  quantity: number;
  salePrice: number;
  profit: number;
};
