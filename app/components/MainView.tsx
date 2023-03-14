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
      <div className="flex sm:flex-row  flex-col gap-6 px-8 mt-10 mb-8 items-center justify-start">
        <div className="pt-3">
          <svg
            width="70px"
            height="81px"
            className="fill-zinc-600"
            viewBox="0.0 0.0 100 116"
            preserveAspectRatio="xMidYMid meet"
            strokeWidth="50"
            version="1.1"
            id="svg5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs />
            <g>
              <g transform="matrix(0.26458333,0,0,0.26458333,45.035239,29.177259)">
                <g>
                  <path d="m -2.7117918,-110.27626 c -12.3311702,0 -24.6642402,4.81293 -33.9218802,14.439458 l -0.07617,0.08008 c -0.0036,0.0037 -0.0082,0.0061 -0.01172,0.0098 L -154.32313,25.872185 c -10.21933,10.52228 -15.92031,24.62294 -15.88867,39.29101 V 219.38195 c 0.0386,31.74034 25.75965,57.46143 57.5,57.5 h 219.95899 v 0.21679 c 31.75099,-0.0386 57.48095,-25.76854 57.51953,-57.51953 V 65.307735 c 0.0318,-14.67297 -5.67176,-28.77691 -15.89453,-39.30274 L 135.69446,12.376085 135.38782,11.897575 31.208128,-95.836802 C 21.950488,-105.46333 9.6193682,-110.27626 -2.7117918,-110.27626 Z m -0.07813,35.128911 c 3.19104001,0 6.38305,1.26291 8.75391,3.789063 L 123.70227,50.342885 c 0.59565,0.61773 1.15143,1.26776 1.66406,1.94531 2.82866,3.73879 4.36711,8.32339 4.33789,13.0586 V 219.57921 c -0.016,11.93882 -9.31952,21.67501 -21.07031,22.4336 -0.43587,-0.0325 -0.85269,-0.13086 -1.29687,-0.13086 h -220.00001 c -12.41954,-0.0165 -22.48347,-10.08047 -22.5,-22.5 V 65.202265 c -0.0292,-4.73363 1.51017,-9.31716 4.33789,-13.05469 0.51245,-0.67733 1.06666,-1.32776 1.66211,-1.94531 l 117.613288,-121.568364 0.0078,0.0078 c 2.3708302,-2.526153 5.5609102,-3.789063 8.7519502,-3.789063 z" />
                </g>
                <path d="m 164.75526,219.46467 c -0.0168,14.23174 -5.20526,27.25161 -13.78637,37.282 -10.52961,12.30798 -26.16826,20.11476 -43.63165,20.13598 v -17.5 -17.5 c 12.40185,-0.0168 22.45147,-10.06607 22.46794,-22.46793" />
                <rect width="34.950081" height="121.2799" x="129.80515" y="98.18631" />
              </g>
            </g>
          </svg>
        </div>
        <div>
          <h1 className="text-4xl text-center text-zinc-700 tracking-normal font-spartan font-semibold leading-relaxed sm:break-before-auto">
            First Home Buyer Calculator
          </h1>
        </div>
      </div>
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
