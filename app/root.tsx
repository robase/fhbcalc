import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import cover from "./images/ogimage.jpg";
import tailwindCSS from "./tailwind.css?url";

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <div>{JSON.stringify(error, null, 2)}</div>;
};

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "First Home Buyer Calculator" },
  {
    name: "description",
    content: "All in one loan and gov scheme eligibility calculator for NSW, VIC, QLD first home buyers",
  },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { property: "og:title", content: "First Home Buyer Calculator" },
  {
    property: "og:description",
    content: "All in one loan and gov scheme eligibility calculator for NSW, VIC, QLD first home buyers",
  },
  { property: "og:url", content: "https://firsthomebuyer.help" },
  {
    property: "og:image",
    content: `https://firsthomebuyer.help${cover}`,
  },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindCSS },
  { rel: "icon", href: "/favicon.ico?v=2" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-[#f6f8fa] w-full min-h-full text-[#24282b] font-roboto">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Analytics />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
