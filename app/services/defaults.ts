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
  dependents: number;
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
  dependents: 0,
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
  loanPeriod: number;
}

export const SETTINGS_DEFAULT: CalcSettings = {
  priceInterval: 20_000,
  interestRate: 6.5,
  transactionFee: 3000,
  loanPeriod: 30,
};
