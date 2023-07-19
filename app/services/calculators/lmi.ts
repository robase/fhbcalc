import type { EligibilityResult } from "../calculators";
import { calcLVR } from "../calculators";

// https://www.homeloanexperts.com.au/lenders-mortgage-insurance/lmi-premium-rates/
export function calcLMI(purchasePrice: number, deposit: number, FHBGEligibility?: EligibilityResult) {
  // Get LVR, lookup LVR vs purchase price in table
  // get premium % from table, multiply by loan amount

  if (FHBGEligibility?.eligible) {
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
