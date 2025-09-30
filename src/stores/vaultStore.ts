import { create } from 'zustand';
import { Transaction, VaultPosition, VaultStats, CrossChainTransfer } from '../types';
import { SUPPORTED_CHAINS } from '../constants/chains';

interface VaultStore {
  // Vault positions and stats
  positions: VaultPosition[];
  statistics: VaultStats

  // Transactions
  recentTransactions: Transaction[]
  crossChainTransfers: CrossChainTransfer[]

  // Loading states
  isLoading: boolean
  isDepositing: boolean
  isWithdrawing: boolean

  // Actions
  setPositions: (positions: VaultPosition[]) => void
  addPosition: (position: VaultPosition) => void
  updatePosition: (positionId: string, updates: Partial<VaultPosition>) => void
  removePosition: (positionId: string) => void

  setStatistics: (stats: VaultStats) => void
  updateStats: () => void

  addRecentTransaction: (transaction: Transaction) => void
  updateRecentTransaction: (id: string, updates: Partial<Transaction>) => void
  setRecentTransactions: (transactions: Transaction[]) => void

  addCrossChainTransfer: (transfer: CrossChainTransfer) => void
  updateCrossChainTransfer: (id: string, updates: Partial<CrossChainTransfer>) => void
  setCrossChainTransfers: (transfers: CrossChainTransfer[]) => void

  // Vault operations
  deposit: (params: { chainId: number; tokenSymbol: string; amount: number; userAddress?: string }) => Promise<{ positionId: string; txHash: string }>
  withdraw: (params: { positionId: string; amount: number; destinationChainId?: number; userAddress?: string }) => Promise<string>
  mockCrossChainTransfer: (fromChainId: number, toChainId: number, amount: number, tokenSymbol: string) => Promise<string>
  crossChainTransfer: (fromChainId: number, toChainId: number, tokenSymbol: string, amount: number) => Promise<string>

  setLoading: (loading: boolean) => void
  setDepositing: (depositing: boolean) => void
  setWithdrawing: (withdrawing: boolean) => void
}

// Mock data for demonstration
const mockPositions: VaultPosition[] = [
  {
    id: 'pos_1',
    chainId: 1,
    tokenSymbol: 'ETH',
    balance: 2.5,
    apy: 8.5,
    yieldEarned: 125,
    lastUpdated: Date.now() - 3600000,
  },
  {
    id: 'pos_2',
    chainId: 137,
    tokenSymbol: 'USDC',
    balance: 1500,
    apy: 12.3,
    yieldEarned: 180,
    lastUpdated: Date.now() - 7200000,
  },
  {
    id: 'pos_3',
    chainId: 56,
    tokenSymbol: 'USDT',
    balance: 800,
    apy: 9.7,
    yieldEarned: 95,
    lastUpdated: Date.now() - 1800000,
  },
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    status: 'completed',
    chainId: 1,
    tokenSymbol: 'ETH',
    amount: 1.0,
    timestamp: Date.now() - 3600000,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    fee: 0.005,
  },
  {
    id: '2',
    type: 'transfer',
    status: 'completed',
    chainId: 1,
    toChainId: 137,
    tokenSymbol: 'USDC',
    amount: 500,
    timestamp: Date.now() - 7200000,
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    fee: 0.012,
  },
  {
    id: '3',
    type: 'withdraw',
    status: 'pending',
    chainId: 137,
    tokenSymbol: 'USDT',
    amount: 200,
    timestamp: Date.now() - 1800000,
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
  },
]

export const useVaultStore = create<VaultStore>((set, get) => ({
  // Initial state
  positions: mockPositions,
  statistics: {
    totalBalance: mockPositions.reduce((sum, p) => sum + p.balance, 0),
    totalYieldEarned: mockPositions.reduce((sum, p) => sum + p.yieldEarned, 0),
    averageApy: mockPositions.length > 0 ? mockPositions.reduce((sum, p) => sum + p.apy, 0) / mockPositions.length : 0,
    totalYield: mockPositions.reduce((sum, p) => sum + (p.balance * (p.apy / 100) / 12), 0),
    positionsCount: mockPositions.length,
  },
  recentTransactions: mockTransactions,
  crossChainTransfers: [],
  isLoading: false,
  isDepositing: false,
  isWithdrawing: false,

  // Position management
  setPositions: (positions) => set({ positions }),

  addPosition: (position) => {
    const { positions } = get()
    set({ positions: [...positions, position] })
    get().updateStats()
  },

  updatePosition: (positionId, updates) => {
    const { positions } = get()
    const updatedPositions = positions.map(pos =>
      pos.id === positionId ? { ...pos, ...updates } : pos
    )
    set({ positions: updatedPositions })
    get().updateStats()
  },

  removePosition: (positionId) => {
    const { positions } = get()
    const filteredPositions = positions.filter(pos => pos.id !== positionId)
    set({ positions: filteredPositions })
    get().updateStats()
  },

  // Stats management
  setStatistics: (stats) => set({ statistics: stats }),

  updateStats: () => {
    const { positions } = get()
    const totalBalance = positions.reduce((sum, pos) => sum + pos.balance, 0)
    const averageApy = positions.length > 0 ? positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length : 0
    const totalYieldEarned = positions.reduce((sum, pos) => sum + pos.yieldEarned, 0)
    const totalYield = positions.reduce((sum, pos) => sum + (pos.balance * (pos.apy / 100) / 12), 0) // approx monthly

    set({
      statistics: {
        totalBalance,
        totalYieldEarned,
        averageApy,
        totalYield,
        positionsCount: positions.length,
      },
    })
  },

  // Recent transactions management
  addRecentTransaction: (transaction) => {
    const { recentTransactions } = get()
    set({ recentTransactions: [transaction, ...recentTransactions] })
  },

  updateRecentTransaction: (id, updates) => {
    const { recentTransactions } = get()
    const updated = recentTransactions.map(tx => (tx.id === id ? { ...tx, ...updates } : tx))
    set({ recentTransactions: updated })
  },

  setRecentTransactions: (transactions) => set({ recentTransactions: transactions }),

  // Cross-chain transfer management
  addCrossChainTransfer: (transfer) => {
    const { crossChainTransfers } = get()
    set({ crossChainTransfers: [transfer, ...crossChainTransfers] })
  },

  updateCrossChainTransfer: (id, updates) => {
    const { crossChainTransfers } = get()
    const updatedTransfers = crossChainTransfers.map(transfer => (transfer.id === id ? { ...transfer, ...updates } : transfer))
    set({ crossChainTransfers: updatedTransfers })
  },

  setCrossChainTransfers: (transfers) => set({ crossChainTransfers: transfers }),

  // Vault operations (mock implementations)
  // Enhanced mock deposit function
  deposit: async ({ chainId, tokenSymbol, amount, userAddress }: { chainId: number; tokenSymbol: string; amount: number; userAddress?: string }) => {
    const positionId = `pos_${Date.now()}`
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId)

    // Add transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount,
      tokenSymbol,
      chainId,
      status: 'pending',
      timestamp: Date.now(),
      txHash,
      hash: txHash,
      description: `Deposit to ${chain?.name} vault` + (userAddress ? ` by ${userAddress}` : ''),
    }

    set(state => ({
      recentTransactions: [transaction, ...state.recentTransactions],
      isLoading: true,
    }))

    // Simulate transaction confirmation with realistic timing
    const confirmationTime = chainId === 1 ? 15000 : 5000 // Ethereum takes longer

    setTimeout(() => {
      // Check if position already exists for this chain/token
      const existingPosition = get().positions.find(p => p.chainId === chainId && p.tokenSymbol === tokenSymbol)

      if (existingPosition) {
        // Update existing position
        set(state => ({
          positions: state.positions.map(p => (p.id === existingPosition.id ? { ...p, balance: p.balance + amount, lastUpdated: Date.now() } : p)),
          recentTransactions: state.recentTransactions.map(tx => (tx.id === transaction.id ? { ...tx, status: 'completed' } : tx)),
          isLoading: false,
        }))
      } else {
        // Create new position
        const newPosition: VaultPosition = {
          id: positionId,
          chainId,
          tokenSymbol,
          balance: amount,
          apy: Math.random() * 10 + 5, // Random APY between 5-15%
          yieldEarned: 0,
          lastUpdated: Date.now(),
        }

        set(state => ({
          positions: [...state.positions, newPosition],
          recentTransactions: state.recentTransactions.map(tx => (tx.id === transaction.id ? { ...tx, status: 'completed' } : tx)),
          isLoading: false,
        }))
      }

      get().updateStats()
    }, confirmationTime)

    return { positionId, txHash }
  },

  // Enhanced mock withdraw function
  withdraw: async ({ positionId, amount, destinationChainId, userAddress }: { positionId: string; amount: number; destinationChainId?: number; userAddress?: string }) => {
    const position = get().positions.find(p => p.id === positionId)
    if (!position) throw new Error('Position not found')

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
    const isWithdrawingAll = amount >= position.balance
    const sourceChain = SUPPORTED_CHAINS.find(c => c.id === position.chainId)
    const destChain = destinationChainId ? SUPPORTED_CHAINS.find(c => c.id === destinationChainId) : null

    // Add transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdraw',
      amount,
      tokenSymbol: position.tokenSymbol,
      chainId: position.chainId,
      toChainId: destinationChainId,
      status: 'pending',
      timestamp: Date.now(),
      txHash,
      hash: txHash,
      description: destinationChainId && destinationChainId !== position.chainId ? `Withdraw and transfer to ${destChain?.name}` : `Withdraw from ${sourceChain?.name} vault` + (userAddress ? ` by ${userAddress}` : ''),
    }

    set(state => ({
      recentTransactions: [transaction, ...state.recentTransactions],
      isLoading: true,
    }))

    // Simulate withdrawal confirmation
    const confirmationTime = position.chainId === 1 ? 15000 : 5000

    // If cross-chain withdrawal, initiate transfer
    if (destinationChainId && destinationChainId !== position.chainId) {
      setTimeout(async () => {
        // Update position first
        set(state => ({
          positions: isWithdrawingAll ? state.positions.filter(p => p.id !== positionId) : state.positions.map(p => (p.id === positionId ? { ...p, balance: p.balance - amount, lastUpdated: Date.now() } : p)),
          recentTransactions: state.recentTransactions.map(tx => (tx.id === transaction.id ? { ...tx, status: 'completed' } : tx)),
        }))

        // Initiate cross-chain transfer after withdrawal
        await get().mockCrossChainTransfer(position.chainId, destinationChainId, amount, position.tokenSymbol)

        set(state => ({ isLoading: false }))
        get().updateStats()
      }, confirmationTime)
    } else {
      // Regular withdrawal to same chain
      setTimeout(() => {
        set(state => ({
          positions: isWithdrawingAll ? state.positions.filter(p => p.id !== positionId) : state.positions.map(p => (p.id === positionId ? { ...p, balance: p.balance - amount, lastUpdated: Date.now() } : p)),
          recentTransactions: state.recentTransactions.map(tx => (tx.id === transaction.id ? { ...tx, status: 'completed' } : tx)),
          isLoading: false,
        }))

        get().updateStats()
      }, confirmationTime)
    }

    return txHash
  },

  // Enhanced mock cross-chain transfer function
  mockCrossChainTransfer: async (fromChainId: number, toChainId: number, amount: number, tokenSymbol: string) => {
    const transferId = `transfer_${Date.now()}`
    const fromChain = SUPPORTED_CHAINS.find(c => c.id === fromChainId)
    const toChain = SUPPORTED_CHAINS.find(c => c.id === toChainId)

    // Calculate estimated time based on chains (mock logic)
    const estimatedTime = fromChainId === 1 ? 600000 : 300000 // Ethereum takes longer

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
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    }

    set(state => ({
      crossChainTransfers: [transfer, ...state.crossChainTransfers],
      isLoading: true,
    }))

    // Add transaction record for the source chain
    const sourceTransaction: Transaction = {
      id: `tx_${Date.now()}_source`,
      type: 'cross_chain_send',
      amount,
      tokenSymbol,
      chainId: fromChainId,
      toChainId,
      status: 'pending',
      timestamp: Date.now(),
      txHash: transfer.txHash,
      hash: transfer.txHash,
      description: `Cross-chain transfer to ${toChain?.name}`,
    }

    set(state => ({
      recentTransactions: [sourceTransaction, ...state.recentTransactions],
    }))

    // Simulate transfer stages
    // Stage 1: Confirmation on source chain
    setTimeout(() => {
      set(state => ({
        crossChainTransfers: state.crossChainTransfers.map(t => (t.id === transferId ? { ...t, status: 'processing' as const } : t)),
        recentTransactions: state.recentTransactions.map(tx => (tx.id === sourceTransaction.id ? { ...tx, status: 'completed' } : tx)),
      }))
    }, 3000)

    // Stage 2: ZetaChain processing
    setTimeout(() => {
      set(state => ({
        crossChainTransfers: state.crossChainTransfers.map(t => (t.id === transferId ? { ...t, status: 'processing' as const, zetaChainTxHash: `0x${Math.random().toString(16).substr(2, 64)}` } : t)),
      }))
    }, 6000)

    // Stage 3: Completion on destination chain
    setTimeout(() => {
      const destinationTxHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // Add destination transaction
      const destinationTransaction: Transaction = {
        id: `tx_${Date.now()}_dest`,
        type: 'cross_chain_receive',
        amount,
        tokenSymbol,
        chainId: toChainId,
        status: 'completed',
        timestamp: Date.now(),
        txHash: destinationTxHash,
        hash: destinationTxHash,
        description: `Received from ${fromChain?.name}`,
      }

      set(state => ({
        crossChainTransfers: state.crossChainTransfers.map(t => (t.id === transferId ? { ...t, status: 'completed' as const, destinationTxHash } : t)),
        recentTransactions: [destinationTransaction, ...state.recentTransactions],
        isLoading: false,
      }))

      // Update positions if this was a vault operation
      const existingPosition = get().positions.find(p => p.chainId === toChainId && p.tokenSymbol === tokenSymbol)

      if (existingPosition) {
        set(state => ({
          positions: state.positions.map(p => (p.id === existingPosition.id ? { ...p, balance: p.balance + amount } : p)),
        }))
      } else {
        // Create new position
        const newPosition: VaultPosition = {
          id: `pos_${Date.now()}`,
          chainId: toChainId,
          tokenSymbol,
          balance: amount,
          apy: Math.random() * 10 + 5, // Random APY between 5-15%
          yieldEarned: 0,
          lastUpdated: Date.now(),
        }

        set(state => ({
          positions: [...state.positions, newPosition],
        }))
      }

      // Update statistics
      get().updateStats()
    }, estimatedTime)

    return transferId
  },

  // Refactored cross-chain transfer utility (not used by UI, kept for API parity)
  crossChainTransfer: async (fromChainId: number, toChainId: number, tokenSymbol: string, amount: number) => {
    try {
      // Simulate cross-chain transfer delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const transferId = `transfer_${Date.now()}`
      const transfer: CrossChainTransfer = {
        id: transferId,
        fromChainId,
        toChainId,
        tokenSymbol,
        amount,
        status: 'pending',
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        estimatedTime: 300000,
      }

      get().addCrossChainTransfer(transfer)

      // Simulate transfer progression
      setTimeout(() => {
        get().updateCrossChainTransfer(transferId, {
          status: 'processing',
          zetaChainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        })
      }, 2000)

      setTimeout(() => {
        get().updateCrossChainTransfer(transferId, {
          status: 'completed',
          destinationTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        })
      }, 5000)

      return transferId
    } catch (error) {
      console.error('Cross-chain transfer failed:', error)
      throw error
    }
  },

  // Loading state setters
  setLoading: (loading) => set({ isLoading: loading }),
  setDepositing: (depositing) => set({ isDepositing: depositing }),
  setWithdrawing: (withdrawing) => set({ isWithdrawing: withdrawing }),
}));