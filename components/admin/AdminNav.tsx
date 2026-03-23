"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin",         label: "Overview",  icon: "◈" },
  { href: "/admin/modules", label: "Modules",   icon: "◧" },
  { href: "/admin/users",   label: "Users",     icon: "◉" },
];

export function AdminNav() {
  const path = usePathname();

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-56 z-40 py-8 px-4"
        style={{ background: "#0d1021", borderRight: "1px solid #1e2540" }}>
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#c49a3c22", border: "1px solid #c49a3c44" }}>
            <span style={{ color: "#c49a3c" }}>◈</span>
          </div>
          <span className="font-ui font-bold tracking-widest text-sm" style={{ color: "#e8e4d9" }}>LUMINARY</span>
        </div>
        <p className="px-2 text-xs mb-8 font-semibold uppercase tracking-widest" style={{ color: "#c49a3c" }}>Admin</p>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ href, label, icon }) => {
            const active = path === href || (href !== "/admin" && path.startsWith(href));
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "#c49a3c18" : "transparent",
                  color: active ? "#c49a3c" : "#6b7280",
                  border: active ? "1px solid #c49a3c33" : "1px solid transparent",
                }}>
                <span>{icon}</span>{label}
              </Link>
            );
          })}
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2"
            style={{ color: "#3a4060", border: "1px solid transparent" }}>
            <span>←</span> Trainee View
          </Link>
        </nav>

        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs w-full mt-4 transition-all"
          style={{ color: "#6b7280" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ff8080")}
          onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
          <span>→</span> Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <nav className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: "#0d1021", borderBottom: "1px solid #1e2540" }}>
        <span className="font-ui font-bold text-sm tracking-widest" style={{ color: "#c49a3c" }}>ADMIN</span>
        <div className="flex gap-4">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} className="text-xs font-medium"
              style={{ color: path.startsWith(href) ? "#c49a3c" : "#6b7280" }}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
