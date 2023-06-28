import type { EligibilityResult } from "../calculators";
import type { FormResponse } from "../defaults";

const FHOGconfig = {
  "new-property": {
    max: 600_000,
  },
  "vacant-land": {
    max: 750_000,
  },
  existing: {
    max: 0,
  },
};

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes
export function qualifiesForFHOG(
  propertyBuild: FormResponse["propertyBuild"],
  purchasePrice: number
): EligibilityResult {
  if (propertyBuild === "existing") {
    return {
      eligible: false,
      reason: "FHOG: Only available for newly built, off the plan or substantially renovated properties",
    };
  }

  if (purchasePrice > FHOGconfig[propertyBuild].max) {
    return {
      eligible: false,
      reason: `FHOG: Property value must not exceed $${FHOGconfig[propertyBuild].max.toLocaleString()}.`,
    };
  }

  return { eligible: true };
}
