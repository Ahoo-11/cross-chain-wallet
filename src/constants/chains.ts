import { Chain, Token } from '../types';

// Supported blockchain networks
export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://rpc.ankr.com/eth',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    icon: '🔷',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'POL',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'Polygon', symbol: 'POL', decimals: 18 },
    icon: '🟣',
  },
  {
    id: 56,
    name: 'BNB Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    icon: '🟡',
  },
  {
    id: 7000,
    name: 'ZetaChain',
    symbol: 'ZETA',
    rpcUrl: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
    blockExplorer: 'https://zetachain.blockscout.com',
    nativeCurrency: { name: 'Zeta', symbol: 'ZETA', decimals: 18 },
    icon: '⚡',
  },
];

// Supported tokens per chain
export const SUPPORTED_TOKENS: Record<number, Token[]> = {
  // Ethereum mainnet
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
      address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      icon: '💵',
      chainId: 1,
    },
    {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      icon: '💰',
      chainId: 1,
    },
  ],
  // Polygon
  137: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'POL',
      name: 'Polygon',
      decimals: 18,
      icon: '🟣',
      chainId: 137,
    },
    {
      address: '0x2791bfd80d24cfb3d7c2c0b2d0ab6e8b6a9a0d0f',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      icon: '💵',
      chainId: 137,
    },
    {
      address: '0xc2132d05d31c914a87c6611c10748aeeb04b58e8',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      icon: '💰',
      chainId: 137,
    },
  ],
  // BNB Chain
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
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 18,
      icon: '💵',
      chainId: 56,
    },
    {
      address: '0x55d398326f99059ff775485246999027b3197955',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 18,
      icon: '💰',
      chainId: 56,
    },
  ],
  // ZetaChain tokens (demo): native ZETA plus cross-chain assets accessible via ZetaChain
  7000: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ZETA',
      name: 'Zeta',
      decimals: 18,
      icon: '⚡',
      chainId: 7000,
    },
    {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      name: 'Ether (via ZetaChain)',
      decimals: 18,
      icon: '🔷',
      chainId: 7000,
    },
    {
      address: '0x1111111111111111111111111111111111111111',
      symbol: 'USDC',
      name: 'USD Coin (via ZetaChain)',
      decimals: 6,
      icon: '💵',
      chainId: 7000,
    },
    {
      address: '0x2222222222222222222222222222222222222222',
      symbol: 'USDT',
      name: 'Tether USD (via ZetaChain)',
      decimals: 6,
      icon: '💰',
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