import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Stethoscope, Search, LayoutDashboard, User, LogOut, HomeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">

        {/* Home */}
        <DockItem
          icon={HomeIcon}
          label="Home"
          to="/"
          active={isActive("/")}
        />

        {/* Find Doctors */}
        <DockItem
          icon={Search}
          label="Find Doctors"
          to="/search"
          active={isActive("/search")}
        />

        {user ? (
          <>
            {/* Doctor Dashboard */}
            {user.role === "doctor" && (
              <DockItem
                icon={LayoutDashboard}
                label="Dashboard"
                to="/dashboard"
                active={isActive("/dashboard")}
              />
            )}

            {/* Profile */}
            <DockItem
              icon={User}
              label="Profile"
              to="/profile"
              active={isActive("/profile")}
            />

            {/* Logout */}
            <button
              onClick={logout}
              className="relative group flex flex-col items-center"
              aria-label="Logout"
            >
              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-14 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200">
                <span className="whitespace-nowrap text-xs font-medium text-white px-4 py-2 rounded-md bg-white/10 border border-white/15 shadow-xl">
                  Logout
                </span>
              </span>

              {/* Icon */}
              <span className="relative z-10 p-3 rounded-full text-white transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-110">
                <LogOut size={22} />
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <DockItem
              icon={User}
              label="Login"
              to="/login"
              active={isActive("/login")}
            />
          </>
        )}
      </div>
    </nav>
  );
};

function DockItem({ icon: Icon, label, to, active }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative group flex flex-col items-center"
    >
      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-14 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200">
        <span className="whitespace-nowrap text-xs font-medium text-white px-4 py-2 rounded-md bg-white/10 border border-white/15 shadow-xl">
          {label}
        </span>
      </span>

      {/* Glow */}
      <span
        className={`absolute inset-0 rounded-md transition-all duration-300 ${
          active
            ? "opacity-100 bg-white/15"
            : "opacity-0 group-hover:opacity-100 bg-white/20"
        }`}
      >
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-tl-2xl rounded-tr-2xl bg-primary" />
      </span>

      {/* Icon */}
      <span
        className={`relative z-10 p-3 rounded-full text-white transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 ${
          active ? "-translate-y-1.5 scale-110" : ""
        }`}
      >
        <Icon size={22} />
      </span>
    </Link>
  );
}

export default Navbar;
