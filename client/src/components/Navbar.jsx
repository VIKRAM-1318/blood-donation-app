import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
      isActive
        ? 'bg-[#ffdad6] text-[#b70011] dark:bg-[#334155] dark:text-[#ffdad6]'
        : isDarkMode
        ? 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b1c30]'
    }`;

  // Keyboard shortcut Ctrl+K
  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? 'bg-[#0F172A]/90 border-[#334155] text-white'
            : 'bg-white/90 border-slate-200 text-[#0b1c30]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#dc2626] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined !text-[22px]">cardiology</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none">
                  Life<span className="text-[#dc2626]">Link</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                  Emergency Grid
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink to="/find-donors" className={navLinkClass}>
                Find Donors
              </NavLink>
              <NavLink to="/blood-requests" className={navLinkClass}>
                Blood Requests
              </NavLink>
              <NavLink to="/create-request" className={navLinkClass}>
                Create Request
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin Console
                </NavLink>
              )}
            </div>

            {/* Actions: Search, Theme Toggle, Auth */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition-colors border cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1E293B] border-[#334155] text-slate-400 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-[#0b1c30]'
                }`}
                title="Search (Ctrl + K)"
              >
                <span className="material-symbols-outlined !text-[18px]">search</span>
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/10 dark:bg-white/10">
                  Ctrl K
                </kbd>
              </button>

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isDarkMode
                    ? 'bg-[#1E293B] border-[#334155] text-amber-400 hover:bg-[#334155]'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
                aria-label="Toggle dark mode"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* Auth actions */}
              <div className="hidden sm:flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold truncate max-w-[120px]">
                      {user?.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-[#dc2626] hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                        isDarkMode
                          ? 'border-[#334155] text-slate-200 hover:bg-[#1E293B]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#dc2626] hover:bg-[#b70011] text-white shadow-sm transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-xl md:hidden transition-colors border cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1E293B] border-[#334155] text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
                aria-label="Open navigation menu"
              >
                <span className="material-symbols-outlined !text-[20px]">
                  {mobileOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div
            className={`md:hidden border-t px-4 py-3 space-y-1 ${
              isDarkMode ? 'bg-[#0F172A] border-[#334155]' : 'bg-white border-slate-200'
            }`}
          >
            <NavLink
              to="/"
              className={navLinkClass}
              end
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/find-donors"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Find Donors
            </NavLink>
            <NavLink
              to="/blood-requests"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Blood Requests
            </NavLink>
            <NavLink
              to="/create-request"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Create Request
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Admin Console
              </NavLink>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-[#334155] flex gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-[#dc2626] text-center"
                >
                  Logout ({user?.name})
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#334155]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-[#dc2626] text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
