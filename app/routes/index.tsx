import { useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import LZString from "lz-string";
import { BoxArrowUpRight, InfoCircle } from "react-bootstrap-icons";
import type { HelpText } from "~/components/AssistanceArea";
import AssistanceArea from "~/components/AssistanceArea";
import ResultsTable from "~/components/ResultsTable";
import CopyResultsButton from "~/components/CopyResultsButton";
import logoSVG from "../images/logo.svg";
import InputForm from "~/components/Form";
import { calcTableData } from "~/services/calculators";
import type { FormResponse, CalcSettings } from "~/services/defaults";
import { SETTINGS_DEFAULT, FORM_DEFAULT } from "~/services/defaults";

interface URLParamData {
  f: FormResponse;
  s: CalcSettings;
}

const PARAM_CHAR = "d";

function getDefaultValues(paramData: string) {
  const parsedData = JSON.parse(LZString.decompressFromEncodedURIComponent(paramData)) as URLParamData | undefined;

  return {
    settingsDefaults: Object.assign(SETTINGS_DEFAULT, parsedData?.s),
    formDefaults: Object.assign(FORM_DEFAULT, parsedData?.f),
  };
}

export default function BaseRoute() {
  // Get calc state from url param if provided
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { formDefaults, settingsDefaults } = getDefaultValues(params.get(PARAM_CHAR) || "");

  // Form state
  const [formValues, setFormValues] = useState<FormResponse>(formDefaults);
  const [calcSettings, setCalcSettings] = useState<CalcSettings>(settingsDefaults);

  const valuesToURLParam = useCallback(() => {
    const paramData: URLParamData = {
      f: formValues,
      s: calcSettings,
    };

    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(paramData));

    if (typeof document !== "undefined") {
      navigator.clipboard.writeText(window.location.href.split("?")[0] + `?${PARAM_CHAR}=` + compressed);
    }

    navigate(`./?d=${compressed}`, { replace: true });
  }, [calcSettings, formValues, navigate]);

  // Input controllers
  const [interestRate, setInterestRate] = useState<number | string>(calcSettings.interestRate);
  const [priceInterval, setPriceInterval] = useState<number | string>(calcSettings.priceInterval);

  // Assistance area
  const [focusedItem, setFocusedItem] = useState<{ item: HelpText; x: number; y: number }>();

  const handleItemFocus = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>, item: HelpText) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFocusedItem({ item, x: rect.left, y: rect.top + rect.height + 40 });
  };

  const [linkButtonText, setLinkButtonText] = useState("Copy results link");

  const tableData = calcTableData(formValues, calcSettings);

  return (
    <>
      <AssistanceArea focusedItem={focusedItem} clearFocusedItem={() => setFocusedItem(undefined)} />
      <div className=" xl:container xl:mx-auto transition-all ease-in-out">
        <div className="flex sm:flex-row  flex-col gap-6 px-8 mt-10 mb-8 items-center justify-start">
          <div className="pt-2">
            <img src={logoSVG} alt="FHB Help logo" />
          </div>
          <div>
            <h1 className="text-4xl text-center text-zinc-700 tracking-normal font-spartan font-semibold leading-relaxed sm:break-before-auto">
              First Home Buyer Calculator
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-20 mt-20 xl:flex-col mb-8 2xl:max-w-screen-4xl">
          <InputForm
            onValueChange={(values: FormResponse) => {
              setFormValues(values);
            }}
            values={formValues || formDefaults}
          />
        </div>
      </div>
      <div className="sm:hidden m-8 p-4 border-sky-500 border-2 bg-white rounded-full flex flex-row gap-2 items-center">
        <InfoCircle size="20px" />
        <p className="text-xs">Tap table headings for calculation explanations</p>
      </div>
      <div className="max-w-[90em] lg:mx-auto sm:mt-24">
        <div className="flex flex-row gap-4 justify-between items-end pb-4 max-sm:px-8 2xl:max-w-screen-4xl text-zinc-700 overflow-x-auto">
          <div className="flex flex-row gap-4">
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
                onChange={(e) => {
                  if (e.target?.value) {
                    setCalcSettings((prev) => ({ ...prev, priceInterval: parseInt(e.target.value) }));
                  }
                  setPriceInterval(e.target?.value);
                }}
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
                onChange={(e) => {
                  if (e.target?.value) {
                    setCalcSettings((prev) => ({ ...prev, interestRate: parseFloat(e.target.value) }));
                  }
                  setInterestRate(e.target?.value);
                }}
              />
            </div>
          </div>
          <div className="max-md:hidden p-2  pr-3 border bg-white rounded-full flex flex-row gap-2 items-center">
            <InfoCircle size="20px" className="fill-zinc-400 shadow-sm" />
            <p className="text-sm">Click on table headings for calculation explanations</p>
          </div>
          <div>
            <CopyResultsButton
              linkText={linkButtonText}
              setLinkText={setLinkButtonText}
              handleCopyLink={() => valuesToURLParam()}
            />
          </div>
        </div>
        <ResultsTable onItemHover={handleItemFocus} data={tableData} settings={calcSettings} />
      </div>
      <div className="flex flex-row justify-center max-sm:justify-start max-sm:p-8">
        <CopyResultsButton
          linkText={linkButtonText}
          setLinkText={setLinkButtonText}
          handleCopyLink={() => valuesToURLParam()}
        />
      </div>
      <div className="xl:container xl:mx-auto transition-all ease-in-out">
        <div className="w-fit mx-8 mb-8">
          <a rel="noreferrer" target="_blank" href="https://forms.gle/4vpH5Szigse9fq8v8" className="w-fit">
            <div className="px-4 text-sm py-2 border bg-white w-46 flex gap-4 hover:bg-zinc-100 border-zinc-300 cursor-pointer items-center">
              <span className="whitespace-nowrap font-sans uppercase text-zinc-600">Provide Feedback</span>
              <BoxArrowUpRight aria-hidden size="1em" />
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
            </ul>
          </div>
          <div className="max-w-md">
            <p>
              Please note that this is a tool intended to compliment your own research, this is not financial advice.
              <br />
              <br /> No data is collected, retained or stored anywhere from this site, it never leaves your browser.
              <br />
              <br />
              v0.0.2 - last updated 29/06/23
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
