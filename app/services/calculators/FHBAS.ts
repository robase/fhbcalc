import type { EligibilityResult } from "../calculators";
import type { FormResponse } from "../defaults";

const FHBASconfig = {
  propertyType: {
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
};

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme
export function qualifiesForFHBAS(purchasePrice: number, { propertyType }: FormResponse): EligibilityResult {
  const result: EligibilityResult = {
    scheme: "FHBAS",
    reason: "",
    eligible: false,
  };

  if (purchasePrice >= FHBASconfig.propertyType[propertyType].max) {
    return {
      ...result,
      eligible: false,
      reason: `FHBAS: Purchase price can not exceed $${FHBASconfig.propertyType[
        propertyType
      ].max.toLocaleString()} for ${FHBASconfig.propertyType[propertyType].text}`,
    };
  }

  if (
    purchasePrice >= FHBASconfig.propertyType[propertyType].concessional &&
    purchasePrice < FHBASconfig.propertyType[propertyType].max
  ) {
    return { ...result, eligible: true, type: "concessional" };
  }

  return { ...result, eligible: true, type: "full" };
}
