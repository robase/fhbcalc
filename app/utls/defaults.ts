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
  landValue: 110_000,
}

export interface FormResponse {
  income: number
  expenses: number
  deposit: number
  landValue: number
  purpose: "occupier" | "investor"
  participants: "single" | "couple"
  state: "NSW"
  hecs: number
  location: "city" | "regional"
  propertyBuild: "existing" | "new-property" | "vacant-land"
  minPrice?: number
}

export const SETTINGS_DEFAULT: CalcSettings = {
  priceInterval: 30_000,
  interestRate: 6.01,
  transferOrTax: "TRANSFER",
  transactionFee: 3000,
}

export interface CalcSettings {
  transferOrTax: "TRANSFER" | "TAX"
  priceInterval: number
  interestRate: number
  transactionFee: number
}
