import { redirect } from "@remix-run/node";
import { State } from "~/utls/defaults";

export const loader = () => {
  return redirect("/");
};
