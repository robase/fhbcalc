import { useForm } from "react-hook-form";
import type { FormResponse } from "~/utls/defaults";
import CurrencyInput from "react-currency-input-field";

function locationCapitals(values: FormResponse) {
  switch (values.state) {
    case "NSW":
      return "Sydney, Newcastle, Lake Macquarie or Illawarra";
    case "VIC":
      return "Melbourne or Geelong";
    case "QLD":
      return "Brisbane, Gold Coast ord Sunshine Coast";
    default:
      return "Capital City or Regional Centre";
  }
}

export default function InfoForm({
  values,
  onValueChange,
}: {
  values: FormResponse;
  onValueChange: (values: FormResponse) => void;
}) {
  const { register, getValues } = useForm();

  return (
    <form
      onChange={() => onValueChange(getValues() as FormResponse)}
      className="text-zinc-700 grid gap-y-4 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 font-roboto max-xl:pl-8 max-xl:py-8 bg-gradient-to-b from-[#fbfbfd] to-[#f6f8fa] xl:p-8 rounded-xl" // border-8 border-[#c7d4dd31] p-6
    >
      <div className="flex flex-col gap-2 ">
        <label htmlFor="form-state" className="block font-bold select-none">
          What state are you in?
        </label>
        <select
          defaultValue={values.state}
          id="form-state"
          {...register("state")}
          className="max-w-fit border-[#24282b]"
        >
          <option>NSW</option>
          <option>VIC</option>
          <option disabled>More coming soon</option>
          {/* <option>ACT</option>
          <option>NT</option>
          <option>QLD</option>
          <option>SA</option>
          <option>TAS</option>
          <option>WA</option> */}
        </select>
      </div>
      <div
        // onMouseEnter={(e) => onItemHover(e, "occupier-vs-investor")}
        className=" flex flex-col"
      >
        <label htmlFor="form-fieldset-purpose" className="mb-4 font-bold select-none">
          Why are you buying a place?
        </label>
        <fieldset defaultValue="occupier" id="form-fieldset-purpose" className="pt-2 flex flex-col gap-2">
          <div>
            <input
              type="radio"
              value="occupier"
              id="form-radio-occupier"
              className="mr-2 cursor-pointer"
              {...register("purpose")}
              defaultChecked={values.purpose === "occupier"}
            />
            <label htmlFor="form-radio-occupier" className="mr-8 cursor-pointer">
              To live in
            </label>
          </div>
          <div>
            <input
              type="radio"
              {...register("purpose")}
              value="investor"
              defaultChecked={values.purpose === "investor"}
              id="form-radio-investor"
              className="cursor-pointer"
            />
            <label htmlFor="form-radio-investor" className="mx-2 cursor-pointer">
              As an investment
            </label>
          </div>
        </fieldset>
      </div>
      {!["NT", "ACT"].includes(values.state) && (
        <div
          // onMouseEnter={() => onItemHover("location")}
          className=""
        >
          <label htmlFor="form-fieldset-location" className="mb-4 font-bold  select-none">
            Where are you buying?
          </label>
          <fieldset id="form-fieldset-location" className="pt-2 flex flex-col gap-2 align-middle">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                {...register("location")}
                value="city"
                id="form-radio-city"
                className="cursor-pointer float-left"
                defaultChecked={values.location === "city"}
              />
              <label htmlFor="form-radio-city" className="mr-14 cursor-pointer block">
                {locationCapitals(values)}
              </label>
            </div>
            <div>
              <input
                type="radio"
                {...register("location")}
                value="regional"
                id="form-radio-regional"
                className="cursor-pointer"
                defaultChecked={values.location === "regional"}
              />
              <label htmlFor="form-radio-regional" className="mx-3 cursor-pointer">
                Rest of State
              </label>
            </div>
          </fieldset>
        </div>
      )}
      <div
        // onMouseEnter={() => onItemHover("new-or-existing")}
        className=""
      >
        <label htmlFor="form-fieldset-new-or-existing" className="mb-4 font-bold select-none">
          Buying an existing, new property or vacant land?
        </label>
        <fieldset id="form-fieldset-new-or-existing" className="pt-2 flex flex-col gap-1">
          <div>
            <input
              type="radio"
              {...register("propertyBuild")}
              value="existing"
              id="form-radio-existing"
              className="mr-2 cursor-pointer"
              defaultChecked={values.propertyBuild === "existing"}
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
              defaultChecked={values.propertyBuild === "new-property"}
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
              defaultChecked={values.propertyBuild === "vacant-land"}
            />
            <label htmlFor="form-radio-vacant-land" className="mx-2 cursor-pointer">
              Vacant land
            </label>
          </div>
        </fieldset>
      </div>
      <div
        className=""
        // onMouseEnter={() => onItemHover("single-vs-couple")}
      >
        <label htmlFor="form-fieldset-participants" className="mb-4 font-bold  select-none">
          Buying as a single or a couple?
        </label>
        <fieldset id="form-fieldset-participants" className="pt-2 flex flex-col gap-1">
          <div>
            <input
              type="radio"
              {...register("participants")}
              value="single"
              id="form-radio-single"
              className="mr-2 cursor-pointer"
              defaultChecked={values.participants === "single"}
            />
            <label htmlFor="form-radio-single" className="mr-8 cursor-pointer">
              Single
            </label>
          </div>
          <div>
            <input
              type="radio"
              {...register("participants")}
              value="couple"
              id="form-radio-couple"
              className="cursor-pointer"
              defaultChecked={values.participants === "couple"}
            />
            <label htmlFor="form-radio-couple" className="mx-2 cursor-pointer">
              Couple
            </label>
          </div>
        </fieldset>
      </div>
      <div
        // onMouseEnter={() => onItemHover("income")}
        className="flex flex-col justify-between "
      >
        <div>
          <label htmlFor="form-income" className="block font-bold  mr-2 select-none">
            What is your yearly pre-tax income?
          </label>
          <p className="text-xs py-1 text-zinc-600">Combined if a couple</p>
        </div>
        <CurrencyInput
          className="max-w-fit border-[#24282b]"
          id="form-income"
          // onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={values.income}
          decimalsLimit={2}
          {...register("income", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div
        // onMouseEnter={() => onItemHover("deposit")}
        className="flex flex-col justify-between "
      >
        <label htmlFor="form-deposit" className="block font-bold  mr-2 select-none">
          How much have you saved for a deposit?
        </label>
        <CurrencyInput
          className="max-w-fit border-[#24282b]"
          id="form-deposit"
          // onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={values.deposit}
          decimalsLimit={2}
          {...register("deposit", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div
        // onMouseEnter={() => onItemHover("expenses")}
        className="flex flex-col justify-between "
      >
        <div>
          <label htmlFor="form-expenses" className="block font-bold  mr-2 select-none">
            What are your monthly living expenses?
          </label>
          <p className="text-xs py-1 text-zinc-600">e.g. food, clothes and other loan repayments, don't include rent</p>
        </div>
        <CurrencyInput
          id="form-expenses"
          className="max-w-fit border-[#24282b]"
          // onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={values.expenses}
          decimalsLimit={2}
          {...register("expenses", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
      <div
        // onMouseEnter={() => onItemHover("hecs")}
        className="flex flex-col justify-between "
      >
        <label htmlFor="form-hecs" className="block font-bold mr-2  select-none">
          Do you have a HECS debt?
        </label>
        <p className="text-xs py-1 text-zinc-600">Add your total remaining amount</p>

        <CurrencyInput
          id="form-hecs"
          className="max-w-fit border-[#24282b]"
          // onFocus={(e) => e.target.select()}
          intlConfig={{ locale: "en-AU", currency: "AUD" }}
          placeholder="Please enter a number"
          defaultValue={values.hecs}
          decimalsLimit={2}
          {...register("hecs", { setValueAs: (v) => Number(v.replace(/[^0-9.-]+/g, "")) })}
        />
      </div>
    </form>
  );
}
