"use client";

import { useState, useCallback } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";

type StepId = "welcome" | "purpose" | "contact" | "submitted";

const interestLabels: Record<string, string> = {
  metalloprokat: "Металлопрокат",
  truby: "Трубы",
  armatura: "Арматура",
  kabel: "Кабель",
  other: "Другое",
};

const purposeLabels: Record<string, string> = {
  "oil-gas": "Нефтегаз",
  construction: "Строительство",
  industrial: "Промышленность",
  other: "Другое",
};

interface ChatWidgetProps {
  locale: string;
  dict: Dictionary;
}

export function ChatWidget({ dict }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<StepId>("welcome");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("+998 ");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const reset = useCallback(() => {
    setStep("welcome");
    setSelections({});
    setContactName("");
    setContactPhone("+998 ");
    setError(false);
  }, []);

  const handleOption = (value: string, nextStep: StepId) => {
    setSelections((prev) => ({ ...prev, [step]: value }));
    setStep(nextStep);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+\s()-]/g, "");
    setContactPhone(value);
  };

  const handleContactSubmit = async () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setSubmitting(true);
    setError(false);

    const interest = interestLabels[selections.welcome] || selections.welcome || "—";
    const purpose = purposeLabels[selections.purpose] || selections.purpose || "—";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          email: "",
          message: `Чат-виджет\nИнтерес: ${interest}\nОтрасль: ${purpose}`,
          company: "",
        }),
      });
      if (res.ok) {
        setStep("submitted");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setSubmitting(false);
  };

  const welcomeOptions = [
    { label: dict.chat.options.metalloprokat, value: "metalloprokat" },
    { label: dict.chat.options.truby, value: "truby" },
    { label: dict.chat.options.armatura, value: "armatura" },
    { label: dict.chat.options.kabel, value: "kabel" },
    { label: dict.chat.options.other, value: "other" },
  ];

  const purposeOptions = [
    { label: dict.chat.options.oilGas, value: "oil-gas" },
    { label: dict.chat.options.construction, value: "construction" },
    { label: dict.chat.options.industrial, value: "industrial" },
    { label: dict.chat.options.otherPurpose, value: "other" },
  ];

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) reset();
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105 hover:bg-accent-dark"
        aria-label={isOpen ? dict.chat.close : dict.chat.open}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-xl bg-white shadow-2xl sm:w-96">
          {/* Header */}
          <div className="bg-brand px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-white">
                MKM Metal
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto p-4">
            {step === "welcome" && (
              <div>
                <div className="mb-4 rounded-lg bg-surface p-3 text-sm text-brand">
                  {dict.chat.welcome}
                </div>
                <div className="flex flex-wrap gap-2">
                  {welcomeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOption(opt.value, "purpose")}
                      className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "purpose" && (
              <div>
                <div className="mb-4 rounded-lg bg-surface p-3 text-sm text-brand">
                  {dict.chat.purpose}
                </div>
                <div className="flex flex-wrap gap-2">
                  {purposeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOption(opt.value, "contact")}
                      className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "contact" && (
              <div>
                <div className="mb-4 rounded-lg bg-surface p-3 text-sm text-brand">
                  {dict.chat.contact}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={dict.chat.name}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+998 XX XXX XX XX"
                    value={contactPhone}
                    onChange={handlePhoneChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {error && (
                    <p className="text-xs text-red-500">
                      Ошибка отправки. Попробуйте ещё раз.
                    </p>
                  )}
                  <button
                    onClick={handleContactSubmit}
                    disabled={submitting || !contactName.trim() || !contactPhone.trim()}
                    className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
                  >
                    {submitting ? "..." : dict.chat.submit}
                  </button>
                </div>
              </div>
            )}

            {step === "submitted" && (
              <div>
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {dict.chat.submitted}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
