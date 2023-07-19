import type { EligibilityResult } from "../calculators";
import type { State } from "../defaults";

type RateBand = { min: number; max: number; calc: (purchasePrice: number) => number };

const calcDuty = (offset: number, rate: number, additional: number) => (purchasePrice: number) =>
  ((purchasePrice - offset) / 100) * rate + additional;

type QldFHBConcessionBand = { min: number; max: number; concession: number };

const qldConcessionBands: QldFHBConcessionBand[] = [
  { min: 0, max: 504_999.99, concession: 8_750 },
  { min: 505_000, max: 509_999.99, concession: 7_875 },
  { min: 510_000, max: 514_999.99, concession: 7_000 },
  { min: 515_000, max: 519_999.99, concession: 6_125 },
  { min: 520_000, max: 524_999.99, concession: 5_250 },
  { min: 525_000, max: 529_999.99, concession: 4_375 },
  { min: 530_000, max: 534_999.99, concession: 3_500 },
  { min: 535_000, max: 539_999.99, concession: 2_625 },
  { min: 540_000, max: 544_999.99, concession: 1_750 },
  { min: 545_000, max: 549_999.99, concession: 875 },
  { min: 550_000, max: Infinity, concession: 0 },
];

const config: Record<State, { default: RateBand[]; concession?: RateBand[] }> = {
  NSW: {
    // https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty#heading4
    default: [
      { min: 0, max: 16_000, calc: calcDuty(0, 1.25, 0) },
      { min: 16_000, max: 35_000, calc: calcDuty(16_000, 1.5, 200) },
      { min: 35_000, max: 93_000, calc: calcDuty(35_000, 1.75, 485) },
      { min: 93_000, max: 351_000, calc: calcDuty(93_000, 3.5, 1500) },
      { min: 351_000, max: 1_168_000, calc: calcDuty(351_000, 4.5, 10_530) },
      { min: 1_168_000, max: 3_505_000, calc: calcDuty(1_168_000, 5.5, 47_295) },
      { min: 3_505_000, max: Infinity, calc: calcDuty(3_505_000, 7.0, 175_830) },
    ],
  },
  VIC: {
    // Merged PPOR rates: https://www.sro.vic.gov.au/principal-place-residence-current-rates
    // and general rates: https://www.sro.vic.gov.au/non-principal-place-residence-dutiable-property-current-rates
    default: [
      { min: 0, max: 25_000, calc: calcDuty(0, 1.4, 0) },
      { min: 25_000, max: 130_000, calc: calcDuty(25_000, 2.4, 350) },
      { min: 130_000, max: 440_000, calc: calcDuty(130_000, 5, 2_870) },
      { min: 440_000, max: 550_000, calc: calcDuty(440_000, 6, 18_370) },
      { min: 550_000, max: 960_000, calc: calcDuty(130_000, 6, 2870) },
      { min: 960_000, max: 2_000_000, calc: calcDuty(960_000, 5.5, 0) },
      { min: 2_000_001, max: Infinity, calc: calcDuty(960_000, 6.5, 110_000) },
    ],
  },
  // https://www.wa.gov.au/organisation/department-of-finance/transfer-duty-assessment
  WA: {
    default: [
      { min: 0, max: 120_000, calc: calcDuty(0, 1.9, 0) },
      { min: 120_001, max: 150_000, calc: calcDuty(120_000, 2.85, 2280) },
      { min: 150_001, max: 360_000, calc: calcDuty(150_000, 3.8, 3135) },
      { min: 360_001, max: 725_000, calc: calcDuty(360_000, 4.75, 11_115) },
      { min: 725_001, max: Infinity, calc: calcDuty(725_000, 5.15, 28_453) },
    ],
    concession: [],
  },
  QLD: {
    // https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/
    // default is set to the 'home' concession rates for QLD
    default: [
      { min: 0, max: 350_000, calc: calcDuty(0, 1.0, 0) },
      { min: 350_001, max: 540_000, calc: calcDuty(350_000, 3.5, 3_500) },
      { min: 540_001, max: 1_000_000, calc: calcDuty(540_000, 4.5, 10_150) },
      { min: 1_000_001, max: Infinity, calc: calcDuty(1_000_000, 5.75, 30_850) },
    ],
    concession: [],
  },
  ACT: { default: [] },
  NT: { default: [] },
  SA: { default: [] },
};

const calcQldFHBConcession = (purchasePrice: number): number => {
  const applicableBand = qldConcessionBands.find((band) => purchasePrice <= band.max);
  return applicableBand ? applicableBand.concession : 0;
};

// linear approx based on vals pulled from NSW calc
function calcNswConcession(purchasePrice: number) {
  return Math.max(0.19863 * purchasePrice - 158895.20811, 0);
}

// quadratic approx based on vals pulled from VIC calc
function calcVicConcession(purchasePrice: number) {
  return 19_776 + -0.273035 * purchasePrice + 0.000000400125 * Math.pow(purchasePrice, 2);
}

export function calcStampDuty(purchasePrice: number, state: State, eligibility?: EligibilityResult) {
  if (eligibility?.eligible) {
    if (eligibility.type === "full") {
      return 0;
    }

    if (state === "NSW") {
      return calcNswConcession(purchasePrice);
    } else if (state === "VIC") {
      return calcVicConcession(purchasePrice);
    }
  }

  const band = config[state].default.find((band) => purchasePrice <= band.max);

  if (band) {
    if (state === "QLD") {
      return band.calc(purchasePrice) - calcQldFHBConcession(purchasePrice);
    }

    return band.calc(purchasePrice);
  }

  // If the purchasePrice exceeds the highest band, use the last band's calculation.
  const lastBand = config[state].default[config[state].default.length - 1];
  return lastBand.calc(purchasePrice);
}
