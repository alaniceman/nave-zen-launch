// Keep the existing answer budget available for visible text, not internal thinking.
export const NAVE_CHAT_OPTIONS = {
  model: "google/gemini-2.5-flash",
  stream: true,
  max_tokens: 500,
  reasoning: { enabled: false },
};