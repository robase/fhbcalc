export const CALC_DEFAULTS: CalcData = {
  income: 100000,
  expenses: 1700,
  deposit: 60000,
  purpose: "occupier",
  participants: "single",
  state: "NSW",
  hecs: 0,
}

export interface CalcData {
  income: number
  expenses: number
  deposit: number
  purpose: "occupier" | "investor"
  participants: "single" | "couple"
  state: "NSW"
  hecs: number
}
