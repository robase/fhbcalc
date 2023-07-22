import type { EligibilityResult } from "../calculators/loan";
import type { FormResponse, State } from "../defaults";

export const dutyConcessionConfig: Record<State, any> = {
  NSW: {
    "new-property": {
      max: 1_000_000,
      concessional: 800_000,
      text: "new or off-the-plan homes",
    },
    existing: {
      max: 1_000_000,
      concessional: 800_000,
      text: "existing homes",
    },
    "vacant-land": {
      max: 450_000,
      concessional: 350_000,
      text: "vacant land",
    },
  },
  VIC: {
    "new-property": {
      max: 750_000,
      concessional: 600_000,
      text: "new or off-the-plan homes",
    },
    existing: {
      max: 750_000,
      concessional: 600_000,
      text: "existing homes",
    },
    "vacant-land": {
      max: 750_000,
      concessional: 600_000,
      text: "vacant land",
    },
  },
  QLD: {},
  ACT: {},
  NT: {},
  SA: {},
  WA: {},
};

// VIC FHB Your home has a dutiable value of:

// $600,000 or less to receive the first home buyer duty exemption,
// $600,001 to $750,000 to receive the first home buyer duty concession.

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme
export function qualifiesForDutyConcession(
  purchasePrice: number,
  { propertyType, state }: FormResponse
): EligibilityResult {
  const result: EligibilityResult = {
    scheme: "FHBAS",
    reason: "",
    eligible: false,
  };

  if (purchasePrice >= dutyConcessionConfig[state][propertyType].max) {
    return {
      ...result,
      eligible: false,
      reason: `Purchase price can not exceed $${dutyConcessionConfig[state][propertyType].max.toLocaleString()} for ${
        dutyConcessionConfig[state][propertyType].text
      }`,
    };
  }

  if (
    purchasePrice >= dutyConcessionConfig[state][propertyType].concessional &&
    purchasePrice < dutyConcessionConfig[state][propertyType].max
  ) {
    return { ...result, eligible: true, type: "concessional" };
  }

  return { ...result, eligible: true, type: "full" };
}
