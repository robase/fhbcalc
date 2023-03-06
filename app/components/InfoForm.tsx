import { useForm } from "react-hook-form"
import type { CalcData } from "~/utls/defaults"
import { CALC_DEFAULTS } from "~/utls/defaults"

export default function InfoForm({
  onValueChange,
  onItemHover,
}: {
  onValueChange: (values: CalcData) => void
  onItemHover: (focusedItem: string) => void
}) {
  const { register, getValues } = useForm()

  return (
    <form
      onChange={() => onValueChange(getValues() as CalcData)}
      className="text-sm grid grid-cols-3 gap-y-4 md:grid-cols-2 xl:grid-cols-5 grid-cols-[200px] font-roboto"
    >
      <div onMouseEnter={() => onItemHover("occupier-vs-investor")}>
        <label htmlFor="form-fieldset-purpose" className="mb-4 font-medium">
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
          <label htmlFor="form-radio-occupier" className="mr-8 cursor-pointer">
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
          <label htmlFor="form-radio-investor" className="mx-2 cursor-pointer">
            As an investment
          </label>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("state")}>
        <label htmlFor="form-state" className="block font-semibold mr-2 mb-2">
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
        <label htmlFor="form-fieldset-participants" className="mb-4 font-semibold">
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
        <label htmlFor="form-income" className="block font-semibold mr-2">
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
        <label htmlFor="form-deposit" className="block font-semibold mr-2">
          How much have you saved for a deposit?
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
        <label htmlFor="form-expenses" className="block font-semibold mr-2">
          What are your monthly expenses?
        </label>
        <p className="text-xs text-zinc-600 ">
          e.g. food, clothes, loan repayments -
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
        <label htmlFor="form-hecs" className="block font-semibold mr-2">
          Do you have a HECS debt?
        </label>
        <p className="text-xs pt-2 pb-2 text-zinc-600">Add your remaining amount, otherwise 0</p>
        <input defaultValue={CALC_DEFAULTS.hecs} className="mt-2" id="form-hecs" {...register("hecs")} type="number" />
      </div>
      <div onMouseEnter={() => onItemHover("location")}>
        <label htmlFor="form-fieldset-location" className="mb-4 font-semibold">
          Where are you buying?
        </label>
        <fieldset id="form-fieldset-location" className="pt-4 flex flex-col gap-2">
          <div>
            <input
              type="radio"
              {...register("location")}
              value="city"
              id="form-radio-city"
              className="cursor-pointer float-left mt-2"
              defaultChecked={CALC_DEFAULTS.location === "city"}
            />
            <label htmlFor="form-radio-city" className="mr-14 cursor-pointer ml-6 block">
              {CALC_DEFAULTS.state === "NSW"
                ? "Sydney, Newcastle, Lake Macquarie or Illawarra"
                : "Capital City or Regional Centre"}
            </label>
          </div>
          <div>
            <input
              type="radio"
              {...register("location")}
              value="regional"
              id="form-radio-regional"
              className="cursor-pointer"
              defaultChecked={CALC_DEFAULTS.location === "regional"}
            />
            <label htmlFor="form-radio-regional" className="mx-2 cursor-pointer">
              Rest of State
            </label>
          </div>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("new-or-existing")}>
        <label htmlFor="form-fieldset-new-or-existing" className="mb-4 font-semibold mr-4">
          Buying an existing, new property or vacant land?
        </label>
        <fieldset id="form-fieldset-new-or-existing" className="pt-4 flex flex-col gap-1">
          <div>
            <input
              type="radio"
              {...register("propertyBuild")}
              value="existing"
              id="form-radio-existing"
              className="mr-2 cursor-pointer"
              defaultChecked={CALC_DEFAULTS.propertyBuild === "existing"}
            />
            <label htmlFor="form-radio-existing" className="mr-8 cursor-pointer">
              Existing
            </label>
          </div>
          <div>
            <input
              type="radio"
              {...register("propertyBuild")}
              value="new-property"
              id="form-radio-new-property"
              className="cursor-pointer"
              defaultChecked={CALC_DEFAULTS.propertyBuild === "new-property"}
            />
            <label htmlFor="form-radio-new-property" className="mx-2 cursor-pointer">
              New <p className="text-xs inline-block">(e.g. off the plan)</p>
            </label>
          </div>
          <div>
            <input
              type="radio"
              {...register("propertyBuild")}
              value="vacant-land"
              id="form-radio-vacant-land"
              className="cursor-pointer"
              defaultChecked={CALC_DEFAULTS.propertyBuild === "vacant-land"}
            />
            <label htmlFor="form-radio-vacant-land" className="mx-2 cursor-pointer">
              Vacant Land
            </label>
          </div>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("land-value")}>
        <label htmlFor="form-land-value" className="block font-semibold mr-2">
          What is the land value of the property?
        </label>
        <input
          className="border"
          defaultValue={CALC_DEFAULTS.landValue}
          id="form-land-value"
          {...register("landValue")}
          type="number"
        />
      </div>
    </form>
  )
}
