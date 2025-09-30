// Blockchain and Chain Types
export interface Chain {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  icon: string;
  color?: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  chainId: number;
}

// Wallet and User Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  provider: any;
}

export interface UserBalance {
  chainId: number;
  tokenAddress: string;
  balance: string;
  usdValue: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'yield' | 'cross_chain_send' | 'cross_chain_receive';
  amount: number;
  tokenSymbol: string;
  chainId: number;
  toChainId?: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;
  hash?: string;
  description?: string;
  fee?: number;
}

// Vault Types
export interface VaultPosition {
  id: string;
  chainId: number;
  tokenSymbol: string;
  balance: number;
  apy: number;
  yieldEarned: number;
  lastUpdated: number;
}

export interface VaultStats {
  totalBalance: number;
  totalYieldEarned: number;
  averageApy: number;
  totalYield: number;
  positionsCount: number;
}

// Cross-Chain Transfer Types
export interface CrossChainTransfer {
  id: string;
  fromChainId: number;
  toChainId: number;
  amount: number;
  tokenSymbol: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  estimatedTime: number;
  txHash?: string;
  zetaChainTxHash?: string;
  destinationTxHash?: string;
  fee?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form Types
export interface DepositForm {
  fromChain: number;
  token: string;
  amount: string;
  slippage: number;
}

export interface WithdrawForm {
  toChain: number;
  token: string;
  amount: string;
  recipient: string;
}

// Component Props Types
export interface ChainSelectorProps {
  selectedChain: number;
  onChainSelect: (chainId: number) => void;
  supportedChains: Chain[];
}

export interface TokenSelectorProps {
  selectedToken: string;
  onTokenSelect: (tokenAddress: string) => void;
  availableTokens: Token[];
  chainId: number;
}

export interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}