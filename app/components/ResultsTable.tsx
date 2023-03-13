import { useEffect, useState } from "react"
import CurrencyInput from "react-currency-input-field"
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
  calcMonthlyRepayment,
} from "~/utls/calculators"
import type { CalcData } from "~/utls/defaults"
import { fmtAUD } from "~/utls/formatters"
import CopyResultsButton from "./ui/CopyResultsButton"
import Pill from "./ui/Pill"
import LZString from "lz-string"
import { useNavigate } from "@remix-run/react"
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
  const navigate = useNavigate()

  const loanAmount = estimateLoanAmount(data)
  const transactionFee = 2000 + 800 + 154

  const [taxOrTransferDuty, setTaxOrTransferDuty] = useState<"TRANSFER" | "TAX">("TRANSFER")
  const [linkButtonText, setLinkButtonText] = useState("copy results link")
  const [priceInterval, setPriceInterval] = useState(data.priceInterval)
  const [minPrice, setMinPrice] = useState(
    Math.round((loanAmount - 8 * priceInterval + priceInterval * 0) / 10000) * 10000 > 0
      ? Math.round((loanAmount - 8 * priceInterval + priceInterval * 0) / 10000) * 10000
      : 0
  )

  useEffect(() => {
    setMinPrice(
      Math.round((loanAmount - 8 * priceInterval + priceInterval * 0) / 10000) * 10000 > 0
        ? Math.round((loanAmount - 8 * priceInterval + priceInterval * 0) / 10000) * 10000
        : 0
    )
  }, [loanAmount, priceInterval])
  const houseCosts = new Array(15).fill(0).map((_, i) => Math.round((minPrice + priceInterval * i) / 10000) * 10000)

  const valuesToURLParam = () => {
    const compressed = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        ...data,
        priceInterval,
        minPrice,
      })
    )

    navigator.clipboard.writeText(window.location.href.split("?")[0] + "?d=" + compressed)
    console.log(window.location.href.split("?")[0] + "?d=" + compressed)

    navigate(`./?d=${compressed}`, { replace: true })
  }

  return (
    <div className="text-sm">
      <div className="flex flex-row gap-4 justify-between items-end pb-4 max-md:px-8 text-zinc-700">
        <div className="flex flex-row gap-4 ">
          <div>
            <label htmlFor="min-price" className="block text-xs font-light font-roboto text-zinc-500 select-none">
              Min purchace price
            </label>
            <CurrencyInput
              id="min-price"
              className="block w-36 py-1.5 border-zinc-400"
              onFocus={(e) => e.target.select()}
              intlConfig={{ locale: "en-AU", currency: "AUD" }}
              placeholder="Please enter a number"
              decimalsLimit={2}
              value={minPrice}
              onChange={(e) => {
                if (e.target.value !== "-") {
                  setMinPrice(Number(e.target.value.replace("-", "").replace(/[^0-9.-]+/g, "")))
                }
              }}
            />
          </div>
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
              onChange={(e) =>
                setPriceInterval(parseInt(e.target?.value || "0") < 10000 ? 10000 : parseInt(e.target.value))
              }
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
          <thead className="text-zinc-800 uppercase bg-zinc-100 dark:bg-gray-700 dark:text-gray-400 font-semibold font-spartan">
            <tr className="uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 tracking-wide [&>td]:select-none">
              <td className="px-4 py-3" onMouseEnter={(e) => onItemHover(e, HELPTEXT.PURCHASE_PRICE)}>
                Purchase Price
              </td>
              <td className="px-4 py-3" onMouseEnter={(e) => onItemHover(e, HELPTEXT.LOAN_PRINCIPAL)}>
                Loan Principal
              </td>
              <td className="px-4 py-3" onMouseEnter={(e) => onItemHover(e, HELPTEXT.LVR)}>
                LVR
              </td>
              <td className="px-4 py-3" onMouseEnter={(e) => onItemHover(e, HELPTEXT.LMI)}>
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
                  <div className="text-zinc-300 w-full h-full px-4 py-1 border border-zinc-200  items-cente gap-2 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-l-xl">
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
                  <div className="text-zinc-300 w-full h-full px-4 py-1 border border-zinc-200  items-cente gap-2 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-500 rounded-r-xl">
                    <span className="whitespace-nowrap">Property Tax</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3" onMouseEnter={(e) => onItemHover(e, HELPTEXT.UPFRONT_CASH)}>
                Upfront Cash Required
              </td>
              <td className="px-4 py-3" onMouseEnter={(e) => onItemHover(e, HELPTEXT.MONTHLY_REPAYMENT)}>
                Monthly Repayment
                <p className="text-xs normal-case py-1 tracking-normal text-zinc-400 whitespace-nowrap">
                  30 years @ 6% p.a.
                </p>
              </td>
              <td className="px-4 py-3">Gov Scheme Eligibility</td>
            </tr>
          </thead>
          <tbody>
            {houseCosts.map((purchasePrice, i) => {
              const FHBGResult = qualifiesForFHBG(data, purchasePrice)
              const FHBCResult = qualifiesForFHBC(data, purchasePrice)
              const FHBASResult = qualifiesForFHBAS(data, purchasePrice)
              const FHOGResult = qualifiesForFHOG(data, purchasePrice)

              const lvr = calcLVR(purchasePrice, data.deposit)
              const lmi = calcLMI(purchasePrice, data.deposit, FHBGResult)

              const transferDuty = calcTransferDuty(purchasePrice, FHBASResult)
              const propertyTax = calcPropertyTax(data.landValue, data.purpose)

              const monthlyRepayment = calcMonthlyRepayment(purchasePrice)

              const cashOnHand = cashOnHandRequired(
                data.deposit,
                transactionFee,
                taxOrTransferDuty === "TAX" ? propertyTax : transferDuty,
                lmi // lvr >= 90 ? lmi : 0
              )

              return (
                <tr
                  key={`${purchasePrice}-${i}`}
                  className={
                    lvr > 95
                      ? "bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-zinc-400 font-roboto hover:bg-zinc-50"
                      : "bg-white border-b dark:bg-gray-900 dark:border-gray-700 font-roboto hover:bg-zinc-50"
                  }
                >
                  <td className="px-4 py-3">{fmtAUD(purchasePrice)}</td>
                  <td className="px-4 py-3">
                    {purchasePrice - data.deposit > 0 ? fmtAUD(purchasePrice - data.deposit) : fmtAUD(0)}
                  </td>
                  <td className="px-4 py-3">{lvr.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    {lmi === -1 ? "No data" : fmtAUD(lmi)}{" "}
                    {FHBGResult.eligible && <span className="text-[10px] text-zinc-400">FHBG</span>}
                  </td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    {fmtAUD(cashOnHand)} {lmi === -1 && "+ LMI"}
                  </td>
                  <td className="px-4 py-3">{fmtAUD(monthlyRepayment)}</td>
                  <td>
                    <div className="flex flex-row gap-2 px-4 py-3 items-center">
                      {FHBASResult.eligible ? (
                        FHBASResult.type === "full" ? (
                          <Pill
                            // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                            status="G"
                            text="FHBAS"
                            url={urlFHBAS}
                            reason={"Full exemption"}
                          />
                        ) : (
                          <Pill
                            // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                            status="A"
                            text="FHBAS"
                            url={urlFHBAS}
                            reason={"Concessional discount"}
                          />
                        )
                      ) : (
                        <Pill
                          // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBAS)}
                          status="R"
                          text="FHBAS"
                          url={urlFHBAS}
                          reason={FHBASResult.reason}
                        />
                      )}
                      {FHOGResult.eligible ? (
                        <Pill
                          // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHOG)}
                          status="G"
                          text="FHOG"
                          url={urlFHOG}
                          reason={FHOGResult.reason}
                        />
                      ) : (
                        <>
                          <Pill
                            // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHOG)}
                            status="R"
                            text="FHOG"
                            url={urlFHOG}
                            reason={FHOGResult.reason}
                          />
                        </>
                      )}
                      {FHBGResult.eligible ? (
                        <Pill
                          // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBG)}
                          status="G"
                          text="FHBG"
                          url={urlFHBG}
                          reason={FHBGResult.reason}
                        />
                      ) : (
                        <>
                          <Pill
                            // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBG)}
                            status="R"
                            text="FHBG"
                            url={urlFHBG}
                            reason={FHBGResult.reason}
                          />
                        </>
                      )}
                      {FHBCResult.eligible ? (
                        <Pill
                          // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBC)}
                          status="G"
                          text="FHBC"
                          url={urlFHBC}
                          reason={FHBCResult.reason}
                        />
                      ) : (
                        <>
                          <Pill
                            // onMouseEnter={(e) => onItemHover(e, HELPTEXT.FHBC)}
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
