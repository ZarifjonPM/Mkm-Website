import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — MKM Metal",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-slate-50 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
