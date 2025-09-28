import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Download
} from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { SUPPORTED_CHAINS } from '../constants/chains';

export const ConnectWallet: React.FC = () => {
  const { isConnected, address, chainId, connectWallet, isConnecting } = useWalletStore();
  const navigate = useNavigate();
  const [showMetaMaskInfo, setShowMetaMaskInfo] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      // Redirect to dashboard after successful connection
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask;

  if (isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Wallet Connected Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your wallet is connected and ready to use the Cross-Chain DeFi Vault
          </p>
          
          <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
            <div className="text-sm text-gray-600 mb-1">Connected Address:</div>
            <div className="font-mono text-sm text-gray-900">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Network: {SUPPORTED_CHAINS.find(c => c.id === chainId)?.name || 'Unknown'}
            </div>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Connect Your Wallet
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect your wallet to start using the Cross-Chain DeFi Vault and earn yield across multiple blockchains
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cross-Chain Access</h3>
          <p className="text-gray-600">
            Access DeFi opportunities across Ethereum, Polygon, and BNB Chain from a single interface
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimized Yields</h3>
          <p className="text-gray-600">
            Automatically find and move your funds to the highest yielding opportunities
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Audited</h3>
          <p className="text-gray-600">
            Built with security-first principles and audited smart contracts
          </p>
        </div>
      </div>

      {/* Connection Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Choose Your Wallet
          </h2>
          <p className="text-gray-600">
            Select a wallet to connect to the Cross-Chain DeFi Vault
          </p>
        </div>

        {/* MetaMask Connection */}
        <div className="max-w-md mx-auto">
          {isMetaMaskInstalled ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI3LjI1IDEyLjVMMTYgMjEuNzVMNC43NSAxMi41TDE2IDNMMjcuMjUgMTIuNVoiIGZpbGw9IiNGNjg1MUIiLz4KPHBhdGggZD0iTTI3LjI1IDEyLjVMMTYgMjEuNzVWM0wyNy4yNSAxMi41WiIgZmlsbD0iI0U5NzMxNyIvPgo8cGF0aCBkPSJNMTYgMjEuNzVMMjcuMjUgMTIuNUwyNy4yNSAxOS41TDE2IDI5TDE2IDIxLjc1WiIgZmlsbD0iI0U5NzMxNyIvPgo8cGF0aCBkPSJNMTYgMjEuNzVMNC43NSAxMi41TDQuNzUgMTkuNUwxNiAyOUwxNiAyMS43NVoiIGZpbGw9IiNGNjg1MUIiLz4KPC9zdmc+" 
                    alt="MetaMask" 
                    className="w-8 h-8"
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">MetaMask</div>
                  <div className="text-sm text-gray-600">Connect using browser wallet</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isConnecting ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
                <div className="flex items-center gap-4 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-900">MetaMask Not Detected</div>
                    <div className="text-sm text-red-700">Please install MetaMask to continue</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Install MetaMask
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  
                  <button
                    onClick={() => setShowMetaMaskInfo(!showMetaMaskInfo)}
                    className="flex items-center gap-2 border border-red-300 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Learn More
                  </button>
                </div>
              </div>
              
              {showMetaMaskInfo && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What is MetaMask?</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    MetaMask is a browser extension that allows you to interact with blockchain applications. 
                    It acts as a bridge between your browser and the blockchain.
                  </p>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">After installing MetaMask:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Create a new wallet or import an existing one</li>
                      <li>Secure your wallet with a strong password</li>
                      <li>Save your recovery phrase in a safe place</li>
                      <li>Return to this page and click "Connect"</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Supported Networks */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Supported Networks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUPPORTED_CHAINS.map((chain) => (
              <div key={chain.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: chain.color }}
                >
                  {chain.symbol}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{chain.name}</div>
                  <div className="text-xs text-gray-600">{chain.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Security Notice:</p>
            <p className="text-yellow-700">
              Never share your private keys or recovery phrase with anyone. The Cross-Chain DeFi Vault 
              will never ask for your private keys. Always verify you're on the correct website before connecting.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};