import React from "react";

import type { Control, FieldValues, UseFormRegister } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { FormResponse } from "~/services/defaults";
import { getQuestions } from "~/services/formSchema";
import { NumericFormat, PatternFormat } from "react-number-format";

export default function InputForm({
  values,
  onValueChange,
}: {
  values: FormResponse;
  onValueChange: (values: FormResponse) => void;
}) {
  const { register, getValues, control } = useForm();

  return (
    <form
      onChange={() => onValueChange(getValues() as FormResponse)}
      className="text-zinc-700 font-roboto grid gap-y-4 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:p-8
        max-xl:pl-8 max-xl:py-8 bg-gradient-to-b from-[#f3f6f8] to-[#f6f8fa] rounded-xl"
    >
      {getQuestions(values.state).map((question) =>
        question.type === "radio" ? (
          <RadioInput
            key={question.label + question.name + question.type}
            label={question.label}
            name={question.name}
            options={question.options}
            register={register}
            defaultValue={values[question.name as keyof Pick<FormResponse, "location" | "participants" | "purpose">]}
          />
        ) : question.type === "select" ? (
          <SelectInput
            key={question.label + question.name + question.type}
            defaultValue={values[question.name as keyof Pick<FormResponse, "dependents" | "state">] as string}
            label={question.label}
            name={question.name}
            options={question.options}
            register={register}
          />
        ) : (
          <MoneyInput
            control={control}
            key={question.label + question.name + question.type}
            HelpText={question.helpText && question.helpText}
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

export function SelectInput({
  name,
  label,
  options,
  defaultValue,
  register,
}: {
  name: string;
  label: string;
  options: { description: string; value: string | number; disabled?: boolean }[];
  defaultValue: string;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="form-state" className="block font-bold select-none">
        {label}
      </label>
      <select
        defaultValue={defaultValue}
        id={`form-select-${name}`}
        {...register(name)}
        className="w-32 border-[#24282b]"
      >
        {options.map((option, i) => (
          <option value={option.value} key={`${i}-${option.description}`} disabled={option.disabled}>
            {option.description}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RadioInput({
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
      <fieldset defaultValue={options[0].value} id={`form-fieldset-${name}`} className="flex flex-col gap-2 pt-0">
        {options.map(({ description, value }) => (
          <div key={name + value} className="flex flex-row items-center gap-2">
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
  HelpText,
  control,
  register,
}: {
  name: string;
  label: string;
  HelpText?: string | React.FC;
  defaultValue: number;
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <div className="flex flex-col justify-between">
      <div>
        <label htmlFor={`form-${name}`} className="block mr-2 font-bold select-none">
          {label}
        </label>
        {typeof HelpText === "string" ? (
          <p className="py-1 text-xs text-zinc-600">{HelpText}</p>
        ) : (
          HelpText && <HelpText />
        )}
      </div>
      <Controller
        control={control}
        name={name}
        rules={{ min: 0}}
        defaultValue={defaultValue}
        render={({ field: { name, onChange, onBlur, value, ref } }) => (
          <NumericFormat
            getInputRef={ref}
            value={value}
            name={name}
            onBlur={onBlur}
            onValueChange={(value) => {
              onChange(value.floatValue || 0.01);
            }}
            thousandSeparator={true}
            prefix={"$"}
            
            allowNegative={false}
            placeholder="Enter amount"
            className="max-w-fit border-[#24282b]"
          />
        )}
      />
    </div>
  );
}
