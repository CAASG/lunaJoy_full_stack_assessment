/**
 * @module Navbar
 * @description Top navigation bar with user greeting, navigation links,
 * and logout button. Only shown on authenticated pages.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-luna-cream-dark">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-xl font-semibold text-luna-dark">
            LunaJoy
          </Link>
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="text-sm text-luna-warm-gray hover:text-luna-dark transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/log"
              className="text-sm text-luna-warm-gray hover:text-luna-dark transition-colors"
            >
              New Entry
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-luna-warm-gray">
              Hi, {user.name.split(' ')[0]}
            </span>
          )}
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-luna-warm-gray hover:text-luna-dark transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
