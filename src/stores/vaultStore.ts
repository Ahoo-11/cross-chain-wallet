import { create } from 'zustand';
import { Transaction, VaultPosition, VaultStats, CrossChainTransfer } from '../types';

interface VaultStore {
  // Vault positions and stats
  positions: VaultPosition[];
  stats: VaultStats;
  
  // Transactions
  transactions: Transaction[];
  crossChainTransfers: CrossChainTransfer[];
  
  // Loading states
  isLoading: boolean;
  isDepositing: boolean;
  isWithdrawing: boolean;
  
  // Actions
  setPositions: (positions: VaultPosition[]) => void;
  addPosition: (position: VaultPosition) => void;
  updatePosition: (chainId: number, tokenAddress: string, updates: Partial<VaultPosition>) => void;
  removePosition: (chainId: number, tokenAddress: string) => void;
  
  setStats: (stats: VaultStats) => void;
  updateStats: () => void;
  
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setTransactions: (transactions: Transaction[]) => void;
  
  addCrossChainTransfer: (transfer: CrossChainTransfer) => void;
  updateCrossChainTransfer: (id: string, updates: Partial<CrossChainTransfer>) => void;
  setCrossChainTransfers: (transfers: CrossChainTransfer[]) => void;
  
  // Vault operations
  deposit: (chainId: number, tokenAddress: string, amount: string) => Promise<string>;
  withdraw: (chainId: number, tokenAddress: string, amount: string, recipient: string) => Promise<string>;
  crossChainTransfer: (fromChain: number, toChain: number, tokenAddress: string, amount: string) => Promise<string>;
  
  setLoading: (loading: boolean) => void;
  setDepositing: (depositing: boolean) => void;
  setWithdrawing: (withdrawing: boolean) => void;
}

// Mock data for demonstration
const mockPositions: VaultPosition[] = [
  {
    chainId: 1,
    tokenAddress: '0x0000000000000000000000000000000000000000',
    amount: '2.5',
    usdValue: 6250,
    apy: 8.5,
  },
  {
    chainId: 137,
    tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    amount: '1500',
    usdValue: 1500,
    apy: 12.3,
  },
  {
    chainId: 56,
    tokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    amount: '800',
    usdValue: 800,
    apy: 9.7,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'deposit',
    status: 'completed',
    fromChain: 1,
    toChain: 1,
    token: 'ETH',
    amount: '1.0',
    timestamp: Date.now() - 3600000,
    gasUsed: '21000',
    gasFee: '0.005',
  },
  {
    id: '2',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'transfer',
    status: 'completed',
    fromChain: 1,
    toChain: 137,
    token: 'USDC',
    amount: '500',
    timestamp: Date.now() - 7200000,
    gasUsed: '45000',
    gasFee: '0.012',
  },
  {
    id: '3',
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    type: 'withdraw',
    status: 'pending',
    fromChain: 137,
    toChain: 1,
    token: 'USDT',
    amount: '200',
    timestamp: Date.now() - 1800000,
  },
];

export const useVaultStore = create<VaultStore>((set, get) => ({
  // Initial state
  positions: mockPositions,
  stats: {
    totalValueLocked: 8550,
    totalYieldEarned: 425.5,
    averageApy: 10.2,
    positionsCount: 3,
  },
  transactions: mockTransactions,
  crossChainTransfers: [],
  isLoading: false,
  isDepositing: false,
  isWithdrawing: false,

  // Position management
  setPositions: (positions) => set({ positions }),
  
  addPosition: (position) => {
    const { positions } = get();
    set({ positions: [...positions, position] });
    get().updateStats();
  },
  
  updatePosition: (chainId, tokenAddress, updates) => {
    const { positions } = get();
    const updatedPositions = positions.map(pos => 
      pos.chainId === chainId && pos.tokenAddress === tokenAddress
        ? { ...pos, ...updates }
        : pos
    );
    set({ positions: updatedPositions });
    get().updateStats();
  },
  
  removePosition: (chainId, tokenAddress) => {
    const { positions } = get();
    const filteredPositions = positions.filter(
      pos => !(pos.chainId === chainId && pos.tokenAddress === tokenAddress)
    );
    set({ positions: filteredPositions });
    get().updateStats();
  },

  // Stats management
  setStats: (stats) => set({ stats }),
  
  updateStats: () => {
    const { positions } = get();
    const totalValueLocked = positions.reduce((sum, pos) => sum + pos.usdValue, 0);
    const averageApy = positions.length > 0 
      ? positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length 
      : 0;
    const totalYieldEarned = totalValueLocked * (averageApy / 100) * 0.1; // Simplified calculation
    
    set({
      stats: {
        totalValueLocked,
        totalYieldEarned,
        averageApy,
        positionsCount: positions.length,
      }
    });
  },

  // Transaction management
  addTransaction: (transaction) => {
    const { transactions } = get();
    set({ transactions: [transaction, ...transactions] });
  },
  
  updateTransaction: (id, updates) => {
    const { transactions } = get();
    const updatedTransactions = transactions.map(tx => 
      tx.id === id ? { ...tx, ...updates } : tx
    );
    set({ transactions: updatedTransactions });
  },
  
  setTransactions: (transactions) => set({ transactions }),

  // Cross-chain transfer management
  addCrossChainTransfer: (transfer) => {
    const { crossChainTransfers } = get();
    set({ crossChainTransfers: [transfer, ...crossChainTransfers] });
  },
  
  updateCrossChainTransfer: (id, updates) => {
    const { crossChainTransfers } = get();
    const updatedTransfers = crossChainTransfers.map(transfer => 
      transfer.id === id ? { ...transfer, ...updates } : transfer
    );
    set({ crossChainTransfers: updatedTransfers });
  },
  
  setCrossChainTransfers: (transfers) => set({ crossChainTransfers: transfers }),

  // Vault operations (mock implementations)
  // Enhanced mock deposit function
  deposit: async (chainId: number, tokenSymbol: string, amount: number) => {
    const positionId = `pos_${Date.now()}`;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    
    // Add transaction
    const transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit' as const,
      amount,
      tokenSymbol,
      chainId,
      status: 'pending' as const,
      timestamp: Date.now(),
      txHash,
      description: `Deposit to ${chain?.name} vault`
    };
    
    set(state => ({
      recentTransactions: [transaction, ...state.recentTransactions],
      isLoading: true
    }));
    
    // Simulate transaction confirmation with realistic timing
    const confirmationTime = chainId === 1 ? 15000 : 5000; // Ethereum takes longer
    
    setTimeout(() => {
      // Check if position already exists for this chain/token
      const existingPosition = get().positions.find(p => 
        p.chainId === chainId && p.tokenSymbol === tokenSymbol
      );
      
      if (existingPosition) {
        // Update existing position
        set(state => ({
          positions: state.positions.map(p => 
            p.id === existingPosition.id 
              ? { ...p, balance: p.balance + amount, lastUpdated: Date.now() }
              : p
          ),
          recentTransactions: state.recentTransactions.map(tx => 
            tx.id === transaction.id ? { ...tx, status: 'confirmed' } : tx
          ),
          isLoading: false
        }));
      } else {
        // Create new position
        const newPosition = {
          id: positionId,
          chainId,
          tokenSymbol,
          balance: amount,
          apy: Math.random() * 10 + 5, // Random APY between 5-15%
          yieldEarned: 0,
          lastUpdated: Date.now()
        };
        
        set(state => ({
          positions: [...state.positions, newPosition],
          recentTransactions: state.recentTransactions.map(tx => 
            tx.id === transaction.id ? { ...tx, status: 'confirmed' } : tx
          ),
          isLoading: false
        }));
      }
      
      get().updateStatistics();
    }, confirmationTime);
    
    return { positionId, txHash };
  },

  // Original deposit function for backward compatibility
  depositLegacy: async (chainId, tokenAddress, amount) => {
    set({ isDepositing: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `deposit_${Date.now()}`;
      const transaction: Transaction = {
        id: transactionId,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        type: 'deposit',
        status: 'pending',
        fromChain: chainId,
        toChain: chainId,
        token: tokenAddress,
        amount,
        timestamp: Date.now(),
      };
      
      get().addTransaction(transaction);
      
      // Simulate transaction confirmation
      setTimeout(() => {
        get().updateTransaction(transactionId, { status: 'completed' });
        
        // Update or add position
        const { positions } = get();
        const existingPosition = positions.find(
          pos => pos.chainId === chainId && pos.tokenAddress === tokenAddress
        );
        
        if (existingPosition) {
          const newAmount = (parseFloat(existingPosition.amount) + parseFloat(amount)).toString();
          get().updatePosition(chainId, tokenAddress, { 
            amount: newAmount,
            usdValue: parseFloat(newAmount) * 2500 // Mock USD value
          });
        } else {
          get().addPosition({
            chainId,
            tokenAddress,
            amount,
            usdValue: parseFloat(amount) * 2500, // Mock USD value
            apy: 8.5 + Math.random() * 5, // Random APY between 8.5-13.5%
          });
        }
      }, 3000);
      
      return transactionId;
    } catch (error) {
      console.error('Deposit failed:', error);
      throw error;
    } finally {
      set({ isDepositing: false });
    }
  },

  // Enhanced mock withdraw function
  withdraw: async (positionId: string, amount: number, destinationChainId?: number) => {
    const position = get().positions.find(p => p.id === positionId);
    if (!position) throw new Error('Position not found');
    
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const isWithdrawing = amount >= position.balance;
    const sourceChain = SUPPORTED_CHAINS.find(c => c.id === position.chainId);
    const destChain = destinationChainId ? SUPPORTED_CHAINS.find(c => c.id === destinationChainId) : null;
    
    // Add transaction
    const transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdraw' as const,
      amount,
      tokenSymbol: position.tokenSymbol,
      chainId: position.chainId,
      status: 'pending' as const,
      timestamp: Date.now(),
      txHash,
      description: destinationChainId && destinationChainId !== position.chainId
        ? `Withdraw and transfer to ${destChain?.name}`
        : `Withdraw from ${sourceChain?.name} vault`
    };
    
    set(state => ({
      recentTransactions: [transaction, ...state.recentTransactions],
      isLoading: true
    }));
    
    // Simulate withdrawal confirmation
    const confirmationTime = position.chainId === 1 ? 15000 : 5000;
    
    // If cross-chain withdrawal, initiate transfer
    if (destinationChainId && destinationChainId !== position.chainId) {
      setTimeout(async () => {
        // Update position first
        set(state => ({
          positions: isWithdrawing 
            ? state.positions.filter(p => p.id !== positionId)
            : state.positions.map(p => 
                p.id === positionId ? { ...p, balance: p.balance - amount, lastUpdated: Date.now() } : p
              ),
          recentTransactions: state.recentTransactions.map(tx => 
            tx.id === transaction.id ? { ...tx, status: 'confirmed' } : tx
          )
        }));
        
        // Initiate cross-chain transfer after withdrawal
        await get().mockCrossChainTransfer(
          position.chainId, 
          destinationChainId, 
          amount, 
          position.tokenSymbol
        );
        
        set(state => ({ isLoading: false }));
        get().updateStatistics();
      }, confirmationTime);
    } else {
      // Regular withdrawal to same chain
      setTimeout(() => {
        set(state => ({
          positions: isWithdrawing 
            ? state.positions.filter(p => p.id !== positionId)
            : state.positions.map(p => 
                p.id === positionId ? { ...p, balance: p.balance - amount, lastUpdated: Date.now() } : p
              ),
          recentTransactions: state.recentTransactions.map(tx => 
            tx.id === transaction.id ? { ...tx, status: 'confirmed' } : tx
          ),
          isLoading: false
        }));
        
        get().updateStatistics();
      }, confirmationTime);
    }
    
    return txHash;
  },

  // Original withdraw function for backward compatibility
  withdrawLegacy: async (chainId, tokenAddress, amount, recipient) => {
    set({ isWithdrawing: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `withdraw_${Date.now()}`;
      const transaction: Transaction = {
        id: transactionId,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        type: 'withdraw',
        status: 'pending',
        fromChain: chainId,
        toChain: chainId,
        token: tokenAddress,
        amount,
        timestamp: Date.now(),
      };
      
      get().addTransaction(transaction);
      
      // Simulate transaction confirmation
      setTimeout(() => {
        get().updateTransaction(transactionId, { status: 'completed' });
        
        // Update position
        const { positions } = get();
        const existingPosition = positions.find(
          pos => pos.chainId === chainId && pos.tokenAddress === tokenAddress
        );
        
        if (existingPosition) {
          const newAmount = Math.max(0, parseFloat(existingPosition.amount) - parseFloat(amount)).toString();
          if (parseFloat(newAmount) === 0) {
            get().removePosition(chainId, tokenAddress);
          } else {
            get().updatePosition(chainId, tokenAddress, { 
              amount: newAmount,
              usdValue: parseFloat(newAmount) * 2500 // Mock USD value
            });
          }
        }
      }, 3000);
      
      return transactionId;
    } catch (error) {
      console.error('Withdraw failed:', error);
      throw error;
    } finally {
      set({ isWithdrawing: false });
    }
  },

  // Enhanced mock cross-chain transfer function
  mockCrossChainTransfer: async (fromChainId: number, toChainId: number, amount: number, tokenSymbol: string) => {
    const transferId = `transfer_${Date.now()}`;
    const fromChain = SUPPORTED_CHAINS.find(c => c.id === fromChainId);
    const toChain = SUPPORTED_CHAINS.find(c => c.id === toChainId);
    
    // Calculate estimated time based on chains (mock logic)
    const estimatedTime = fromChainId === 1 ? 600000 : 300000; // Ethereum takes longer
    
    // Add to cross-chain transfers
    const transfer: CrossChainTransfer = {
      id: transferId,
      fromChainId,
      toChainId,
      amount,
      tokenSymbol,
      status: 'pending',
      timestamp: Date.now(),
      estimatedTime,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
    
    set(state => ({
      crossChainTransfers: [transfer, ...state.crossChainTransfers],
      isLoading: true
    }));
    
    // Add transaction record for the source chain
    const sourceTransaction = {
      id: `tx_${Date.now()}_source`,
      type: 'cross_chain_send' as const,
      amount,
      tokenSymbol,
      chainId: fromChainId,
      status: 'pending' as const,
      timestamp: Date.now(),
      txHash: transfer.txHash,
      description: `Cross-chain transfer to ${toChain?.name}`
    };
    
    set(state => ({
      recentTransactions: [sourceTransaction, ...state.recentTransactions]
    }));
    
    // Simulate transfer stages
    // Stage 1: Confirmation on source chain
    setTimeout(() => {
      set(state => ({
        crossChainTransfers: state.crossChainTransfers.map(t => 
          t.id === transferId ? { ...t, status: 'processing' as const } : t
        ),
        recentTransactions: state.recentTransactions.map(tx =>
          tx.id === sourceTransaction.id ? { ...tx, status: 'confirmed' as const } : tx
        )
      }));
    }, 3000);
    
    // Stage 2: ZetaChain processing
    setTimeout(() => {
      set(state => ({
        crossChainTransfers: state.crossChainTransfers.map(t => 
          t.id === transferId ? { 
            ...t, 
            status: 'processing' as const,
            zetaChainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`
          } : t
        )
      }));
    }, 6000);
    
    // Stage 3: Completion on destination chain
    setTimeout(() => {
      const destinationTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Add destination transaction
      const destinationTransaction = {
        id: `tx_${Date.now()}_dest`,
        type: 'cross_chain_receive' as const,
        amount,
        tokenSymbol,
        chainId: toChainId,
        status: 'confirmed' as const,
        timestamp: Date.now(),
        txHash: destinationTxHash,
        description: `Received from ${fromChain?.name}`
      };
      
      set(state => ({
        crossChainTransfers: state.crossChainTransfers.map(t => 
          t.id === transferId ? { 
            ...t, 
            status: 'completed' as const,
            destinationTxHash
          } : t
        ),
        recentTransactions: [destinationTransaction, ...state.recentTransactions],
        isLoading: false
      }));
      
      // Update positions if this was a vault operation
      const existingPosition = get().positions.find(p => 
        p.chainId === toChainId && p.tokenSymbol === tokenSymbol
      );
      
      if (existingPosition) {
        set(state => ({
          positions: state.positions.map(p => 
            p.id === existingPosition.id 
              ? { ...p, balance: p.balance + amount }
              : p
          )
        }));
      } else {
        // Create new position
        const newPosition = {
          id: `pos_${Date.now()}`,
          chainId: toChainId,
          tokenSymbol,
          balance: amount,
          apy: Math.random() * 10 + 5, // Random APY between 5-15%
          yieldEarned: 0,
          lastUpdated: Date.now()
        };
        
        set(state => ({
          positions: [...state.positions, newPosition]
        }));
      }
      
      // Update statistics
      get().updateStatistics();
    }, estimatedTime);
    
    return transferId;
  },

  crossChainTransfer: async (fromChain, toChain, tokenAddress, amount) => {
    try {
      // Simulate cross-chain transfer delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transferId = `transfer_${Date.now()}`;
      const transfer: CrossChainTransfer = {
        id: transferId,
        fromChain,
        toChain,
        token: tokenAddress,
        amount,
        recipient: 'vault', // Vault as recipient
        status: 'initiated',
        timestamp: Date.now(),
      };
      
      get().addCrossChainTransfer(transfer);
      
      // Simulate transfer progression
      setTimeout(() => {
        get().updateCrossChainTransfer(transferId, { 
          status: 'processing',
          zetaHash: `0x${Math.random().toString(16).substr(2, 64)}`
        });
      }, 2000);
      
      setTimeout(() => {
        get().updateCrossChainTransfer(transferId, { 
          status: 'completed',
          destinationHash: `0x${Math.random().toString(16).substr(2, 64)}`
        });
      }, 5000);
      
      return transferId;
    } catch (error) {
      console.error('Cross-chain transfer failed:', error);
      throw error;
    }
  },

  // Loading state setters
  setLoading: (loading) => set({ isLoading: loading }),
  setDepositing: (depositing) => set({ isDepositing: depositing }),
  setWithdrawing: (withdrawing) => set({ isWithdrawing: withdrawing }),
}));