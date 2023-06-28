export const FORM_DEFAULT: FormResponse = {
  income: 100_000,
  expenses: 1700,
  deposit: 65_000,
  purpose: "occupier",
  participants: "single",
  state: "NSW",
  hecs: 0,
  location: "city",
  propertyBuild: "existing",
};

export interface FormResponse {
  income: number;
  expenses: number;
  deposit: number;
  purpose: "occupier" | "investor";
  participants: "single" | "couple";
  state: "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";
  hecs: number;
  location: "city" | "regional";
  propertyBuild: "existing" | "new-property" | "vacant-land";
  minPrice?: number;
}

export const SETTINGS_DEFAULT: CalcSettings = {
  priceInterval: 30_000,
  interestRate: 6.01,
  transactionFee: 3000,
};

export interface CalcSettings {
  priceInterval: number;
  interestRate: number;
  transactionFee: number;
}
