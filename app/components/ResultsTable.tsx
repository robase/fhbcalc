import { useState } from "react"
import {
  Check,
  Check2Circle,
  CheckCircle,
  CheckCircleFill,
  Circle,
  Icon0Circle,
  XCircleFill,
} from "react-bootstrap-icons"
import {
  estimateLoanAmount,
  calcLVR,
  calcTransferDuty,
  calcPropertyTax,
  qualifiesForFHBG,
  qualifiesForFHBC,
  qualifiesForFHBAS,
  qualifiesForFHOG,
  calcLMI,
  cashOnHandRequired,
} from "~/utls/calculators"
import type { CalcData } from "~/utls/defaults"
import { CALC_DEFAULTS } from "~/utls/defaults"

const GAP = 10000

export function fmtAUD(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount)
}

function Pill({ text, status, url }: { text: string; status: "R" | "A" | "G"; url?: string }) {
  return (
    <a href={url} rel="noreferrer" target="_blank">
      <p
        className={`${
          status === "R"
            ? "text-zinc-400 border-zinc-400"
            : status === "A"
            ? "border-yellow-600 text-yellow-600"
            : "border-green-600 text-green-600"
        } border-2 tracking-wide font-bold border-opacity-60 rounded-full text-xs px-2 py-1 w-min cursor-pointer hover:bg-zinc-100`}
      >
        {text}
      </p>
    </a>
  )
}

const urlFHBAS = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
const urlFHBG = "https://www.nhfic.gov.au/support-buy-home/first-home-guarantee"
const urlFHOG = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer"
const urlFHBC = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice"

export default function ResultsTable({ data }: { data: CalcData | null }) {
  const vals = data ? data : CALC_DEFAULTS

  const [taxOrTransferDuty, setTaxOrTransferDuty] = useState<"TRANSFER" | "TAX">("TRANSFER")

  const loanAmount = estimateLoanAmount(vals)
  const transactionFee = 1500 + 800 + 463

  const houseCosts = new Array(15).fill(0).map((_, i) => Math.round((loanAmount - 8 * GAP + GAP * i) / 10000) * 10000)

  return (
    <div className="text-sm">
      <table className="w-full text-sm text-left  border">
        <thead className="text-zinc-700 uppercase bg-zinc-100 dark:bg-gray-700 dark:text-gray-400 font-semibold font-spartan">
          <tr className=" text-zinc-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <td className="px-4 py-3">Purchase Price</td>
            <td className="px-4 py-3">Loan Amount</td>
            <td className="px-4 py-3">LVR</td>
            <td className="px-4 py-3">LMI</td>
            <td className="w-28 cursor-pointer" onClick={() => setTaxOrTransferDuty("TRANSFER")}>
              {taxOrTransferDuty === "TRANSFER" ? (
                <div className="w-full h-full px-4 py-3 border border-zinc-500 gap-2  items-center hover:bg-zinc-100 rounded-l-lg">
                  <span className="whitespace-nowrap">Transfer Duty</span>
                  {/* <span className="inline">
                    <CheckCircleFill size="1.3em" className="fill-zinc-600" />
                  </span> */}
                </div>
              ) : (
                <div className="text-zinc-300 w-full h-full px-4 py-3 border border-zinc-200  items-cente gap-2 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-l-lg">
                  <span className="whitespace-nowrap">Transfer Duty</span>
                  {/* <span className="inline">
                    <Circle size="1.3em" className="fill-zinc-400" />
                  </span> */}
                </div>
              )}
            </td>
            <td className="w-28 cursor-pointer" onClick={() => setTaxOrTransferDuty("TAX")}>
              {taxOrTransferDuty === "TAX" ? (
                <div className="w-full h-full px-4 py-3 border border-zinc-500  gap-2 items-center hover:bg-zinc-100  rounded-r-xl ">
                  <span className="whitespace-nowrap">Property Tax</span>
                  {/* <span className="inline">
                    <CheckCircleFill size="1.3em" className="fill-sky-700 m-0" />
                  </span> */}
                </div>
              ) : (
                <div className="text-zinc-300 w-full h-full px-4 py-3 border border-zinc-200  items-cente gap-2 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-r-xl">
                  <span className="whitespace-nowrap">Property Tax</span>
                  {/* <span className="inline">
                    <Circle size="1.3em" className="fill-zinc-400" />
                  </span> */}
                </div>
              )}
            </td>
            <td className="px-4 py-3">Cash Required</td>
            <td className="px-4 py-3">Gov Scheme Eligibility</td>
          </tr>
        </thead>
        <tbody>
          {houseCosts.map((purchasePrice) => {
            const FHBGResult = qualifiesForFHBG(vals, purchasePrice)
            const FHBCResult = qualifiesForFHBC(vals, purchasePrice)
            const FHBASResult = qualifiesForFHBAS(vals, purchasePrice)
            const FHOGResult = qualifiesForFHOG(vals, purchasePrice)

            const lvr = calcLVR(purchasePrice, vals.deposit)
            const lmi = calcLMI(purchasePrice, vals.deposit, FHBGResult)

            const transferDuty = calcTransferDuty(purchasePrice, FHBASResult)
            const propertyTax = calcPropertyTax(vals.landValue, vals.purpose)

            const cashOnHand = cashOnHandRequired(
              vals.deposit,
              transactionFee,
              taxOrTransferDuty === "TAX" ? propertyTax : transferDuty,
              lmi // lvr >= 90 ? lmi : 0
            )

            return (
              <tr
                key={`${purchasePrice}`}
                className={
                  lvr > 95
                    ? "bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-zinc-400 [&>td]:px-6 [&>td]:py-3 font-roboto"
                    : "bg-white border-b dark:bg-gray-900 dark:border-gray-700 [&>td]:px-6 [&>td]:py-3 font-roboto"
                }
              >
                <td>{fmtAUD(purchasePrice)}</td>
                <td>{fmtAUD(purchasePrice - vals.deposit)}</td>
                <td>{lvr.toFixed(2)}%</td>
                <td>
                  {fmtAUD(lmi)} {FHBGResult.eligible && <span className="text-[10px] text-zinc-400">FHBG</span>}
                </td>
                <td>
                  {FHBASResult.type === "full" ? (
                    <p>
                      <span className={taxOrTransferDuty === "TAX" ? "line-through text-zinc-200" : ""}>
                        {fmtAUD(transferDuty)}
                      </span>{" "}
                      <span
                        className={
                          taxOrTransferDuty === "TAX" ? "text-[10px] text-zinc-200" : "text-[10px] text-zinc-400"
                        }
                      >
                        FHBAS exempt
                      </span>
                    </p>
                  ) : (
                    <div className="flex flex-row items-center gap-2">
                      <p className={taxOrTransferDuty === "TAX" ? "line-through text-zinc-200" : ""}>
                        {fmtAUD(transferDuty)}{" "}
                      </p>
                      {FHBASResult.type === "concessional" && (
                        <span
                          className={
                            taxOrTransferDuty === "TAX"
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
                <td>
                  <span className={taxOrTransferDuty === "TRANSFER" ? "line-through text-zinc-200" : ""}>
                    {fmtAUD(propertyTax)}
                  </span>{" "}
                  <span
                    className={
                      taxOrTransferDuty === "TRANSFER" ? "text-[11px] text-zinc-200" : "text-[11px] text-zinc-400"
                    }
                  >
                    p.a.
                  </span>
                </td>
                <td>{fmtAUD(cashOnHand)}</td>
                <td className="flex flex-row gap-2">
                  {FHBASResult.eligible ? (
                    FHBASResult.type === "full" ? (
                      <Pill status="G" text="BAS" url={urlFHBAS} />
                    ) : (
                      <Pill status="A" text="BAS" url={urlFHBAS} />
                    )
                  ) : (
                    <Pill status="R" text="BAS" url={urlFHBAS} />
                  )}
                  {FHOGResult.eligible ? (
                    <Pill status="G" text="OG" url={urlFHOG} />
                  ) : (
                    <>
                      <Pill status="R" text="OG" url={urlFHOG} />
                    </>
                  )}
                  {FHBGResult.eligible ? (
                    <Pill status="G" text="BG" url={urlFHBG} />
                  ) : (
                    <>
                      <Pill status="R" text="BG" url={urlFHBG} />
                    </>
                  )}
                  {FHBCResult.eligible ? (
                    <Pill status="G" text="BC" url={urlFHBC} />
                  ) : (
                    <>
                      <Pill status="R" text="BC" url={urlFHBC} />
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
