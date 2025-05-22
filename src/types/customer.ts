
export type CustomerType = {
  id: string;
  name: string;
  platform: string;
  alias: string;
  notes: string;
  trustedBuyer: boolean;
  totalOrders: number;
  totalSpent: number;
  totalProfit: number;
  lastPurchase?: Date;
  emoji?: string;
};

export type PurchaseType = {
  id: string;
  customerId: string;
  date: Date;
  strain: string;
  quantity: number;
  amount: number;
  profit: number;
  rating?: number;
};

export type CustomerFormData = {
  name: string;
  platform: string;
  alias: string;
  notes: string;
  trustedBuyer: boolean;
  emoji: string;
};
