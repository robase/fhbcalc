import type { EligibilityResult } from "../calculators";
import type { FormResponse, State } from "../defaults";

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
  propertyType: FormResponse["propertyType"],
  purchasePrice: number,
  state: State
): EligibilityResult {
  if (propertyType === "existing") {
    return {
      eligible: false,
      reason: "FHOG: Only available for newly built, off the plan or substantially renovated properties",
    };
  }

  if (purchasePrice > FHOGconfig[propertyType].max) {
    return {
      eligible: false,
      reason: `FHOG: Property value must not exceed $${FHOGconfig[propertyType].max.toLocaleString()}.`,
    };
  }

  return { eligible: true };
}
