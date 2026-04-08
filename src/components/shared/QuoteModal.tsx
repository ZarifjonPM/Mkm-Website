"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useQuoteModal } from "./QuoteModalProvider";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "./Button";

interface QuoteModalProps {
  dict: Dictionary;
}

export function QuoteModal({ dict }: QuoteModalProps) {
  const { isOpen, prefill, closeQuoteModal } = useQuoteModal();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      company: form.get("company") as string,
      phone: form.get("phone") as string,
      email: form.get("email") as string,
      message: form.get("message") as string,
      category: prefill.category || "",
      productName: prefill.productName || "",
    };

    // Basic client validation
    const newErrors: Record<string, string> = {};
    if (!data.name || data.name.length < 2) newErrors.name = "min 2";
    if (!data.company || data.company.length < 2) newErrors.company = "min 2";
    if (!data.phone || data.phone.length < 9) newErrors.phone = "invalid";
    if (data.email && !data.email.includes("@")) newErrors.email = "invalid";
    if (!data.message || data.message.length < 10) newErrors.message = "min 10";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          closeQuoteModal();
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeQuoteModal} title={dict.quote.title}>
      {status === "success" ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">{dict.quote.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label={dict.quote.name}
            placeholder={dict.quote.namePlaceholder}
            required
            error={errors.name}
          />
          <Input
            name="company"
            label={dict.quote.company}
            placeholder={dict.quote.companyPlaceholder}
            required
            error={errors.company}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="phone"
              type="tel"
              inputMode="tel"
              label={dict.quote.phone}
              defaultValue="+998 "
              required
              error={errors.phone}
            />
            <Input
              name="email"
              type="email"
              label={dict.quote.email}
              placeholder={dict.quote.emailPlaceholder}
              error={errors.email}
            />
          </div>
          <Textarea
            name="message"
            label={dict.quote.message}
            placeholder={dict.quote.messagePlaceholder}
            required
            error={errors.message}
          />

          {prefill.category && (
            <div className="rounded-md bg-surface px-3 py-2 text-xs text-gray-500">
              {dict.quote.category}: {prefill.category}
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-red-500">{dict.quote.error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            {dict.quote.submit}
          </Button>
        </form>
      )}
    </Modal>
  );
}
