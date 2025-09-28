import React from 'react';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { formatAddress } from '../utils/format';
import { isMetaMaskInstalled } from '../utils/web3';
import toast from 'react-hot-toast';

interface WalletConnectProps {
  className?: string;
  showBalance?: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  className = '', 
  showBalance = false 
}) => {
  const {
    isConnected,
    address,
    balance,
    chainId,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWalletStore();

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      await connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success('Wallet disconnected');
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`
          flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
          text-white rounded-lg font-medium transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showBalance && (
        <div className="text-sm text-gray-600">
          {parseFloat(balance).toFixed(4)} ETH
        </div>
      )}
      
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium">
          {formatAddress(address || '')}
        </span>
      </div>
      
      <button
        onClick={handleDisconnect}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};

// Wallet status indicator component
export const WalletStatus: React.FC = () => {
  const { isConnected, chainId } = useWalletStore();
  const supportedChains = [1, 137, 56, 7000]; // Ethereum, Polygon, BSC, ZetaChain
  const isUnsupportedChain = chainId && !supportedChains.includes(chainId);

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Wallet not connected</span>
      </div>
    );
  }

  if (isUnsupportedChain) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Unsupported network</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm">Connected</span>
    </div>
  );
};

// Chain switcher component
export const ChainSwitcher: React.FC = () => {
  const { chainId, switchChain, isSwitchingChain } = useWalletStore();
  
  const chains = [
    { id: 1, name: 'Ethereum', icon: '🔷' },
    { id: 137, name: 'Polygon', icon: '🟣' },
    { id: 56, name: 'BNB Chain', icon: '🟡' },
    { id: 7000, name: 'ZetaChain', icon: '⚡' },
  ];

  const currentChain = chains.find(chain => chain.id === chainId);

  const handleChainSwitch = async (newChainId: number) => {
    if (newChainId === chainId) return;
    
    try {
      await switchChain(newChainId);
      toast.success(`Switched to ${chains.find(c => c.id === newChainId)?.name}`);
    } catch (error: any) {
      console.error('Failed to switch chain:', error);
      toast.error(error.message || 'Failed to switch network');
    }
  };

  return (
    <div className="relative">
      <select
        value={chainId || ''}
        onChange={(e) => handleChainSwitch(Number(e.target.value))}
        disabled={isSwitchingChain}
        className="
          appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8
          text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {!chainId && <option value="">Select Network</option>}
        {chains.map(chain => (
          <option key={chain.id} value={chain.id}>
            {chain.icon} {chain.name}
          </option>
        ))}
      </select>
      
      {isSwitchingChain && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};