import type { EligibilityResult } from "../calculators";
import type { FormResponse, State } from "../defaults";

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
export function qualifiesForFHBAS(
  propertyType: FormResponse["propertyType"],
  purchasePrice: number,
  state: State
): EligibilityResult {
  // TODO: add warning state to EligibilityResult
  //   if (purpose === "investor") {
  //     return {
  //       eligible: false,
  //       type: "amber",
  //       reason: "you must live in the property for at least 6 continuous months, you must move in within 12 months",
  //     }
  //   }

  if (purchasePrice >= FHBASconfig.propertyType[propertyType].max) {
    return {
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
    return { eligible: true, type: "concessional" };
  }

  return { eligible: true, type: "full" };
}
