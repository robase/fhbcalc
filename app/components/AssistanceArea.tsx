import { useEffect, useState } from "react"
import { QuestionCircleFill, XCircle, XLg } from "react-bootstrap-icons"

export enum HELPTEXT {
  PURCHASE_PRICE = "purchase-price",
  LOAN_PRINCIPAL = "loan-principal",
  LVR = "lvr",
  LMI = "lmi",
  TRANSFER_DUTY = "transfer-duty",
  PROPERTY_TAX = "property-tax",
  UPFRONT_CASH = "upfront-cash",
  FHBAS = "FHBAS",
  FHOG = "FHOG",
  FHBC = "FHBC",
  FHBG = "FHBG",
  MONTHLY_REPAYMENT = "monthly-repayment",
}

function getContent(item: HELPTEXT) {
  switch (item) {
    case HELPTEXT.FHBAS:
      return {
        title: "First Home Buyer's Assistance Scheme (FHBAS)",
        body: (
          <div>
            <p>This is some text</p>
          </div>
        ),
      }
    case HELPTEXT.FHOG:
      return {
        title: "First Home Owner's Grant (FHOG)",
        body: (
          <div>
            <p>This is some text</p>
          </div>
        ),
      }
    case HELPTEXT.FHBC:
      return {
        title: "First Home Buyer Choice (FHBC)",
        body: (
          <div>
            <p>This is some text</p>
          </div>
        ),
      }
    case HELPTEXT.FHBG:
      return {
        title: "First Home Buyer's Grant (FHBG)",
        body: (
          <div>
            <p>This is some text</p>
          </div>
        ),
      }
    case HELPTEXT.MONTHLY_REPAYMENT:
      return {
        title: "Monthly Repayment",
        body: (
          <div>
            <p>
              The amount you will need to pay every month of the loan period. This calculator assumes a fixed-rate
              mortgage with an interest rate of 6% annually over a 30 year loan period.
            </p>
            <p className="pt-2">
              See{" "}
              <a
                rel="noreferrer"
                target="_blank"
                className="underline"
                href="https://en.wikipedia.org/wiki/Mortgage_calculator#Monthly_payment_formula"
              >
                here for how monthly repayments are calculated
              </a>
            </p>
          </div>
        ),
      }
    case HELPTEXT.UPFRONT_CASH:
      return {
        title: "Upfront Cash Required",
        body: (
          <div>
            <p>The amount of cash on hand you will need to buy a property</p>

            <p className="py-2">Example:</p>
            <table className="text-left mx-auto">
              <thead className="[&>tr>th]:px-2 [&>tr>th]:py-1">
                <tr>
                  <th>Cost</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody className="[&>tr>td]:px-2 [&>tr>td]:py-0.5">
                <tr>
                  <td>Deposit</td>
                  <td>$65,000</td>
                </tr>
                <tr>
                  <td>LMI</td>
                  <td>$13,080</td>
                </tr>
                <tr>
                  <td>Conveyancing</td>
                  <td>$2,000</td>
                </tr>
                <tr>
                  <td>Registration of mortgage</td>
                  <td>$154</td>
                </tr>
                <tr>
                  <td>Lender fees</td>
                  <td>$800</td>
                </tr>
                <tr>
                  <td className="font-bold">Total</td>
                  <td>$81,034</td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
      }
    case HELPTEXT.PROPERTY_TAX:
      return {
        title: "Property Tax",
        body: (
          <div>
            <p>
              The{" "}
              <a
                rel="noreferrer"
                target="_blank"
                className="underline"
                href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/first-home-buyer-choice"
              >
                First Home Buyer Choice (FHBC)
              </a>{" "}
              scheme enables eligible first home buyers to choose to pay an annual property tax instead of upfront
              transfer duty.
            </p>
            <p className="py-2">
              The amount of tax paid annually depends on the value of the land of the property being purchased:
            </p>
            <p className="mx-auto my-4 p-2 border w-fit font-mono text-center">
              <span className="font-bold font-sans">Owner occupier</span>
              <br /> Annual property tax = $400 + 0.3% of Land value <br />
              <br />
              <span className="font-bold font-sans">Investor</span>
              <br /> Annual property tax = $1500 + 1.1% of Land value
            </p>
            <p className="font-semibold py-2">Considerations</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li>
                The choice to pay annual property tax rather than transfer duty enables you to put more of your savings
                toward a deposit when buying.
              </li>
              <li>
                Depending on how long you intend to live in a property, paying an annual land tax can work out to be
                more expensive than paying transfer duty over time, where:
              </li>
              <ul className="list-outside pl-6 list-disc pb-2">
                <li>
                  <code className="border">
                    (annual property tax * number of years you live in a property) &#62; transfer duty
                  </code>
                </li>
              </ul>
            </ul>
          </div>
        ),
      }
    case HELPTEXT.TRANSFER_DUTY:
      return {
        title: "Transfer Duty",
        body: (
          <div>
            <p>
              Transfer duty (formerly known as stamp duty) is a tax that the government charges when you purchase a
              property. It must be paid as a lump upfront cost.
            </p>
            <p className="py-2">
              Calculating transfer duty is complex as it is a progressive tax for which you are charged a set fee and
              percentage for every dollar the price of the property is over each pricing tier. The higher the purchase
              price of the property, the more transfer duty you will need to pay. Read:{" "}
              <a
                rel="noreferrer"
                target="_blank"
                className="underline"
                href="https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty#heading4"
              >
                how transfer duty is calculated
              </a>
            </p>
            <p className="font-semibold py-1">First Home Buyer's Assistance Scheme (FHBAS)</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li>
                If you qualify for the FHBAS, you may be entitled to either a full exemption or a concessional rate when
                paying transfer duty.
              </li>
            </ul>
            <p className="font-semibold py-1">First Home Buyer Choice (FHBC)</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li>
                If you qualify for the FHBC scheme, you can choose to pay an annual property tax instead of a lump sum.
                This can be beneficial as paying transfer duty as a lump sum can cut heavily into the savings you have
                available to use as a deposit.
              </li>
            </ul>
          </div>
        ),
      }
    case HELPTEXT.LMI:
      return {
        title: "Lender's Mortgage Insurance (LMI)",
        body: (
          <div>
            <p>
              Lender's Mortgage Insurance (LMI) is an insurance policy that lenders might require you to pay when you
              take out a home loan. LMI protects the lender in case you're not able to repay your home loan. It is
              usually required if you have a small deposit i.e. your LVR is greater than 80%.
            </p>
            <p className="py-2">
              LMI is calculated based off a set of premiums set by a lender's insurer. These premiums depend on how much
              you are borrowing and what your LVR is for the loan. Generally speaking, the higher your LVR, the more LMI
              will cost.
            </p>
            <p className="mx-auto my-4 p-2 border w-fit font-mono text-center">
              LMI = Purchase Price * LMI premium <br />
              <br />
              LMI premium = function of (LVR, Loan principal)
            </p>

            <p className="font-semibold py-1">Avoiding LMI</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li>
                If you qualify for the{" "}
                <a
                  href="https://www.nhfic.gov.au/support-buy-home/first-home-guarantee"
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                >
                  First Home Guarantee (FHBG)
                </a>
                , the government will act as a guarantor of your home loan and you will not need to pay LMI
              </li>
              <li>
                You can qualify to have LMI waived with some lenders based on your profession - typically legal, medical
                and accounting professionals will qualify.
              </li>
            </ul>
          </div>
        ),
      }
    case HELPTEXT.LVR:
      return {
        title: "Loan to Value Ratio (LVR)",
        body: (
          <div>
            <p>
              The ratio of the loan principal to the value of the property being purchased. If a borrower is purchasing
              a home worth $500,000 and takes out a loan for $400,000, the loan to value ratio (LVR) would be 80%
            </p>
            <p className="pt-1">Calculated as:</p>
            <p className="mx-auto my-4 p-2 border w-fit font-mono">LVR = (Loan Principal / Purchase Price) * 100</p>
          </div>
        ),
      }
    case HELPTEXT.LOAN_PRINCIPAL:
      return {
        title: "Loan Principal",
        body: (
          <div>
            <p className="pb-1">The amount you will need to borrow to buy a house for the given purchase price</p>
            <p>Calculated as:</p>
            <p className="mx-auto my-4 p-2 border w-fit font-mono">Loan Amount = Purchase Price - Deposit</p>
            <p className="font-semibold py-1">Note: LMI Capitalisation</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li>
                This calculator assumes that LMI is being paid in a lump sum as an upfront cost when you first begin
                your loan.
              </li>
              <li>
                Some lenders offer the option to add the cost of LMI to your loan so you can avoid paying it upfront -
                known as LMI Capitalisation
              </li>
              <li>
                This can be beneficial if you have a low deposit but may cost more as you will be charged interest on
                the LMI added to your loan principal
              </li>
            </ul>
            <p>Calculated with LMI capitalisation:</p>
            <p className="mx-auto my-4 p-2 border w-fit font-mono">Loan Principal = Purchase Price - Deposit + LMI</p>
          </div>
        ),
      }
    case HELPTEXT.PURCHASE_PRICE:
      return {
        title: "Purchase Price",
        body: (
          <div>
            <p>The price of a property sold at auction or via direct offer</p>
          </div>
        ),
      }
    default:
      return { title: "Help", body: null }
  }
}

// const Timer = ({ delayResend: initDelay = 60 }) => {
//   const [delay, setDelay] = useState(initDelay)
//   const minutes = Math.floor(delay / 60)
//   const seconds = Math.floor(delay % 60)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setDelay(delay - 1)
//     }, 20)

//     if (delay === 0) {
//       clearInterval(timer)
//     }

//     return () => {
//       clearInterval(timer)
//     }
//   })

//   return <div className="bg-blue-400 h-1 transition-all" style={{ width: `${(seconds / 60) * 100 || 100}%` }} />
// }

export default function AssistanceArea({
  focusedItem,
  clearFocusedItem,
}: {
  focusedItem?: { item: HELPTEXT; x: number; y: number }
  clearFocusedItem: () => void
}) {
  if (!focusedItem) {
    return null
  }

  const { title, body } = getContent(focusedItem.item)

  return (
    <div
      className={`${
        focusedItem.x > window.innerWidth / 2 - 100 ? "ml-10 mr-auto" : "mr-10 ml-auto"
      } fixed mb-10 rounded-lg mt-auto inset-0 bg-white z-30 border border-zinc-300 px-4 pt-3 pb-4 w-fit h-fit shadow-md text-zinc-700 max-w-xl`}
    >
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row gap-2 items-center mb-1">
          <QuestionCircleFill />
          <h3 className="font-spartan font-bold pb-1">{title}</h3>
        </div>
        <XLg className="mb-1 hover:bg-black hover:fill-white cursor-pointer" onClick={clearFocusedItem} size="1em" />
      </div>
      <div className="text-sm">{body}</div>
    </div>
  )
}
