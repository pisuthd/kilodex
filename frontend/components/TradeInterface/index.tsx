"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownUp, ArrowRight, Wallet, Droplets } from 'lucide-react'
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import TokenFaucet from './TokenFaucet';
import WalletInfo from './WalletInfo';

// Token definitions matching the Leo program
const TOKENS = {
  WALEO: { id: 1, symbol: 'WALEO', name: 'Wrapped Aleo', icon: '/aleo-icon.png', decimals: 6 },
  USDC: { id: 2, symbol: 'USDC', name: 'USD Coin', icon: '/usdc-icon.png', decimals: 6 }
};

// RPC endpoint for Aleo Testnet Beta
const ALEO_RPC_URL = 'https://testnetbeta.aleorpc.com';
const PROGRAM_ID = 'kilodex_v1.aleo';

interface TokenBalance {
  [key: string]: string;
}

const TradeInterface = () => {
  const { publicKey, requestTransaction, transactionStatus } = useWallet();
  const [fromToken, setFromToken] = useState(TOKENS.WALEO);
  const [toToken, setToToken] = useState(TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [balances, setBalances] = useState<TokenBalance>({});
  const [isSwapping, setIsSwapping] = useState(false);
  const [txStatus, setTxStatus] = useState<string>('');

  // Generate balance key for a user and token
  // const getBalanceKey = (tokenId: number, address: string): string => {
  //   // This should match the BHP256::hash_to_field([token_id as field, user as field]) in Leo
  //   return `${tokenId}_${address}`;
  // };

  // Fetch balance from Aleo RPC
  const fetchBalance = async (tokenId: number, address: string) => {
    try {

      const response = await fetch(ALEO_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getMappingValue",
          params: {
            "program_id": PROGRAM_ID,
            "mapping_name": "balances",
            // FIXME: Find the way to hash the balance key 
            "key": tokenId === 1 ? "7430593060978641952442759277403221573591193011240094530212132801109312618932field" : "270877472161161040706168621091348283850430060791407508380458373650193625572field"
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        // Parse balance from "amountu64" or "amountu128" format to number
        return data.result.replace(/u\d+$/, '');
      }
      return "0";
    } catch (error) {
      console.error('Error fetching balance:', error);
      return "0";
    }
  };

  // Format balance for display
  const formatBalance = (balance: string, decimals: number = 6) => {
    const num = parseFloat(balance) / Math.pow(10, decimals);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Fetch all balances when wallet connects
  useEffect(() => {
    if (publicKey) {
      const fetchAllBalances = async () => {
        const waleoBalance = await fetchBalance(TOKENS.WALEO.id, publicKey);
        const usdcBalance = await fetchBalance(TOKENS.USDC.id, publicKey);
        setBalances({
          [TOKENS.WALEO.symbol]: waleoBalance,
          [TOKENS.USDC.symbol]: usdcBalance
        });
      };

      fetchAllBalances();
    }
  }, [publicKey]);

  // Calculate to amount (simple 1:1 for demo, would use pool data in production)
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      setToAmount(fromAmount); // Simple 1:1 for demo
    } else {
      setToAmount('');
    }
  }, [fromAmount]);

  // Handle token swap
  const handleSwap = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSwapping(true);
    setTxStatus('Initiating swap...');

    try {
      // Create swap transaction (matching Leo program signature)
      const amountIn = BigInt(parseFloat(fromAmount) * Math.pow(10, fromToken.decimals));
      const minAmountOut = BigInt(parseFloat(fromAmount) * Math.pow(10, toToken.decimals) * 0.95); // 5% slippage

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        PROGRAM_ID,
        'swap_exact_tokens_for_tokens',
        [
          fromToken.id.toString() + "u64",
          toToken.id.toString() + "u64",
          amountIn.toString() + 'u128',
          '0u128'
        ],
        70_000, // fee
        false
      );

      setTxStatus('Sending transaction...');
      const transactionId = await requestTransaction!(aleoTransaction);

      setTxStatus(`Transaction sent: ${transactionId}. Waiting for confirmation...`);

      // Poll for transaction status
      let finalized = false;
      const checkStatus = async () => {
        try {
          const status = await transactionStatus!(transactionId);
          console.log(`Swap transaction status check ${Date.now()}: ${status}`);

          if (status === "Finalized" || status === "Completed") {
            setTxStatus(`Transaction completed successfully!`);
            finalized = true;
            setTimeout(() => setTxStatus(''), 3000);
            return true; // Signal success
          } else if (status && status !== "Finalized" && status !== "Completed") {
            setTxStatus(`Processing swap transaction... (${status})`);
            return false; // Continue polling
          }
        } catch (error) {
          console.error('Status check error:', error);
          return false; // Continue polling on error
        }
        return false; // Continue polling
      };

      // Check status every 3 seconds, break when finalized or timeout
      for (let i = 0; i < 10 && !finalized; i++) { // Reduced to 10 attempts (30 seconds total)
        const isFinalized = await checkStatus();
        if (isFinalized) {
          break; // Exit loop immediately when finalized
        }
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Update progress
        if (!finalized) {
          setTxStatus(`Checking swap status... (${i + 1}/10)`);
        }
      }

      // Handle timeout case
      if (!finalized) {
        setTxStatus(`Transaction taking longer than expected. Please check your wallet.`);
      }

    } catch (error) {
      console.error('Swap error:', error);
      setTxStatus(`Error: ${error}`);
    } finally {
      setIsSwapping(false);
      setTimeout(() => setTxStatus(''), 5000);
    }
  };

  // Switch tokens
  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Wallet Connection Warning */}
        {!publicKey && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 text-sm font-medium">Connect Your Wallet</span>
              </div>
              <p className="text-yellow-300 text-xs mt-1">
                Connect wallet to enable trading and ensure you're on <span className=" font-semibold">Aleo Testnet Beta</span>
              </p>
            </div>

          </motion.div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Trading Interface */}
          <div className="col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Trading Card Header */}
              <div className="bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Token Swap</h2>
                    <p className="text-sm text-gray-400">Exchange tokens instantly with zero-knowledge privacy</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">
                      Aleo Testnet
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">

                {/* Swap Interface */}
                <div className="space-y-6">
                  {/* From Token */}
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">From</label>
                    <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img src={fromToken.icon} alt={fromToken.symbol} className="w-8 h-8 rounded-full" />
                          <span className="text-white font-medium">{fromToken.symbol}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          Balance: {formatBalance(balances[fromToken.symbol] || '0', fromToken.decimals)}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Switch Button */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={switchTokens}
                      className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] p-3 rounded-full shadow-lg"
                    >
                      <ArrowDownUp className="w-4 h-4 text-black" />
                    </motion.button>
                  </div>

                  {/* To Token */}
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">To</label>
                    <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img src={toToken.icon} alt={toToken.symbol} className="w-8 h-8 rounded-full" />
                          <span className="text-white font-medium">{toToken.symbol}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          Balance: {formatBalance(balances[toToken.symbol] || '0', toToken.decimals)}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={toAmount}
                        readOnly
                        placeholder="0.00"
                        className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSwap}
                    disabled={isSwapping || !fromAmount}
                    className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-xl py-4 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isSwapping ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Swap Tokens
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Transaction Status */}
                  {txStatus && (
                    <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                      <p className="text-sm text-gray-300">{txStatus}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 col-span-2">
            {/* Wallet Info - only show when wallet is connected */}
            {publicKey ? (
              <WalletInfo publicKey={publicKey} balances={balances} />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-white font-medium mb-2">Wallet Not Connected</h3>
                  <p className="text-gray-400 text-sm">Connect your wallet to view balance and transaction history</p>
                </div>
              </motion.div>
            )}

            {/* Token Faucet - only show when wallet is connected */}
            {publicKey ? (
              <TokenFaucet onMintSuccess={() => {
                // Refresh balances after successful mint
                if (publicKey) {
                  fetchBalance(TOKENS.WALEO.id, publicKey).then(waleo => {
                    fetchBalance(TOKENS.USDC.id, publicKey).then(usdc => {
                      setBalances({
                        [TOKENS.WALEO.symbol]: waleo,
                        [TOKENS.USDC.symbol]: usdc
                      });
                    });
                  });
                }
              }} />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="text-center py-8">
                  <Droplets className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-white font-medium mb-2">Token Faucet Unavailable</h3>
                  <p className="text-gray-400 text-sm">Connect your wallet to access test tokens</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInterface;