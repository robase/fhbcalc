import { useForm } from "react-hook-form"
import type { CalcData } from "~/utls/defaults"
import { CALC_DEFAULTS } from "~/utls/defaults"

export default function Calculator({
  onValueChange,
  onItemHover,
}: {
  onValueChange: (values: CalcData) => void
  onItemHover: (focusedItem: string) => void
}) {
  const { register, getValues } = useForm()

  return (
    <form onChange={() => onValueChange(getValues() as CalcData)} className="grid grid-cols-1 gap-y-8 sm:grid-cols-2">
      <div onMouseEnter={() => onItemHover("occupier-vs-investor")}>
        <label htmlFor="form-fieldset-purpose" className="mb-4 font-semibold whitespace-nowrap">
          Why are you buying a place?
        </label>
        <fieldset defaultValue="occupier" id="form-fieldset-purpose" className="pt-4">
          <input
            type="radio"
            value="occupier"
            id="form-radio-occupier"
            className="mr-2 cursor-pointer"
            {...register("purpose")}
            defaultChecked={CALC_DEFAULTS.purpose === "occupier"}
          />
          <label htmlFor="form-radio-occupier" className="mr-8 cursor-pointer whitespace-nowrap">
            To live in
          </label>
          <input
            type="radio"
            {...register("purpose")}
            value="investor"
            defaultChecked={CALC_DEFAULTS.purpose === "investor"}
            id="form-radio-investor"
            className="cursor-pointer"
          />
          <label htmlFor="form-radio-investor" className="mx-2 cursor-pointer whitespace-nowrap">
            As an investment
          </label>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("state")}>
        <label htmlFor="form-state" className="block font-semibold mb-2 whitespace-nowrap">
          What state are you in?
        </label>
        <select defaultValue={CALC_DEFAULTS.state} id="form-state" {...register("state")}>
          <option>NSW</option>
          <option disabled>More coming soon</option>
          {/* <option disabled>ACT</option>
          <option disabled>NT</option>
          <option disabled>QLD</option>
          <option disabled>SA</option>
          <option disabled>TAS</option>
          <option disabled>VIC</option>
          <option disabled>WA</option> */}
        </select>
      </div>
      <div onMouseEnter={() => onItemHover("single-vs-couple")}>
        <label htmlFor="form-fieldset-participants" className="mb-4 font-semibold whitespace-nowrap">
          Buying as a single or a couple?
        </label>
        <fieldset id="form-fieldset-participants" className="pt-4">
          <input
            type="radio"
            {...register("participants")}
            value="single"
            id="form-radio-single"
            className="mr-2 cursor-pointer"
            defaultChecked={CALC_DEFAULTS.participants === "single"}
          />
          <label htmlFor="form-radio-single" className="mr-8 cursor-pointer">
            Single
          </label>
          <input
            type="radio"
            {...register("participants")}
            value="couple"
            id="form-radio-couple"
            className="cursor-pointer"
            defaultChecked={CALC_DEFAULTS.participants === "couple"}
          />
          <label htmlFor="form-radio-couple" className="mx-2 cursor-pointer">
            Couple
          </label>
        </fieldset>
      </div>

      <div onMouseEnter={() => onItemHover("income")}>
        <label htmlFor="form-income" className="block font-semibold whitespace-nowrap">
          What is your yearly income?
        </label>
        <p className="text-xs text-zinc-600">Combined if a couple</p>
        <input
          defaultValue={CALC_DEFAULTS.income}
          className="mt-2"
          id="form-income"
          {...register("income")}
          type="number"
        />
      </div>
      <div onMouseEnter={() => onItemHover("deposit")}>
        <label htmlFor="form-deposit" className="block font-semibold">
          How much have you saved
          <br /> for a deposit?
        </label>
        <input
          className="border"
          defaultValue={CALC_DEFAULTS.deposit}
          id="form-deposit"
          {...register("deposit")}
          type="number"
        />
      </div>
      <div onMouseEnter={() => onItemHover("expenses")}>
        <label htmlFor="form-expenses" className="block font-semibold whitespace-nowrap">
          What are your monthly expenses?
        </label>
        <p className="text-xs text-zinc-600 ">
          e.g. general spending, loan repayments -
          <br /> don't include rent
        </p>
        <input
          defaultValue={CALC_DEFAULTS.expenses}
          className="mt-2"
          id="form-expenses"
          {...register("expenses")}
          type="number"
        />
      </div>
      <div onMouseEnter={() => onItemHover("expenses")}>
        <label htmlFor="form-hecs" className="block font-semibold whitespace-nowrap">
          Do you have a HECS debt?
        </label>
        <p className="text-xs pt-2 pb-2 text-zinc-600">Add your remaining amount, otherwise 0</p>
        <input defaultValue={CALC_DEFAULTS.hecs} className="mt-2" id="form-hecs" {...register("hecs")} type="number" />
      </div>
    </form>
  )
}
