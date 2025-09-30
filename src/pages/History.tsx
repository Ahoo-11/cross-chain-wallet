import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
  Filter,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { useVaultStore } from '../stores/vaultStore';
import { SUPPORTED_CHAINS, SUPPORTED_TOKENS } from '../constants/chains';
import { formatCurrency, formatTokenAmount, formatAddress, formatTimeAgo } from '../utils/format';

type TransactionFilter = 'all' | 'deposit' | 'withdraw' | 'transfer';
type StatusFilter = 'all' | 'pending' | 'completed' | 'failed';

export const History: React.FC = () => {
  const { isConnected, address } = useWalletStore();
  const { recentTransactions, crossChainTransfers } = useVaultStore();
  
  const [typeFilter, setTypeFilter] = useState<TransactionFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Combine all transactions
  const allTransactions = useMemo(() => {
    const transactions = [...recentTransactions];
    
    // Add cross-chain transfers as transactions
    crossChainTransfers.forEach(transfer => {
      const txStatus = transfer.status === 'processing' ? 'pending' : transfer.status;
      transactions.push({
        id: `transfer-${transfer.id}`,
        type: 'transfer' as const,
        amount: transfer.amount,
        tokenSymbol: transfer.tokenSymbol,
        chainId: transfer.fromChainId,
        toChainId: transfer.toChainId,
        status: txStatus,
        timestamp: transfer.timestamp,
        hash: transfer.txHash,
        fee: transfer.fee
      });
    });
    
    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [recentTransactions, crossChainTransfers]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      
      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const chain = SUPPORTED_CHAINS.find(c => c.id === tx.chainId);
        const toChain = tx.toChainId ? SUPPORTED_CHAINS.find(c => c.id === tx.toChainId) : null;
        
        const searchableText = [
          tx.type,
          tx.tokenSymbol,
          chain?.name,
          toChain?.name,
          tx.hash,
          tx.amount.toString()
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }
      
      return true;
    });
  }, [allTransactions, typeFilter, statusFilter, searchQuery]);

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-500" />;
    if (status === 'failed') return <XCircle className="w-5 h-5 text-red-500" />;
    
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="w-5 h-5 text-green-500" />;
      case 'withdraw':
        return <ArrowUpFromLine className="w-5 h-5 text-red-500" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600 mb-8">
            Please connect your wallet to view transaction history
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">
            Track all your deposits, withdrawals, and cross-chain transfers
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as TransactionFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdraw">Withdrawals</option>
                  <option value="transfer">Cross-chain Transfers</option>
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Transactions Found
            </h3>
            <p className="text-gray-600">
              {allTransactions.length === 0 
                ? "You haven't made any transactions yet"
                : "Try adjusting your filters or search query"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((tx) => {
              const chain = SUPPORTED_CHAINS.find(c => c.id === tx.chainId);
              const toChain = tx.toChainId ? SUPPORTED_CHAINS.find(c => c.id === tx.toChainId) : null;
              const ALL_TOKENS = Object.values(SUPPORTED_TOKENS).flat();
              const token = ALL_TOKENS.find(t => t.symbol === tx.tokenSymbol);
              
              return (
                <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Transaction Icon */}
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {getTransactionIcon(tx.type, tx.status)}
                      </div>
                      
                      {/* Transaction Details */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-gray-900 capitalize">
                            {tx.type === 'transfer' ? 'Cross-chain Transfer' : tx.type}
                          </h3>
                          <span className={getStatusBadge(tx.status)}>
                            {tx.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{chain?.name}</span>
                          {toChain && (
                            <>
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>{toChain.name}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatTimeAgo(tx.timestamp)}</span>
                        </div>
                        
                        {tx.hash && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              Hash: {formatAddress(tx.hash)}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700">
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Amount and Fee */}
                    <div className="text-right">
                      <div className={`font-medium text-lg ${
                        tx.type === 'deposit' ? 'text-green-600' :
                        tx.type === 'withdraw' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}
                        {formatTokenAmount(tx.amount, token?.decimals || 18)} {tx.tokenSymbol}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        ≈ {formatCurrency(tx.amount * 1800)} {/* Mock USD value */}
                      </div>
                      
                      {tx.fee && (
                        <div className="text-xs text-gray-500 mt-1">
                          Fee: {formatCurrency(tx.fee)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">
              {filteredTransactions.length}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Volume</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                filteredTransactions.reduce((sum, tx) => sum + (tx.amount * 1800), 0)
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                (filteredTransactions.filter(tx => tx.status === 'completed').length / 
                 filteredTransactions.length) * 100
              )}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};