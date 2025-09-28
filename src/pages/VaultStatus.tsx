import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Activity,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useWalletStore } from '../stores/walletStore';
import { useVaultStore } from '../stores/vaultStore';
import { SUPPORTED_CHAINS, SUPPORTED_TOKENS } from '../constants/chains';
import { formatCurrency, formatPercentage, formatTokenAmount } from '../utils/format';

type ViewMode = 'overview' | 'allocation' | 'performance';

export const VaultStatus: React.FC = () => {
  const { isConnected } = useWalletStore();
  const { positions, statistics, recentTransactions } = useVaultStore();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate chain distribution data
  const chainDistribution = SUPPORTED_CHAINS.map(chain => {
    const chainPositions = positions.filter(p => p.chainId === chain.id);
    const totalValue = chainPositions.reduce((sum, p) => sum + p.balance, 0);
    const percentage = statistics.totalBalance > 0 ? (totalValue / statistics.totalBalance) * 100 : 0;
    
    return {
      name: chain.name,
      value: totalValue,
      percentage,
      color: chain.color,
      positions: chainPositions.length
    };
  }).filter(item => item.value > 0);

  // Mock performance data
  const performanceData = [
    { date: '2024-01-01', value: 10000, apy: 8.5 },
    { date: '2024-01-08', value: 10180, apy: 9.2 },
    { date: '2024-01-15', value: 10350, apy: 9.8 },
    { date: '2024-01-22', value: 10520, apy: 10.1 },
    { date: '2024-01-29', value: 10680, apy: 9.5 },
    { date: '2024-02-05', value: 10850, apy: 9.7 },
    { date: '2024-02-12', value: 11020, apy: 10.3 }
  ];

  // Token distribution data
  const tokenDistribution = SUPPORTED_TOKENS.map(token => {
    const tokenPositions = positions.filter(p => p.tokenSymbol === token.symbol);
    const totalValue = tokenPositions.reduce((sum, p) => sum + p.balance, 0);
    
    return {
      name: token.symbol,
      value: totalValue,
      positions: tokenPositions.length
    };
  }).filter(item => item.value > 0);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Wallet to View Vault Status
          </h2>
          <p className="text-gray-600 mb-8">
            Connect your wallet to see detailed vault analytics and performance metrics
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Vault Status</h1>
          <p className="text-gray-600 mt-1">
            Detailed analytics and performance metrics for your cross-chain vault
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'overview', label: 'Overview', icon: Activity },
          { key: 'allocation', label: 'Allocation', icon: PieChart },
          { key: 'performance', label: 'Performance', icon: TrendingUp }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key as ViewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value Locked</p>
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
                  +{formatPercentage(12.5)} this month
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average APY</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPercentage(statistics.averageApy)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Best: {formatPercentage(15.2)} on Polygon
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
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Last 7 days: +{formatCurrency(125.50)}
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
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Across {chainDistribution.length} chains
                </span>
              </div>
            </div>
          </div>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chain Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Chain Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chainDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chainDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {chainDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatPercentage(item.percentage)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentTransactions.slice(0, 6).map((tx) => {
                  const chain = SUPPORTED_CHAINS.find(c => c.id === tx.chainId);
                  
                  return (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {tx.type === 'deposit' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {tx.type}
                          </div>
                          <div className="text-xs text-gray-500">
                            {chain?.name} • {new Date(tx.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Mode */}
      {viewMode === 'allocation' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chain Allocation */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Chain Allocation</h3>
              <div className="space-y-4">
                {chainDistribution.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.value)}</div>
                        <div className="text-sm text-gray-500">
                          {formatPercentage(item.percentage)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.positions} position{item.positions !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Allocation */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Token Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tokenDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Position Details</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {positions.map((position) => {
                const chain = SUPPORTED_CHAINS.find(c => c.id === position.chainId);
                const token = SUPPORTED_TOKENS.find(t => t.symbol === position.tokenSymbol);
                
                return (
                  <div key={position.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: chain?.color }}
                        >
                          {chain?.symbol}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatTokenAmount(position.balance, token?.decimals || 18)} {position.tokenSymbol}
                          </div>
                          <div className="text-sm text-gray-600">
                            {chain?.name} • APY: {formatPercentage(position.apy)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(position.balance * 1800)}
                        </div>
                        <div className="text-sm text-green-600">
                          +{formatCurrency(position.yieldEarned)} earned
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Performance Mode */}
      {viewMode === 'performance' && (
        <div className="space-y-8">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[{ key: '7d', label: '7 Days' }, { key: '30d', label: '30 Days' }, { key: '90d', label: '90 Days' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeRange(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Value Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [formatCurrency(value), 'Portfolio Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Total Return</div>
              <div className="text-2xl font-bold text-green-600">+{formatPercentage(18.5)}</div>
              <div className="text-sm text-gray-500 mt-1">Since inception</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Best Performing Chain</div>
              <div className="text-2xl font-bold text-purple-600">Polygon</div>
              <div className="text-sm text-gray-500 mt-1">APY: {formatPercentage(15.2)}</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Risk Score</div>
              <div className="text-2xl font-bold text-yellow-600">Medium</div>
              <div className="text-sm text-gray-500 mt-1">Diversified portfolio</div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Vault Optimization:</p>
            <p className="text-blue-700">
              Your funds are automatically rebalanced across chains to maximize yield while maintaining security. 
              The vault continuously monitors opportunities and moves funds when better yields are available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};