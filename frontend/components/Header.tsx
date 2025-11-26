"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="flex w-full px-4 py-3 justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">NR</span>
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Nightly Reflection
              </h1>
              <p className="text-xs text-gray-500 font-medium">Encrypted Journal</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

