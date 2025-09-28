import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  DollarSign,
  PieChart,
  Activity,
  ExternalLink,
  Zap
} from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { useVaultStore } from '../stores/vaultStore';
import { SUPPORTED_CHAINS } from '../constants/chains';
import { formatCurrency, formatPercentage, formatAddress } from '../utils/format';

export const Dashboard: React.FC = () => {
  const { isConnected, address, balances } = useWalletStore();
  const { positions, statistics, recentTransactions } = useVaultStore();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Cross-Chain DeFi Vault
          </h2>
          <p className="text-gray-600 mb-8">
            Connect your wallet to start earning yield across multiple blockchains
          </p>
          <Link
            to="/connect"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {formatAddress(address!)}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            to="/deposit"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Withdraw
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.totalBalance)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              +{formatPercentage(statistics.totalYield)} this month
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Yield Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.totalYieldEarned)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              APY: {formatPercentage(statistics.averageApy)}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Positions</p>
              <p className="text-2xl font-bold text-gray-900">
                {positions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Across {new Set(positions.map(p => p.chainId)).size} chains
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentTransactions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Last 30 days
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chain Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Chain Distribution</h3>
            <Link
              to="/vault"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View Details
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {SUPPORTED_CHAINS.map((chain) => {
              const chainPositions = positions.filter(p => p.chainId === chain.id);
              const chainBalance = chainPositions.reduce((sum, p) => sum + p.balance, 0);
              const percentage = statistics.totalBalance > 0 ? (chainBalance / statistics.totalBalance) * 100 : 0;
              
              return (
                <div key={chain.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: chain.color + '20' }}>
                      <span className="text-xs font-medium" style={{ color: chain.color }}>
                        {chain.symbol}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{chain.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(chainBalance)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(percentage)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link
              to="/history"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((tx) => {
              const chain = SUPPORTED_CHAINS.find(c => c.id === tx.chainId);
              const isDeposit = tx.type === 'deposit';
              
              return (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDeposit ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isDeposit ? (
                        <ArrowDownToLine className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpFromLine className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {tx.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {chain?.name} • {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      isDeposit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};