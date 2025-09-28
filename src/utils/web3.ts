import { ethers } from 'ethers';
import { Chain, Token } from '../types';
import { SUPPORTED_CHAINS, getChainById } from '../constants/chains';

/**
 * Get provider for a specific chain
 */
export const getProvider = (chainId: number): ethers.JsonRpcProvider | null => {
  const chain = getChainById(chainId);
  if (!chain) return null;
  
  try {
    return new ethers.JsonRpcProvider(chain.rpcUrl);
  } catch (error) {
    console.error(`Failed to create provider for chain ${chainId}:`, error);
    return null;
  }
};

/**
 * Get the current connected provider from MetaMask
 */
export const getCurrentProvider = (): ethers.BrowserProvider | null => {
  if (!window.ethereum) return null;
  
  try {
    return new ethers.BrowserProvider(window.ethereum);
  } catch (error) {
    console.error('Failed to get current provider:', error);
    return null;
  }
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Get token balance for an address
 */
export const getTokenBalance = async (
  provider: ethers.Provider,
  tokenAddress: string,
  userAddress: string,
  decimals: number = 18
): Promise<string> => {
  try {
    // Native token (ETH, MATIC, BNB)
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      const balance = await provider.getBalance(userAddress);
      return ethers.formatUnits(balance, decimals);
    }
    
    // ERC-20 token
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
      ],
      provider
    );
    
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};

/**
 * Get token allowance
 */
export const getTokenAllowance = async (
  provider: ethers.Provider,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  decimals: number = 18
): Promise<string> => {
  try {
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      return ethers.MaxUint256.toString(); // Native tokens don't need approval
    }
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function allowance(address owner, address spender) view returns (uint256)'],
      provider
    );
    
    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    return ethers.formatUnits(allowance, decimals);
  } catch (error) {
    console.error('Failed to get token allowance:', error);
    return '0';
  }
};

/**
 * Approve token spending
 */
export const approveToken = async (
  signer: ethers.Signer,
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  decimals: number = 18
): Promise<string> => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function approve(address spender, uint256 amount) returns (bool)'],
      signer
    );
    
    const amountWei = ethers.parseUnits(amount, decimals);
    const tx = await tokenContract.approve(spenderAddress, amountWei);
    
    return tx.hash;
  } catch (error) {
    console.error('Failed to approve token:', error);
    throw error;
  }
};

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (
  provider: ethers.Provider,
  txHash: string,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt | null> => {
  try {
    return await provider.waitForTransaction(txHash, confirmations);
  } catch (error) {
    console.error('Failed to wait for transaction:', error);
    return null;
  }
};

/**
 * Estimate gas for a transaction
 */
export const estimateGas = async (
  provider: ethers.Provider,
  transaction: ethers.TransactionRequest
): Promise<bigint> => {
  try {
    return await provider.estimateGas(transaction);
  } catch (error) {
    console.error('Failed to estimate gas:', error);
    return BigInt(300000); // Default gas limit
  }
};

/**
 * Get current gas price
 */
export const getGasPrice = async (provider: ethers.Provider): Promise<bigint> => {
  try {
    const feeData = await provider.getFeeData();
    return feeData.gasPrice || BigInt(0);
  } catch (error) {
    console.error('Failed to get gas price:', error);
    return BigInt(0);
  }
};

/**
 * Calculate transaction fee
 */
export const calculateTransactionFee = async (
  provider: ethers.Provider,
  transaction: ethers.TransactionRequest
): Promise<{ gasLimit: bigint; gasPrice: bigint; totalFee: string }> => {
  try {
    const gasLimit = await estimateGas(provider, transaction);
    const gasPrice = await getGasPrice(provider);
    const totalFee = ethers.formatEther(gasLimit * gasPrice);
    
    return { gasLimit, gasPrice, totalFee };
  } catch (error) {
    console.error('Failed to calculate transaction fee:', error);
    return {
      gasLimit: BigInt(300000),
      gasPrice: BigInt(0),
      totalFee: '0',
    };
  }
};

/**
 * Switch to a specific chain in MetaMask
 */
export const switchToChain = async (chainId: number): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  
  const chain = getChainById(chainId);
  if (!chain) {
    throw new Error('Unsupported chain');
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
};

/**
 * Add token to MetaMask
 */
export const addTokenToWallet = async (token: Token): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
        },
      },
    });
  } catch (error) {
    console.error('Failed to add token to wallet:', error);
    throw error;
  }
};

/**
 * Get block explorer URL for transaction
 */
export const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
  const chain = getChainById(chainId);
  if (!chain) return '';
  
  return `${chain.blockExplorer}/tx/${txHash}`;
};

/**
 * Get block explorer URL for address
 */
export const getAddressExplorerUrl = (chainId: number, address: string): string => {
  const chain = getChainById(chainId);
  if (!chain) return '';
  
  return `${chain.blockExplorer}/address/${address}`;
};

/**
 * Validate transaction hash
 */
export const isValidTxHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

/**
 * Get network name by chain ID
 */
export const getNetworkName = (chainId: number): string => {
  const chain = getChainById(chainId);
  return chain?.name || 'Unknown Network';
};

/**
 * Check if chain is supported
 */
export const isSupportedChain = (chainId: number): boolean => {
  return SUPPORTED_CHAINS.some(chain => chain.id === chainId);
};

/**
 * Mock cross-chain transfer function (for demonstration)
 */
export const mockCrossChainTransfer = async (
  fromChain: number,
  toChain: number,
  tokenAddress: string,
  amount: string,
  recipient: string
): Promise<{ txHash: string; transferId: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock transaction hash and transfer ID
  const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
  const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`Mock cross-chain transfer initiated:`, {
    fromChain,
    toChain,
    tokenAddress,
    amount,
    recipient,
    txHash,
    transferId,
  });
  
  return { txHash, transferId };
};