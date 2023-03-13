import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

import styles from "./tailwind.css"

export const meta: MetaFunction = () => ({
  "charset": "utf-8",
  // "title": "First Home Buyer Calculator",
  "description": "A tool to help you navigate the journey of buying your first home",
  "viewport": "width=device-width,initial-scale=1",
  "og:title": "First Home Buyer Calculator",
  "og:description": "A tool to help you navigate the journey of buying your first home",
  "og:url": "https://firsthomebuyer.help",
  "og:image": "https://firsthomebuyer.help/ogimg.jpg",
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
