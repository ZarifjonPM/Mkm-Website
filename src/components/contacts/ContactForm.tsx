"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Button } from "@/components/shared/Button";

interface ContactFormProps {
  dict: Dictionary;
}

export function ContactForm({ dict }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          company: form.get("company"),
          phone: form.get("phone"),
          email: form.get("email"),
          message: form.get("message"),
        }),
      });

      setStatus(res.ok ? "success" : "error");
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label={dict.contacts.formName}
        required
      />
      <Input
        name="company"
        label={dict.contacts.formCompany}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="phone"
          type="tel"
          inputMode="tel"
          label={dict.contacts.formPhone}
          defaultValue="+998 "
          required
        />
        <Input
          name="email"
          type="email"
          label={dict.contacts.formEmail}
          required
        />
      </div>
      <Textarea
        name="message"
        label={dict.contacts.formMessage}
        required
      />

      {status === "success" && (
        <p className="text-sm text-green-600">{dict.contacts.formSuccess}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500">{dict.contacts.formError}</p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        {dict.contacts.formSubmit}
      </Button>
    </form>
  );
}
