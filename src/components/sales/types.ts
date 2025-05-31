
import { ParsedSale } from "@/hooks/sale-parser/types";

export type SaleItem = {
  id: string;
  strain: string;
  date: Date;
  quantity: number;
  customer: string;
  salePrice: number;
  costPerGram: number;
  profit: number;
  image?: string;
};

export type StrainInfo = {
  id: string;
  name: string;
  costPerGram: number;
  image?: string;
};

export type CustomerInfo = {
  id: string;
  name: string;
  orderCount: number;
  lastOrderDate: Date | null;
  totalSpent: number;
  loyaltyTag: "🆕 New" | "🌀 Regular" | "🔥 VIP" | "👻 Ghosted";
};
