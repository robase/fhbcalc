<h1 align="center">
  <br>
  <a href="http://firsthomebuyer.help"><img src="https://raw.githubusercontent.com/robase/fhbcalc/main/app/images/logo.svg" alt="Markdownify" width="90" ></a>
  <br>
  <a href="http://firsthomebuyer.help">firsthomebuyer.help</a>
  <br>
  <br>
</h1>

<h4 align="center">A government scheme eligibility & loan calculator for australian first home buyers</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#sources">Sources</a> •
  <a href="#development">Development</a>
</p>

![fhb calc screenshot](https://raw.githubusercontent.com/robase/fhbcalc/dev/app/images/screenshot.png)

## Features

- Shows all your loan options across a range of property prices in one view, including your eligibility for government schemes for first home buyers
- Calculates your loan stats including LVR, LMI, estimated monthly repayments, and more
- Generates a sharable link which you can send to lenders to avoid having to reexplain your circumstances over and over again
- No data is captured or stored, it never leaves your browser

## Sources

#### National

- [First Home Buyer Guarantee](https://www.nhfic.gov.au/support-buy-home/first-home-guarantee)
- [HECS repayment rates](https://www.ato.gov.au/Rates/HELP,-TSL-and-SFSS-repayment-thresholds-and-rates/)

<details>
    <summary><b>NSW</b></summary>

- [First home buyer's assistance scheme (FHBAS)](https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme)
- [First home owner's grant (FHOG)](https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-owner-new-homes-grant)
- [Transfer duty rates](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty#heading4)

</details>

<details>
    <summary><b>VIC</b></summary>

- [First home owner's grant (FHOG)](https://www.sro.vic.gov.au/first-home-owner)
- [First home buyer duty concession](https://www.sro.vic.gov.au/fhbduty)
- Transfer duty rates
  - [PPOR](https://www.sro.vic.gov.au/principal-place-residence-current-rates)
  - [General](https://www.sro.vic.gov.au/non-principal-place-residence-dutiable-property-current-rates)

</details>

#### ... more states coming soon

## How to contribute

To add a scheme or update eligibility or calculation details for a state:

- Form questions for each state are defined in [`app/services/formSchema.tsx`](/app/services/formSchema.tsx)
- Eligibility functions for government schemes are defined in [`app/services/schemes`](/app/services/schemes)
- Loan calculations are defined in [`app/services/calculators`](/app/services/calculators)
- Help info content is defined in [`app/markdown`](/app/markdown)

General flow:

1. Form question UI inputs are generated from the questions defined for each state in the `formSchema.tsx` file.
2. For each table row:
   1. Check eligibility for schemes
   2. Calculate loan data
3. Render table, help info for each column & scheme

## Development

- [Remix Docs](https://remix.run/docs)

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev

# runs on http://localhost:3000
```
