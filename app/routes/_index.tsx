import { useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import LZString from "lz-string";
import { BoxArrowUpRight, Github, InfoCircle, PlusCircle } from "react-bootstrap-icons";
import type { HelpText } from "~/components/AssistanceArea";
import AssistanceArea from "~/components/AssistanceArea";
import ResultsTable from "~/components/ResultsTable";
import CopyResultsButton from "~/components/CopyResultsButton";
import logoSVG from "../images/logo.svg";
import InputForm from "~/components/Form";
import type { FormResponse, CalcSettings } from "~/services/defaults";
import { SETTINGS_DEFAULT, FORM_DEFAULT } from "~/services/defaults";
import { calcTableData } from "~/services/calculators/loan";

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

  const [numberOfRows, setNumberOfRows] = useState(15);

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
  const [loanPeriod, setLoanPeriod] = useState<number | string>(calcSettings.loanPeriod);

  // Assistance area
  const [focusedItem, setFocusedItem] = useState<{ item: HelpText; x: number; y: number }>();

  const handleItemFocus = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>, item: HelpText) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFocusedItem({ item, x: rect.left, y: rect.top + rect.height + 40 });
  };

  const [linkButtonText, setLinkButtonText] = useState("Copy results link");

  const tableData = useMemo(
    () => calcTableData(formValues, calcSettings, numberOfRows),
    [calcSettings, formValues, numberOfRows]
  );

  return (
    <>
      <AssistanceArea
        state={formValues.state}
        focusedItem={focusedItem}
        clearFocusedItem={() => setFocusedItem(undefined)}
      />
      <div className=" xl:container xl:mx-auto transition-all ease-in-out">
        <div className="flex sm:flex-row  flex-col gap-6 px-8 mt-10 mb-8 items-center justify-start">
          <div className="pt-0">
            <img src={logoSVG} width="70" height="81" alt="FHB Help logo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl text-center text-zinc-600 tracking-normal font-spartan font-semibold  sm:break-before-auto">
              First Home Buyer Calculator
            </h1>
            <h3 className="text-xl text-zinc-400 tracking-normal font-spartan max-sm:text-center max-sm:pt-2">
              firsthomebuyer.help
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-20 mt-16 xl:flex-col mb-8 2xl:max-w-screen-4xl">
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
                Purchase price interval
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
              <label htmlFor="interestRate" className="block text-xs font-light font-roboto text-zinc-500 select-none">
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
            <div>
              <label htmlFor="interestRate" className="block text-xs font-light font-roboto text-zinc-500 select-none">
                Loan period (years)
              </label>
              <input
                id="loanPeriod"
                type="number"
                className="block w-36 py-1.5 border-zinc-400"
                min={1}
                step={1}
                max={40}
                value={loanPeriod}
                onChange={(e) => {
                  if (e.target?.value) {
                    setCalcSettings((prev) => ({ ...prev, loanPeriod: parseInt(e.target.value) }));
                  }
                  setLoanPeriod(e.target?.value);
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
        {numberOfRows < 100 && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => setNumberOfRows((rows) => rows + 10)}
              className="flex p-4 gap-2 items-center text-zinc-500 hover:text-black rounded-md"
            >
              <PlusCircle className="h-4" />
              <p className="text-xs">Add more rows</p>
            </button>
          </div>
        )}
        <p className="pt-2 pb-4 mx-6 text-sm">* estimate only</p>
        <div className="flex flex-row max-sm:flex-col max-sm:items-center justify-between gap-4 md:mx-6 max-sm:justify-start mb-8">
          <a rel="noreferrer" target="_blank" href="https://forms.gle/4vpH5Szigse9fq8v8" className="w-fit">
            <div className="px-4 text-sm py-2 border rounded-md bg-white w-46 flex gap-4 hover:bg-zinc-200 border-zinc-400 cursor-pointer items-center">
              <span className="whitespace-nowrap font-sans uppercase text-zinc-600">Provide Feedback</span>
              <BoxArrowUpRight aria-hidden size="1em" />
            </div>
          </a>
          <CopyResultsButton
            linkText={linkButtonText}
            setLinkText={setLinkButtonText}
            handleCopyLink={() => valuesToURLParam()}
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between gap-x-4 gap-y-12 font-roboto text-sm px-8 mb-8 text-zinc-500">
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
            <p className="max-w-xs">
              This calculator is open source, keeping it updated takes time! Contributions welcome:
            </p>
            <div className="mt-4 max-w-fit">
              <a
                href="https://github.com/robase/fhbcalc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline w-fit hover:text-zinc-800 "
              >
                <div className=" flex gap-2 max-w-fit items-center border rounded-md px-4 py-2 hover:bg-white">
                  <Github className="h-6 w-6" />
                  View GitHub repo
                </div>
              </a>
            </div>
          </div>
          <div className="max-w-md">
            <p>
              Please note that this is a tool intended to compliment your own research, this is not financial advice.
              Please report errors via the{" "}
              <a
                href="https://forms.gle/4vpH5Szigse9fq8v8"
                target="_blank"
                rel="noopener noreferrer"
                className="underline w-fit hover:text-zinc-800 "
              >
                feedback form
              </a>
              .
              <br />
              <br /> No data is collected, retained or stored anywhere from this site, it never leaves your browser.
              <br />
              <br />
              Last updated 20/11/23
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
