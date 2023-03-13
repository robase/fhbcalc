import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

import styles from "./tailwind.css"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "FHB Help",
  description: "Calculate the costs of buying your first home",
  viewport: "width=device-width,initial-scale=1",
})

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function App() {
  console.log("Hi 👋, follow me on github: https://github.com/robase")
  return (
    <html className="bg-gradient-to-br from-stone-50 to-stone-200 w-full" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
