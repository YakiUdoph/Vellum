// Nimiq Pay SDK & Wallet Integration Utility for Vellum Mini App

const LOCAL_STORAGE_KEY_ECHOES = 'vellum_inscribed_echoes_v1';
const LOCAL_STORAGE_KEY_WALLET = 'vellum_nimiq_wallet_v1';

export const ERROR_CODES = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  USER_CANCELLED: 'USER_CANCELLED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
};

export class NimiqPayError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'NimiqPayError';
    this.code = code;
    this.details = details;
  }
}

export const INITIAL_WALLET_STATE = {
  isConnected: true,
  address: 'NQ84 7E71 V3LL UM00 N1M1 Q999 8888',
  displayName: 'Museum Explorer',
  balances: {
    USDT: 24.50,
    NIM: 1850.00,
  },
  bonusPoints: 340,
  patronBadge: 'NIM Patron',
  network: 'Nimiq Mainnet (PoS)',
  txHistory: [
    {
      id: 'tx-init-1',
      txHash: '0x3aef871b9c011e4284d720b08a1837a4d912ef60',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      currency: 'NIM',
      amount: '1',
      bonusPoints: 100,
      status: 'CONFIRMED',
      memo: 'Library of Alexandria Echo Inscription',
    },
    {
      id: 'tx-init-2',
      txHash: '0x8f10b72a9104c832104928efd00121aa904bca78',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      currency: 'USDT',
      amount: '0.01',
      bonusPoints: 20,
      status: 'CONFIRMED',
      memo: 'Antikythera Mechanism Inscription',
    },
  ],
};

// Fixed Micro-payment pricing & Incentive Configuration
export const ECHO_PRICE = {
  USDT: '0.01',
  NIM: '1',
};

// Reward Points per Currency (NIM Usage Incentivized 5x for Bonus Points)
export const POINT_REWARDS = {
  NIM: 100,  // 5x Bonus Points for using native NIM
  USDT: 20,  // Standard Points for USDT
};

export function calculatePatronRank(bonusPoints) {
  if (bonusPoints >= 1000) return 'NIM PoS Legend';
  if (bonusPoints >= 500) return 'NIM Master Archivist';
  if (bonusPoints >= 200) return 'NIM Patron';
  if (bonusPoints >= 50) return 'NIM Scholar';
  return 'Museum Novice';
}

// Retrieve persisted wallet state
export function getSavedWalletState() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_WALLET);
    if (!data) return INITIAL_WALLET_STATE;
    const parsed = JSON.parse(data);
    return {
      ...INITIAL_WALLET_STATE,
      ...parsed,
      balances: {
        ...INITIAL_WALLET_STATE.balances,
        ...(parsed.balances || {}),
      },
    };
  } catch (err) {
    console.warn('LocalStorage error reading wallet state:', err);
    return INITIAL_WALLET_STATE;
  }
}

// Save wallet state
export function saveWalletState(walletState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_WALLET, JSON.stringify(walletState));
  } catch (err) {
    console.warn('LocalStorage error saving wallet state:', err);
  }
}

// Retrieve custom inscribed echoes for an artifact
export function getInscribedEchoes(artifactId) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ECHOES);
    const allEchoes = raw ? JSON.parse(raw) : {};
    return allEchoes[artifactId] || [];
  } catch (err) {
    console.warn('Error reading stored echoes:', err);
    return [];
  }
}

// Save a new echo into localStorage
export function saveInscribedEcho(artifactId, echoObj) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ECHOES);
    const allEchoes = raw ? JSON.parse(raw) : {};
    if (!allEchoes[artifactId]) {
      allEchoes[artifactId] = [];
    }
    allEchoes[artifactId].unshift(echoObj);
    localStorage.setItem(LOCAL_STORAGE_KEY_ECHOES, JSON.stringify(allEchoes));
    return allEchoes[artifactId];
  } catch (err) {
    console.error('Failed to persist inscribed echo:', err);
    return [];
  }
}

// Generate realistic Nimiq / Crypto Transaction Hash
export function generateTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Executes a Nimiq Pay transaction for Vellum micro-payments.
 * Supports window.NimiqPay SDK integration + Interactive Sandbox Error Simulations.
 */
export async function initiateNimiqPayment({
  amount,
  currency = 'USDT',
  message = 'Vellum Echo Inscription',
  simulationScenario = 'none', // 'none' | 'user_cancel' | 'network_error' | 'insufficient_funds'
  onProgressStep,
}) {
  if (onProgressStep) onProgressStep('preparing', 'Building transaction payload...');

  // Simulated Scenario Overrides for Testing Defensive Error Handling
  if (simulationScenario === 'user_cancel') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (onProgressStep) onProgressStep('signing', 'Awaiting Nimiq Pay wallet authorization...');
    await new Promise((resolve) => setTimeout(resolve, 600));
    throw new NimiqPayError(
      ERROR_CODES.USER_CANCELLED,
      'Payment was cancelled by the user in Nimiq Pay. No funds were spent.'
    );
  }

  if (simulationScenario === 'network_error') {
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (onProgressStep) onProgressStep('broadcasting', 'Broadcasting transaction to Nimiq PoS validators...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    throw new NimiqPayError(
      ERROR_CODES.NETWORK_ERROR,
      'Nimiq PoS node connection timed out. Please check network connectivity and try again.'
    );
  }

  // 1. Real Window SDK Execution
  if (window.NimiqPay && typeof window.NimiqPay.requestPayment === 'function') {
    try {
      if (onProgressStep) onProgressStep('signing', 'Opening Nimiq Pay Wallet modal...');
      const paymentResult = await window.NimiqPay.requestPayment({
        recipient: 'NQ00 VELL UM11 HACK ATHO NMIN IAPP S',
        amount: amount,
        currency: currency,
        memo: message,
      });

      if (onProgressStep) onProgressStep('broadcasting', 'Consensus confirmed by Nimiq PoS ledger.');
      return {
        success: true,
        txHash: paymentResult.hash || generateTxHash(),
        currency,
        amount,
      };
    } catch (sdkError) {
      if (sdkError?.message?.includes('cancel') || sdkError?.code === 4001) {
        throw new NimiqPayError(
          ERROR_CODES.USER_CANCELLED,
          'Payment request was cancelled in your Nimiq Wallet.'
        );
      }
      throw new NimiqPayError(
        ERROR_CODES.PAYMENT_FAILED,
        sdkError.message || 'Nimiq Pay SDK failed to complete transaction.'
      );
    }
  }

  // 2. Realistic Simulated Web3 Blockchain Execution Mode
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (onProgressStep) onProgressStep('signing', 'Signing micro-transaction with Nimiq Keyguard...');

  await new Promise((resolve) => setTimeout(resolve, 800));
  if (onProgressStep) onProgressStep('broadcasting', 'Finalizing PoS block inclusion (Slot #14,892)...');

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    txHash: generateTxHash(),
    currency,
    amount,
  };
}

/**
 * Execute Nimiq Pay transaction with defensive validation, balance check,
 * bonus points accumulation, and transaction logging.
 */
export async function executeNimiqPayTransaction({
  currency,
  amount,
  walletState,
  message,
  simulationScenario = 'none',
  onProgressStep,
}) {
  const numericAmount = parseFloat(amount);
  const currentBalance = walletState?.balances?.[currency] || 0;

  // Defensive Guard 1: Connection Check
  if (!walletState || !walletState.isConnected) {
    throw new NimiqPayError(
      ERROR_CODES.WALLET_NOT_CONNECTED,
      'Nimiq Pay Wallet is not connected. Please connect your wallet to proceed.'
    );
  }

  // Defensive Guard 2: Balance Check
  if (simulationScenario === 'insufficient_funds' || currentBalance < numericAmount) {
    throw new NimiqPayError(
      ERROR_CODES.INSUFFICIENT_BALANCE,
      `Insufficient ${currency} balance. Available: ${currentBalance} ${currency}, Required: ${amount} ${currency}.`
    );
  }

  // Trigger Transaction & State Progress
  const paymentResult = await initiateNimiqPayment({
    amount,
    currency,
    message,
    simulationScenario,
    onProgressStep,
  });

  // Calculate Bonus Points & Rank
  const pointsEarned = POINT_REWARDS[currency] || 20;
  const newTotalPoints = (walletState.bonusPoints || 0) + pointsEarned;
  const newRank = calculatePatronRank(newTotalPoints);

  // Update Wallet Balance & Transaction Log
  const updatedWallet = {
    ...walletState,
    balances: {
      ...walletState.balances,
      [currency]: parseFloat((currentBalance - numericAmount).toFixed(2)),
    },
    bonusPoints: newTotalPoints,
    patronBadge: newRank,
    txHistory: [
      {
        id: 'tx-' + Date.now(),
        txHash: paymentResult.txHash,
        timestamp: new Date().toISOString(),
        currency,
        amount,
        bonusPoints: pointsEarned,
        status: 'CONFIRMED',
        memo: message || 'Vellum Inscription Payment',
      },

      ...(walletState.txHistory || []),
    ],
  };

  saveWalletState(updatedWallet);

  return {
    success: true,
    txHash: paymentResult.txHash,
    timestamp: new Date().toISOString(),
    currency,
    amount,
    pointsEarned,
    updatedWallet,
  };
}
