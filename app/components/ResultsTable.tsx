import { useEffect, useState } from "react"
import {
  calcLVR,
  calcTransferDuty,
  calcPropertyTax,
  qualifiesForFHBG,
  qualifiesForFHBC,
  qualifiesForFHBAS,
  qualifiesForFHOG,
  calcLMI,
  cashOnHandRequired,
  calcMonthlyRepayment,
  calcHecsYearlyRepayment,
  calcDTI,
  calcPrincipalFromRepayment,
} from "~/utls/calculators"
import type { CalcData } from "~/utls/defaults"
import { fmtAUD } from "~/utls/formatters"
import CopyResultsButton from "./ui/CopyResultsButton"
import Pill from "./ui/Pill"
import LZString from "lz-string"
import { HELPTEXT } from "./AssistanceArea"

const urlFHBAS = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
const urlFHBG = "https://www.nhfic.gov.au/support-buy-home/first-home-guarantee"
const urlFHOG = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes"
const urlFHBC = "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice"

export default function ResultsTable({
  data,
  onItemHover,
}: {
  data: CalcData
  onItemHover: (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>, focusedItem: HELPTEXT) => void
}) {
  const monthlyIncome = data.income / 12
  const monthlyExpenses = data.expenses + calcHecsYearlyRepayment(data.income, data.hecs) / 12
  const maxRepayment = 0.7 * monthlyIncome - monthlyExpenses

  const [interestRate, setInterestRate] = useState<number | string>(data.interestRate)
  const loanAmount = Math.round(calcPrincipalFromRepayment(maxRepayment, interestRate as number) / 1000) * 1000

  const transactionFee = 3000

  const [taxOrTransferDuty, setTaxOrTransferDuty] = useState<"TRANSFER" | "TAX">("TRANSFER")
  const [linkButtonText, setLinkButtonText] = useState("copy results link")
  const [priceInterval, setPriceInterval] = useState(data.priceInterval)

  const [maxPrice, setMaxPrice] = useState(loanAmount)

  useEffect(() => {
    const monthlyIncome = data.income / 12
    const monthlyExpenses = data.expenses + calcHecsYearlyRepayment(data.income, data.hecs) / 12
    const maxRepayment = 0.7 * monthlyIncome - monthlyExpenses
    const loanAmount = Math.round(calcPrincipalFromRepayment(maxRepayment, interestRate as number) / 1000) * 1000
    setMaxPrice(loanAmount)
  }, [loanAmount, monthlyExpenses, data.hecs, data.income, data.expenses, interestRate])

  const loanPrincipals = new Array(15)
    .fill(0)
    .map((_, i) => (maxPrice - priceInterval * i > 0 ? maxPrice - priceInterval * i : 0))

  const valuesToURLParam = () => {
    const compressed = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        ...data,
        priceInterval,
        interestRate,
      })
    )

    navigator.clipboard.writeText(window.location.href.split("?")[0] + "?d=" + compressed)
    // navigate(`./?d=${compressed}`, { replace: true })
  }

  return (
    <div className="text-sm">
      <div className="flex flex-row gap-4 justify-between items-end pb-4 max-md:px-8 text-zinc-700 overflow-x-auto">
        <div className="flex flex-row gap-4 ">
          {/* <div>
            <label htmlFor="min-price" className="block text-xs font-light font-roboto text-zinc-500 select-none">
              Min purchase price
            </label>
            <CurrencyInput
              id="min-price"
              className="block w-36 py-1.5 border-zinc-400"
              onFocus={(e) => e.target.select()}
              intlConfig={{ locale: "en-AU", currency: "AUD" }}
              placeholder="Please enter a number"
              decimalsLimit={2}
              value={maxPrice}
              onChange={(e) => {
                if (e.target.value !== "-") {
                  setMaxPrice(Number(e.target.value.replace("-", "").replace(/[^0-9.-]+/g, "")))
                }
              }}
            />
          </div> */}
          <div>
            <label htmlFor="priceInterval" className="block text-xs font-light font-roboto text-zinc-500 select-none">
              Price interval
            </label>
            <input
              id="priceInterval"
              type="number"
              className="block w-36 py-1.5 border-zinc-400"
              min={10000}
              step={10000}
              value={priceInterval}
              onChange={(e) => setPriceInterval(parseInt(e.target?.value))}
            />
          </div>
          <div>
            <label htmlFor="min-price" className="block text-xs font-light font-roboto text-zinc-500 select-none">
              Interest rate %
            </label>
            <input
              id="interestRate"
              type="number"
              className="block w-36 py-1.5 border-zinc-400"
              min={0}
              step={0.01}
              value={interestRate}
              onChange={(e) => setInterestRate(e.target?.value ? parseFloat(e.target?.value) : "")}
            />
          </div>
        </div>
        <div>
          <CopyResultsButton
            linkText={linkButtonText}
            setLinkText={setLinkButtonText}
            handleCopyLink={() => valuesToURLParam()}
          />
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-visible w-full">
        <table className="w-full text-sm text-left border overflow-visible">
          <thead className="text-zinc-700 uppercase bg-zinc-100 dark:bg-gray-700 dark:text-gray-400 font-semibold font-spartan">
            <tr className="uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400  [&>td]:select-none">
              <td className="px-3 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.PURCHASE_PRICE)}>
                Purchase Price
              </td>
              <td className="px-3 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.LOAN_PRINCIPAL)}>
                Loan Principal
              </td>
              <td className="pl-3 pr-5 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.DTI)}>
                DTI
              </td>
              <td className="px-3 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.LVR)}>
                LVR
              </td>
              <td className="px-3 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.LMI)}>
                LMI*
              </td>
              <td
                className="w-28 cursor-pointer"
                onClick={() => setTaxOrTransferDuty("TRANSFER")}
                onMouseEnter={(e) => onItemHover(e, HELPTEXT.TRANSFER_DUTY)}
              >
                {taxOrTransferDuty === "TRANSFER" ? (
                  <div className="w-full h-full px-4 py-1 border border-zinc-500 gap-2  items-center hover:bg-zinc-100 rounded-l-xl">
                    <span className="whitespace-nowrap">Transfer Duty</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 w-full h-full px-4 py-1 border border-zinc-200  items-center gap-2 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-l-xl">
                    <span className="whitespace-nowrap">Transfer Duty</span>
                  </div>
                )}
              </td>
              <td
                className="w-28 cursor-pointer"
                onClick={() => setTaxOrTransferDuty("TAX")}
                onMouseEnter={(e) => onItemHover(e, HELPTEXT.PROPERTY_TAX)}
              >
                {taxOrTransferDuty === "TAX" ? (
                  <div className="w-full h-full px-4 py-1 border border-zinc-500  gap-2 items-center hover:bg-zinc-100  rounded-r-xl ">
                    <span className="whitespace-nowrap">Property Tax</span>
                  </div>
                ) : (
                  <div className="text-zinc-300 w-full h-full px-4 py-1 border border-zinc-200  items-center gap-2 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-r-xl">
                    <span className="whitespace-nowrap">Property Tax</span>
                  </div>
                )}
              </td>
              <td className="px-3 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.UPFRONT_CASH)}>
                Upfront Cash Required
              </td>
              <td className="px-3 py-2" onMouseEnter={(e) => onItemHover(e, HELPTEXT.MONTHLY_REPAYMENT)}>
                Monthly Repayment
                <p className="text-xs normal-case py-1 tracking-normal text-zinc-400 whitespace-nowrap">
                  30 years @ {((interestRate || 0) as number).toFixed(2)}% p.a.
                </p>
              </td>
              <td className="px-3 py-2">Gov Scheme Eligibility</td>
            </tr>
          </thead>
          <tbody>
            {loanPrincipals.map((loanPrincipal, i) => {
              const purchasePrice = loanPrincipal + data.deposit
              const FHBGResult = qualifiesForFHBG(data, purchasePrice)
              const FHBCResult = qualifiesForFHBC(data, purchasePrice)
              const FHBASResult = qualifiesForFHBAS(data, purchasePrice)
              const FHOGResult = qualifiesForFHOG(data, purchasePrice)

              const monthlyRepayment = calcMonthlyRepayment(loanPrincipal, interestRate as number)

              const lvr = calcLVR(purchasePrice, data.deposit)
              const lmi = calcLMI(purchasePrice, data.deposit, FHBGResult)
              const dti = calcDTI(monthlyExpenses + monthlyRepayment, monthlyIncome)

              const transferDuty = calcTransferDuty(purchasePrice, FHBASResult)
              const propertyTax = calcPropertyTax(data.landValue, data.purpose)

              const cashOnHand = cashOnHandRequired(
                data.deposit,
                transactionFee,
                taxOrTransferDuty === "TAX" ? propertyTax : transferDuty,
                lmi, // lvr >= 90 ? lmi : 0,
                FHOGResult.eligible
              )

              return (
                <tr
                  key={`${purchasePrice}-${i}`}
                  className={
                    dti > 0.71 || dti < 0
                      ? "bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-zinc-400 font-roboto hover:bg-zinc-50"
                      : "bg-white border-b dark:bg-gray-900 dark:border-gray-700 font-roboto hover:bg-zinc-50"
                  }
                >
                  <td className="px-3 py-2">{fmtAUD(purchasePrice)}</td>
                  <td className="pl-3 pr-5 py-2">{fmtAUD(loanPrincipal)}</td>
                  <td className={`${dti > 0.6 ? "text-red-600" : dti > 0.55 ? "text-yellow-600" : ""} px-3 py-2`}>
                    {dti.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">{lvr.toFixed(2)}%</td>
                  <td className="px-3 py-2">
                    {lmi === -1 ? "No data" : fmtAUD(lmi)}{" "}
                    {FHBGResult.eligible && <span className="text-[10px] text-zinc-400">FHBG</span>}
                  </td>
                  <td className="px-3 py-2">
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
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      {/* <div>
                        <span className={taxOrTransferDuty === "TRANSFER" ? "line-through text-zinc-200" : ""}>
                          {fmtAUD(Math.round(propertyTax / 12))}
                        </span>{" "}
                        <span
                          className={
                            taxOrTransferDuty === "TRANSFER" ? "text-[11px] text-zinc-200" : "text-[11px] text-zinc-400"
                          }
                        >
                          monthly
                        </span>
                      </div> */}
                      <div>
                        <span className={taxOrTransferDuty === "TRANSFER" ? "line-through text-zinc-200 text-xs" : ""}>
                          {fmtAUD(propertyTax)}
                        </span>{" "}
                        <span
                          className={
                            taxOrTransferDuty === "TRANSFER" ? "text-[11px] text-zinc-200" : "text-[11px] text-zinc-400"
                          }
                        >
                          p.a.
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-row gap-2 items-center">
                      <span>
                        {fmtAUD(cashOnHand)} {lmi === -1 && "+ LMI"}
                      </span>
                      {FHOGResult.eligible && <span className="text-zinc-400 text-[10px] leading-3">inc. FHOG</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-row gap-2">
                      <span>{fmtAUD(monthlyRepayment)}</span>
                      <span className="text-zinc-400 text-[10px] leading-3">
                        {((monthlyRepayment / (data.income / 12)) * 100).toFixed(2)}%<br />
                        of income
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-row gap-2 px-4 py-3 items-center">
                      {FHBASResult.eligible ? (
                        FHBASResult.type === "full" ? (
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
                          reason={FHBASResult.reason}
                        />
                      )}
                      {FHOGResult.eligible ? (
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHOG)}
                          status="G"
                          text="FHOG"
                          url={urlFHOG}
                          reason={FHOGResult.reason}
                        />
                      ) : (
                        <>
                          <Pill
                            onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHOG)}
                            status="R"
                            text="FHOG"
                            url={urlFHOG}
                            reason={FHOGResult.reason}
                          />
                        </>
                      )}
                      {FHBGResult.eligible ? (
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBG)}
                          status="G"
                          text="FHBG"
                          url={urlFHBG}
                          reason={FHBGResult.reason}
                        />
                      ) : (
                        <>
                          <Pill
                            onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBG)}
                            status="R"
                            text="FHBG"
                            url={urlFHBG}
                            reason={FHBGResult.reason}
                          />
                        </>
                      )}
                      {FHBCResult.eligible ? (
                        <Pill
                          onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBC)}
                          status="G"
                          text="FHBC"
                          url={urlFHBC}
                          reason={FHBCResult.reason}
                        />
                      ) : (
                        <>
                          <Pill
                            onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBC)}
                            status="R"
                            text="FHBC"
                            url={urlFHBC}
                            reason={FHBCResult.reason}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p>* estimate only</p>
      <div className="flex flex-row justify-center">
        <CopyResultsButton
          linkText={linkButtonText}
          setLinkText={setLinkButtonText}
          handleCopyLink={() => valuesToURLParam()}
        />
      </div>
    </div>
  )
}
