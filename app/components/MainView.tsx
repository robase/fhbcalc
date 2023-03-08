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
          {/* <h3 className="text-2xl font-medium mb-8">Your Info</h3> */}
          <InfoForm onItemHover={setFocusedItem} onValueChange={(values: CalcData) => setCalcState(values)} />
        </div>
        <div>
          {/* <h3 className="text-2xl mb-2 mt-8 mb-8">Results</h3> */}
          <ResultsTable data={calcState} />
        </div>
      </div>
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
