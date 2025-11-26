"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NightlyReflectionForm } from "./NightlyReflectionForm";
import { NightlyReflectionDisplay } from "./NightlyReflectionDisplay";
import { useNightlyReflection } from "@/hooks/useNightlyReflection";

export const NightlyReflectionApp = () => {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const { contractAddress, fhevmStatus, fhevmError } = useNightlyReflection();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a consistent structure during SSR and initial client render
    return (
      <div className="w-full max-w-2xl mx-auto mt-20">
        <div className="modern-card">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="modern-card text-center" style={{ animation: "fadeInUp 0.6s ease-out" }}>
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 mb-4 mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6 text-base leading-relaxed max-w-md mx-auto">
              Connect your Rainbow wallet to start recording your nightly reflections securely with end-to-end encryption
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ animation: "fadeInUp 0.6s ease-out" }}>
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 mb-4 shadow-lg">
          <span className="text-3xl">🌙</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
          Nightly Reflection
        </h1>
        <p className="text-white/95 text-base max-w-xl mx-auto leading-relaxed font-medium">
          Record your daily reflections with end-to-end encryption. Your thoughts are private and secure on the blockchain.
        </p>
      </div>

      {/* Warning if contract not deployed */}
      {!contractAddress && (
        <div className="mb-8 modern-card bg-yellow-50 border-yellow-200">
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-1">Contract Not Deployed</h3>
            <p className="text-yellow-700 text-sm">
              The Nightly Reflection contract is not deployed on this network. Please deploy the contract first or switch to a network where it's deployed.
            </p>
          </div>
        </div>
      )}

      {/* Warning if FHEVM has errors */}
      {fhevmStatus === "error" && fhevmError && (
        <div className="mb-8 modern-card bg-orange-50 border-orange-200">
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-1">FHEVM Initialization Warning</h3>
            <p className="text-orange-700 text-sm mb-2">
              The FHEVM encryption service is currently unavailable. This may be temporary.
            </p>
            <p className="text-orange-600 text-xs">
              Error: {fhevmError.message || "Unknown error"}
            </p>
            <p className="text-orange-600 text-xs mt-2">
              You can still view existing reflections, but adding new encrypted reflections may not work until the service is restored.
            </p>
          </div>
        </div>
      )}

      {/* Loading indicator for FHEVM */}
      {fhevmStatus === "loading" && (
        <div className="mb-8 modern-card bg-blue-50 border-blue-200">
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-1">Initializing Encryption Service</h3>
            <p className="text-blue-700 text-sm">
              Please wait while we set up the FHEVM encryption service...
            </p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Add Reflection Card */}
        <div className="modern-card">
          <h2 className="section-title">
            Add Reflection
          </h2>
          <NightlyReflectionForm />
        </div>

        {/* Display Reflection Card */}
        <div className="modern-card">
          <h2 className="section-title">
            My Reflection
          </h2>
          <NightlyReflectionDisplay />
        </div>
      </div>
    </div>
  );
};



