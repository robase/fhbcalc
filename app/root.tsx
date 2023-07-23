import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import cover from "./images/ogimage.jpg";
import styles from "./tailwind.css";

export const meta: V2_MetaFunction = () => [
  { charset: "utf-8" },
  { title: "First Home Buyer Calculator" },
  {
    name: "description",
    content:
      "Navigate the journey of buying your first home with ease. Discover your government scheme eligibility and the benefits to your home loan as a first home buyer",
  },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { property: "og:title", content: "First Home Buyer Calculator" },
  {
    property: "og:description",
    content:
      "Navigate the journey of buying your first home with ease. Discover your government scheme eligibility and the benefits to your home loan as a first home buyer",
  },
  { property: "og:url", content: "https://firsthomebuyer.help" },
  {
    property: "og:image",
    content: `https://firsthomebuyer.help${cover}`,
  },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/favicon.ico?v=2" },
];

export default function App() {
  return (
    <html className="bg-[#f6f8fa] w-full min-h-full text-[#24282b] font-roboto" lang="en">
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
