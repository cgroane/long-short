import { Nile } from "@niledatabase/server";
import { nextJs } from "@niledatabase/nextjs";

const nile = await Nile({
  debug: true,
  databaseName: "long_short_poll",
  extensions: [nextJs],
});

export { nile };