import type { EligibilityResult } from "~/utls/calculators"
import type { CalcSettings, FormResponse } from "~/utls/defaults"
import { fmtAUD } from "~/utls/formatters"
import Pill from "./ui/Pill"
import { HELPTEXT } from "./AssistanceArea"
import type { NSWResult } from "./MainView"

const urlFHBAS = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
const urlFHBG = "https://www.nhfic.gov.au/support-buy-home/first-home-guarantee"
const urlFHOG = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes"
const urlFHBC = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice"

export default function ResultsTable({
  data,
  settings,
  onItemHover,
  setCalcSettings,
}: {
  data: NSWResult[]
  settings: CalcSettings
  onItemHover: (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>, focusedItem: HELPTEXT) => void
  setCalcSettings: React.Dispatch<React.SetStateAction<CalcSettings>>
}) {
  return (
    <div className="text-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left border overflow-visible">
          <thead className="text-zinc-700 uppercase bg-zinc-100 font-semibold font-spartan">
            <tr className="uppercase bg-gray-50  [&>td]:select-none">
              <td
                className=" select-none hover:bg-white px-3 py-2 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.PURCHASE_PRICE)}
              >
                Purchase Price
              </td>
              <td
                className=" select-none hover:bg-white px-3 py-2 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.LOAN_PRINCIPAL)}
              >
                Loan Amount
                <div className="flex flex-row text-[12px] normal-case tracking-normal font-normal text-zinc-400 whitespace-nowrap  -mb-2 gap-2">
                  <span>Principal</span>
                  <span>+</span>
                  <span>Interest</span>
                  <span>=</span>
                  <span>Total</span>
                </div>
              </td>
              {/* <td className=" select-none hover:bg-white px-3 py-2 cursor-pointer" onClick={(e) => onItemHover(e, HELPTEXT.LOAN_INTEREST)}>
                Loan Interest
              </td> */}
              <td
                className=" select-none hover:bg-white pl-3 pr-5 py-2 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.DTI)}
              >
                DTI
              </td>
              <td
                className=" select-none hover:bg-white px-3 py-2 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.LVR)}
              >
                LVR
              </td>
              <td
                className=" select-none hover:bg-white px-3 py-2 cursor-pointer"
                onClick={(e) => onItemHover(e, HELPTEXT.LMI)}
              >
                LMI*
              </td>
              <td
                className="cursor-pointer whitespace-nowrap "
                onClick={(e) => {
                  setCalcSettings((prev) => ({ ...prev, transferOrTax: "TRANSFER" }))
                  onItemHover(e, HELPTEXT.TRANSFER_DUTY)
                }}
              >
                {settings.transferOrTax === "TRANSFER" ? (
                  <div className="w-full h-full px-4 py-1 border border-zinc-500  items-center hover:bg-zinc-100 rounded-l-xl text-center">
                    <span>Transfer Duty</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 w-full h-full px-4 py-1 border border-zinc-200  items-center hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-l-xl text-center">
                    <span>Transfer Duty</span>
                  </div>
                )}
              </td>
              <td
                className="cursor-pointer whitespace-nowrap "
                onClick={(e) => {
                  setCalcSettings((prev) => ({ ...prev, transferOrTax: "TAX" }))
                  onItemHover(e, HELPTEXT.PROPERTY_TAX)
                }}
              >
                {settings.transferOrTax === "TAX" ? (
                  <div className="w-full h-full px-4 py-1 border border-zinc-500  items-center hover:bg-zinc-100  rounded-r-xl text-center ">
                    <span>Property Tax</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 w-full h-full px-4 py-1 border border-zinc-200  items-center hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-r-xl text-center">
                    <span>Property Tax</span>
                  </div>
                )}
              </td>
              <td
                className=" select-none px-3 py-2 cursor-pointer hover:bg-white"
                onClick={(e) => onItemHover(e, HELPTEXT.UPFRONT_CASH)}
              >
                Upfront Cash Required
              </td>
              <td
                className=" select-none px-3 py-2 cursor-pointer hover:bg-white"
                onClick={(e) => onItemHover(e, HELPTEXT.MONTHLY_REPAYMENT)}
              >
                Monthly Repayment
                <p className="text-xs  py-1 normal-case tracking-normal font-normal text-zinc-400 whitespace-nowrap">
                  30 years @ {((settings.interestRate || 0) as number).toFixed(2)}% p.a.
                </p>
              </td>
              <td className=" select-none px-3 py-2">Gov Scheme Eligibility</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={`${row.purchasePrice}-${i}`}
                className={
                  row.dti > 0.71 || row.dti < 0
                    ? "bg-white border-b text-zinc-400 font-roboto hover:bg-zinc-50"
                    : "bg-white border-b font-roboto hover:bg-zinc-50"
                }
              >
                <td className=" px-3 py-2">{fmtAUD(row.purchasePrice)}</td>
                <td className=" pl-3 pr-5 ">
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
                <td className=" px-3 py-2">{row.lvr.toFixed(2)}%</td>
                <td className=" px-3 py-2">
                  {row.lmi === -1 ? "No data" : fmtAUD(row.lmi)}{" "}
                  {row.FHBGResult.eligible && <span className="text-[10px] text-zinc-400">FHBG</span>}
                </td>
                <td className=" px-3 py-2">
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
                <td className=" px-3 py-2">
                  <div className="flex flex-col">
                    <div>
                      <span
                        className={settings.transferOrTax === "TRANSFER" ? "line-through text-zinc-200 text-xs" : ""}
                      >
                        {fmtAUD(row.propertyTax)}
                      </span>{" "}
                      <span
                        className={
                          settings.transferOrTax === "TRANSFER"
                            ? "text-[11px] text-zinc-200"
                            : "text-[11px] text-zinc-400"
                        }
                      >
                        p.a.
                      </span>
                    </div>
                  </div>
                </td>
                <td className=" px-3 py-2">
                  <div className="flex flex-row gap-2 items-center">
                    <span>
                      {fmtAUD(row.cashOnHand)} {row.lmi === -1 && "+ LMI"}
                    </span>
                    {row.FHOGResult.eligible && <span className="text-zinc-400 text-[10px] leading-3">inc. FHOG</span>}
                  </div>
                </td>
                <td className=" px-3 py-2">
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
                          onClick={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                          status="G"
                          text="FHBAS"
                          url={urlFHBAS}
                          reason={"Full exemption"}
                        />
                      ) : (
                        <Pill
                          onClick={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                          status="A"
                          text="FHBAS"
                          url={urlFHBAS}
                          reason={"Concessional discount"}
                        />
                      )
                    ) : (
                      <Pill
                        onClick={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                        status="R"
                        text="FHBAS"
                        url={urlFHBAS}
                        reason={row.FHBASResult.reason}
                      />
                    )}
                    {row.FHOGResult.eligible ? (
                      <Pill
                        onClick={(e) => onItemHover(e, HELPTEXT.FHOG)}
                        status="G"
                        text="FHOG"
                        url={urlFHOG}
                        reason={row.FHOGResult.reason}
                      />
                    ) : (
                      <>
                        <Pill
                          onClick={(e) => onItemHover(e, HELPTEXT.FHOG)}
                          status="R"
                          text="FHOG"
                          url={urlFHOG}
                          reason={row.FHOGResult.reason}
                        />
                      </>
                    )}
                    {row.FHBGResult.eligible ? (
                      <Pill
                        onClick={(e) => onItemHover(e, HELPTEXT.FHBG)}
                        status="G"
                        text="FHBG"
                        url={urlFHBG}
                        reason={row.FHBGResult.reason}
                      />
                    ) : (
                      <>
                        <Pill
                          onClick={(e) => onItemHover(e, HELPTEXT.FHBG)}
                          status="R"
                          text="FHBG"
                          url={urlFHBG}
                          reason={row.FHBGResult.reason}
                        />
                      </>
                    )}
                    {row.FHBCResult.eligible ? (
                      <Pill
                        onClick={(e) => onItemHover(e, HELPTEXT.FHBC)}
                        status="G"
                        text="FHBC"
                        url={urlFHBC}
                        reason={row.FHBCResult.reason}
                      />
                    ) : (
                      <>
                        <Pill
                          onClick={(e) => onItemHover(e, HELPTEXT.FHBC)}
                          status="R"
                          text="FHBC"
                          url={urlFHBC}
                          reason={row.FHBCResult.reason}
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
      <p>* estimate only</p>
    </div>
  )
}
