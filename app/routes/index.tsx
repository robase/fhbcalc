import MainView from "~/components/MainView"
import { JSDOM } from "jsdom"

// export const loader = () => {
//   const dom = new JSDOM(`
//   <table class="newHleTable tableAlignCenter"> <!-- –– 'tableAlignCenter' aligns all content to center of column ––-->
//   <caption>
//   <p><strong>Information on how to use this <abbr title="Lenders Mortgage Insurance">LMI</abbr> rates table is towards the bottom of this page.</strong></p>
//   </caption>
//   <thead>
//   <tr>
//   <th>LVR</th>
//   <th>Up to $300K</th>
//   <th>$300,001 – $500K</th>
//   <th>$500,001 – $600K</th>
//   <th>$600,001 – $750K</th>
//   <th>$750,001 – $1M</th>
//   </tr>
//   </thead>
//   <tbody>
//   <tr>
//   <td>80.01 – 81%</td>
//   <td>0.475%</td>
//   <td>0.568%</td>
//   <td>0.904%</td>
//   <td>0.904%</td>
//   <td>0.913%</td>
//   </tr>
//   <tr>
//   <td>81.01 – 82%</td>
//   <td>0.485%</td>
//   <td>0.568%</td>
//   <td>0.904%</td>
//   <td>0.904%</td>
//   <td>0.913%</td>
//   </tr>
//   <tr>
//   <td>82.01 – 83%</td>
//   <td>0.596%</td>
//   <td>0.699%</td>
//   <td>0.932%</td>
//   <td>1.090%</td>
//   <td>1.109%</td>
//   </tr>
//   <tr>
//   <td>83.01 – 84%</td>
//   <td>0.662%</td>
//   <td>0.829%</td>
//   <td>0.960%</td>
//   <td>1.090%</td>
//   <td>1.146%</td>
//   </tr>
//   <tr>
//   <td>84.01 – 85%</td>
//   <td>0.727%</td>
//   <td>0.969%</td>
//   <td>1.165%</td>
//   <td>1.333%</td>
//   <td>1.407%</td>
//   </tr>
//   <tr>
//   <td>85.01 – 86%</td>
//   <td>0.876%</td>
//   <td>1.081%</td>
//   <td>1.258%</td>
//   <td>1.407%</td>
//   <td>1.463%</td>
//   </tr>
//   <tr>
//   <td>86.01 – 87%</td>
//   <td>0.932%</td>
//   <td>1.146%</td>
//   <td>1.407%</td>
//   <td>1.631%</td>
//   <td>1.733%</td>
//   </tr>
//   <tr>
//   <td>87.01 – 88%</td>
//   <td>1.062%</td>
//   <td>1.305%</td>
//   <td>1.463%</td>
//   <td>1.631%</td>
//   <td>1.752%</td>
//   </tr>
//   <tr>
//   <td>88.01 – 89%</td>
//   <td>1.295%</td>
//   <td>1.621%</td>
//   <td>1.948%</td>
//   <td>2.218%</td>
//   <td>2.395%</td>
//   </tr>
//   <tr>
//   <td>89.01 – <a href="/no-deposit-home-loans/90-percent-home-loan/" title="Are 90% home loans considered risky?" target="_blank" rel="noopener noreferrer">90%</a></td>
//   <td>1.463%</td>
//   <td>1.873%</td>
//   <td>2.180%</td>
//   <td>2.367%</td>
//   <td>2.516%</td>
//   </tr>
//   <tr>
//   <td>90.01 – 91%</td>
//   <td>2.013%</td>
//   <td>2.618%</td>
//   <td>3.513%</td>
//   <td>3.783%</td>
//   <td>3.820%</td>
//   </tr>
//   <tr>
//   <td>91.01 – 92%</td>
//   <td>2.013%</td>
//   <td>2.674%</td>
//   <td>3.569%</td>
//   <td>3.867%</td>
//   <td>3.932%</td>
//   </tr>
//   <tr>
//   <td>92.01 – 93%</td>
//   <td>2.330%</td>
//   <td>3.028%</td>
//   <td>3.802%</td>
//   <td>4.081%</td>
//   <td>4.156%</td>
//   </tr>
//   <tr>
//   <td>93.01 – 94%</td>
//   <td>2.376%</td>
//   <td>3.028%</td>
//   <td>3.802%</td>
//   <td>4.286%</td>
//   <td>4.324%</td>
//   </tr>
//   <tr>
//   <td>94.01 – <a href="/no-deposit-home-loans/95-percent-home-loan/" title="Is it tough to borrow 95% of the property value?" target="_blank" rel="noopener noreferrer">95%</a></td>
//   <td>2.609%</td>
//   <td>3.345%</td>
//   <td>3.998%</td>
//   <td>4.613%</td>
//   <td>4.603%</td>
//   </tr>
//   </tbody>
//   </table>
// `)

//   console.log("yo")

//   const stringRangeToMax = (st: string) => {
//     const s = st.split("$")

//     return parseInt(s[s.length - 1].replace("K", "000").replace("M", "000000").replace(".", ""))
//   }

//   const table = dom.window.document.querySelectorAll("table")[0]

//   const purchasePriceBuckets = Array.prototype.map
//     .call(table.tHead?.rows[0].cells, (cell, i) => {
//       if (i === 0) return null

//       return stringRangeToMax(cell.innerHTML)
//     })
//     .filter((x) => !!x)

//   const lvrLookup: Record<number, number[]> = {}

//   for (let i = 1; i < table.rows.length; i++) {
//     const element = table.rows[i]

//     const lvrInt = parseInt(table.rows[i].cells[0].innerHTML.slice(0, 2))
//     lvrLookup[lvrInt + 1] = []
//     Array.prototype.forEach.call(element.cells, (cell, i) => {
//       console.log(cell.innerHTML)

//       if (i !== 0) {
//         lvrLookup[lvrInt].push(parseFloat((cell.innerHTML as string).trim().replace("%", "")))
//       }
//     })

//     console.log(element.cells)
//   }

//   console.log(purchasePriceBuckets)

//   console.log(lvrLookup)

//   // table.forEach((thing) => console.log(thing.tagName))
//   return {}
// }

export default function Index() {
  return <MainView />
}
