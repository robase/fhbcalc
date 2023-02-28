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

  const houseCosts = new Array(10).fill(0).map((_, i) => Math.round((loanAmount - 5 * GAP + GAP * i) / 10000) * 10000)

  return (
    <div className="text-sm">
      <table className="text-left">
        <thead>
          <tr>
            <td colSpan={6} />
            <td className="border-b text-center" colSpan={4}>
              Govt Scheme Eligibility
            </td>
          </tr>
          <tr className="[&>td]:pr-2 [&>td]:py-2 first:[&>td]:pl-0 border-b-2 border-zinc-800 font-semibold">
            <td>Purchase Price</td>
            <td>Loan Amount</td>
            <td>LVR</td>
            <td>LMI</td>
            <td>Transfer (Stamp) Duty</td>
            <td>Annual Property Tax</td>
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
            const FHGBResult = qualifiesForFHBG(vals, purchasePrice)
            const FHGCResult = qualifiesForFHBC(vals, purchasePrice)
            const FHBASResult = qualifiesForFHBAS(vals, purchasePrice)
            const FHOGResult = qualifiesForFHOG(vals, purchasePrice)

            return (
              <tr key={`${purchasePrice}`} className="[&>td]:min-w-fit [&>td]:py-2 first:[&>td]:pl-0 border-b">
                <td>{fmtAUD(purchasePrice)}</td>
                <td>{fmtAUD(purchasePrice - vals.deposit)}</td>
                <td>{calcLVR(purchasePrice, vals.deposit).toFixed(2)}%</td>
                <td>{calcLMI(purchasePrice, vals.deposit)}</td>
                <td>
                  {calcTransferDuty(purchasePrice) === 0 ? (
                    <p>
                      $0 <span className="text-[10px] text-zinc-400">exempt</span>
                    </p>
                  ) : (
                    <p>
                      {fmtAUD(calcTransferDuty(purchasePrice))}{" "}
                      {FHBASResult.type === "concessional" && (
                        <span className="text-[10px] text-zinc-400">concession</span>
                      )}
                    </p>
                  )}
                </td>

                <td>{fmtAUD(calcPropertyTax(vals.landValue, vals.purpose))}</td>
                <td
                  title={FHBASResult.reason || FHBASResult.type}
                  className={
                    FHBASResult.eligible
                      ? FHBASResult.type === "full"
                        ? "bg-green-500 border-r opacity-80"
                        : "bg-yellow-300 border-r opacity-80"
                      : "bg-red-500 border-r opacity-80"
                  }
                ></td>
                <td
                  title={FHOGResult.reason}
                  className={
                    FHOGResult.eligible ? "bg-green-500 border-r opacity-80" : "bg-red-500 border-r opacity-80"
                  }
                ></td>
                <td
                  title={FHGBResult.reason}
                  className={
                    FHGBResult.eligible ? "bg-green-500 border-r opacity-80" : "bg-red-500 border-r opacity-80"
                  }
                ></td>
                <td
                  title={FHGCResult.reason}
                  className={
                    FHGCResult.eligible ? "bg-green-500 border-r opacity-80" : "bg-red-500 border-r opacity-80"
                  }
                ></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}