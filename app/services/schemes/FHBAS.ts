import type { EligibilityResult } from "../calculators/loan";
import type { FormResponse, State } from "../defaults";

export const dutyConcessionConfig: Record<State, any> = {
  NSW: {
    // https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme
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
  QLD: {
    existing: {
      max: 550_000,
      concessional: 505_000,
      text: "existing homes",
    },
    "vacant-land": {
      max: 400_000,
      concessional: 250_000,
      text: "vacant land",
    },
  },
  ACT: {},
  NT: {},
  SA: {},
  WA: {},
};

export function qualifiesForDutyConcession(
  purchasePrice: number,
  { propertyType, state }: FormResponse
): EligibilityResult {
  const result: EligibilityResult = {
    scheme: "FHBAS",
    reason: "",
    eligible: false,
  };

  if (!dutyConcessionConfig[state][propertyType]) {
    return {
      ...result,
      reason: `Not available for ${propertyType.replace("-", " ")} purchases in ${state}`,
    };
  }

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
