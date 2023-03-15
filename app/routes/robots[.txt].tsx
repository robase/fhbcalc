import { Response } from "@remix-run/node"

export const loader = () => {
  return new Response(
    `User-agent: *
Allow: /`,
    { status: 200, headers: { "Content-Type": "text/plain", "Cache-Control": "max-age=604800" } }
  )
}
