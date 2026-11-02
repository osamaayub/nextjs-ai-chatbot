import "server-only";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { env } from "@/server/env";
import { createDemoModel } from "./demo-model";

/** Real OpenAI model when a key is set, otherwise the free demo model. */
export function getModel(): LanguageModel {
  const { OPENAI_API_KEY, OPENAI_MODEL } = env();
  return OPENAI_API_KEY ? openai(OPENAI_MODEL) : createDemoModel();
}

export const isDemoMode = () => !env().OPENAI_API_KEY;
