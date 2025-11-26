"use client";

import { useAccount } from "wagmi";
import { useNightlyReflection } from "@/hooks/useNightlyReflection";

export const NightlyReflectionDisplay = () => {
  const { address } = useAccount();
  const {
    reflection,
    isRefreshing,
    isDecrypting,
    canDecrypt,
    canRefresh,
    refreshReflection,
    decryptReflection,
  } = useNightlyReflection();

  if (!address) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔐</div>
        <div className="empty-title">Wallet Not Connected</div>
        <div className="empty-subtitle">Please connect your wallet to view reflections</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={refreshReflection}
          disabled={!canRefresh}
          className={`flex-1 modern-btn ${canRefresh ? 'modern-btn-primary' : ''}`}
        >
          {isRefreshing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Refreshing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Refresh</span>
            </span>
          )}
        </button>
        <button
          onClick={decryptReflection}
          disabled={!canDecrypt}
          className={`flex-1 modern-btn ${canDecrypt ? 'modern-btn-success' : ''}`}
        >
          {isDecrypting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Decrypting...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Decrypt</span>
            </span>
          )}
        </button>
      </div>

      {/* Reflection Data Display */}
      {reflection && (
        <div className="space-y-4">
          {/* Stress Level */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-2 border-red-100/80 transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">😰</span>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Stress Level</span>
                </div>
                {reflection.decryptedStress !== undefined && (
                  <span className="modern-badge">Decrypted</span>
                )}
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {reflection.decryptedStress !== undefined
                  ? reflection.decryptedStress.toString()
                  : "🔒"}
              </div>
              {reflection.decryptedStress === undefined && (
                <div className="text-xs font-semibold text-gray-500 mt-1">Encrypted</div>
              )}
            </div>
          </div>

          {/* Achievement Level */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-100/80 transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Achievement Level</span>
                </div>
                {reflection.decryptedAchievement !== undefined && (
                  <span className="modern-badge">Decrypted</span>
                )}
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                {reflection.decryptedAchievement !== undefined
                  ? reflection.decryptedAchievement.toString()
                  : "🔒"}
              </div>
              {reflection.decryptedAchievement === undefined && (
                <div className="text-xs font-semibold text-gray-500 mt-1">Encrypted</div>
              )}
            </div>
          </div>

          {/* Mindset Adjustment */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-100/80 transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🧘</span>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Mindset Adjustment</span>
                </div>
                {reflection.decryptedMindset !== undefined && (
                  <span className="modern-badge">Decrypted</span>
                )}
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {reflection.decryptedMindset !== undefined
                  ? reflection.decryptedMindset.toString()
                  : "🔒"}
              </div>
              {reflection.decryptedMindset === undefined && (
                <div className="text-xs font-semibold text-gray-500 mt-1">Encrypted</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!reflection && !isRefreshing && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <div className="empty-title">No Reflection Found</div>
          <div className="empty-subtitle">Add your first reflection to get started!</div>
        </div>
      )}
    </div>
  );
};
