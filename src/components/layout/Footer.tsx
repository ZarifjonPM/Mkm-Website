import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CONTACT, NAV_ITEMS } from "@/lib/constants";
import categories from "@/data/categories.json";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo-white.jpg"
                alt="MKM Metal"
                width={200}
                height={80}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-white/60">{dict.footer.description}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              {dict.footer.navigation}
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const href =
                  item.href === "/"
                    ? `/${locale}`
                    : `/${locale}${item.href}`;
                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {dict.nav[item.labelKey as keyof typeof dict.nav]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              {dict.footer.products}
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}/catalog?category=${cat.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {cat.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              {dict.footer.contactUs}
            </h3>
            <div className="space-y-3 text-sm text-white/60">
              {CONTACT.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="block transition-colors hover:text-white"
                >
                  {phone}
                </a>
              ))}
              <a
                href={`mailto:${CONTACT.email}`}
                className="block transition-colors hover:text-white"
              >
                {CONTACT.email}
              </a>
              <p>{CONTACT.address[locale]}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {year} MKM Metal. {dict.footer.rights}.
        </div>
      </div>
    </footer>
  );
}
