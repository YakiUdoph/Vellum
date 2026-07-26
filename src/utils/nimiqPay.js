// Nimiq Pay SDK & Wallet Integration Utility for Vellum

const LOCAL_STORAGE_KEY_ECHOES = 'vellum_inscribed_echoes_v1';
const LOCAL_STORAGE_KEY_WALLET = 'vellum_nimiq_wallet_v1';

export const INITIAL_WALLET_STATE = {
  isConnected: false,
  address: 'NQ84 7E71 V3LL UM00 N1M1 Q999 8888',
  displayName: 'Museum Explorer',
  balances: {
    USDT: 24.50,
    NIM: 1850.00,
  },
  network: 'Nimiq Mainnet (PoS)',
};

// Fixed Micro-payment pricing
export const ECHO_PRICE = {
  USDT: '0.01',
  NIM: '1',
};

// Retrieve persisted wallet state
export function getSavedWalletState() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_WALLET);
    return data ? JSON.parse(data) : INITIAL_WALLET_STATE;
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
 * Simulates or executes a Nimiq Pay transaction for Vellum micro-payments.
 * Supports choosing between USDT and NIM as mandated by competition rules.
 */
export async function initiateNimiqPayment({ amount, currency = 'USDT', message = 'Vellum Echo Inscription' }) {
  try {
    // Check if Nimiq Pay SDK is injected in the window context
    if (window.NimiqPay && typeof window.NimiqPay.requestPayment === 'function') {
      const paymentResult = await window.NimiqPay.requestPayment({
        recipient: 'NQ00 VELL UM11 HACK ATHO NMIN IAPP S',
        amount: amount, // e.g., 0.10 for USDT or equivalent NIM
        currency: currency, // 'USDT' or 'NIM'
        memo: message,
      });
      return { success: true, txHash: paymentResult.hash, currency, amount };
    }

    // Fallback simulation mode for testing inside Antigravity browser
    console.warn('NimiqPay SDK not detected in window. Running secure simulation mode.');
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate network latency
    
    return {
      success: true,
      txHash: '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      currency,
      amount
    };
  } catch (error) {
    console.error('Nimiq Pay transaction failed:', error);
    return { success: false, error: error.message };
  }
}

// Execute Nimiq Pay micro-transaction with balance deduction & SDK fallback
export async function executeNimiqPayTransaction({ currency, amount, walletState, message }) {
  const numericAmount = parseFloat(amount);
  const currentBalance = walletState?.balances?.[currency] || 0;

  if (walletState && !walletState.isConnected) {
    throw new Error('Wallet not connected. Please connect your Nimiq Pay wallet first.');
  }

  if (walletState && currentBalance < numericAmount) {
    throw new Error(`Insufficient ${currency} balance in your Nimiq Pay wallet.`);
  }

  // Trigger SDK or Simulation Mode
  const paymentResult = await initiateNimiqPayment({ amount, currency, message });

  if (!paymentResult.success) {
    throw new Error(paymentResult.error || 'Nimiq Pay payment failed.');
  }

  // Deduct balance in local state if connected
  let updatedWallet = walletState;
  if (walletState && walletState.isConnected) {
    updatedWallet = {
      ...walletState,
      balances: {
        ...walletState.balances,
        [currency]: parseFloat((currentBalance - numericAmount).toFixed(2)),
      },
    };
    saveWalletState(updatedWallet);
  }

  return {
    success: true,
    txHash: paymentResult.txHash,
    timestamp: new Date().toISOString(),
    currency,
    amount,
    updatedWallet,
  };
}
