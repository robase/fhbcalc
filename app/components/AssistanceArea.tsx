import { useEffect, useState } from "react"
import { Link45deg, QuestionCircleFill, XCircle, XLg } from "react-bootstrap-icons"

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
  DTI = "dti",
}

const propertyTaxBody = (
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
      scheme enables eligible first home buyers to choose to pay an annual property tax instead of upfront transfer
      duty.
    </p>
    <p className="py-2">The amount of tax paid annually depends on the land value of the property being purchased:</p>
    <p className="mx-auto my-4 p-2 border w-fit font-mono text-center">
      <span className="font-bold font-sans">Owner occupier</span>
      <br /> Annual property tax = $400 + 0.3% of Land value <br />
      <br />
      <span className="font-bold font-sans">Investor</span>
      <br /> Annual property tax = $1500 + 1.1% of Land value
    </p>
    <p className="font-semibold py-2">Considerations</p>
    <ul className="list-outside pl-4 list-disc pb-2">
      <li className="py-2">
        The choice to pay annual property tax rather than transfer duty enables you to put more of your savings toward a
        deposit when buying.
      </li>
      <li className="py-2">
        Depending on how long you intend to live in a property, paying an annual land tax can work out to be more
        expensive than paying transfer duty over time, where:
      </li>
      <ul className="list-outside pl-6 list-disc pb-2">
        <li className="py-2">
          <code className="border">(annual property tax * years lived in home) &#62; transfer duty</code>
        </li>
      </ul>
    </ul>
    <p className="font-semibold">Full information:</p>
    <a href="https://www.nsw.gov.au/housing-and-construction/first-home-buyer-choice" rel="noreferrer" target="_blank">
      <div className="hover:underline hover:bg-blue-100 rounded-full border-blue-500 border-2 shadow-md bg-white px-4 py-2 mt-3 flex flex-row gap-2 w-fit">
        <span>FHBC Website</span> <Link45deg size="20px" />
      </div>
    </a>
  </div>
)

function getContent(item: HELPTEXT) {
  switch (item) {
    case HELPTEXT.FHBAS:
      return {
        title: "First Home Buyer's Assistance Scheme (FHBAS)",
        body: (
          <div>
            <p>
              If you qualify for the FHBAS, you may be entitled to either a full exemption or a concessional rate when
              paying transfer duty.
            </p>
            <p className="font-semibold py-2">Eligibility</p>
            <ul className="list-outside px-4 list-disc pb-2">
              <li className="py-1">You move in within 12 months and live there for a minimum 6 continuous months</li>
              <li className="py-1">
                You must be an owner-occupier of the purchased property (not buying as an investment)
              </li>
            </ul>
            <p className="font-semibold py-2">Benefits</p>
            <ul className="list-outside px-4 list-disc">
              <li className="py-1">New and existing homes</li>
              <ul className="list-outside px-4 list-disc">
                <li className="py-1">Full exemption for purchase price less than $650,000</li>
                <li className="py-1">Concessional rate for purchase price less than $800,000</li>
              </ul>
              <li className="py-1">Vacant Land</li>
              <ul className="list-outside px-4 list-disc">
                <li className="py-1">Full exemption for purchase price less than $350,000</li>
                <li className="py-1">Concessional rate for purchase price less than $450,000</li>
              </ul>
            </ul>
            <p className="font-semibold pt-2">Full information:</p>
            <a
              href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme"
              rel="noreferrer"
              target="_blank"
            >
              <div className="hover:underline hover:bg-blue-100 rounded-full border-blue-500 border-2 shadow-md bg-white px-4 py-2 mt-3 flex flex-row gap-2 w-fit">
                <span>FHBAS Website</span> <Link45deg size="20px" />
              </div>
            </a>
          </div>
        ),
      }
    case HELPTEXT.FHOG:
      return {
        title: "First Home Owner's Grant (FHOG)",
        body: (
          <div>
            <p>First Home Owner's Grant (FHOG) gives you $10,000 when you build or buy your first home.</p>
            <p className="font-semibold py-2">Eligibility</p>
            <ul className="list-outside px-4 list-disc pb-2">
              <li className="py-1">The purchase price must not exceed:</li>
              <ul className="list-outside px-4 list-disc">
                <li className="py-1">$600,000 for a newly built house, townhouse, apartment, unit or similar</li>
                <li className="py-1">$600,000 for a home which was substantially renovated by the seller</li>
                <li className="py-1">$750,000 when buying vacant land with a building contract </li>
              </ul>
            </ul>
            <p className="font-semibold pt-2">Full information:</p>
            <a
              href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/new-homes"
              rel="noreferrer"
              target="_blank"
            >
              <div className="hover:underline hover:bg-blue-100 rounded-full border-blue-500 border-2 shadow-md bg-white px-4 py-2 mt-3 flex flex-row gap-2 w-fit">
                <span>FHOG Website</span> <Link45deg size="20px" />
              </div>
            </a>
          </div>
        ),
      }
    case HELPTEXT.FHBG:
      return {
        title: "First Home Buyer's Grant (FHBG)",
        body: (
          <div>
            <p>
              The First Home Buyer's Grant (FHBG) allows eligible first home buyers to purchase a property with an LVR
              up to 95% without paying Lenders Mortgage Insurance (LMI).
            </p>
            <p className="pt-2">
              The FHBG scheme is delivered through participating lenders. Lenders have a limited allocation of spots
              available for each financial year.
            </p>
            <p className="font-semibold py-2">Eligibility</p>
            <ul className="list-outside px-4 list-disc pb-2">
              <li className="py-1">
                You must earn less than: $125,000 for individuals or $200,000 for couples, evidenced via the ATO
              </li>
              <li className="py-1">
                You must be an owner-occupiers of the purchased property (not buying as an investment)
              </li>
              <li className="py-1">The property price must be less than:</li>
              <ul className="list-outside px-4 list-disc">
                <li className="py-1">$900,000 if buying in Sydney, Newcastle, Lake Macquarie or Illawarra</li>
                <li className="py-1">$750,000 otherwise</li>
              </ul>
            </ul>
            <p className="font-semibold">Full information:</p>
            <a href="https://www.nhfic.gov.au/support-buy-home/first-home-guarantee" rel="noreferrer" target="_blank">
              <div className="hover:underline hover:bg-blue-100 rounded-full border-blue-500 border-2 shadow-md bg-white px-4 py-2 mt-3 flex flex-row gap-2 w-fit">
                <span>FHBG Website</span> <Link45deg size="20px" />
              </div>
            </a>
          </div>
        ),
      }
    case HELPTEXT.DTI:
      return {
        title: "Debt to Income Ratio (DTI)",
        body: (
          <div>
            <p>
              Debt to income ratio (DTI) is a measure of your expenses compared to how much money you make. It is
              calculated by dividing your total monthly debt payments and living expenses by your gross monthly income.
            </p>
            <p className="mx-auto my-4 p-2 border w-fit font-mono text-center">
              DTI = monthly expenses / monthly income <br />
              <br />
              DTI = (living expenses + monthly hecs) / monthly income
            </p>
            <p className="font-semibold py-2">Borrowing Power</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li className="py-2">
                Different lenders will place different limits on DTI when offering loans as a way to limit their risk
                exposure to you failing to repay your loan. The higher the DTI of a borrower, the higher the risk.
              </li>
              <li className="py-2">
                To decrease your DTI and increase your borrowing power, you can either reduce your expenses or loan
                repayments (e.g. cancel a credit card, pay off your hecs), or increase your income.
              </li>
            </ul>
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
              mortgage with an interest rate of your choice (default is 6.01%) annually over a 30 year loan period.
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
            <p>
              The amount of cash on hand you will need to buy a property e.g. conveyancing fees, settlement costs. These
              costs can significantly vary depending on your choice of lender and conveyancer
            </p>

            <p className="py-2">
              This calculator adds a flat amount of $3000 to account for these costs when calculating cash on hand
              required for a purchase
            </p>

            <p className="py-2">Example for a house bought for $818,500, no government scheme benefits applied:</p>
            <table className="text-left">
              <thead className="[&>tr>th]:px-2 [&>tr>th]:py-1 border-b">
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
                  <td>$34,017</td>
                </tr>
                <tr>
                  <td>Transfer Duty</td>
                  <td>$31,923</td>
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
                  <td>$846</td>
                </tr>
                <tr className="border-t">
                  <td className="font-bold">Total</td>
                  <td>$133,940</td>
                </tr>
              </tbody>
            </table>
            <p className="pt-4">
              View a detailed{" "}
              <a
                rel="noreferrer"
                target="_blank"
                className="underline hover:text-zinc-300"
                href="https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/buying-residential-property-nsw/planning-your-finances/costs-when-buying-a-home"
              >
                breakdown of costs associated with buying a property
              </a>
            </p>
          </div>
        ),
      }
    case HELPTEXT.FHBC:
      return {
        title: "First Home Buyer Choice (FHBC)",
        body: propertyTaxBody,
      }
    case HELPTEXT.PROPERTY_TAX:
      return {
        title: "Property Tax",
        body: propertyTaxBody,
      }
    case HELPTEXT.TRANSFER_DUTY:
      return {
        title: "Transfer Duty",
        body: (
          <div>
            <p>
              Transfer duty (formerly known as stamp duty in NSW) is a tax paid when you purchase or transfer ownership
              of a property. It must be paid as a lump upfront cost.
            </p>
            <p className="py-2">
              Calculating transfer duty can be complicated because it is a progressive tax. This means that you are
              charged a set fee as well as a percentage of every dollar over each price bracket that the property price
              falls into. More simply: the more expensive the property is, the more transfer duty you will have to pay.
              <br />
              <br /> Read:{" "}
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
              <li className="py-2">
                If you qualify for the FHBAS, you may be entitled to either a full exemption or a concessional rate when
                paying transfer duty.
              </li>
            </ul>
            <p className="font-semibold py-1">First Home Buyer Choice (FHBC)</p>
            <ul className="list-outside pl-4 list-disc pb-2">
              <li className="py-2">
                If you qualify for the FHBC scheme, you can choose to pay an annual property tax instead of transfer
                duty. This can be beneficial as you can avoid paying transfer duty as a lump sum which can free up more
                of your savings to use for a deposit.
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
              <li className="py-2">
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
              <li className="py-2">
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
              <li className="py-2">
                This calculator assumes that LMI is being paid in a lump sum as an upfront cost when you first begin
                your loan.
              </li>
              <li className="py-2">
                Some lenders offer the option to add the cost of LMI to your loan so you can avoid paying it upfront -
                known as LMI Capitalisation
              </li>
              <li className="py-2">
                This can be beneficial if you have a low deposit but may cost more as you will be charged interest on
                the LMI added to your loan principal
              </li>
            </ul>
            <p>Loan principal calculated with LMI capitalisation:</p>
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
        focusedItem.x > window.innerWidth / 2 - 100 ? "sm:ml-10 sm:mr-auto" : "sm:mr-10 sm:ml-auto"
      } max-h-full fixed sm:mb-10 rounded-lg mt-auto inset-0 bg-white z-30 border border-zinc-400 px-4 pt-3 pb-4 w-fit shadow-md text-zinc-700 max-w-xl`}
    >
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row gap-2 items-center mb-1">
          <QuestionCircleFill />
          <h3 className="font-spartan font-bold py-1">{title}</h3>
        </div>
        <div
          onClick={clearFocusedItem}
          className="mb-1 hover:bg-zinc-200  hover:text-zinc-50 cursor-pointer border p-1 rounded-lg"
        >
          <XLg size="1em" className="" />
        </div>
      </div>
      <div className="text-sm h-fit max-h-full overflow-y-auto pb-4 mb-4">{body}</div>
    </div>
  )
}
