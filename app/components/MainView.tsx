import { useState } from "react"
import type { CalcData } from "~/utls/defaults"
import AssistanceArea from "./AssistanceArea"
import Calculator from "./Calculator"
import ResultsTable from "./Results"

export default function MainView() {
  const [calcState, setCalcState] = useState<CalcData | null>(null)

  const [focusedItem, setFocusedItem] = useState("")

  return (
    <>
      <div className="container lg:mx-auto max-w-2xl px-8">
        <div className="max-w-2xl mb-14">
          <h1 className="my-10 text-4xl font-semibold">How do I buy my first house?</h1>
          <p className="">
            There's a lot to think about when buying a house for the first time. This site aims to centralise the basic
            knowledge required to get started. Please note that this is only a tool
            <b> intended to compliment your own research, this is not financial advice</b>.
          </p>
          <p className="mt-4">
            No data is collected, retained or stored anywhere from this site, it never leaves your browser
          </p>
        </div>

        <h3 className="text-2xl mb-8">First, some finacial info</h3>
        <Calculator onItemHover={setFocusedItem} onValueChange={(values: CalcData) => setCalcState(values)} />
        <h3 className="text-2xl mt-8">Your outlook</h3>
      </div>

      <ResultsTable data={calcState} />

      <div className="container lg:mx-auto max-w-2xl mt-8 px-8">
        <h3 className="text-2xl">What does this mean?</h3>
      </div>
    </>
  )
}
