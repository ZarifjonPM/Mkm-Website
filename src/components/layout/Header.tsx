"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { NAV_ITEMS } from "@/lib/constants";
import { useQuoteModal } from "@/components/shared/QuoteModalProvider";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openQuoteModal } = useQuoteModal();

  const otherLocale = locale === "ru" ? "uz" : "ru";
  const switchLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="sticky top-0 z-50 bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between lg:h-24">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo-white.jpg"
              alt="MKM Metal"
              width={200}
              height={80}
              className="h-14 w-auto sm:h-16 lg:h-20"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const href = item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
              const isActive =
                item.href === "/"
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(`/${locale}${item.href}`);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {dict.nav[item.labelKey as keyof typeof dict.nav]}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <Link
              href={switchLocalePath}
              className="rounded-md border border-white/20 px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-white/10"
            >
              {otherLocale}
            </Link>

            {/* CTA button */}
            <button
              onClick={() => openQuoteModal()}
              className="hidden rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:block"
            >
              {dict.cta.button}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-white/80 hover:text-white lg:hidden"
              aria-label="Open menu"
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
        dict={dict}
      />
    </header>
  );
}
