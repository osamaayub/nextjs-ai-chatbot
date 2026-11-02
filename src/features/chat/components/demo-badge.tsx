import { connection } from "next/server";
import { isDemoMode } from "../server";

/** Server component: checks the key at request time, not at build time. */
export async function DemoBadge() {
  await connection();
  if (!isDemoMode()) return null;
  return <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-300">Demo mode</span>;
}
