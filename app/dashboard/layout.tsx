import Link from "next/link";
import LogoutButton from "../../components/logout-button";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: "▦" },
  { label: "AI Chats", href: "/dashboard/chats", icon: "💬" },
];

const WAGTAIL_LINKS = [
  { label: "Manage Content", href: "http://127.0.0.1:8000/admin/", icon: "⚙️" },
  { label: "Django Admin", href: "http://127.0.0.1:8000/django-admin/", icon: "🗄️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* ═══ Sidebar ═══ */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-navy-800 bg-navy-900/40 p-4 backdrop-blur">
          <div className="mb-4 flex items-center gap-3 border-b border-navy-800 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-navy-950">
              AK
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-100">Dashboard</div>
              <div className="text-xs text-ink-500">Private</div>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-300 transition-colors hover:bg-navy-800/60 hover:text-gold-300"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-navy-800 pt-4">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
              External
            </div>
            <nav className="space-y-1">
              {WAGTAIL_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-400 transition-colors hover:bg-navy-800/60 hover:text-gold-300"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label} ↗
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-6 border-t border-navy-800 pt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ═══ Main ═══ */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
