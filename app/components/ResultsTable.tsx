import Pill from "./Pill";
import { HelpText } from "./AssistanceArea";
import type { CalcSettings } from "~/services/defaults";
import { fmtAUD } from "~/services/formatters";
import type { CalculationResult } from "~/services/calculators/loan";

export default function ResultsTable({
  data,
  settings,
  onItemHover,
}: {
  data: CalculationResult[];
  settings: CalcSettings;
  onItemHover: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>, focusedItem: HelpText) => void;
}) {
  return (
    <div className="text-sm">
      <div className="overflow-x-auto w-full xl:px-6 bg-gradient-to-b from-[#ebf0f3c7] to-[#f6f8fa]">
        <table className="w-full overflow-visible text-left">
          <thead className="text-[#24282b] uppercase  text-base font-medium font-spartan">
            <tr className="uppercase [&>th]:select-none [&>th]:pb-3 [&>th]:pt-4 border-b-0 [&>th]:font-medium">
              <th
                className="px-3 cursor-pointer hover:text-zinc-400"
                onClick={(e) => onItemHover(e, HelpText.PURCHASE_PRICE)}
              >
                Purchase Price
              </th>
              <th
                className="px-3 cursor-pointer hover:text-zinc-400"
                onClick={(e) => onItemHover(e, HelpText.LOAN_PRINCIPAL)}
              >
                Loan Amount
                <div className="flex flex-row text-[14px] normal-case tracking-normal font-normal text-zinc-500 whitespace-nowrap gap-2">
                  <span>Principal</span>
                  <span>+</span>
                  <span>Interest</span>
                  <span>=</span>
                  <span>Total</span>
                </div>
              </th>
              <th
                className="pl-3 pr-5 cursor-pointer hover:text-zinc-400"
                onClick={(e) => onItemHover(e, HelpText.DTI)}
              >
                DTI
              </th>
              <th className="px-3 cursor-pointer hover:text-zinc-400" onClick={(e) => onItemHover(e, HelpText.LVR)}>
                LVR
              </th>
              <th className="px-3 cursor-pointer hover:text-zinc-400" onClick={(e) => onItemHover(e, HelpText.LMI)}>
                LMI*
              </th>
              <th
                className="px-3 cursor-pointer hover:text-zinc-400"
                onClick={(e) => onItemHover(e, HelpText.TRANSFER_DUTY)}
              >
                Transfer Duty
              </th>
              <th
                className="px-3 cursor-pointer hover:text-zinc-400"
                onClick={(e) => onItemHover(e, HelpText.UPFRONT_CASH)}
              >
                Upfront Cash
              </th>
              <th
                className="px-3 cursor-pointer hover:text-zinc-400"
                onClick={(e) => onItemHover(e, HelpText.MONTHLY_REPAYMENT)}
              >
                Monthly Repayment
                <p className="py-1 text-xs font-normal tracking-normal normal-case text-zinc-500 whitespace-nowrap">
                  {settings.loanPeriod} years @ {((settings.interestRate || 0) as number).toFixed(2)}% p.a.
                </p>
              </th>
              <th className="px-3 select-none">Scheme Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={`${row.purchasePrice}-${i}`}
                className="bg-white border-t border-b font-roboto hover:bg-zinc-50 last:border-b-0 first:border-t-0"
              >
                <td className="px-3 py-2">{fmtAUD(row.purchasePrice)}</td>
                <td className="pl-3 pr-5 ">
                  <div className="flex flex-row">
                    <div>
                      <span>{fmtAUD(row.loanPrincipal)}</span>
                    </div>
                    <div>
                      <span className="px-2 text-zinc-400">+</span>
                    </div>
                    <div>
                      <span>{fmtAUD(row.totalInterest)}</span>
                    </div>
                    <div>
                      <span className="px-2 text-zinc-400">=</span>
                    </div>
                    <div>
                      <span>{fmtAUD(row.loanPrincipal + row.totalInterest)}</span>
                    </div>
                  </div>
                </td>
                <td className={`${row.dti > 0.55 ? "text-red-600" : row.dti > 0.5 && "text-yellow-600"} px-3 py-2`}>
                  {row.dti.toFixed(2)}
                </td>
                <td className="px-3 py-2">{row.lvr.toFixed(2)}%</td>
                <td className="px-3 py-2">
                  {row.lmi === -1 ? "No data" : fmtAUD(row.lmi)}{" "}
                  {row.schemeResults.lmi?.eligible && <span className="text-[10px] text-zinc-400">FHBG</span>}
                </td>
                <td className="px-3 py-2">
                  {row.schemeResults.transferDuty?.type === "full" ? (
                    <p>
                      <span>{fmtAUD(row.transferDuty)}</span>{" "}
                      <span className={"text-[10px] text-zinc-400"}>exempt</span>
                    </p>
                  ) : (
                    <div className="flex flex-row items-baseline gap-2">
                      {fmtAUD(row.transferDuty)}
                      {row.schemeResults.transferDuty?.type === "concessional" && (
                        <span className="text-[10px] text-zinc-400">concession</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      {fmtAUD(row.cashOnHand)} {row.lmi === -1 && "+ LMI"}
                    </span>
                    {row.schemeResults.cashOnHand?.eligible && (
                      <span className="text-[10px] text-zinc-400 leading-3">inc. FHOG</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-row gap-2">
                    <span>{fmtAUD(row.monthlyRepayment)}</span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-row items-center gap-2 px-4 py-3">
                    {Object.values(row.schemeResults).map((eligibility, j) =>
                      eligibility.type ? (
                        <Pill
                          key={`${eligibility.scheme}-${i}-${j}}`}
                          onClick={(e) => onItemHover(e, HelpText[eligibility.scheme])}
                          status={eligibility.eligible ? (eligibility.type === "full" ? "G" : "A") : "R"}
                          text={eligibility.scheme === "FHBAS" && data[0].state !== "NSW" ? "DUTY" : eligibility.scheme}
                          reason={
                            eligibility?.eligible
                              ? eligibility.type === "full"
                                ? "Full exemption"
                                : "Concessional discount"
                              : eligibility?.reason
                          }
                        />
                      ) : (
                        <Pill
                          key={`${eligibility.scheme}-${i}-${j}}`}
                          onClick={(e) => onItemHover(e, HelpText[eligibility.scheme])}
                          status={eligibility?.eligible ? "G" : "R"}
                          text={eligibility.scheme === "FHBAS" && data[0].state !== "NSW" ? "DUTY" : eligibility.scheme}
                          reason={eligibility?.reason}
                        />
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
