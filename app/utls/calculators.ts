import type { CalcData } from "./defaults"

import { JSDOM } from "jsdom"

interface EligibilityResult {
  eligible: boolean
  type?: string
  reason?: string
}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes
export function qualifiesForFHOG({ propertyBuild }: CalcData, purchasePrice: number): EligibilityResult {
  if (!["vacant-land", "new-property"].includes(propertyBuild)) {
    return {
      eligible: false,
      reason: "FHOG: Only available for newly built, off the plan or substantially renovated properties",
    }
  }

  if (propertyBuild === "vacant-land" && purchasePrice > 750_000) {
    return {
      eligible: false,
      reason:
        "FHOG: Property value (house and land) must not exceed $750,000. Applies to Owner builders and Comprehensive home building contracts",
    }
  }

  if (propertyBuild === "new-property" && purchasePrice > 600_000) {
    return {
      eligible: false,
      reason: "FHOG: The purchase price must not exceed $600,000",
    }
  }

  return { eligible: true }
}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme
export function qualifiesForFHBAS({ propertyBuild, purpose }: CalcData, purchasePrice: number): EligibilityResult {
  //   if (purpose === "investor") {
  //     return {
  //       eligible: false,
  //       type: "amber",
  //       reason: "you must live in the property for at least 6 continuous months, you must move in within 12 months",
  //     }
  //   }
  if (propertyBuild === "new-property" || propertyBuild === "existing") {
    if (purchasePrice >= 800_000) {
      return {
        eligible: false,
        reason: "FHBAS: Purchase price can not exceed $800,000 for new or existing home purchases",
      }
    }
    if (purchasePrice >= 650_000 && purchasePrice < 800_000) {
      return { eligible: true, type: "concessional" }
    }
  }

  if (propertyBuild === "vacant-land") {
    if (purchasePrice >= 450_000) {
      return { eligible: false, reason: "FHBAS: Purchase price can not exceed $450,000 for vacant land purchases" }
    }
    if (purchasePrice >= 350_000 && purchasePrice < 450_000) {
      return { eligible: true, type: "concessional" }
    }
  }

  return { eligible: true, type: "full" }
}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice#heading3
export function qualifiesForFHBC({ propertyBuild }: CalcData, purchasePrice: number): EligibilityResult {
  if (purchasePrice > 1_500_000 && ["existing", "new-property"].includes(propertyBuild)) {
    return { eligible: false, reason: "FHBC: New or existing home purchases must not exceed $1.5m" }
  }

  if (propertyBuild === "vacant-land" && purchasePrice > 800_000) {
    return { eligible: false, reason: "FHBC: Vacant land purchases must not exceed $800,000" }
  }

  return { eligible: true }
}

// https://www.nhfic.gov.au/support-buy-home/property-price-caps
// https://www.nhfic.gov.au/support-buy-home/first-home-guarantee#eligibility-and-how-to-apply
export function qualifiesForFHBG(
  { participants, income, purpose, deposit, location, state }: CalcData,
  purchasePrice: number
): EligibilityResult {
  if (purpose === "investor") {
    return { eligible: false, reason: "FHBG: You must be intending to be an owner-occupier of the purchased property" }
  }

  if (location === "city") {
    if (state === "NSW" && purchasePrice > 900_000) {
      return {
        eligible: false,
        reason:
          "FHBG: Purchase price must not exceed $900,000 for properties in Sydney, Newcastle, Lake Macquarie or Illawarra",
      }
    }
  }

  if (location === "regional") {
    if (state === "NSW" && purchasePrice > 750_000) {
      return {
        eligible: false,
        reason:
          "FHBG: Purchase price must not exceed $750,000 for properties outside of Sydney, Newcastle, Lake Macquarie or Illawarra",
      }
    }
  }

  const lvr = calcLVR(purchasePrice, deposit)

  if (lvr > 95) {
    return { eligible: false, reason: "FHBG: The minimum deposit required is 5%" }
  }

  if (lvr < 80) {
    return {
      eligible: false,
      reason: "FHBG: Your LVR is less than 80%",
    }
  }

  if (participants === "couple") {
    if (income > 200_000) {
      return { eligible: false, reason: "FHBG: your income is over the 200k threshold for couples" }
    }
  } else {
    if (income > 125_000) {
      return { eligible: false, reason: "FHBG: your income is over the 125k threshold for individuals" }
    }
  }

  return { eligible: true }
}

export function calcFHBASConcession(purchasePrice: number) {
  const res = 0.20727 * purchasePrice - 134723.33391
  return res < 0 ? 0 : res
}

// https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty#heading4
export function calcTransferDuty(purchasePrice: number, { eligible, type }: EligibilityResult) {
  if (eligible) {
    if (type === "full") {
      return 0
    }

    return calcFHBASConcession(purchasePrice)
  }

  if (purchasePrice <= 15_000) return (purchasePrice / 100) * 1.25
  if (purchasePrice <= 32_000) return ((purchasePrice - 15_000) / 100) * 1.5 + 187
  if (purchasePrice <= 87_000) return ((purchasePrice - 32_000) / 100) * 1.75 + 442
  if (purchasePrice <= 327_000) return ((purchasePrice - 87_000) / 100) * 3.5 + 1405
  if (purchasePrice <= 1_089_000) return ((purchasePrice - 327_000) / 100) * 4.5 + 9805
  if (purchasePrice <= 3_268_000) return ((purchasePrice - 1_089_000) / 100) * 5.5 + 44_095

  return ((purchasePrice - 3_268_000) / 100) * 7.0 + 163_940
}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice#heading10
export function calcPropertyTax(landValue: number, purpose: CalcData["purpose"]) {
  return purpose === "occupier" ? 400 + 0.003 * landValue : 1500 + 0.011 * landValue
}

// DTI * 6
export function estimateLoanAmount({ income, expenses }: CalcData) {
  return (income - expenses * 12) * 6
}

export function calcLVR(purchasePrice: number, depositPlusLMI: number) {
  const lvr = ((purchasePrice - depositPlusLMI) / purchasePrice) * 100
  return lvr > 0 ? lvr : 0
}

// https://www.homeloanexperts.com.au/lenders-mortgage-insurance/lmi-premium-rates/
export function calcLMI(purchasePrice: number, deposit: number, { eligible }: EligibilityResult) {
  // Get LVR, lookup LVR vs purchase price in table
  // get premium % from table, multiply by loan amount

  if (eligible) {
    return 0
  }
  const lvr = Math.ceil(calcLVR(purchasePrice, deposit))

  if (lvr < 81) {
    return 0
  }

  if (lvr > 95) {
    return -1
  }

  const priceBuckets = [300000, 500000, 600000, 750000, 1000000]

  let bucketIndex

  for (let i = 0; i < priceBuckets.length; i++) {
    if (purchasePrice <= priceBuckets[i]) {
      bucketIndex = i
      break
    }
  }

  if (bucketIndex === null || bucketIndex === undefined) {
    // console.log("price too high for lvr")
    return -1
  }

  const lookup: Record<number, number[]> = {
    81: [0.475, 0.568, 0.904, 0.904, 0.913],
    82: [0.485, 0.568, 0.904, 0.904, 0.913],
    83: [0.596, 0.699, 0.932, 1.09, 1.109],
    84: [0.662, 0.829, 0.96, 1.09, 1.146],
    85: [0.727, 0.969, 1.165, 1.333, 1.407],
    86: [0.876, 1.081, 1.258, 1.407, 1.463],
    87: [0.932, 1.146, 1.407, 1.631, 1.733],
    88: [1.062, 1.305, 1.463, 1.631, 1.752],
    89: [1.295, 1.621, 1.948, 2.218, 2.395],
    90: [1.463, 1.873, 2.18, 2.367, 2.516],
    91: [2.013, 2.618, 3.513, 3.783, 3.82],
    92: [2.013, 2.674, 3.569, 3.867, 3.932],
    93: [2.33, 3.028, 3.802, 4.081, 4.156],
    94: [2.376, 3.028, 3.802, 4.286, 4.324],
    95: [2.609, 3.345, 3.998, 4.613, 4.603],
  }

  const premium = lookup[Math.ceil(lvr)][bucketIndex]

  return purchasePrice * (premium / 100)
}

export function cashOnHandRequired(deposit: number, fees: number, taxOrTransferDuty: number, lmi: number) {
  // console.log(deposit, fees, taxOrTransferDuty, lmi, deposit + fees + taxOrTransferDuty + lmi)

  return deposit + fees + taxOrTransferDuty + lmi
}

export function calcMonthlyRepayment(purchasePrice: number) {
  const r = 0.06 / 12
  const numMonths = 12 * 30
  const P = purchasePrice

  return (r * P) / (1 - Math.pow(1 + r, -numMonths))
  // return purchasePrice / (Math.pow(1 + , 30 * 12) - 1) / ((0.06 / 12) * Math.pow(1 + 0.06 / 12, 30 * 12))
}
