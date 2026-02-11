import { Outlet, Link } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  PiggyBank,
  User,
  Wallet,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { ConfirmModal } from "../ui/ConfirmModal";
import { ThemeToggle } from "../ui/ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/transactions", label: "Transactions", icon: ClipboardList },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/savings-goals", label: "Savings", icon: PiggyBank },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

function getInitial(displayNameOrEmail: string | undefined): string {
  if (!displayNameOrEmail) return "U";
  const part = displayNameOrEmail.includes("@")
    ? displayNameOrEmail.split("@")[0]
    : displayNameOrEmail;
  if (!part) return "U";
  return part.slice(0, 2).toUpperCase();
}

function getDisplayNameFromEmail(email: string | undefined): string {
  if (!email) return "User";
  const part = email.split("@")[0];
  if (!part) return "User";
  return part.charAt(0).toUpperCase() + part.slice(1);
}

const MOBILE_HEADER_HEIGHT = 56;
const SCROLL_DOWN_THRESHOLD = 50;
const SCROLL_UP_THRESHOLD = 20;

export const Layout = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const lastScrollTop = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      if (scrollTop <= SCROLL_UP_THRESHOLD) {
        setShowMobileHeader(true);
      } else if (scrollTop > lastScrollTop.current && scrollTop > SCROLL_DOWN_THRESHOLD) {
        setShowMobileHeader(false);
      } else if (scrollTop < lastScrollTop.current) {
        setShowMobileHeader(true);
      }
      lastScrollTop.current = scrollTop;
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName =
    (user?.user_metadata?.display_name as string | undefined)?.trim() ||
    getDisplayNameFromEmail(user?.email);
  const initial = getInitial(displayName || user?.email);

  return (
    <div className="w-full min-w-0 min-h-screen flex bg-[var(--page-bg)] text-[var(--text)]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--border)] bg-[var(--card-bg)] shrink-0">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <img
              src={isDark ? "/favicon.svg" : "/logo-light.svg"}
              alt=""
              className="h-9 w-9 rounded-lg shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)] truncate">
                MyFinTrack
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Expense tracker
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        {/* Profile block */}
        <div className="p-3 border-t border-[var(--border)] shrink-0">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--page-bg)] p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--page-bg)] text-[var(--text)] font-semibold text-sm ring-2 ring-primary/20">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--text)] truncate">
                  {displayName}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>Member</span>
            </div>
            <Link
              to="/settings"
              className="block text-center rounded-lg border border-[var(--border)] py-2.5 min-h-[44px] flex items-center justify-center text-xs font-medium text-[var(--text)] hover:bg-[var(--border)] transition-colors mb-2 touch-manipulation"
            >
              Account & settings
            </Link>
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 min-h-[44px] text-xs font-medium text-white hover:bg-red-700 transition-colors touch-manipulation"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:min-h-0">
        <header
          className={[
            "z-20 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[var(--border)] bg-[var(--card-bg)] shrink-0 transition-transform duration-300 ease-out",
            "lg:sticky lg:top-0",
            "fixed top-0 left-0 right-0 lg:relative lg:left-auto lg:right-auto",
            showMobileHeader ? "translate-y-0" : "-translate-y-full lg:translate-y-0",
          ].join(" ")}
        >
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)] touch-manipulation"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={isDark ? "/favicon.svg" : "/logo-light.svg"}
              alt=""
              className="h-8 w-8 shrink-0 rounded-lg object-contain"
            />
            <span className="font-semibold text-[var(--text)]">MyFinTrack</span>
          </div>
          <div className="ml-auto flex items-center shrink-0">
            <ThemeToggle
              checked={isDark}
              onChange={toggleTheme}
              label={isDark ? "Dark mode" : "Light mode"}
            />
          </div>
        </header>

        {showMobileHeader && (
          <div className="lg:hidden h-14 shrink-0 pointer-events-none" aria-hidden />
        )}

        {mobileOpen && (
          <nav className="lg:hidden border-b border-[var(--border)] bg-[var(--card-bg)] p-3 space-y-0.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 min-h-[48px] text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)] touch-manipulation transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[var(--border)] flex items-center gap-3 px-3 py-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--page-bg)] text-[var(--text)] font-semibold text-sm ring-2 ring-primary/20">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--text)] truncate text-sm">
                  {displayName}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3 min-h-[48px] text-sm font-medium text-white hover:bg-red-700 transition-colors touch-manipulation"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </nav>
        )}

        <ConfirmModal
          open={logoutConfirmOpen}
          onClose={() => setLogoutConfirmOpen(false)}
          onConfirm={async () => {
            await signOut();
            setLogoutConfirmOpen(false);
          }}
          title="Log out?"
          description="Are you sure you want to log out? You will need to sign in again to access your data."
          confirmLabel="Log out"
          variant="danger"
        />

        <main
          ref={mainRef}
          className="flex-1 min-h-0 p-2 md:p-3 overflow-auto"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
