import type { EligibilityResult } from "../calculators/loan";
import type { FormResponse } from "../defaults";
import { State } from "../defaults";

const FHOGconfig: Record<State, any> = {
  NSW: {
    // https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes
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
  [State.QLD]: {
    // https://qro.qld.gov.au/property-concessions-grants/first-home-grant/eligibility/
    "new-property": {
      max: 750000,
    },
    "vacant-land": {
      max: 750000,
    },
  },
  [State.SA]: undefined,
  [State.WA]: undefined,
};

export function qualifiesForFHOG(
  purchasePrice: number,
  { propertyType, state, purpose }: FormResponse
): EligibilityResult {
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

  if (purpose === "investor" && state === State.QLD) {
    return {
      ...result,
      reason: "Not available to purchase investment properties in QLD",
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
