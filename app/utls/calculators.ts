import { CalcData } from "./defaults"

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes
export function qualifiesForFHOG({}: CalcData) {}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme
export function qualifiesForFHBAS({}: CalcData) {}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice
export function qualifiesForFHBC({}: CalcData) {}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice
export function qualifiesForFHBG({ participants, income, purpose, deposit }: CalcData, purchasePrice: number) {
  if (purpose === "investor") {
    return { eligible: false, reason: "you must be intending to be an owner-occupier of the purchased property" }
  }

  const lvr = calcLVR(purchasePrice, deposit)

  if (lvr > 95) {
    return { eligible: false, reason: "The minimum deposit required is 5%" }
  }

  if (lvr < 80) {
    return {
      eligible: false,
      reason: "The maximum LVR is 20%, LMI usually not charged for deposits of this size or larger",
    }
  }

  if (participants === "couple") {
    if (income > 200000) {
      return { eligible: false, reason: "your income is over the 200k threshold for couples" }
    }
  } else {
    if (income > 125000) {
      return { eligible: false, reason: "your income is over the 125k threshold for individuals" }
    }
  }

  return { eligible: true }
}

export function calcLVR(purchasePrice: number, deposit: number) {
  return ((purchasePrice - deposit) / purchasePrice) * 100
}

// https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty#heading4
export function calcTransferDuty(purchaseCost: number) {
  if (purchaseCost <= 650000) {
    return 0
  } else if (purchaseCost > 650000 && purchaseCost <= 1089000) {
    return purchaseCost / 450 + 9805
  } else if (purchaseCost > 1089000 && purchaseCost <= 3000000) {
    return purchaseCost / 550 + 44095
  } else {
    return -1
  }
}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice#heading10
export function calcPropertyTax(landValue: number, purpose: CalcData["purpose"]) {
  return purpose === "occupier" ? 400 + 0.003 * landValue : 1500 + 0.011 * landValue
}

// DTI * 6
export function estimateLoanAmount({ income, expenses }: CalcData) {
  return (income - expenses * 12) * 6
}
