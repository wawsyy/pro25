"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useNightlyReflection } from "@/hooks/useNightlyReflection";

export const NightlyReflectionForm = () => {
  const { address } = useAccount();
  const { addReflection, isAdding } = useNightlyReflection();
  
  const [stressLevel, setStressLevel] = useState<string>("50");
  const [achievement, setAchievement] = useState<string>("50");
  const [mindsetAdjustment, setMindsetAdjustment] = useState<string>("50");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    const stress = parseInt(stressLevel);
    const achieve = parseInt(achievement);
    const mindset = parseInt(mindsetAdjustment);

    if (isNaN(stress) || stress < 0 || stress > 100) {
      alert("Stress level must be between 0 and 100");
      return;
    }

    if (isNaN(achieve) || achieve < 0 || achieve > 100) {
      alert("Achievement level must be between 0 and 100");
      return;
    }

    if (isNaN(mindset) || mindset < 0 || mindset > 100) {
      alert("Mindset adjustment must be between 0 and 100");
      return;
    }

    try {
      await addReflection(stress, achieve, mindset);
      // Reset form
      setStressLevel("50");
      setAchievement("50");
      setMindsetAdjustment("50");
    } catch (error: any) {
      console.error("Error adding reflection:", error);
      const errorMessage = error?.message || "Unknown error occurred";
      alert(`Failed to add reflection: ${errorMessage}\n\nPlease check:\n1. Your wallet is connected\n2. You have enough ETH for gas\n3. FHEVM Relayer is accessible\n\nTry refreshing the page if the issue persists.`);
    }
  };

  const getSliderColor = (value: number) => {
    if (value < 33) return "from-red-400 to-orange-400";
    if (value < 66) return "from-yellow-400 to-orange-400";
    return "from-green-400 to-emerald-400";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stress Level */}
      <div className="form-group">
        <label htmlFor="stress" className="block text-sm font-bold text-gray-800 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">😰</span>
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Today's Stress Level
            </span>
          </div>
        </label>
        <input
          type="range"
          id="stress"
          min="0"
          max="100"
          value={stressLevel}
          onChange={(e) => setStressLevel(e.target.value)}
          className={`modern-range bg-gradient-to-r ${getSliderColor(parseInt(stressLevel))}`}
          style={{
            background: `linear-gradient(to right, 
              ${parseInt(stressLevel) < 33 ? '#f87171' : parseInt(stressLevel) < 66 ? '#fbbf24' : '#34d399'} 0%, 
              ${parseInt(stressLevel) < 33 ? '#fb923c' : parseInt(stressLevel) < 66 ? '#fb923c' : '#10b981'} ${parseInt(stressLevel)}%, 
              #e2e8f0 ${parseInt(stressLevel)}%, 
              #e2e8f0 100%)`
          }}
          disabled={isAdding}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Low</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {stressLevel}
            </span>
            <span className="text-sm font-semibold text-gray-400">/100</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">High</span>
        </div>
      </div>

      {/* Achievement Level */}
      <div className="form-group">
        <label htmlFor="achievement" className="block text-sm font-bold text-gray-800 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⭐</span>
            <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Achievement Level
            </span>
          </div>
        </label>
        <input
          type="range"
          id="achievement"
          min="0"
          max="100"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
          className={`modern-range bg-gradient-to-r ${getSliderColor(parseInt(achievement))}`}
          style={{
            background: `linear-gradient(to right, 
              ${parseInt(achievement) < 33 ? '#f87171' : parseInt(achievement) < 66 ? '#fbbf24' : '#34d399'} 0%, 
              ${parseInt(achievement) < 33 ? '#fb923c' : parseInt(achievement) < 66 ? '#fb923c' : '#10b981'} ${parseInt(achievement)}%, 
              #e2e8f0 ${parseInt(achievement)}%, 
              #e2e8f0 100%)`
          }}
          disabled={isAdding}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Low</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {achievement}
            </span>
            <span className="text-sm font-semibold text-gray-400">/100</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">High</span>
        </div>
      </div>

      {/* Mindset Adjustment */}
      <div className="form-group">
        <label htmlFor="mindset" className="block text-sm font-bold text-gray-800 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧘</span>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Mindset Adjustment
            </span>
          </div>
        </label>
        <input
          type="range"
          id="mindset"
          min="0"
          max="100"
          value={mindsetAdjustment}
          onChange={(e) => setMindsetAdjustment(e.target.value)}
          className={`modern-range bg-gradient-to-r ${getSliderColor(parseInt(mindsetAdjustment))}`}
          style={{
            background: `linear-gradient(to right, 
              ${parseInt(mindsetAdjustment) < 33 ? '#f87171' : parseInt(mindsetAdjustment) < 66 ? '#fbbf24' : '#34d399'} 0%, 
              ${parseInt(mindsetAdjustment) < 33 ? '#fb923c' : parseInt(mindsetAdjustment) < 66 ? '#fb923c' : '#10b981'} ${parseInt(mindsetAdjustment)}%, 
              #e2e8f0 ${parseInt(mindsetAdjustment)}%, 
              #e2e8f0 100%)`
          }}
          disabled={isAdding}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Low</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {mindsetAdjustment}
            </span>
            <span className="text-sm font-semibold text-gray-400">/100</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">High</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isAdding}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 mt-8 modern-btn ${
          isAdding
            ? ""
            : "modern-btn-primary"
        }`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Encrypting & Saving...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Save Reflection</span>
          </span>
        )}
      </button>
    </form>
  );
};
