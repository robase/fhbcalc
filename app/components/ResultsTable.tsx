import { Check, Check2Circle, CheckCircleFill, Icon0Circle, XCircleFill } from "react-bootstrap-icons"
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
} from "~/utls/calculators"
import type { CalcData } from "~/utls/defaults"
import { CALC_DEFAULTS } from "~/utls/defaults"

const GAP = 50000

function fmtAUD(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ResultsTable({ data }: { data: CalcData | null }) {
  const vals = data ? data : CALC_DEFAULTS

  const loanAmount = estimateLoanAmount(vals)
  const transactionFee = 1500 + 800 + 463

  const houseCosts = new Array(10).fill(0).map((_, i) => Math.round((loanAmount - 5 * GAP + GAP * i) / 10000) * 10000)

  return (
    <div className="text-sm">
      <table className="w-full text-sm text-left font-roboto">
        <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 font-semibold">
          <tr className="bg-white">
            <td colSpan={8} />
            <td className="border-b text-center" colSpan={4}>
              Government Scheme Eligibility
            </td>
          </tr>
          <tr className="[&>td]:px-4 [&>td]:py-3  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <td>Purchase Price</td>
            <td>Loan Amount</td>
            <td>LVR</td>
            <td>LMI</td>
            <td>Transfer (Stamp) Duty</td>
            <td>Annual Property Tax</td>
            <td>Transaction Fees</td>
            <td>Total Cost</td>
            <td>
              <a
                target="_blank"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
                rel="noreferrer"
              >
                FHBAS
              </a>
            </td>
            <td>
              <a target="_blank" href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer" rel="noreferrer">
                FHOG
              </a>
            </td>
            <td>
              <a target="_blank" href="https://www.nhfic.gov.au/support-buy-home/first-home-guarantee" rel="noreferrer">
                FHBG
              </a>
            </td>
            <td>
              <a
                target="_blank"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice"
                rel="noreferrer"
              >
                FHBC
              </a>
            </td>
          </tr>
        </thead>
        <tbody>
          {houseCosts.map((purchasePrice) => {
            const FHBGResult = qualifiesForFHBG(vals, purchasePrice)
            const FHBCResult = qualifiesForFHBC(vals, purchasePrice)
            const FHBASResult = qualifiesForFHBAS(vals, purchasePrice)
            const FHOGResult = qualifiesForFHOG(vals, purchasePrice)

            const lvr = calcLVR(purchasePrice, vals.deposit)
            const lmi = calcLMI(purchasePrice, vals.deposit)
            const transferDuty = calcTransferDuty(purchasePrice)

            return (
              <tr
                key={`${purchasePrice}`}
                className={
                  lvr > 95
                    ? "bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-zinc-400 [&>td]:px-6 [&>td]:py-3"
                    : "bg-white border-b dark:bg-gray-900 dark:border-gray-700 [&>td]:px-6 [&>td]:py-3"
                }
              >
                <td>{fmtAUD(purchasePrice)}</td>
                <td>{fmtAUD(purchasePrice - vals.deposit)}</td>
                <td>{lvr.toFixed(2)}%</td>
                <td className={FHBGResult.eligible ? "line-through" : ""}>{fmtAUD(lmi)}</td>
                <td>
                  {transferDuty === 0 ? (
                    <p>
                      $0 <span className="text-[10px] text-zinc-400">FHBAS exempt</span>
                    </p>
                  ) : (
                    <p>
                      {fmtAUD(transferDuty)}{" "}
                      {FHBASResult.type === "concessional" && (
                        <span className="text-[10px] text-zinc-400">FHBAS concession</span>
                      )}
                    </p>
                  )}
                </td>

                <td className={transferDuty === 0 ? "line-through" : ""}>
                  {fmtAUD(calcPropertyTax(vals.landValue, vals.purpose))}
                </td>
                <td>{fmtAUD(transactionFee)}</td>
                <td>$0</td>
                <td title={FHBASResult.reason || FHBASResult.type} className="text-center">
                  {FHBCResult.eligible ? (
                    FHBASResult.type === "full" ? (
                      <CheckCircleFill className="fill-green-600" />
                    ) : (
                      <CheckCircleFill className="fill-yellow-500" />
                    )
                  ) : (
                    <XCircleFill className="fill-red-600" />
                  )}
                </td>
                <td title={FHOGResult.reason} className="text-center">
                  {FHOGResult.eligible ? (
                    <CheckCircleFill className="fill-green-600" />
                  ) : (
                    <XCircleFill className="fill-red-600" />
                  )}
                </td>
                <td title={FHBGResult.reason} className="text-center">
                  {FHBGResult.eligible ? (
                    <CheckCircleFill className="fill-green-600" />
                  ) : (
                    <XCircleFill className="fill-red-600" />
                  )}
                </td>
                <td title={FHBCResult.reason} className="text-center">
                  {FHBCResult.eligible ? (
                    <CheckCircleFill className="fill-green-600" />
                  ) : (
                    <XCircleFill className="fill-red-600" />
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
