import cover from "../images/ogimage.jpg";

export const loader = () => {
  return new Response(cover, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "max-age=31536000",
    },
  });
};
