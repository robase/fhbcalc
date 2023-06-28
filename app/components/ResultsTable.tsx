import type { CalcSettings } from "~/utls/defaults";
import { fmtAUD } from "~/utls/formatters";
import Pill from "./ui/Pill";
import { HELPTEXT } from "./AssistanceArea";
import type { NSWResult } from "~/routes";

const urlFHBAS = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme";
const urlFHBG = "https://www.nhfic.gov.au/support-buy-home/first-home-guarantee";
const urlFHOG = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes";

export default function ResultsTable({
  data,
  settings,
  onItemHover,
}: {
  data: NSWResult[];
  settings: CalcSettings;
  onItemHover: (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>, focusedItem: HELPTEXT) => void;
}) {
  return (
    <div className="text-sm">
      <div className="overflow-x-auto w-full xl:px-6 xl:pb-6 bg-[#ebf0f3c7]">
        <table className="w-full text-left overflow-visible">
          <thead className="text-[#24282b] uppercase bg-[#ebf0f3c7] text-base font-medium font-spartan">
            <tr className="uppercase [&>td]:select-none [&>td]:pb-3 [&>td]:pt-4 border-b-0">
              <td
                className="hover:text-zinc-400 px-3 cursor-pointer "
                onClick={(e) => onItemHover(e, HELPTEXT.PURCHASE_PRICE)}
              >
                Purchase Price
              </td>
              <td
                className="hover:text-zinc-400 px-3 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.LOAN_PRINCIPAL)}
              >
                Loan Amount
                <div className="flex flex-row text-[14px] normal-case tracking-normal font-normal text-zinc-500 whitespace-nowrap gap-2">
                  <span>Principal</span>
                  <span>+</span>
                  <span>Interest</span>
                  <span>=</span>
                  <span>Total</span>
                </div>
              </td>
              <td
                className="hover:text-zinc-400 pl-3 pr-5 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.DTI)}
              >
                DTI
              </td>
              <td className="hover:text-zinc-400 px-3 cursor-pointer" onClick={(e) => onItemHover(e, HELPTEXT.LVR)}>
                LVR
              </td>
              <td className="hover:text-zinc-400 px-3 cursor-pointer" onClick={(e) => onItemHover(e, HELPTEXT.LMI)}>
                LMI*
              </td>

              <td
                className="hover:text-zinc-400 px-3 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.TRANSFER_DUTY)}
              >
                Transfer Duty
              </td>
              <td
                className="hover:text-zinc-400 px-3 cursor-pointer "
                onClick={(e) => onItemHover(e, HELPTEXT.UPFRONT_CASH)}
              >
                Upfront Cash
              </td>
              <td
                className="hover:text-zinc-400 px-3 cursor-pointer "
                onClick={(e) => onItemHover(e, HELPTEXT.MONTHLY_REPAYMENT)}
              >
                Monthly Repayment
                <p className="text-xs py-1 normal-case tracking-normal font-normal text-zinc-500 whitespace-nowrap">
                  30 years @ {((settings.interestRate || 0) as number).toFixed(2)}% p.a.
                </p>
              </td>
              <td className="select-none px-3">Scheme Eligibility</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={`${row.purchasePrice}-${i}`}
                className="bg-white border-b border-t font-roboto hover:bg-zinc-50 last:border-b-0 first:border-t-0"
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
                <td className={`${row.dti > 0.6 ? "text-red-600" : row.dti > 0.55 ? "text-yellow-600" : ""} px-3 py-2`}>
                  {row.dti.toFixed(2)}
                </td>
                <td className="px-3 py-2">{row.lvr.toFixed(2)}%</td>
                <td className="px-3 py-2">
                  {row.lmi === -1 ? "No data" : fmtAUD(row.lmi)}{" "}
                  {row.FHBGResult.eligible && <span className="text-[10px] text-zinc-400">FHBG</span>}
                </td>
                <td className="px-3 py-2">
                  {row.FHBASResult.type === "full" ? (
                    <p>
                      <span className={settings.transferOrTax === "TAX" ? "line-through text-zinc-200" : ""}>
                        {fmtAUD(row.transferDuty)}
                      </span>{" "}
                      <span
                        className={
                          settings.transferOrTax === "TAX" ? "text-[10px] text-zinc-200" : "text-[10px] text-zinc-400"
                        }
                      >
                        FHBAS exempt
                      </span>
                    </p>
                  ) : (
                    <div className="flex flex-row items-center gap-2">
                      <p className={settings.transferOrTax === "TAX" ? "line-through text-zinc-200" : ""}>
                        {fmtAUD(row.transferDuty)}{" "}
                      </p>
                      {row.FHBASResult.type === "concessional" && (
                        <span
                          className={
                            settings.transferOrTax === "TAX"
                              ? "text-[10px] text-zinc-200 leading-3"
                              : "text-[10px] text-zinc-400 leading-3"
                          }
                        >
                          FHBAS <br />
                          concession
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-row gap-2 items-center">
                    <span>
                      {fmtAUD(row.cashOnHand)} {row.lmi === -1 && "+ LMI"}
                    </span>
                    {row.FHOGResult.eligible && <span className="text-zinc-400 text-[10px] leading-3">inc. FHOG</span>}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-row gap-2">
                    <span>{fmtAUD(row.monthlyRepayment)}</span>
                    <span className="text-zinc-400 text-[10px] leading-3">
                      {((row.monthlyRepayment / row.monthlyIncome) * 100).toFixed(2)}%<br />
                      of income
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-row gap-2 px-4 py-3 items-center">
                    {row.FHBASResult.eligible ? (
                      row.FHBASResult.type === "full" ? (
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                          status="G"
                          text="FHBAS"
                          url={urlFHBAS}
                          reason={"Full exemption"}
                        />
                      ) : (
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                          status="A"
                          text="FHBAS"
                          url={urlFHBAS}
                          reason={"Concessional discount"}
                        />
                      )
                    ) : (
                      <Pill
                        onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                        status="R"
                        text="FHBAS"
                        url={urlFHBAS}
                        reason={row.FHBASResult.reason}
                      />
                    )}
                    {row.FHOGResult.eligible ? (
                      <Pill
                        onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHOG)}
                        status="G"
                        text="FHOG"
                        url={urlFHOG}
                        reason={row.FHOGResult.reason}
                      />
                    ) : (
                      <>
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHOG)}
                          status="R"
                          text="FHOG"
                          url={urlFHOG}
                          reason={row.FHOGResult.reason}
                        />
                      </>
                    )}
                    {row.FHBGResult.eligible ? (
                      <Pill
                        onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBG)}
                        status="G"
                        text="FHBG"
                        url={urlFHBG}
                        reason={row.FHBGResult.reason}
                      />
                    ) : (
                      <>
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBG)}
                          status="R"
                          text="FHBG"
                          url={urlFHBG}
                          reason={row.FHBGResult.reason}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pt-2">* estimate only</p>
    </div>
  );
}
