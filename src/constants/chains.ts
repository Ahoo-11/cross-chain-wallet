import { Chain, Token } from '../types';

// Supported blockchain networks
export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    icon: '🔷',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
    icon: '🟣',
  },
  {
    id: 56,
    name: 'BNB Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    icon: '🟡',
  },
  {
    id: 7000,
    name: 'ZetaChain',
    symbol: 'ZETA',
    rpcUrl: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
    blockExplorer: 'https://zetachain.blockscout.com',
    nativeCurrency: {
      name: 'Zeta',
      symbol: 'ZETA',
      decimals: 18,
    },
    icon: '⚡',
  },
];

// Supported tokens per chain
export const SUPPORTED_TOKENS: Record<number, Token[]> = {
  // Ethereum tokens
  1: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      icon: '🔷',
      chainId: 1,
    },
    {
      address: '0xA0b86a33E6441b8435b662f0E2d0c2837c0b0000',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      icon: '💵',
      chainId: 1,
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      icon: '💰',
      chainId: 1,
    },
  ],
  // Polygon tokens
  137: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
      icon: '🟣',
      chainId: 137,
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      icon: '💵',
      chainId: 137,
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      icon: '💰',
      chainId: 137,
    },
  ],
  // BNB Chain tokens
  56: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'BNB',
      name: 'BNB',
      decimals: 18,
      icon: '🟡',
      chainId: 56,
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 18,
      icon: '💵',
      chainId: 56,
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 18,
      icon: '💰',
      chainId: 56,
    },
  ],
  // ZetaChain tokens
  7000: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ZETA',
      name: 'Zeta',
      decimals: 18,
      icon: '⚡',
      chainId: 7000,
    },
  ],
};

// Helper functions
export const getChainById = (chainId: number): Chain | undefined => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
};

export const getTokensByChain = (chainId: number): Token[] => {
  return SUPPORTED_TOKENS[chainId] || [];
};

export const getTokenByAddress = (chainId: number, address: string): Token | undefined => {
  const tokens = getTokensByChain(chainId);
  return tokens.find(token => token.address.toLowerCase() === address.toLowerCase());
};

// ZetaChain contract addresses (mock addresses for demo)
export const ZETA_CONTRACTS = {
  VAULT_CONTRACT: '0x1234567890123456789012345678901234567890',
  CONNECTOR_ETH: '0x2345678901234567890123456789012345678901',
  CONNECTOR_POLYGON: '0x3456789012345678901234567890123456789012',
  CONNECTOR_BSC: '0x4567890123456789012345678901234567890123',
};

// Transaction settings
export const TRANSACTION_SETTINGS = {
  DEFAULT_SLIPPAGE: 0.5, // 0.5%
  MAX_SLIPPAGE: 5.0, // 5%
  DEFAULT_GAS_LIMIT: 300000,
  CONFIRMATION_BLOCKS: 3,
};