import type { CalculationResult, EligibilityResult } from "./calculators/loan";
import { qualifiesForDutyConcession } from "./schemes/FHBAS";
import type { FormResponse } from "./defaults";
import { State } from "./defaults";
import { qualifiesForFHBG } from "./schemes/FHBG";
import { qualifiesForFHOG } from "./schemes/FHOG";

type Question = { name: string; label: string; helpText?: string | (() => JSX.Element) } & (
  | { type: "money" }
  | { type: "radio"; options: { description: string; value: string }[] }
  | { type: "select"; options: { description: string; value: string | number; disabled?: boolean }[] }
);

interface Scheme {
  name: string;
  short: string;
  link: string;
  helpDoc: string;
  affects: keyof CalculationResult;
  getEligibility: (purchasePrice: number, formData: FormResponse) => EligibilityResult;
}

export function getQuestions(state: State) {
  return defaultQuestions.concat(schema[state].questions);
}

export function getSchemes(state: State) {
  return defaultSchemes.concat(schema[state].schemes);
}

const defaultQuestions: Question[] = [
  {
    label: "What state are you in?",
    type: "select",
    name: "state",
    options: [
      ...Object.values(State)
        .sort()
        .filter((state) => state === "NSW" || state === "VIC" || state === "QLD")
        .map((state) => ({ description: state, value: state })),
      { description: "More coming soon" as any, value: "", disabled: true },
    ],
  },
  {
    label: "Why are you buying a place?",
    type: "radio",
    name: "purpose",
    options: [
      { description: "To live in", value: "occupier" },
      { description: "As an investment", value: "investor" },
    ],
  },
  {
    label: "Buying an existing, new property or vacant land?",
    type: "radio",
    name: "propertyType",
    options: [
      { description: "Existing", value: "existing" },
      { description: "New e.g. off the plan", value: "new-property" },
      { description: "Vacant land", value: "vacant-land" },
    ],
  },
  {
    label: "Buying as a single or a couple?",
    type: "radio",
    name: "participants",
    options: [
      { description: "Single", value: "single" },
      { description: "Couple", value: "couple" },
    ],
  },
  {
    type: "select",
    name: "dependents",
    label: "How many dependents do you have?",
    options: [
      { description: "0", value: 0 },
      { description: "1", value: 1 },
      { description: "2", value: 2 },
      { description: "3", value: 3 },
      { description: "4", value: 4 },
      { description: "5", value: 5 },
      { description: "6+", value: 6 },
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
    helpText: () => (
      <p className="py-1 text-xs text-zinc-600">
        Add your{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/early-access-to-super/first-home-super-saver-scheme#Requestingadeterminationstep1"
          className="underline hover:text-zinc-400"
        >
          FHSS determination
        </a>{" "}
        amount here if you have one
      </p>
    ),
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
];

const defaultSchemes: Scheme[] = [
  {
    name: "First Home Guarantee",
    short: "FHBG",
    link: "https://www.nhfic.gov.au/support-buy-home/first-home-guarantee",
    helpDoc: "fhbg.md",
    affects: "lmi",
    getEligibility: qualifiesForFHBG,
  },
];

const schema: Record<State, { questions: Question[]; schemes: Scheme[] }> = {
  NSW: {
    questions: [
      {
        label: "Where are you buying?",
        type: "radio",
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
        affects: "transferDuty",
        getEligibility: qualifiesForDutyConcession,
      },
      {
        name: "First Home Owner's Grant",
        short: "FHOG",
        link: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes",
        helpDoc: "fhog.md",
        affects: "cashOnHand",
        getEligibility: qualifiesForFHOG,
      },
    ],
  },
  VIC: {
    questions: [
      {
        label: "Where are you buying?",
        type: "radio",
        name: "location",
        options: [
          { description: "Melbourne or Geelong", value: "city" },
          { description: "Rest of State", value: "regional" },
        ],
      },
    ],
    schemes: [
      {
        name: "FHB Duty Concession",
        short: "FHB Duty",
        link: "https://www.sro.vic.gov.au/fhbduty",
        helpDoc: "fhbas.md",
        affects: "transferDuty",
        getEligibility: qualifiesForDutyConcession,
      },
      {
        name: "First Home Owner's Grant",
        short: "FHOG",
        link: "https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes",
        helpDoc: "fhog.md",
        affects: "cashOnHand",
        getEligibility: qualifiesForFHOG,
      },
    ],
  },
  QLD: {
    questions: [
      {
        label: "Where are you buying?",
        type: "radio",
        name: "location",
        options: [
          { description: "Brisbane, Gold Coast or Sunshine Coast", value: "city" },
          { description: "Rest of State", value: "regional" },
        ],
      },
    ],
    schemes: [
      {
        name: "First Home Concession",
        short: "FH Concession",
        link: "https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/first-home/",
        helpDoc: "fhbas.md",
        affects: "transferDuty",
        getEligibility: qualifiesForDutyConcession,
      },
      {
        name: "First Home Owner's Grant",
        short: "FHOG",
        link: "https://qro.qld.gov.au/property-concessions-grants/first-home-grant/",
        helpDoc: "fhog.md",
        affects: "cashOnHand",
        getEligibility: qualifiesForFHOG,
      },
    ],
  },
  WA: {
    questions: [
      {
        label: "Where are you buying?",
        type: "radio",
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
