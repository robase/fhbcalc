import { useState } from "react"
import type { CalcData } from "~/utls/defaults"
import AssistanceArea from "./AssistanceArea"
import InfoForm from "./InfoForm"
import ResultsTable from "./ResultsTable"

export default function MainView() {
  const [calcState, setCalcState] = useState<CalcData | null>(null)

  const [focusedItem, setFocusedItem] = useState("")

  return (
    <div className="container xl:mx-auto">
      <h1 className="px-8 mt-10 mb-8 text-4xl text-zinc-700 tracking-normal font-spartan font-semibold">
        🏠 <span className="px-2"> </span>First Home Buyer Calculator
      </h1>
      <div className="flex flex-col gap-20 px-8 mt-20 xl:flex-col mb-8 2xl:max-w-screen-2xl">
        <div>
          <InfoForm onItemHover={setFocusedItem} onValueChange={(values: CalcData) => setCalcState(values)} />
        </div>
        <div>
          <ResultsTable data={calcState} />
        </div>
      </div>
      <hr className="mb-8 mx-9" />
      <div className="flex flex-row flex-wrap justify-between font-roboto text-sm px-8 mb-8 text-zinc-700">
        <div>
          <p>Assumptions:</p>
          <ul className="list-inside list-disc pl-4 pt-2">
            <li>you are a first home buyer</li>
            <li>you are an australian citizen</li>
            <li>you are over 18</li>
            <li>you or your partner have never previously owned a home</li>
          </ul>
        </div>
        <div>
          <p>Sources:</p>
          <ul className="list-inside list-disc pl-4 pt-2">
            <li>
              <a
                rel="noreferrer"
                className="underline"
                target="_blank"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
              >
                First Home Buyer Assistance Scheme (FBHAS)
              </a>
            </li>
            <li>
              <a
                rel="noreferrer"
                target="_blank"
                className="underline"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes"
              >
                First Home Owner's Grant (FHOG)
              </a>
            </li>
            <li>
              <a
                rel="noreferrer"
                className="underline"
                target="_blank"
                href="https://www.nhfic.gov.au/support-buy-home/first-home-guarantee"
              >
                First Home Buyer Guarantee (FHBG)
              </a>
            </li>
            <li>
              <a
                rel="noreferrer"
                target="_blank"
                className="underline"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice"
              >
                First Home Buyer Choice (FHBC)
              </a>
            </li>
          </ul>
        </div>
        <div className="max-w-md">
          <p>
            Please note that this is a tool intended to compliment your own research, this is not financial advice.
            <br />
            <br /> No data is collected, retained or stored anywhere from this site, it never leaves your browser.
          </p>
        </div>
      </div>
    </div>
  )
}
