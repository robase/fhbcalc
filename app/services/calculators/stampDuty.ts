import type { EligibilityResult } from "./loan";
import { FormResponse, State } from "../defaults";

type RateBand = { min: number; max: number; calc: (purchasePrice: number) => number };
type ConcessionBand = { min: number; max: number; concession: number };

const calcDuty = (offset: number, rate: number, additional: number) => (purchasePrice: number) =>
  ((purchasePrice - offset) / 100) * rate + additional;

const config: Record<
  State,
  { default: RateBand[]; concession: RateBand[]; existing?: ConcessionBand[]; "vacant-land"?: ConcessionBand[] }
> = {
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
    concession: [],
  },
  VIC: {
    // General rates: https://www.sro.vic.gov.au/non-principal-place-residence-dutiable-property-current-rates
    default: [
      { min: 0, max: 25_000, calc: calcDuty(0, 1.4, 0) },
      { min: 25_000, max: 130_000, calc: calcDuty(25_000, 2.4, 350) },
      { min: 130_000, max: 960_000, calc: calcDuty(130_000, 6, 2_870) },
      { min: 960_000, max: 2_000_000, calc: calcDuty(0, 5.5, 0) },
      { min: 2_000_000, max: Infinity, calc: calcDuty(2_000_000, 6.5, 110_000) },
    ],
    // PPOR rates: https://www.sro.vic.gov.au/pprdutyconcession
    concession: [
      // general rate applies < $130k
      { min: 0, max: 25_000, calc: calcDuty(0, 1.4, 0) },
      { min: 25_000, max: 130_000, calc: calcDuty(25_000, 2.4, 350) },
      // PPOR rates:
      { min: 130_000, max: 440_000, calc: calcDuty(130_000, 5, 2_870) },
      { min: 440_000, max: 550_000, calc: calcDuty(440_000, 6, 18_370) },
      // general rate applies > $550k
      { min: 130_000, max: 960_000, calc: calcDuty(130_000, 6, 2_870) },
      { min: 960_000, max: 2_000_000, calc: calcDuty(0, 5.5, 0) },
      { min: 2_000_000, max: Infinity, calc: calcDuty(2_000_000, 6.5, 110_000) },
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
    // QLD has default transfer duty rates (applies to sales or more than homes)
    // https://qro.qld.gov.au/duties/transfer-duty/calculate/rates/
    default: [
      { min: 0, max: 5_000, calc: calcDuty(0, 0, 0) },
      { min: 5_001, max: 75_000, calc: calcDuty(5_000, 1.5, 0) },
      { min: 75_001, max: 540_000, calc: calcDuty(75_000, 3.5, 1_050) },
      { min: 540_001, max: 1_000_000, calc: calcDuty(540_000, 4.5, 17_325) },
      { min: 1_000_001, max: Infinity, calc: calcDuty(1_000_000, 5.75, 38_025) },
    ],
    // QLD has a concession for home purchases (this isn't the FHB concession though)
    // The home concession rate discounts duty for homes valued at less than $350,000.
    // https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/
    concession: [
      { min: 0, max: 350_000, calc: calcDuty(0, 1.0, 0) },
      { min: 350_001, max: 540_000, calc: calcDuty(350_000, 3.5, 3_500) },
      { min: 540_001, max: 1_000_000, calc: calcDuty(540_000, 4.5, 10_150) },
      { min: 1_000_001, max: Infinity, calc: calcDuty(1_000_000, 5.75, 30_850) },
    ],
    // https://qro.qld.gov.au/duties/transfer-duty/calculate/concession-rates/
    // Duty is calculated at the home concession rate minus the additional concession amount below.
    existing: [
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
    ],
    "vacant-land": [
      // { min: 0, max: 250_000, concession: Infinity },
      { min: 250_000, max: 259_999.99, concession: 7_175 },
      { min: 260_000, max: 269_999.99, concession: 6_700 },
      { min: 270_000, max: 279_999.99, concession: 6_225 },
      { min: 280_000, max: 289_999.99, concession: 5_750 },
      { min: 290_000, max: 299_999.99, concession: 5_275 },
      { min: 300_000, max: 309_999.99, concession: 4_800 },
      { min: 310_000, max: 319_999.99, concession: 4_325 },
      { min: 320_000, max: 329_999.99, concession: 3_850 },
      { min: 330_000, max: 339_999.99, concession: 3_375 },
      { min: 340_000, max: 349_999.99, concession: 2_900 },
      { min: 350_000, max: 359_999.99, concession: 2_425 },
      { min: 360_000, max: 369_999.99, concession: 1_950 },
      { min: 370_000, max: 379_999.99, concession: 1_475 },
      { min: 380_000, max: 389_999.99, concession: 1_000 },
      { min: 390_000, max: 399_999.99, concession: 525 },
      { min: 400_000, max: Infinity, concession: 0 },
    ],
  },
  ACT: { default: [], concession: [] },
  NT: { default: [], concession: [] },
  SA: { default: [], concession: [] },
};

// const calcQldFHBConcession = (purchasePrice: number): number => {
//   const applicableBand = qldConcessionBands.find((band) => purchasePrice <= band.max);
//   return applicableBand ? applicableBand.concession : 0;
// };

// linear approx based on vals pulled from NSW calc
function calcNswConcession(purchasePrice: number) {
  return Math.max(0.19863 * purchasePrice - 158895.20811, 0);
}

// quadratic approx based on vals pulled from VIC calc
function calcVicConcession(purchasePrice: number) {
  return 19_776 + -0.273035 * purchasePrice + 0.000000400125 * Math.pow(purchasePrice, 2);
}

function calcQLDFHBRate(purchasePrice: number, propertyType: FormResponse["propertyType"]) {
  let dutyBands: RateBand[] = [];

  // @ts-ignore
  const discountBands: ConcessionBand[] = config[State.QLD][propertyType];

  if (propertyType === "vacant-land") {
    dutyBands = config[State.QLD].default;
  } else {
    dutyBands = config[State.QLD].concession;
  }

  console.log(propertyType);

  const band = dutyBands.find((band) => purchasePrice <= band.max);
  const concessionBand = discountBands.find((band) => purchasePrice <= band.max);

  if (concessionBand) {
    return band!.calc(purchasePrice) - concessionBand.concession;
  }

  if (band) {
    return band.calc(purchasePrice);
  }

  // If the purchasePrice exceeds the highest band, use the last band's calculation.
  const lastBand = config[State.QLD].default[config[State.QLD].default.length - 1];
  return lastBand.calc(purchasePrice);
}

export function calcStampDuty(
  purchasePrice: number,
  state: State,
  purpose: FormResponse["purpose"],
  propertyType: FormResponse["propertyType"],
  eligibility?: EligibilityResult
) {
  if (eligibility?.eligible) {
    if (eligibility.type === "full") {
      return 0;
    }

    if (state === "NSW") return calcNswConcession(purchasePrice);
    if (state === "VIC") return calcVicConcession(purchasePrice);
    if (state === "QLD") return calcQLDFHBRate(purchasePrice, propertyType);
  }

  // VIC, QLD have general non-FHB home concessions for PPORs
  if (
    (state === "VIC" && purpose === "occupier") ||
    (state === "QLD" && purpose === "occupier" && propertyType !== "vacant-land")
  ) {
    const generalHomeConcession = config[state].concession.find((band) => purchasePrice <= band.max);
    return generalHomeConcession!.calc(purchasePrice);
  }

  const band = config[state].default.find((band) => purchasePrice <= band.max);

  if (band) {
    return band.calc(purchasePrice);
  }

  // If the purchasePrice exceeds the highest band, use the last band's calculation.
  const lastBand = config[state].default[config[state].default.length - 1];
  return lastBand.calc(purchasePrice);
}
