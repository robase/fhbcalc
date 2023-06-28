import { QuestionCircleFill, XLg } from "react-bootstrap-icons";

import DTI from "../markdown/dti.md";
import LMI from "../markdown/lmi.md";
import LVR from "../markdown/lvr.md";
import FHBG from "../markdown/fhbg.md";
import FHBAS from "../markdown/fhbas.md";
import FHOG from "../markdown/fhog.md";
import UpfrontCash from "../markdown/upfront_cash.md";
import LoanPrincipal from "../markdown/loan_principal.md";
import TransferDuty from "../markdown/transfer_duty.md";
import PurchasePrice from "../markdown/purchase_price.md";
import MonthlyRepayment from "../markdown/monthly_repayment.md";

export enum HelpText {
  PURCHASE_PRICE = "purchase-price",
  LOAN_PRINCIPAL = "loan-principal",
  LVR = "lvr",
  LMI = "lmi",
  TRANSFER_DUTY = "transfer-duty",
  UPFRONT_CASH = "upfront-cash",
  FHBAS = "FHBAS",
  FHOG = "FHOG",
  FHBG = "FHBG",
  MONTHLY_REPAYMENT = "monthly-repayment",
  DTI = "dti",
}

const helpContent: Record<HelpText, { title: string; body: JSX.Element }> = {
  [HelpText.PURCHASE_PRICE]: {
    title: "Purchase Price",
    body: <PurchasePrice />,
  },
  [HelpText.LOAN_PRINCIPAL]: {
    title: "Loan Principal",
    body: <LoanPrincipal />,
  },
  [HelpText.LVR]: {
    title: "Loan to Value Ratio (LVR)",
    body: <LVR />,
  },
  [HelpText.LMI]: {
    title: "Lender's Mortgage Insurance (LMI)",
    body: <LMI />,
  },
  [HelpText.TRANSFER_DUTY]: {
    title: "Transfer Duty",
    body: <TransferDuty />,
  },
  [HelpText.UPFRONT_CASH]: {
    title: "Upfront Cash Required",
    body: <UpfrontCash />,
  },
  [HelpText.FHBAS]: {
    title: "First Home Buyer's Assistance Scheme (FHBAS)",
    body: <FHBAS />,
  },
  [HelpText.FHOG]: {
    title: "First Home Owner's Grant (FHOG)",
    body: <FHOG />,
  },
  [HelpText.FHBG]: {
    title: "First Home Buyer's Grant (FHBG)",
    body: <FHBG />,
  },
  [HelpText.MONTHLY_REPAYMENT]: {
    title: "Monthly Repayment",
    body: <MonthlyRepayment />,
  },
  [HelpText.DTI]: {
    title: "Debt to Income Ratio (DTI)",
    body: <DTI />,
  },
};

export default function AssistanceArea({
  focusedItem,
  clearFocusedItem,
}: {
  focusedItem?: { item: HelpText; x: number; y: number };
  clearFocusedItem: () => void;
}) {
  if (!focusedItem) {
    return null;
  }

  const { title, body } = helpContent[focusedItem.item];

  return (
    <div
      className={`${
        focusedItem.x > window.innerWidth / 2 - 100 ? "sm:ml-10 sm:mr-auto" : "sm:mr-10 sm:ml-auto"
      } h-min max-h-full fixed sm:mb-10  mt-auto inset-0 bg-white z-30 border-[#516472] border-t-8 shadow-xl shadow-zinc-300 px-4 pt-3 w-fit max-sm:w-full max-sm:rounded-none text-zinc-700 max-w-xl`}
    >
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row gap-2 items-center mb-1">
          <QuestionCircleFill />
          <h3 className="font-spartan font-bold py-1">{title}</h3>
        </div>
        <div
          onClick={clearFocusedItem}
          className="mb-1 hover:bg-zinc-300 group hover:text-zinc-50 rounded-full cursor-pointer border p-1 border-zinc-400 hover:border-zinc-800"
        >
          <XLg size="1em" className="group-hover:text-zinc-900" />
        </div>
      </div>
      <div className="text-sm max-h-[80vh] overflow-y-auto pb-4 mb-4 prose">{body}</div>
    </div>
  );
}
