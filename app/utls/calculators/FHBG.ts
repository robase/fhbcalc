import { calcLVR, type EligibilityResult } from "../calculators";
import type { FormResponse, State } from "../defaults";

const FHBGconfig: {
  location: Record<State, { city: number; regional: number } | { default: number }>;
  income: Record<FormResponse["participants"], number>;
  lvr: { max: number; min: number };
} = {
  location: {
    NSW: {
      city: 900_000,
      regional: 750_000,
    },
    VIC: {
      city: 800_000,
      regional: 650_000,
    },
    QLD: {
      city: 700_000,
      regional: 550_000,
    },
    WA: {
      city: 600_000,
      regional: 450_000,
    },
    SA: {
      city: 600_000,
      regional: 450_000,
    },
    ACT: { default: 750_000 },
    NT: { default: 600_000 },
  },
  income: {
    couple: 200_000,
    single: 125_000,
  },
  lvr: {
    max: 95,
    min: 80,
  },
};

// https://www.nhfic.gov.au/support-buy-home/property-price-caps
// https://www.nhfic.gov.au/support-buy-home/first-home-guarantee#eligibility-and-how-to-apply
export function qualifiesForFHBG(
  {
    participants,
    income,
    purpose,
    deposit,
    location,
    state,
  }: Pick<FormResponse, "participants" | "income" | "purpose" | "deposit" | "location" | "state">,
  purchasePrice: number
): EligibilityResult {
  const locationThresholds = FHBGconfig.location[state as State];

  if (purpose === "investor") {
    return { eligible: false, reason: "FHBG: You must be intending to be an owner-occupier of the purchased property" };
  }

  if ("default" in locationThresholds) {
    const threshold = locationThresholds.default;

    if (purchasePrice > threshold) {
      return {
        eligible: false,
        reason: `FHBG: Purchase price must not exceed $${threshold.toLocaleString()} for ${state} properties.`,
      };
    }
  } else {
    const threshold = locationThresholds[location];

    if (purchasePrice > threshold) {
      const regionDescription = location === "city" ? `properties in ${state}` : `properties outside ${state}`;
      return {
        eligible: false,
        reason: `FHBG: Purchase price must not exceed $${threshold.toLocaleString()} for ${regionDescription}`,
      };
    }
  }

  const lvr = calcLVR(purchasePrice, deposit);

  if (lvr > FHBGconfig.lvr.max) {
    return {
      eligible: false,
      reason: `FHBG: The minimum deposit required is ${100 - FHBGconfig.lvr.max}% of purchase price`,
    };
  }

  if (lvr < FHBGconfig.lvr.min) {
    return { eligible: false, reason: `FHBG: Your LVR is less than ${FHBGconfig.lvr.min}%` };
  }

  const incomeThreshold = FHBGconfig.income[participants];

  if (income > incomeThreshold) {
    return {
      eligible: false,
      reason: `FHBG: Your income is over the $${incomeThreshold.toLocaleString()} threshold for ${
        participants === "couple" ? "couples" : "individuals"
      }`,
    };
  }

  return { eligible: true };
}
