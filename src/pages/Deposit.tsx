import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownToLine,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWalletStore } from '../stores/walletStore';
import { useVaultStore } from '../stores/vaultStore';
import { SUPPORTED_CHAINS, SUPPORTED_TOKENS } from '../constants/chains';
import { formatCurrency, formatTokenAmount, parseTokenAmount } from '../utils/format';
import { ChainSwitcher } from '../components/WalletConnect';

export const Deposit: React.FC = () => {
  const { isConnected, address, currentChain, balances } = useWalletStore();
  const { deposit, isLoading } = useVaultStore();
  
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [estimatedYield, setEstimatedYield] = useState(0);

  // Update selected chain when wallet chain changes
  useEffect(() => {
    if (currentChain) {
      const chain = SUPPORTED_CHAINS.find(c => c.id === currentChain.id);
      if (chain) {
        setSelectedChain(chain);
      }
    }
  }, [currentChain]);

  // Validate amount and calculate estimated yield
  useEffect(() => {
    const numAmount = parseFloat(amount);
    const tokenBalance = balances[selectedToken.symbol] || 0;
    
    setIsValidAmount(numAmount > 0 && numAmount <= tokenBalance);
    
    if (numAmount > 0) {
      // Mock yield calculation (8-12% APY)
      const mockApy = 0.095; // 9.5% APY
      setEstimatedYield(numAmount * mockApy);
    } else {
      setEstimatedYield(0);
    }
  }, [amount, selectedToken, balances]);

  const handleDeposit = async () => {
    if (!isValidAmount || !address) return;

    try {
      const numAmount = parseFloat(amount);
      
      await deposit({
        chainId: selectedChain.id,
        tokenSymbol: selectedToken.symbol,
        amount: numAmount,
        userAddress: address
      });

      toast.success(`Successfully deposited ${amount} ${selectedToken.symbol}!`);
      setAmount('');
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
      console.error('Deposit error:', error);
    }
  };

  const handleMaxAmount = () => {
    const balance = balances[selectedToken.symbol] || 0;
    setAmount(balance.toString());
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
            Please connect your wallet to make deposits
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
          <h1 className="text-3xl font-bold text-gray-900">Deposit Funds</h1>
          <p className="text-gray-600 mt-1">
            Deposit tokens to start earning cross-chain yield
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Chain Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Chain
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedChain.id === chain.id
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
          
          {currentChain?.id !== selectedChain.id && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Switch to {selectedChain.name} network to deposit
                </span>
              </div>
              <div className="mt-2">
                <ChainSwitcher />
              </div>
            </div>
          )}
        </div>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Token
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUPPORTED_TOKENS.map((token) => {
              const balance = balances[token.symbol] || 0;
              return (
                <button
                  key={token.symbol}
                  onClick={() => setSelectedToken(token)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedToken.symbol === token.symbol
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {token.symbol}
                    </div>
                    <div className="text-sm text-gray-600">
                      {token.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Balance: {formatTokenAmount(balance, token.decimals)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amount to Deposit
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={handleMaxAmount}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                MAX
              </button>
              <span className="text-gray-500 text-sm">{selectedToken.symbol}</span>
            </div>
          </div>
          
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-600">
              Balance: {formatTokenAmount(balances[selectedToken.symbol] || 0, selectedToken.decimals)} {selectedToken.symbol}
            </span>
            {amount && (
              <span className="text-gray-600">
                ≈ {formatCurrency(parseFloat(amount) * 1800)} {/* Mock USD price */}
              </span>
            )}
          </div>
        </div>

        {/* Transaction Preview */}
        {amount && isValidAmount && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Transaction Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Amount:</span>
                <span className="font-medium">{amount} {selectedToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination Chain:</span>
                <span className="font-medium">{selectedChain.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated APY:</span>
                <span className="font-medium text-green-600">9.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Annual Yield:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(estimatedYield)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee:</span>
                  <span className="font-medium">~$2.50</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          disabled={!isValidAmount || isLoading || currentChain?.id !== selectedChain.id}
          className={`w-full py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isValidAmount && !isLoading && currentChain?.id === selectedChain.id
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Deposit...
            </>
          ) : (
            <>
              <ArrowDownToLine className="w-5 h-5" />
              Deposit {selectedToken.symbol}
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Your funds will be deposited into the cross-chain vault</li>
                <li>• The vault automatically finds the best yield opportunities</li>
                <li>• Funds may be moved across chains for optimal returns</li>
                <li>• You can withdraw anytime with a small cross-chain fee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};