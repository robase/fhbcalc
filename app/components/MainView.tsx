import { useState } from "react"
import type { CalcData } from "~/utls/defaults"
import AssistanceArea from "./AssistanceArea"
import InfoForm from "./InfoForm"
import ResultsTable from "./ResultsTable"

export default function MainView() {
  const [calcState, setCalcState] = useState<CalcData | null>(null)

  const [focusedItem, setFocusedItem] = useState("")

  return (
    <>
      <div className="flex flex-row flex-wrap ">
        <div className="px-8">
          <h1 className="my-10 text-4xl font-semibold">First Home Buyer Calulator</h1>
        </div>
        <div className="max-w-2xl mb-14 px-8 pt-10">
          <p className="text-sm">
            Please note that this is only a tool
            <b> intended to compliment your own research, this is not financial advice</b>. No data is collected,
            retained or stored anywhere from this site, it never leaves your browser. This calculator assumes: you are
            an australian citizen, you are over 18 and you or your partner have never previously owned a home
          </p>
        </div>
      </div>
      <div className="flex flex-col px-8 xl:flex-col">
        <div>
          <h3 className="text-2xl mb-8">Your Info</h3>
          <InfoForm onItemHover={setFocusedItem} onValueChange={(values: CalcData) => setCalcState(values)} />
        </div>
        <div>
          <h3 className="text-2xl mb-2 mt-8">Results</h3>
          <ResultsTable data={calcState} />
        </div>
      </div>
    </>
  )
}
