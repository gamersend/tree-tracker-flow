
export type ImportDataType = "sales" | "customers" | "inventory" | "ticks" | "business-supplies";

export interface FormatExample {
  header: string;
  data: string[];
  description: string;
}
