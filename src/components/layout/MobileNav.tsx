"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { NAV_ITEMS } from "@/lib/constants";
import { useQuoteModal } from "@/components/shared/QuoteModalProvider";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
}

export function MobileNav({ isOpen, onClose, locale, dict }: MobileNavProps) {
  const pathname = usePathname();
  const { openQuoteModal } = useQuoteModal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-72 bg-brand p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">MKM Metal</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-white/80 hover:text-white"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const href =
              item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
            const isActive =
              item.href === "/"
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(`/${locale}${item.href}`);

            return (
              <Link
                key={item.href}
                href={href}
                onClick={onClose}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {dict.nav[item.labelKey as keyof typeof dict.nav]}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-6">
          <button
            onClick={() => {
              openQuoteModal();
              onClose();
            }}
            className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {dict.cta.button}
          </button>
        </div>

        {/* Language switcher */}
        <div className="mt-4 flex gap-2">
          <Link
            href={pathname.replace(`/${locale}`, "/ru")}
            onClick={onClose}
            className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase ${
              locale === "ru"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            RU
          </Link>
          <Link
            href={pathname.replace(`/${locale}`, "/uz")}
            onClick={onClose}
            className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase ${
              locale === "uz"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            UZ
          </Link>
        </div>
      </div>
    </div>
  );
}
