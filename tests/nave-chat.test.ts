import { test, expect } from "bun:test";
import { NAVE_CHAT_OPTIONS } from "../supabase/functions/chat-nave/requestOptions";

test("Nave chat keeps its existing model and 500-token budget without internal reasoning consuming it", () => {
  expect(NAVE_CHAT_OPTIONS.model).toBe("google/gemini-2.5-flash");
  expect(NAVE_CHAT_OPTIONS.max_tokens).toBe(500);
  expect(NAVE_CHAT_OPTIONS.reasoning.enabled).toBe(false);
  expect(NAVE_CHAT_OPTIONS.stream).toBe(true);
});