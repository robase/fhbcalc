import type { CalcData } from "./defaults"

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
      reason: "only available for newly built, purchased off the plan or substantially renovated",
    }
  }

  if (propertyBuild === "vacant-land" && purchasePrice > 750_000) {
    return {
      eligible: false,
      reason:
        "Property value (house and land) must not exceed $750,000. Applies to Owner builders and Comprehensive home building contracts",
    }
  }

  if (propertyBuild === "new-property" && purchasePrice > 600_000) {
    return {
      eligible: false,
      reason: "The purchase price must not exceed $600,000",
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
  //       reason: "you must live in the porperty for at least 6 continuous months, you must move in within 12 months",
  //     }
  //   }
  if (propertyBuild === "new-property" || propertyBuild === "existing") {
    if (purchasePrice >= 800_000) {
      return { eligible: false, reason: "purchase price can not exceed $800,000 for new or existing home purchases" }
    }
    if (purchasePrice >= 650_000 && purchasePrice < 800_000) {
      return { eligible: true, type: "concessional" }
    }
  }

  if (propertyBuild === "vacant-land") {
    if (purchasePrice >= 450_000) {
      return { eligible: false, reason: "purchase price can not exceed $450,000 for vacant land purchases" }
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
    return { eligible: false, reason: "new or existing home purchases must not exceed $1.5m" }
  }

  if (propertyBuild === "vacant-land" && purchasePrice > 800_000) {
    return { eligible: false, reason: "vacant land purchases must not exceed $800,000" }
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
    return { eligible: false, reason: "you must be intending to be an owner-occupier of the purchased property" }
  }

  if (location === "city") {
    if (state === "NSW" && purchasePrice > 900_000) {
      return {
        eligible: false,
        reason:
          "purchase price must not exceed $900,000 for properties in Sydney, Newcastle, Lake Macquarie or Illawarra",
      }
    }
  }

  if (location === "regional") {
    if (state === "NSW" && purchasePrice > 750_000) {
      return {
        eligible: false,
        reason:
          "purchase price must not exceed $750,000 for properties not in Sydney, Newcastle, Lake Macquarie or Illawarra",
      }
    }
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
    if (income > 200_000) {
      return { eligible: false, reason: "your income is over the 200k threshold for couples" }
    }
  } else {
    if (income > 125_000) {
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
  if (purchaseCost <= 650_000) {
    return 0
  } else if (purchaseCost > 650_000 && purchaseCost <= 1_089_000) {
    return purchaseCost / 450 + 9805
  } else if (purchaseCost > 1_089_000 && purchaseCost <= 3_000_000) {
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

// https://www.homeloanexperts.com.au/lenders-mortgage-insurance/lmi-premium-rates/
function calcLMI() {
  // Get LVR, lookup LVR vs purchase price in table
  // get premium % from table, multiply by loan amount
}
