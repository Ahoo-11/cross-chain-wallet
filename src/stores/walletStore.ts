import { create } from 'zustand';
import { ethers } from 'ethers';
import { WalletState, UserBalance } from '../types';
import { getChainById } from '../constants/chains';

interface WalletStore extends WalletState {
  // Actions
  connectWallet: () => Promise<void>;
  connectMockWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchChain: (chainId: number) => Promise<void>;
  updateBalance: () => Promise<void>;
  setProvider: (provider: any) => void;
  
  // User balances across chains
  userBalances: UserBalance[];
  setUserBalances: (balances: UserBalance[]) => void;
  addUserBalance: (balance: UserBalance) => void;
  
  // Loading states
  isConnecting: boolean;
  isSwitchingChain: boolean;
  setConnecting: (connecting: boolean) => void;
  setSwitchingChain: (switching: boolean) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  isConnected: false,
  address: null,
  chainId: null,
  balance: '0',
  provider: null,
  userBalances: [],
  isConnecting: false,
  isSwitchingChain: false,

  // Actions
  connectWallet: async () => {
    try {
      set({ isConnecting: true });
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      set({
        isConnected: true,
        address,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        provider,
        isConnecting: false,
      });

      // Set up event listeners
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          get().disconnectWallet();
        } else {
          set({ address: accounts[0] });
          get().updateBalance();
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        set({ chainId: parseInt(chainId, 16) });
        get().updateBalance();
      });

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      set({ isConnecting: false });
      throw error;
    }
  },

  // Mock connection for demo/testing without a real wallet
  connectMockWallet: async () => {
    try {
      set({ isConnecting: true });

      // Use ZetaChain as default demo network
      const demoChainId = 7000;
      const demoAddress = '0xDEMO000000000000000000000000000000000000';
      const demoBalanceEth = '10.0';

      set({
        isConnected: true,
        address: demoAddress,
        chainId: demoChainId,
        balance: demoBalanceEth,
        provider: null,
        isConnecting: false,
      });
    } catch (error) {
      console.error('Failed to mock connect wallet:', error);
      set({ isConnecting: false });
      throw error;
    }
  },

  disconnectWallet: () => {
    set({
      isConnected: false,
      address: null,
      chainId: null,
      balance: '0',
      provider: null,
      userBalances: [],
    });
  },

  switchChain: async (chainId: number) => {
    try {
      set({ isSwitchingChain: true });
      
      const { provider } = get();
      const chain = getChainById(chainId);
      if (!chain) {
        throw new Error('Unsupported chain');
      }

      // Demo mode fallback: if no provider or no injected wallet, just update chainId
      if (!window.ethereum || !provider) {
        set({ chainId, isSwitchingChain: false });
        return;
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // Chain not added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [chain.rpcUrl],
                blockExplorerUrls: [chain.blockExplorer],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      set({ chainId, isSwitchingChain: false });
      await get().updateBalance();
      
    } catch (error) {
      console.error('Failed to switch chain:', error);
      set({ isSwitchingChain: false });
      throw error;
    }
  },

  updateBalance: async () => {
    try {
      const { provider, address } = get();
      if (!provider || !address) return;

      const balance = await provider.getBalance(address);
      set({ balance: ethers.formatEther(balance) });
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  },

  setProvider: (provider: any) => {
    set({ provider });
  },

  setUserBalances: (balances: UserBalance[]) => {
    set({ userBalances: balances });
  },

  addUserBalance: (balance: UserBalance) => {
    const { userBalances } = get();
    const existingIndex = userBalances.findIndex(
      b => b.chainId === balance.chainId && b.tokenAddress === balance.tokenAddress
    );

    if (existingIndex >= 0) {
      const updated = [...userBalances];
      updated[existingIndex] = balance;
      set({ userBalances: updated });
    } else {
      set({ userBalances: [...userBalances, balance] });
    }
  },

  setConnecting: (connecting: boolean) => {
    set({ isConnecting: connecting });
  },

  setSwitchingChain: (switching: boolean) => {
    set({ isSwitchingChain: switching });
  },
}));

// Auto-connect on page load if previously connected
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.request({ method: 'eth_accounts' })
    .then((accounts: string[]) => {
      if (accounts.length > 0) {
        useWalletStore.getState().connectWallet();
      }
    })
    .catch(console.error);
}