import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  // Animated counters for social proof
  const [tvl, setTvl] = useState(0);
  const [users, setUsers] = useState(0);
  const [chains, setChains] = useState(0);

  useEffect(() => {
    const animate = (setter: (n: number) => void, target: number, duration = 1200) => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setter(Math.floor(p * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    animate(setTvl, 8550000);
    animate(setUsers, 1234);
    animate(setChains, 4);
  }, []);

  const formatUSD = (n: number) => {
    return `$${(n / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
        <Zap className="w-4 h-4" /> Powered by ZetaChain
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Cross-Chain Yield, Simplified.
      </h1>
      <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
        Deposit on any chain. We route via ZetaChain to the best returns. Withdraw anywhere.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/deposit"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          Start Depositing
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          to="/connect"
          className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          Try Demo Mode
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatUSD(tvl)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Value Locked</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{users.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{chains}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Supported Chains</div>
        </div>
      </div>
    </div>
  );
}