/**
 * @module Navbar
 * @description Top navigation bar with user greeting, navigation links,
 * and logout button. Responsive: collapses gracefully on mobile.
 * Only shown on authenticated pages.
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /** Returns active link styling based on current path */
  const linkClass = (path: string) =>
    `text-sm transition-colors ${
      location.pathname.startsWith(path)
        ? 'text-luna-dark font-medium'
        : 'text-luna-warm-gray hover:text-luna-dark'
    }`;

  return (
    <nav className="bg-white border-b border-luna-cream-dark sticky top-0 z-40">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/dashboard" className="text-xl font-semibold text-luna-dark">
            LunaJoy
          </Link>
          <div className="flex gap-3 sm:gap-4">
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/log" className={linkClass('/log')}>
              New Entry
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full ring-2 ring-luna-cream-dark"
              referrerPolicy="no-referrer"
            />
          ) : user ? (
            <div className="w-8 h-8 rounded-full bg-luna-blue-light flex items-center justify-center text-sm font-medium text-luna-blue-dark">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : null}
          <span className="text-sm text-luna-warm-gray hidden sm:inline">
            {user?.name.split(' ')[0]}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-luna-warm-gray hover:text-luna-dark transition-colors ml-1"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
