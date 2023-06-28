import type { EligibilityResult } from "../calculators";
import type { FormResponse } from "../defaults";

const FHBASconfig = {
  propertyBuild: {
    "new-property": {
      max: 800_000,
      concessional: 650_000,
      text: "new or off-the-plan homes",
    },
    existing: {
      max: 800_000,
      concessional: 650_000,
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
  propertyBuild: FormResponse["propertyBuild"],
  purchasePrice: number
): EligibilityResult {
  // TODO: add warning state to EligibilityResult
  //   if (purpose === "investor") {
  //     return {
  //       eligible: false,
  //       type: "amber",
  //       reason: "you must live in the property for at least 6 continuous months, you must move in within 12 months",
  //     }
  //   }

  if (purchasePrice >= FHBASconfig.propertyBuild[propertyBuild].max) {
    return {
      eligible: false,
      reason: `FHBAS: Purchase price can not exceed $${FHBASconfig.propertyBuild[
        propertyBuild
      ].max.toLocaleString()} for ${FHBASconfig.propertyBuild[propertyBuild].text}`,
    };
  }

  if (
    purchasePrice >= FHBASconfig.propertyBuild[propertyBuild].concessional &&
    purchasePrice < FHBASconfig.propertyBuild[propertyBuild].max
  ) {
    return { eligible: true, type: "concessional" };
  }

  return { eligible: true, type: "full" };
}
