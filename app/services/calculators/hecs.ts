// https://www.ato.gov.au/Rates/HELP,-TSL-and-SFSS-repayment-thresholds-and-rates/
export function calcHecsYearlyRepayment(income: number, hecs: number) {
  if (income < 48361) return 0;
  if (income < 55836) return income * 0.01 > hecs ? hecs : income * 0.01;
  if (income < 59186) return income * 0.02 > hecs ? hecs : income * 0.02;
  if (income < 62738) return income * 0.025 > hecs ? hecs : income * 0.025;
  if (income < 66502) return income * 0.03 > hecs ? hecs : income * 0.03;
  if (income < 70492) return income * 0.035 > hecs ? hecs : income * 0.035;
  if (income < 74722) return income * 0.04 > hecs ? hecs : income * 0.04;
  if (income < 79206) return income * 0.045 > hecs ? hecs : income * 0.045;
  if (income < 83958) return income * 0.05 > hecs ? hecs : income * 0.05;
  if (income < 88996) return income * 0.055 > hecs ? hecs : income * 0.055;
  if (income < 94336) return income * 0.06 > hecs ? hecs : income * 0.06;
  if (income < 99996) return income * 0.065 > hecs ? hecs : income * 0.065;
  if (income < 105996) return income * 0.07 > hecs ? hecs : income * 0.07;
  if (income < 112355) return income * 0.075 > hecs ? hecs : income * 0.075;
  if (income < 119097) return income * 0.08 > hecs ? hecs : income * 0.08;
  if (income < 126243) return income * 0.085 > hecs ? hecs : income * 0.085;
  if (income < 133818) return income * 0.09 > hecs ? hecs : income * 0.09;
  if (income < 141847) return income * 0.095 > hecs ? hecs : income * 0.095;
  return income * 0.1 > hecs ? hecs : income * 0.1;
}

export function calcHecsMonthlyRepayment(income: number, hecs: number) {
  return calcHecsYearlyRepayment(income, hecs) / 12;
}
