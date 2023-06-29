import type { EligibilityResult } from "../calculators";
import { qualifiesForFHBAS } from "../calculators/FHBAS";
import { qualifiesForFHBG } from "../calculators/FHBG";
import { qualifiesForFHOG } from "../calculators/FHOG";
import { State } from "../defaults";
import type { FormResponse } from "../defaults";

type Question = { name: string; label: string; helpText?: string } & (
  | { type: "money" }
  | { type: "select"; options: { description: string; value: string }[] }
);

interface Scheme {
  name: string;
  short: string;
  link: string;
  helpDoc: string;
  getEligibility: (...args: any) => EligibilityResult;
}

export function getQuestions(state: State) {
  return schema[state].questions.concat(schema.all.questions);
}

export const schema: Record<"all" | State, { questions: Question[]; schemes: Scheme[] }> = {
  all: {
    questions: [
      {
        label: "Why are you buying a place?",
        type: "select",
        name: "purpose",
        options: [
          { description: "To live in", value: "occupier" },
          { description: "As an investment", value: "investor" },
        ],
      },
      {
        label: "Buying an existing, new property or vacant land?",
        type: "select",
        name: "propertyType",
        options: [
          { description: "Existing", value: "existing" },
          { description: "New e.g. off the plan", value: "new-property" },
          { description: "Vacant land", value: "vacant-land" },
        ],
      },
      {
        label: "Buying as a single or a couple?",
        type: "select",
        name: "participants",
        options: [
          { description: "Single", value: "single" },
          { description: "Couple", value: "couple" },
        ],
      },
      {
        name: "income",
        type: "money",
        helpText: "Combined if a couple",
        label: "What is your yearly pre-tax income?",
      },
      {
        type: "money",
        label: "How much have you saved for a deposit?",
        name: "deposit",
      },
      {
        type: "money",
        name: "expenses",
        label: "What are your monthly living expenses?",
        helpText: "e.g. food, clothes and other loan repayments, don't include rent",
      },
      {
        type: "money",
        name: "hecs",
        label: "Do you have a HECS debt?",
        helpText: "Add your total remaining amount",
      },
    ],
    schemes: [
      {
        name: "First Home Guarantee",
        short: "FHBG",
        link: "https://www.nhfic.gov.au/support-buy-home/first-home-guarantee",
        helpDoc: "fhbg.md",
        getEligibility: (
          data: Pick<FormResponse, "purpose" | "location" | "participants" | "income" | "deposit" | "state">,
          purchasePrice: number
        ) => qualifiesForFHBG(data, purchasePrice),
      },
    ],
  },
  NSW: {
    questions: [
      {
        label: "Where are you buying?",
        type: "select",
        name: "location",
        options: [
          { description: "Sydney, Newcastle, Lake Macquarie or Illawarra", value: "city" },
          { description: "Rest of State", value: "regional" },
        ],
      },
    ],
    schemes: [
      {
        name: "First Home Buyer Assistance Scheme",
        short: "FHBAS",
        link: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme",
        helpDoc: "fhbas.md",
        getEligibility: (propertyType: FormResponse["propertyType"], purchasePrice: number) =>
          qualifiesForFHBAS(propertyType, purchasePrice, State.NSW),
      },
      {
        name: "First Home Owner's Grant",
        short: "FHOG",
        link: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes",
        helpDoc: "fhog.md",
        getEligibility: (propertyType: "existing" | "new-property" | "vacant-land", purchasePrice: number) =>
          qualifiesForFHOG(propertyType, purchasePrice, State.NSW),
      },
    ],
  },
  VIC: {
    questions: [
      {
        label: "Where are you buying?",
        type: "select",
        name: "location",
        options: [
          { description: "Melbourne or Geelong", value: "city" },
          { description: "Rest of State", value: "regional" },
        ],
      },
    ],
    schemes: [],
  },
  QLD: {
    questions: [
      {
        label: "Where are you buying?",
        type: "select",
        name: "location",
        options: [
          { description: "Brisbane, Gold Coast ord Sunshine Coast", value: "city" },
          { description: "Rest of State", value: "regional" },
        ],
      },
    ],
    schemes: [],
  },
  WA: {
    questions: [
      {
        label: "Where are you buying?",
        type: "select",
        name: "location",
        options: [
          { description: "Perth", value: "city" },
          { description: "Rest of State", value: "regional" },
        ],
      },
    ],
    schemes: [],
  },
  SA: {
    questions: [],
    schemes: [],
  },
  ACT: {
    questions: [],
    schemes: [],
  },
  NT: {
    questions: [],
    schemes: [],
  },
};
