import { useForm } from "react-hook-form"
import { CalcData, CALC_DEFAULTS } from "~/utls/defaults"
// import { defaults } from "~/utls/defaults"
import CurrencyInput from "react-currency-input-field"
import { useEffect, useState } from "react"

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
      className="text-sm text-zinc-700 grid  gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 [&>div]:pr-8  border-zinc-200"
    >
      <div onMouseEnter={() => onItemHover("occupier-vs-investor")}>
        <label htmlFor="form-fieldset-purpose" className="mb-4 font-bold font-spartan">
          Why are you buying a place?
        </label>
        <fieldset defaultValue="occupier" id="form-fieldset-purpose" className="pt-4 font-roboto">
          <input
            type="radio"
            value="occupier"
            id="form-radio-occupier"
            className="mr-2 cursor-pointer"
            {...register("purpose")}
            // defaultChecked={CALC_DEFAULTS.purpose === "occupier"}
          />
          <label htmlFor="form-radio-occupier" className="mr-8 cursor-pointer">
            To live in
          </label>
          <input
            type="radio"
            {...register("purpose")}
            value="investor"
            // defaultChecked={CALC_DEFAULTS.purpose === "investor"}
            id="form-radio-investor"
            className="cursor-pointer"
          />
          <label htmlFor="form-radio-investor" className="mx-2 cursor-pointer">
            As an investment
          </label>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("state")} className="flex flex-col gap-2">
        <label htmlFor="form-state" className="block font-bold mr-2">
          What state are you in?
        </label>
        <select defaultValue={CALC_DEFAULTS.state} id="form-state" {...register("state")} className="max-w-fit">
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
      <div onMouseEnter={() => onItemHover("location")}>
        <label htmlFor="form-fieldset-location" className="mb-4 font-bold font-spartan">
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
              // defaultChecked={CALC_DEFAULTS.location === "city"}
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
              // defaultChecked={CALC_DEFAULTS.location === "regional"}
            />
            <label htmlFor="form-radio-regional" className="mx-2 cursor-pointer">
              Rest of State
            </label>
          </div>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("new-or-existing")}>
        <label htmlFor="form-fieldset-new-or-existing" className="mb-4 font-bold mr-4">
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
              // defaultChecked={CALC_DEFAULTS.propertyBuild === "existing"}
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
              // defaultChecked={CALC_DEFAULTS.propertyBuild === "new-property"}
            />
            <label htmlFor="form-radio-new-property" className="mx-2 cursor-pointer">
              New <p className="text-xs py-1 inline-block">(e.g. off the plan)</p>
            </label>
          </div>
          <div>
            <input
              type="radio"
              {...register("propertyBuild")}
              value="vacant-land"
              id="form-radio-vacant-land"
              className="cursor-pointer"
              // defaultChecked={CALC_DEFAULTS.propertyBuild === "vacant-land"}
            />
            <label htmlFor="form-radio-vacant-land" className="mx-2 cursor-pointer">
              Vacant Land
            </label>
          </div>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("single-vs-couple")}>
        <label htmlFor="form-fieldset-participants" className="mb-4 font-bold font-spartan">
          Buying as a single or a couple?
        </label>
        <fieldset id="form-fieldset-participants" className="pt-4">
          <input
            type="radio"
            {...register("participants")}
            value="single"
            id="form-radio-single"
            className="mr-2 cursor-pointer"
            // defaultChecked={CALC_DEFAULTS.participants === "single"}
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
            // defaultChecked={CALC_DEFAULTS.participants === "couple"}
          />
          <label htmlFor="form-radio-couple" className="mx-2 cursor-pointer">
            Couple
          </label>
        </fieldset>
      </div>
      <div onMouseEnter={() => onItemHover("income")} className="flex flex-col justify-between">
        <div>
          <label htmlFor="form-income" className="block font-bold mr-2">
            What is your yearly income?
          </label>
          <p className="text-xs py-1 text-zinc-600">Combined if a couple</p>
        </div>
        <CurrencyInput
          className="max-w-fit"
          id="form-income"
          onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={CALC_DEFAULTS.income}
          decimalsLimit={2}
          {...register("income", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div onMouseEnter={() => onItemHover("deposit")} className="flex flex-col justify-between">
        <label htmlFor="form-deposit" className="block font-bold mr-2">
          How much have you saved for a deposit?
        </label>
        <CurrencyInput
          className="max-w-fit"
          id="form-deposit"
          onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={CALC_DEFAULTS.deposit}
          decimalsLimit={2}
          {...register("deposit", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div onMouseEnter={() => onItemHover("expenses")} className="flex flex-col justify-between">
        <div>
          <label htmlFor="form-expenses" className="block font-bold mr-2">
            What are your monthly expenses?
          </label>
          <p className="text-xs py-1 text-zinc-600">e.g. food, clothes, loan repayments - don't include rent</p>
        </div>
        <CurrencyInput
          id="form-expenses"
          className="max-w-fit"
          onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={CALC_DEFAULTS.expenses}
          decimalsLimit={2}
          {...register("expenses", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div onMouseEnter={() => onItemHover("expenses")} className="flex flex-col justify-between">
        <div>
          <label htmlFor="form-hecs" className="block font-bold mr-2">
            Do you have a HECS debt?
          </label>
          <p className="text-xs py-1 text-zinc-600">Add your remaining amount, otherwise 0</p>
        </div>
        <CurrencyInput
          id="form-hecs"
          className="max-w-fit"
          onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={CALC_DEFAULTS.hecs}
          decimalsLimit={2}
          {...register("hecs", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div onMouseEnter={() => onItemHover("land-value")} className="flex flex-col justify-between">
        <label htmlFor="form-land-value" className="block font-bold mr-2">
          What is the land value of the property?
        </label>
        <CurrencyInput
          className="max-w-fit"
          onFocus={(e) => e.target.select()}
          id="form-land-value"
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={CALC_DEFAULTS.landValue}
          decimalsLimit={2}
          {...register("landValue", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
    </form>
  )
}
