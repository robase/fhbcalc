import CurrencyInput from "react-currency-input-field";
import type { FieldValues, UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { FormResponse } from "~/services/defaults";
import { State } from "~/services/defaults";
import { getQuestions } from "~/services/formSchema";

export default function InputForm({
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
      className="text-zinc-700 grid gap-y-4 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 font-roboto max-xl:pl-8 max-xl:py-8 bg-gradient-to-b from-[#f3f6f8] to-[#f6f8fa] xl:p-8 rounded-xl" // border-8 border-[#c7d4dd31] p-6
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
          {Object.values(State)
            .sort()
            .map((state, i) => (state === "NSW" || state === "VIC") && <option key={`${i}-${state}`}>{state}</option>)}
          <option disabled>More coming soon</option>
        </select>
      </div>
      {getQuestions(values.state).map((question) =>
        question.type === "select" ? (
          <SwitchInput
            key={question.label + question.name + question.type}
            label={question.label}
            name={question.name}
            options={question.options}
            register={register}
            defaultValue={
              values[question.name as keyof Pick<FormResponse, "location" | "participants" | "location" | "purpose">]
            }
          />
        ) : (
          <MoneyInput
            key={question.label + question.name + question.type}
            helpText={question.helpText}
            label={question.label}
            name={question.name}
            register={register}
            defaultValue={values[question.name as keyof Pick<FormResponse, "deposit" | "expenses" | "hecs" | "income">]}
          />
        )
      )}
    </form>
  );
}

export function SwitchInput({
  name,
  label,
  options,
  defaultValue,
  register,
}: {
  name: string;
  label: string;
  options: { description: string; value: string }[];
  defaultValue: string;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={`form-fieldset-${name}`} className="mb-2 font-bold select-none">
        {label}
      </label>
      <fieldset defaultValue={options[0].value} id={`form-fieldset-${name}`} className="pt-0 flex flex-col gap-2">
        {options.map(({ description, value }) => (
          <div key={name + value} className="flex flex-row gap-2 items-center">
            <input
              type="radio"
              value={value}
              id={`form-radio-${value}`}
              className="cursor-pointer text-md"
              {...register(name)}
              defaultChecked={defaultValue === value}
            />
            <label htmlFor={`form-radio-${value}`} className="mr-8 cursor-pointer">
              {description}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

export function MoneyInput({
  name,
  label,
  defaultValue,
  helpText,
  register,
}: {
  name: string;
  label: string;
  helpText?: string;
  defaultValue: number;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <div className="flex flex-col justify-between">
      <div>
        <label htmlFor={`form-${name}`} className="block font-bold  mr-2 select-none">
          {label}
        </label>
        <p className="text-xs py-1 text-zinc-600">{helpText}</p>
      </div>
      <CurrencyInput
        className="max-w-fit border-[#24282b]"
        id={`form-${name}`}
        intlConfig={{ locale: "en-AU", currency: "AUD" }}
        placeholder="Please enter a number"
        defaultValue={defaultValue}
        decimalsLimit={2}
        {...register(name, {
          setValueAs: (v) => (typeof v === "number" ? v : Number(v.replace(/[^0-9.-]+/g, ""))),
        })}
      />
    </div>
  );
}
