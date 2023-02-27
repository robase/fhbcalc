import { estimateLoanAmount, calcLVR, calcTransferDuty, calcPropertyTax, qualifiesForFHBG } from "~/utls/calculators"
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
    <div className="container mx-auto w-fit">
      <table className="text-left ">
        <thead>
          <tr>
            <td colSpan={5} />
            <td className="border-b text-center" colSpan={4}>
              Govt Scheme Eligibility
            </td>
          </tr>
          <tr className="[&>td]:px-3 [&>td]:py-1 first:[&>td]:pl-0 border-b font-semibold">
            <td>House Cost</td>
            <td>Loan Amount</td>
            <td>LVR</td>
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
          {houseCosts.map((purchasePrice) => (
            <tr key={`${purchasePrice}`} className="[&>td]:pl-6 [&>td]:py-1 first:[&>td]:pl-0">
              <td>{fmtAUD(purchasePrice)}</td>
              <td>{fmtAUD(purchasePrice - vals.deposit)}</td>
              <td>{calcLVR(purchasePrice, vals.deposit).toFixed(2)}%</td>
              <td>
                {calcTransferDuty(purchasePrice) === 0 ? (
                  <p>None (FHBAS)</p>
                ) : (
                  <p>{fmtAUD(calcTransferDuty(purchasePrice))}</p>
                )}
              </td>
              <td>{fmtAUD(calcPropertyTax(100000, vals.purpose))}</td>
              <td></td>
              <td></td>
              <td title={qualifiesForFHBG(vals, purchasePrice).reason}>
                {qualifiesForFHBG(vals, purchasePrice).eligible ? "🟢" : "🔴"}
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
