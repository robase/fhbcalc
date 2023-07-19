import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import cover from "./images/ogimage.jpg";
import styles from "./tailwind.css";

export const meta: V2_MetaFunction = () => [
  { charset: "utf-8" },
  { title: "First Home Buyer Calculator" },
  {
    description:
      "Navigate the journey of buying your first home with ease. Discover your government scheme eligibility and the benefits to your home loan as a first home buyer",
  },
  { viewport: "width=device-width,initial-scale=1" },
  { "og:title": "First Home Buyer Calculator" },
  {
    "og:description":
      "Navigate the journey of buying your first home with ease. Discover your government scheme eligibility and the benefits to your home loan as a first home buyer",
  },
  { "og:url": "https://firsthomebuyer.help" },
  {
    "og:image":
      process.env.NODE_ENV === "development" ? `http://localhost:3000${cover}` : `https://firsthomebuyer.help${cover}`,
  },
];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  console.log("Hi 👋, follow me on github: https://github.com/robase");
  return (
    <html
      className="bg-gradient-to-br from-[#f6f8fa] to-[#f6f8fa] w-full min-h-full text-[#24282b] font-roboto"
      lang="en"
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
