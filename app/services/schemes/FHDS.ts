import { calcLVR, type EligibilityResult } from "../calculators/loan";
import type { FormResponse, State } from "../defaults";

type FHDSState = State | "TAS";

// Price caps as of 01 October 2025
// Note: Regional centres are:
// - NSW: Illawarra, Newcastle and Lake Macquarie
// - VIC: Geelong
// - QLD: Gold Coast and Sunshine Coast
export const FHDSconfig: {
  location: Record<FHDSState, { city: number; regional: number } | { default: number }>;
  lvr: { max: number; min: number };
} = {
  location: {
    NSW: {
      city: 1_500_000, // Sydney, Newcastle, Lake Macquarie, Illawarra
      regional: 800_000, // Rest of NSW
    },
    VIC: {
      city: 950_000, // Melbourne, Geelong
      regional: 650_000, // Rest of VIC
    },
    QLD: {
      city: 1_000_000, // Brisbane, Gold Coast, Sunshine Coast
      regional: 700_000, // Rest of QLD
    },
    WA: {
      city: 850_000, // Perth
      regional: 600_000, // Rest of WA
    },
    SA: {
      city: 900_000, // Adelaide
      regional: 500_000, // Rest of SA
    },
    TAS: {
      city: 700_000, // Hobart and regional centres
      regional: 550_000, // Rest of TAS
    },
    ACT: { default: 1_000_000 },
    NT: { default: 600_000 },
    // Note: Additional territories not yet supported in calculator:
    // - Jervis Bay Territory & Norfolk Island: $550,000
    // - Christmas Island & Cocos (Keeling) Islands: $400,000
  },
  lvr: {
    max: 95,
    min: 80,
  },
};

// Australian Government 5% Deposit Scheme
// https://firsthomebuyers.gov.au
// Effective from 01 October 2025
export function qualifiesForFHDS(
  purchasePrice: number,
  { participants, purpose, deposit, location, state }: FormResponse
): EligibilityResult {
  const result: EligibilityResult = {
    scheme: "FHDS",
    reason: "",
    eligible: false,
  };

  const locationThresholds = FHDSconfig.location[state as FHDSState];

  if (purpose === "investor") {
    return {
      ...result,
      reason: "You must be intending to be an owner-occupier of the purchased property",
    };
  }

  if ("default" in locationThresholds) {
    const threshold = locationThresholds.default;

    if (purchasePrice > threshold) {
      return {
        ...result,
        reason: `Purchase price must not exceed $${threshold.toLocaleString()} for ${state} properties.`,
      };
    }
  } else {
    const threshold = locationThresholds[location];

    if (purchasePrice > threshold) {
      const regionDescription = location === "city" ? "capital city & regional centres" : "rest of state";
      return {
        ...result,
        reason: `Purchase price must not exceed $${threshold.toLocaleString()} for ${regionDescription} in ${state}`,
      };
    }
  }

  const lvr = calcLVR(purchasePrice, deposit);

  if (lvr > FHDSconfig.lvr.max) {
    return {
      ...result,
      reason: `The minimum deposit required is ${100 - FHDSconfig.lvr.max}% of purchase price`,
    };
  }

  if (lvr < FHDSconfig.lvr.min) {
    return { ...result, reason: `Your LVR is less than ${FHDSconfig.lvr.min}%`, scheme: "FHDS" };
  }

  return { eligible: true, scheme: "FHDS" };
}
