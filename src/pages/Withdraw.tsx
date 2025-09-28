import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpFromLine,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWalletStore } from '../stores/walletStore';
import { useVaultStore } from '../stores/vaultStore';
import { SUPPORTED_CHAINS, SUPPORTED_TOKENS } from '../constants/chains';
import { formatCurrency, formatTokenAmount, formatPercentage } from '../utils/format';

export const Withdraw: React.FC = () => {
  const { isConnected, address } = useWalletStore();
  const { positions, withdraw, isLoading, statistics } = useVaultStore();
  
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [destinationChain, setDestinationChain] = useState(SUPPORTED_CHAINS[0]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPercentage, setWithdrawPercentage] = useState(0);
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState(0);

  // Set default position
  useEffect(() => {
    if (positions.length > 0 && !selectedPosition) {
      setSelectedPosition(positions[0]);
    }
  }, [positions, selectedPosition]);

  // Validate amount and calculate fees
  useEffect(() => {
    if (!selectedPosition) return;
    
    const numAmount = parseFloat(withdrawAmount);
    const maxAmount = selectedPosition.balance;
    
    setIsValidAmount(numAmount > 0 && numAmount <= maxAmount);
    setWithdrawPercentage(maxAmount > 0 ? (numAmount / maxAmount) * 100 : 0);
    
    if (numAmount > 0) {
      // Mock cross-chain fee calculation (0.1% + $2 base fee)
      const percentageFee = numAmount * 0.001;
      const baseFee = 2;
      setEstimatedFee(percentageFee + baseFee);
    } else {
      setEstimatedFee(0);
    }
  }, [withdrawAmount, selectedPosition]);

  const handleWithdraw = async () => {
    if (!isValidAmount || !selectedPosition || !address) return;

    try {
      const numAmount = parseFloat(withdrawAmount);
      
      await withdraw({
        positionId: selectedPosition.id,
        amount: numAmount,
        destinationChainId: destinationChain.id,
        userAddress: address
      });

      toast.success(`Withdrawal initiated! Funds will arrive on ${destinationChain.name} shortly.`);
      setWithdrawAmount('');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
      console.error('Withdrawal error:', error);
    }
  };

  const handlePercentageWithdraw = (percentage: number) => {
    if (!selectedPosition) return;
    const amount = (selectedPosition.balance * percentage / 100).toString();
    setWithdrawAmount(amount);
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
            Please connect your wallet to make withdrawals
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

  if (positions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Positions Found
          </h2>
          <p className="text-gray-600 mb-8">
            You don't have any active positions to withdraw from
          </p>
          <Link
            to="/deposit"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Make a Deposit
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Withdraw Funds</h1>
          <p className="text-gray-600 mt-1">
            Withdraw your funds to any supported chain
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Position Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Position to Withdraw From
          </label>
          <div className="space-y-3">
            {positions.map((position) => {
              const chain = SUPPORTED_CHAINS.find(c => c.id === position.chainId);
              const token = SUPPORTED_TOKENS.find(t => t.symbol === position.tokenSymbol);
              
              return (
                <button
                  key={position.id}
                  onClick={() => setSelectedPosition(position)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPosition?.id === position.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
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
                        {formatCurrency(position.balance * 1800)} {/* Mock USD value */}
                      </div>
                      <div className="text-sm text-green-600">
                        +{formatCurrency(position.yieldEarned)} earned
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedPosition && (
          <>
            {/* Destination Chain Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Destination Chain
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SUPPORTED_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => setDestinationChain(chain)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      destinationChain.id === chain.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: chain.color }}
                      >
                        {chain.symbol}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {chain.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Withdrawal Amount
              </label>
              
              {/* Quick percentage buttons */}
              <div className="flex gap-2 mb-3">
                {[25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handlePercentageWithdraw(percentage)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.0"
                  max={selectedPosition.balance}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className="text-gray-500 text-sm">{selectedPosition.tokenSymbol}</span>
                </div>
              </div>
              
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Available: {formatTokenAmount(selectedPosition.balance, 18)} {selectedPosition.tokenSymbol}
                </span>
                {withdrawAmount && (
                  <span className="text-gray-600">
                    {formatPercentage(withdrawPercentage)} of position
                  </span>
                )}
              </div>
            </div>

            {/* Transaction Preview */}
            {withdrawAmount && isValidAmount && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Withdrawal Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Withdrawal Amount:</span>
                    <span className="font-medium">{withdrawAmount} {selectedPosition.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From Chain:</span>
                    <span className="font-medium">
                      {SUPPORTED_CHAINS.find(c => c.id === selectedPosition.chainId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To Chain:</span>
                    <span className="font-medium">{destinationChain.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cross-chain Fee:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(estimatedFee)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">You'll Receive:</span>
                      <span className="font-medium text-green-600">
                        ≈ {formatCurrency((parseFloat(withdrawAmount) * 1800) - estimatedFee)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      2-5 minutes
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Withdraw Button */}
            <button
              onClick={handleWithdraw}
              disabled={!isValidAmount || isLoading}
              className={`w-full py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isValidAmount && !isLoading
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Withdrawal...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-5 h-5" />
                  Withdraw to {destinationChain.name}
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="space-y-1 text-yellow-700">
                    <li>• Cross-chain withdrawals may take 2-5 minutes to complete</li>
                    <li>• A small fee is charged for cross-chain transfers</li>
                    <li>• You can track the progress in your transaction history</li>
                    <li>• Withdrawing stops yield generation for the withdrawn amount</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};