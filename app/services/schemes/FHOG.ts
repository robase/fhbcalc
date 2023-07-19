import type { EligibilityResult } from "../calculators";
import type { FormResponse } from "../defaults";
import { State } from "../defaults";

const FHOGconfig: Record<State, any> = {
  NSW: {
    "new-property": {
      max: 600000,
    },
    "vacant-land": {
      max: 750000,
    },
  },
  VIC: {
    "new-property": {
      max: 750000,
    },
    "vacant-land": {
      max: 750000,
    },
  },
  [State.ACT]: undefined,
  [State.NT]: undefined,
  [State.QLD]: undefined,
  [State.SA]: undefined,
  [State.WA]: undefined,
};

// https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes
export function qualifiesForFHOG(purchasePrice: number, { propertyType, state }: FormResponse): EligibilityResult {
  const result: EligibilityResult = {
    scheme: "FHOG",
    reason: "",
    eligible: false,
  };

  if (propertyType === "existing") {
    return {
      ...result,
      reason: "Only available for new properties",
    };
  }

  if (purchasePrice > FHOGconfig[state][propertyType].max) {
    return {
      ...result,
      reason: `Property value must not exceed $${FHOGconfig[state][propertyType].max.toLocaleString()}.`,
    };
  }

  return { eligible: true, scheme: "FHOG" };
}
