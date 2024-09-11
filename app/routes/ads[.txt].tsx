export const loader = () => {
  return new Response(`google.com, pub-7123056396745025, DIRECT, f08c47fec0942fa0`, {
    status: 200,
    headers: { "Content-Type": "text/plain", "Cache-Control": "max-age=604800" },
  });
};
