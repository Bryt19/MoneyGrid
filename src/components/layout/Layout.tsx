import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronUp,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  PiggyBank,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { ConfirmModal } from "../ui/ConfirmModal";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useNotification } from "../../contexts/NotificationContext";

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
  
  const words = part.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return words[0].slice(0, 2).toUpperCase();
}

function getDisplayNameFromEmail(email: string | undefined): string {
  if (!email) return "User";
  const part = email.split("@")[0];
  if (!part) return "User";
  return part.charAt(0).toUpperCase() + part.slice(1);
}

const SCROLL_DOWN_THRESHOLD = 50;
const SCROLL_UP_THRESHOLD = 20;

export const Layout = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { showSuccess } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const lastScrollTop = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const welcomeShownRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = !desktopProfileRef.current || !desktopProfileRef.current.contains(event.target as Node);
      const isOutsideMobile = !mobileProfileRef.current || !mobileProfileRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    if (location.state?.welcome && !welcomeShownRef.current && user) {
      showSuccess(`Welcome back, ${displayName}`);
      welcomeShownRef.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, displayName, showSuccess, navigate, user]);

  const initial = getInitial(displayName || user?.email);

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <img
            src={isDark ? "/favicon.svg" : "/logo-light.svg"}
            alt=""
            className="h-9 w-9 rounded-lg shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="font-semibold text-[var(--text)] truncate">
              MoneyGrid
            </p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">
              moneygrid.vercel.app
            </p>
          </div>
          {isMobile && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="ml-auto p-1 rounded-lg hover:bg-[var(--border)] lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 ${isMobile ? 'py-2' : 'py-2.5'} text-sm font-medium transition-colors ${
              location.pathname === to 
                ? 'bg-primary/10 text-primary' 
                : 'text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      {/* Profile block */}
      <div 
        className="p-3 border-t border-[var(--border)] shrink-0 relative" 
        ref={isMobile ? mobileProfileRef : desktopProfileRef}
      >
        {profileMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <Link
              to="/settings"
              onClick={() => {
                setProfileMenuOpen(false);
                if (isMobile) setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            >
              <Settings className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              Account & settings
            </Link>
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(false);
                setLogoutConfirmOpen(true);
              }}
              className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className={`w-full flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--page-bg)] ${isMobile ? 'p-2.5' : 'p-3'} text-left transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98] ${profileMenuOpen ? 'ring-2 ring-primary/20 border-primary/30' : ''}`}
        >
          <div className={`flex ${isMobile ? 'h-9 w-9' : 'h-10 w-10'} shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] font-semibold text-sm ring-2 ring-primary/10`}>
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[var(--text)] truncate text-sm">
              {displayName}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">
              {user?.email}
            </p>
          </div>
          <ChevronUp className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-w-0 min-h-screen flex bg-[var(--page-bg)] text-[var(--text)]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--border)] bg-[var(--card-bg)] shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:min-h-0">
        <header
          className={[
            "z-40 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-b border-[var(--border)] bg-[var(--card-bg)] shrink-0 transition-transform duration-300 ease-out",
            "lg:sticky lg:top-0",
            "fixed top-0 left-0 right-0 lg:relative lg:left-auto lg:right-auto",
            showMobileHeader || mobileOpen ? "translate-y-0" : "-translate-y-full lg:translate-y-0",
          ].join(" ")}
        >
          <button
            type="button"
            className="lg:hidden flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)] touch-manipulation"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={isDark ? "/favicon.svg" : "/logo-light.svg"}
              alt=""
              className="h-7 w-7 shrink-0 rounded-lg object-contain"
            />
            <span className="font-semibold text-[var(--text)]">MoneyGrid</span>
          </div>
          <div className="ml-auto flex items-center shrink-0">
            <ThemeToggle
              checked={isDark}
              onChange={toggleTheme}
              label={isDark ? "Dark mode" : "Light mode"}
            />
          </div>
        </header>

        {/* Spacer for fixed header on mobile */}
        <div 
          className={`lg:hidden h-[53px] shrink-0 pointer-events-none transition-[margin-top] duration-300 ${showMobileHeader || mobileOpen ? '' : '-mt-[53px]'}`} 
          aria-hidden 
        />

        {/* Mobile Sidebar Drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div 
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setMobileOpen(false)} 
          />
          <div className={`absolute inset-y-0 left-0 w-64 bg-[var(--card-bg)] shadow-2xl transition-transform duration-300 ease-out border-r border-[var(--border)] ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <SidebarContent isMobile />
          </div>
        </div>

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
          <footer className="mt-auto py-6 px-4 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-muted)]">
              © {new Date().getFullYear()} MoneyGrid. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
