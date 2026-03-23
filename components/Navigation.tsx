"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/modules",   label: "Modules",   icon: "◧" },
  { href: "/progress",  label: "Progress",  icon: "◎" },
];

export function Navigation({ userName }: { userName?: string | null }) {
  const path = usePathname();

  return (
    <>
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-56 z-40 py-8 px-4"
        style={{ background: "#0d1021", borderRight: "1px solid #1e2540" }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#c49a3c22", border: "1px solid #c49a3c44" }}>
            <span style={{ color: "#c49a3c" }}>◈</span>
          </div>
          <span className="font-ui font-bold tracking-widest text-sm" style={{ color: "#e8e4d9" }}>LUMINARY</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ href, label, icon }) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "#c49a3c18" : "transparent",
                  color: active ? "#c49a3c" : "#6b7280",
                  border: active ? "1px solid #c49a3c33" : "1px solid transparent",
                }}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div className="border-t pt-4 mt-4" style={{ borderColor: "#1e2540" }}>
          {userName && (
            <p className="text-xs px-3 mb-3 truncate" style={{ color: "#6b7280" }}>{userName}</p>
          )}
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs w-full transition-all"
            style={{ color: "#6b7280" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ff8080")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
            <span>→</span> Sign out
          </button>
        </div>
      </aside>

      {/* Bottom bar — mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-4 py-3"
        style={{ background: "#0d1021", borderTop: "1px solid #1e2540" }}>
        {NAV.map(({ href, label, icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 text-xs font-medium transition-all"
              style={{ color: active ? "#c49a3c" : "#6b7280" }}>
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          );
        })}
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center gap-1 text-xs font-medium"
          style={{ color: "#6b7280" }}>
          <span className="text-xl">→</span>
          Out
        </button>
      </nav>
    </>
  );
}
