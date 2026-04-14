import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, LayoutDashboard, User, LogOut, HomeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-0.5 px-3 py-2 rounded-full bg-white border border-blue-100 shadow-[0_4px_20px_rgba(59,130,246,0.12)]">

        <DockItem icon={HomeIcon} label="Home"         to="/"       active={isActive("/")} />
        <DockItem icon={Search}   label="Find doctors" to="/search" active={isActive("/search")} />

        {user ? (
          <>
            {user.role === "doctor" && (
              <DockItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={isActive("/dashboard")} />
            )}
            <DockItem icon={User} label="Profile" to="/profile" active={isActive("/profile")} />

            {/* Separator */}
            <div className="w-px h-5 bg-blue-100 mx-2" />

            {/* Logout */}
            <button
              onClick={logout}
              aria-label="Log out"
              className="
                group relative flex items-center justify-center
                w-11 h-11 rounded-full
                text-slate-400 hover:text-red-500 hover:bg-red-50
                transition-all duration-150
              "
            >
              <Tooltip label="Log out" />
              <LogOut size={19} strokeWidth={2} />
            </button>
          </>
        ) : (
          <DockItem icon={User} label="Login" to="/login" active={isActive("/login")} />
        )}

      </div>
    </nav>
  );
};

function Tooltip({ label }) {
  return (
    <span className="
      pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
      opacity-0 group-hover:opacity-100 transition-opacity duration-150
      text-[11px] font-medium text-white whitespace-nowrap
      px-2.5 py-1 rounded-md bg-slate-800
    ">
      {label}
    </span>
  );
}

function DockItem({ icon: Icon, label, to, active }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`
        group relative flex items-center justify-center
        w-11 h-11 rounded-full transition-all duration-150
        ${active
          ? "text-blue-600 bg-blue-50"
          : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
        }
      `}
    >
      <Tooltip label={label} />

      {/* Active dot */}
      {active && (
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
      )}

      <Icon size={19} strokeWidth={2} />
    </Link>
  );
}

export default Navbar;