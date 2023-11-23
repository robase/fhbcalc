import type { FormResponse } from "../defaults";

const lookup: Record<number, { single: number[]; couple: number[]; singleAdd: number; coupleAdd: number }> = {
  50000: {
    single: [1373.67, 1815.67, 2305.33, 2799.33],
    couple: [2496.0, 2873.0, 3189.33, 3505.67],
    singleAdd: 494.0,
    coupleAdd: 316.33,
  },
  62000: {
    single: [1460.33, 1898.0, 2392.0, 2881.67],
    couple: [2582.67, 2959.67, 3276.0, 3544.67],
    singleAdd: 489.67,
    coupleAdd: 268.67,
  },
  74000: {
    single: [1629.33, 2067.0, 2556.67, 3050.67],
    couple: [2751.67, 3128.67, 3440.67, 3713.67],
    singleAdd: 494.0,
    coupleAdd: 273.0,
  },
  99000: {
    single: [1867.67, 2305.33, 2799.33, 3289.0],
    couple: [2990.0, 3367.0, 3683.33, 3952.0],
    singleAdd: 489.67,
    coupleAdd: 268.67,
  },
  124000: {
    single: [2214.33, 2652.0, 3141.67, 3631.33],
    couple: [3336.67, 3709.33, 4025.67, 4298.67],
    singleAdd: 489.67,
    coupleAdd: 273.0,
  },
  149000: {
    single: [2535.0, 2972.67, 3462.33, 3947.67],
    couple: [3653.0, 4030.0, 4346.33, 4619.33],
    singleAdd: 485.33,
    coupleAdd: 273.0,
  },
  173000: {
    single: [2916.33, 3349.67, 3839.33, 4329.0],
    couple: [4034.33, 4411.33, 4727.67, 5000.67],
    singleAdd: 489.67,
    coupleAdd: 273.0,
  },
  198000: {
    single: [3107.0, 3540.33, 4030.0, 4515.33],
    couple: [4225.0, 4602.0, 4918.33, 5191.33],
    singleAdd: 485.33,
    coupleAdd: 273.0,
  },
  248000: {
    single: [3315.0, 3752.67, 4238.0, 4723.33],
    couple: [4433.0, 4810.0, 5126.33, 5399.33],
    singleAdd: 485.33,
    coupleAdd: 273.0,
  },
  309000: {
    single: [3861.0, 4294.33, 4779.67, 5265.0],
    couple: [4979.0, 5356.0, 5672.33, 5945.33],
    singleAdd: 485.33,
    coupleAdd: 273.0,
  },
  371000: {
    single: [4385.33, 4818.67, 5304.0, 5785.0],
    couple: [5503.33, 5876.0, 6196.67, 6469.67],
    singleAdd: 481.0,
    coupleAdd: 277.33,
  },
  619000: {
    single: [4567.33, 5000.67, 5481.67, 5967.0],
    couple: [5681.0, 6058.0, 6374.33, 6651.67],
    singleAdd: 485.33,
    coupleAdd: 277.33,
  },
};

export function calculateExpensesMeasure(
  income: number,
  participants: FormResponse["participants"],
  dependents: number
) {
  const incomeLookup = Object.keys(lookup).map(Number);

  let incomeIndex = null;

  for (let i = 0; i < incomeLookup.length; i++) {
    if (income < incomeLookup[i]) {
      incomeIndex = i;
      break;
    }
  }

  if (incomeIndex === null) {
    incomeIndex = incomeLookup.length - 1;
  }

  const expensesLookup = lookup[incomeLookup[incomeIndex]];

  if (dependents > 3) {
    return expensesLookup[participants][3] + expensesLookup[`${participants}Add`] * (dependents - 3);
  }

  return expensesLookup[participants][dependents];
}
