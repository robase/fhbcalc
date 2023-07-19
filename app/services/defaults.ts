export enum State {
  ACT = "ACT",
  NSW = "NSW",
  NT = "NT",
  QLD = "QLD",
  SA = "SA",
  VIC = "VIC",
  WA = "WA",
}

export interface FormResponse {
  income: number;
  expenses: number;
  deposit: number;
  purpose: "occupier" | "investor";
  participants: "single" | "couple";
  state: State;
  hecs: number;
  location: "city" | "regional";
  propertyType: "existing" | "new-property" | "vacant-land";
  minPrice?: number;
}

export const FORM_DEFAULT: FormResponse = {
  income: 100_000,
  expenses: 1700,
  deposit: 65_000,
  purpose: "occupier",
  participants: "single",
  state: State.NSW,
  hecs: 0,
  location: "city",
  propertyType: "existing",
};

export interface CalcSettings {
  priceInterval: number;
  interestRate: number;
  transactionFee: number;
}

export const SETTINGS_DEFAULT: CalcSettings = {
  priceInterval: 30_000,
  interestRate: 6.01,
  transactionFee: 3000,
};
