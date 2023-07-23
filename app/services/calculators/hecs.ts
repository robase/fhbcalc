// https://www.ato.gov.au/Rates/HELP,-TSL-and-SFSS-repayment-thresholds-and-rates/
const hecsIncomeRateThresholds: { [key: number]: number } = {
  51550: 0.0,
  59518: 0.01,
  63089: 0.02,
  66875: 0.025,
  70888: 0.03,
  75140: 0.035,
  79649: 0.04,
  84429: 0.045,
  89494: 0.05,
  94865: 0.055,
  100557: 0.06,
  106590: 0.065,
  112985: 0.07,
  119764: 0.075,
  126950: 0.08,
  134568: 0.085,
  142642: 0.09,
  151200: 0.095,
  Infinity: 0.1,
};

export function calcHecsYearlyRepayment(income: number, hecs: number): number {
  const thresholds = Object.keys(hecsIncomeRateThresholds).map(Number);
  const rates = Object.values(hecsIncomeRateThresholds);

  let rate = rates[0];

  for (let i = 0; i < thresholds.length; i++) {
    if (income < thresholds[i]) {
      rate = rates[i];
      break;
    }
  }

  // Calculate the yearly repayment based on the income and rate
  const yearlyRepayment = income * rate;

  // Ensure repayment does not exceed the outstanding debt
  return Math.min(yearlyRepayment, hecs);
}

export function calcHecsMonthlyRepayment(income: number, hecs: number) {
  return calcHecsYearlyRepayment(income, hecs) / 12;
}
