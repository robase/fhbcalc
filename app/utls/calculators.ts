import type { FormResponse } from "./defaults";

export interface EligibilityResult {
  eligible: boolean;
  type?: string;
  reason?: string;
}

// 1 July 2023 FHBC removed
// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice#heading3

// https://www.nhfic.gov.au/support-buy-home/property-price-caps
// https://www.nhfic.gov.au/support-buy-home/first-home-guarantee#eligibility-and-how-to-apply

export enum State {
  NSW = "NSW",
  VIC = "VIC",
  QLD = "QLD",
  WA = "WA",
  ACT = "ACT",
  NT = "NT",
}

export function calcFHBASConcession(purchasePrice: number) {
  return Math.max(0.20727 * purchasePrice - 134723.33391, 0);
}

// https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty#heading4
export function calcTransferDuty(purchasePrice: number, { eligible, type }: EligibilityResult) {
  if (eligible) {
    if (type === "full") {
      return 0;
    }

    return calcFHBASConcession(purchasePrice);
  }

  if (purchasePrice <= 15_000) return (purchasePrice / 100) * 1.25;
  if (purchasePrice <= 32_000) return ((purchasePrice - 15_000) / 100) * 1.5 + 187;
  if (purchasePrice <= 87_000) return ((purchasePrice - 32_000) / 100) * 1.75 + 442;
  if (purchasePrice <= 327_000) return ((purchasePrice - 87_000) / 100) * 3.5 + 1405;
  if (purchasePrice <= 1_089_000) return ((purchasePrice - 327_000) / 100) * 4.5 + 9805;
  if (purchasePrice <= 3_268_000) return ((purchasePrice - 1_089_000) / 100) * 5.5 + 44_095;

  return ((purchasePrice - 3_268_000) / 100) * 7.0 + 163_940;
}

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice#heading10
export function calcPropertyTax(landValue: number, purpose: FormResponse["purpose"]) {
  const base = purpose === "occupier" ? 400 : 1500;
  const rate = purpose === "occupier" ? 0.003 : 0.011;
  return base + rate * landValue;
}

// Debt to income ratio
export function calcDTI(monthlyExpenses: number, monthlyIncome: number) {
  return monthlyExpenses / monthlyIncome;
}

export function calcLVR(purchasePrice: number, depositPlusLMI: number) {
  return Math.max(((purchasePrice - depositPlusLMI) / purchasePrice) * 100, 0);
}

// https://www.homeloanexperts.com.au/lenders-mortgage-insurance/lmi-premium-rates/
export function calcLMI(purchasePrice: number, deposit: number, FHBGEligibility: EligibilityResult) {
  // Get LVR, lookup LVR vs purchase price in table
  // get premium % from table, multiply by loan amount

  if (FHBGEligibility.eligible) {
    return 0;
  }
  const lvr = Math.ceil(calcLVR(purchasePrice, deposit));

  if (lvr < 81) {
    return 0;
  }

  if (lvr > 95) {
    // FIXME: don't have lookup table available for LVR > 95
    return -1;
  }

  const priceBuckets = [300000, 500000, 600000, 750000, 1000000];

  const bucketIndex = priceBuckets.findIndex((bucket) => purchasePrice <= bucket);

  if (bucketIndex === -1) {
    // FIXME: don't have lookup table available for price > 1000000
    return -1;
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
  };

  const premium = lookup[lvr][bucketIndex];

  return purchasePrice * (premium / 100);
}

export function cashOnHandRequired(
  deposit: number,
  fees: number,
  taxOrTransferDuty: number,
  lmi: number,
  FHOGeligible: boolean
) {
  return deposit + fees + taxOrTransferDuty + lmi - (FHOGeligible ? 10000 : 0);
}

export function calcPrincipalFromRepayment(m: number, rPA?: number) {
  const r = (rPA || 0) / 100 / 12;
  const n = 12 * 30;

  return Math.max((m * (1 - Math.pow(1 + r, -n))) / r, 0);
}

export function calcMonthlyRepayment(principal: number, rPA?: number) {
  const r = (rPA || 0) / 100 / 12;
  const numMonths = 12 * 30;
  const P = principal;

  return Math.max((r * P) / (1 - Math.pow(1 + r, -numMonths)), 0);
}

// https://www.ato.gov.au/Rates/HELP,-TSL-and-SFSS-repayment-thresholds-and-rates/
function calcHecsYearlyRepayment(income: number, hecs: number) {
  if (income < 48361) return 0;
  if (income < 55836) return income * 0.01 > hecs ? hecs : income * 0.01;
  if (income < 59186) return income * 0.02 > hecs ? hecs : income * 0.02;
  if (income < 62738) return income * 0.025 > hecs ? hecs : income * 0.025;
  if (income < 66502) return income * 0.03 > hecs ? hecs : income * 0.03;
  if (income < 70492) return income * 0.035 > hecs ? hecs : income * 0.035;
  if (income < 74722) return income * 0.04 > hecs ? hecs : income * 0.04;
  if (income < 79206) return income * 0.045 > hecs ? hecs : income * 0.045;
  if (income < 83958) return income * 0.05 > hecs ? hecs : income * 0.05;
  if (income < 88996) return income * 0.055 > hecs ? hecs : income * 0.055;
  if (income < 94336) return income * 0.06 > hecs ? hecs : income * 0.06;
  if (income < 99996) return income * 0.065 > hecs ? hecs : income * 0.065;
  if (income < 105996) return income * 0.07 > hecs ? hecs : income * 0.07;
  if (income < 112355) return income * 0.075 > hecs ? hecs : income * 0.075;
  if (income < 119097) return income * 0.08 > hecs ? hecs : income * 0.08;
  if (income < 126243) return income * 0.085 > hecs ? hecs : income * 0.085;
  if (income < 133818) return income * 0.09 > hecs ? hecs : income * 0.09;
  if (income < 141847) return income * 0.095 > hecs ? hecs : income * 0.095;
  return income * 0.1 > hecs ? hecs : income * 0.1;
}

export function calcHecsMonthlyRepayment(income: number, hecs: number) {
  return calcHecsYearlyRepayment(income, hecs) / 12;
}

export function calcMaxLoan(monthlyIncome: number, staticExpenses: number, interestRate: number) {
  return (
    Math.round(calcPrincipalFromRepayment(0.7 * monthlyIncome - staticExpenses, interestRate as number) / 10000) * 10000
  );
}

export function calcMonthlyIncome(income: number) {
  return income / 12;
}
