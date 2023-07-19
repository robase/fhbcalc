import type { CalcSettings, FormResponse, State } from "./defaults";
import { calcStampDuty } from "./calculators/stampDuty";
import { getSchemes } from "./formSchema";
import { calcLMI } from "./calculators/lmi";
import { calcHecsMonthlyRepayment } from "./calculators/hecs";

export interface EligibilityResult {
  scheme: "FHBG" | "FHOG" | "FHBAS";
  eligible: boolean;
  type?: "full" | "concessional";
  reason?: string;
}

export interface CalculationResult {
  monthlyIncome: number;
  purchasePrice: number;
  loanPrincipal: number;
  totalInterest: number;
  monthlyRepayment: number;

  lvr: number;
  dti: number;

  lmi: number;
  transferDuty: number;
  cashOnHand: number;

  schemeResults: Partial<Record<keyof CalculationResult, EligibilityResult>>;
  state: State;
}

export function calcTableData(formData: FormResponse, calcSettings: CalcSettings): CalculationResult[] {
  const { deposit, expenses, hecs, income, state } = formData;
  const monthlyIncome = income / 12;
  const staticExpenses = expenses + calcHecsMonthlyRepayment(income, hecs);

  const maxPrice = calcMaxLoan(monthlyIncome, staticExpenses, calcSettings.interestRate);

  const loanPrincipals = new Array(15).fill(0).map((_, i) => Math.max(maxPrice - calcSettings.priceInterval * i, 0));

  const schemes = getSchemes(state);

  return loanPrincipals.map((loanPrincipal) => {
    const purchasePrice = loanPrincipal + deposit;

    const monthlyRepayment = calcMonthlyRepayment(loanPrincipal, calcSettings.interestRate as number);

    const schemeResults = schemes.reduce((acc, scheme) => {
      acc[scheme.affects] = scheme.getEligibility(purchasePrice, formData);
      return acc;
    }, {} as Record<keyof CalculationResult, EligibilityResult>);

    const lmi = calcLMI(purchasePrice, deposit, schemeResults?.lmi);
    const transferDuty = calcStampDuty(purchasePrice, state, schemeResults?.transferDuty);
    const cashOnHand = cashOnHandRequired(
      deposit,
      calcSettings.transactionFee,
      transferDuty,
      lmi,
      schemeResults?.cashOnHand
    );

    return {
      monthlyIncome,
      purchasePrice,
      loanPrincipal,
      totalInterest: monthlyRepayment * 12 * 30 - loanPrincipal,
      monthlyRepayment: monthlyRepayment,

      lvr: calcLVR(purchasePrice, deposit),
      dti: calcDTI(staticExpenses + monthlyRepayment, monthlyIncome),

      lmi,
      transferDuty,
      cashOnHand,

      schemeResults,
      state,
    };
  });
}

// Debt to income ratio
export function calcDTI(monthlyExpenses: number, monthlyIncome: number) {
  return monthlyExpenses / monthlyIncome;
}

export function calcLVR(purchasePrice: number, depositPlusLMI: number) {
  return Math.max(((purchasePrice - depositPlusLMI) / purchasePrice) * 100, 0);
}

export function cashOnHandRequired(
  deposit: number,
  fees: number,
  transferDuty: number,
  lmi: number,
  FHOGEligiblity: EligibilityResult
) {
  return deposit + fees + transferDuty + lmi - (FHOGEligiblity.eligible ? 10000 : 0);
}

export function calcPrincipalFromRepayment(m: number, rPA?: number) {
  const r = (rPA || 0) / 100 / 12;
  const n = 12 * 30;

  return Math.max((m * (1 - Math.pow(1 + r, -n))) / r, 0);
}

export function calcMonthlyRepayment(principal: number, rPA?: number) {
  const r = (rPA || 0) / 100 / 12;
  const numMonths = 12 * 30;
  const P = principal;

  return Math.max((r * P) / (1 - Math.pow(1 + r, -numMonths)), 0);
}

// Calculates the maximum loan amount (first table row) from a DTI val of 0.7
// 0.7 chosen because it would be near or would exceed the max amount a lender would lend
export function calcMaxLoan(monthlyIncome: number, staticExpenses: number, interestRate: number) {
  return (
    Math.round(calcPrincipalFromRepayment(0.7 * monthlyIncome - staticExpenses, interestRate as number) / 10000) * 10000
  );
}
