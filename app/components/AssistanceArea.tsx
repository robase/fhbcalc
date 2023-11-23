import { QuestionCircle, XLg } from "react-bootstrap-icons";

import DTI from "../markdown/dti.md";
import LMI from "../markdown/lmi.md";
import LVR from "../markdown/lvr.md";

import DutyNSW from "../markdown/dutyConcession/nsw.md";
import DutyVIC from "../markdown/dutyConcession/vic.md";
import DutyQLD from "../markdown/dutyConcession/qld.md";

import FHBGNsw from "../markdown/fhbg/nsw.md";
import FHBGVic from "../markdown/fhbg/vic.md";
import FHBGQld from "../markdown/fhbg/qld.md";

import FHOGNsw from "../markdown/fhog/nsw.md";
import FHOGVic from "../markdown/fhog/vic.md";
import FHOGQld from "../markdown/fhog/qld.md";

import TransferDutyNsw from "../markdown/transferDuty/nsw.md";
import TransferDutyVic from "../markdown/transferDuty/vic.md";
import TransferDutyQld from "../markdown/transferDuty/qld.md";

import UpfrontCash from "../markdown/upfront_cash.md";
import LoanPrincipal from "../markdown/loan_principal.md";
import PurchasePrice from "../markdown/purchase_price.md";
import MonthlyRepayment from "../markdown/monthly_repayment.md";
import type { State } from "~/services/defaults";

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

// There must be a better way
// MDX doesn't seem to support conditional rendering
// nunjucks templates seem to break remix
// maybe its easiest to have a doc for each state?
function selectContent(state: State, item: HelpText): { title: string; element?: JSX.Element } {
  switch (item) {
    case HelpText.PURCHASE_PRICE:
      return {
        title: "Purchase Price",
        element: <PurchasePrice />,
      };
    case HelpText.LOAN_PRINCIPAL:
      return {
        title: "Loan Principal",
        element: <LoanPrincipal />,
      };
    case HelpText.LVR:
      return {
        title: "Loan to Value Ratio (LVR)",
        element: <LVR />,
      };
    case HelpText.LMI:
      return {
        title: "Lender's Mortgage Insurance (LMI)",
        element: <LMI />,
      };
    case HelpText.TRANSFER_DUTY:
      return {
        title: "Transfer Duty",
        element: { NSW: <TransferDutyNsw />, VIC: <TransferDutyVic />, QLD: <TransferDutyQld /> }[state as string],
      };
    case HelpText.UPFRONT_CASH:
      return {
        title: "Upfront Cash Required",
        element: <UpfrontCash />,
      };
    case HelpText.FHBAS:
      return {
        title: state === "NSW" ? "First Home Buyer's Assistance Scheme (FHBAS)" : "First Home Buyer Duty Concession",
        element: { NSW: <DutyNSW />, VIC: <DutyVIC />, QLD: <DutyQLD /> }[state as string],
      };
    case HelpText.FHOG:
      return {
        title: "First Home Owner's Grant (FHOG)",
        element: { NSW: <FHOGNsw />, VIC: <FHOGVic />, QLD: <FHOGQld /> }[state as string],
      };
    case HelpText.FHBG:
      return {
        title: "First Home Buyer's Grant (FHBG)",
        element: { NSW: <FHBGNsw />, VIC: <FHBGVic />, QLD: <FHBGQld /> }[state as string],
      };
    case HelpText.MONTHLY_REPAYMENT:
      return {
        title: "Monthly Repayment",
        element: <MonthlyRepayment />,
      };
    case HelpText.DTI:
      return {
        title: "Debt to Income Ratio (DTI)",
        element: <DTI />,
      };
    default:
      return {
        title: "Woops",
        element: <p>Failed to load help information</p>,
      };
  }
}

export default function AssistanceArea({
  state,
  focusedItem,
  clearFocusedItem,
}: {
  state: State;
  focusedItem?: { item: HelpText; x: number; y: number };
  clearFocusedItem: () => void;
}) {
  if (!focusedItem) {
    return null;
  }

  const { title, element } = selectContent(state, focusedItem.item);

  return (
    <div
      className={`${
        focusedItem.x > window.innerWidth / 2 - 100 ? "sm:ml-10 sm:mr-auto" : "sm:mr-10 sm:ml-auto"
      } h-min max-h-full fixed sm:mb-10  mt-auto inset-0 bg-white z-30 border-[#516472] border-t-8 shadow-xl shadow-zinc-300 px-4 pt-3 w-fit max-sm:w-full max-sm:rounded-none text-zinc-700 max-w-xl`}
    >
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row gap-3 items-center mb-1">
          <QuestionCircle className="h-6 w-6 mb-2 mt-1" />
          <h3 className="font-spartan font-bold py-1">{title}</h3>
        </div>
        <div
          onClick={clearFocusedItem}
          className="mb-1 hover:bg-zinc-300 group hover:text-zinc-50 rounded-full cursor-pointer border p-1 border-zinc-400 hover:border-zinc-800"
        >
          <XLg size="1em" className="group-hover:text-zinc-900" />
        </div>
      </div>
      <div className="text-sm max-h-[80vh] overflow-y-auto mb-4 prose prose-neutral prose-pre:bg-[#f6f8fa] prose-code:text-neutral-800">
        {element}
      </div>
    </div>
  );
}
