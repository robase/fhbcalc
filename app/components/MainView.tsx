import { useSearchParams } from "@remix-run/react"
import { useState } from "react"
import type { CalcData } from "~/utls/defaults"
import { CALC_DEFAULTS } from "~/utls/defaults"
import InfoForm from "./InfoForm"
import ResultsTable from "./ResultsTable"
import LZString from "lz-string"
import type { HELPTEXT } from "./AssistanceArea"
import AssistanceArea from "./AssistanceArea"
import { BoxArrowUpRight } from "react-bootstrap-icons"

export default function MainView() {
  const [params] = useSearchParams()

  const urlCalcData = JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("d") || "")) as CalcData

  const defaultValues = urlCalcData ? urlCalcData : CALC_DEFAULTS
  const [calcState, setCalcState] = useState<CalcData>(defaultValues)

  const [focusedItem, setFocusedItem] = useState<{ item: HELPTEXT; x: number; y: number }>()

  const handleItemFocus = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>, item: HELPTEXT) => {
    const rect = e.currentTarget.getBoundingClientRect()

    setFocusedItem({ item, x: rect.left, y: rect.top + rect.height + 40 })
  }

  return (
    <div className=" xl:container xl:mx-auto transition-all ease-in-out">
      <AssistanceArea focusedItem={focusedItem} clearFocusedItem={() => setFocusedItem(undefined)} />
      <h1 className="px-8 mt-10 mb-8 text-4xl text-zinc-700 tracking-normal font-spartan font-semibold leading-relaxed">
        🏠 <span className="px-2"> </span>First Home Buyer Calculator
      </h1>
      <div className="flex flex-col gap-20  mt-20 xl:flex-col mb-8 2xl:max-w-screen-4xl">
        <div className="px-8">
          <InfoForm
            onItemHover={handleItemFocus}
            onValueChange={(values: CalcData) => setCalcState(values)}
            defaultValues={defaultValues}
          />
        </div>
        <div className="px-1 md:px-8">
          <ResultsTable onItemHover={handleItemFocus} data={calcState} />
        </div>
      </div>
      <div className="w-fit mx-8 mb-8">
        <a rel="noreferrer" target="_blank" href="https://forms.gle/4vpH5Szigse9fq8v8" className="w-fit">
          <div className="px-4 text-sm py-2 border bg-white w-44 flex gap-4 hover:bg-zinc-100 border-zinc-300 rounded-lg cursor-pointer items-center">
            <span>Provide Feedback</span> <BoxArrowUpRight aria-hidden size="1em" />
          </div>
        </a>
      </div>
      <div className="flex flex-row flex-wrap justify-between gap-4 font-roboto text-sm px-8 mb-8 text-zinc-500">
        <div>
          <p>Assumptions:</p>
          <ul className="list-inside list-disc pl-2 pt-2">
            <li>you are a first home buyer</li>
            <li>you are an australian citizen</li>
            <li>you are over 18</li>
            <li>you or your partner have never previously owned a home</li>
          </ul>
        </div>
        <div>
          <p>Sources:</p>
          <ul className="list-inside list-disc pl-2 pt-2">
            <li>
              <a
                rel="noreferrer"
                className="underline"
                target="_blank"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
              >
                First Home Buyer Assistance Scheme (FHBAS)
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
            Accuracy is best effort
            <br />
            <br /> No data is collected, retained or stored anywhere from this site, it never leaves your browser.
            <br />
            <br />
            v0.0.1 - last updated 14/03/23
          </p>
        </div>
      </div>
    </div>
  )
}
