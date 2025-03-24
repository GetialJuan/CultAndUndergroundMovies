'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white flex items-center w-full py-1 gap-2"
    >
      <LogOut className="w-4 h-4" /> {/* Icono de logout */}
      <span>Log Out</span>
    </button>
  );
};

export default LogoutButton;
