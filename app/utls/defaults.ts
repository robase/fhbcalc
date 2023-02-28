export const CALC_DEFAULTS: CalcData = {
  income: 100_000,
  expenses: 1700,
  deposit: 60_000,
  purpose: "occupier",
  participants: "single",
  state: "NSW",
  hecs: 0,
  location: "city",
  propertyBuild: "existing",
  landValue: 120_000,
}

export interface CalcData {
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
}
