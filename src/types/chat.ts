export type ChatStepId = "welcome" | "purpose" | "contact" | "submitted";

export interface ChatOption {
  label: { ru: string; uz: string };
  value: string;
  nextStep: ChatStepId;
}

export interface ChatStep {
  id: ChatStepId;
  message: { ru: string; uz: string };
  options?: ChatOption[];
  inputType?: "contact-form";
}
