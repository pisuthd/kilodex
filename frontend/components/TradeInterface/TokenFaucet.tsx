"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, CheckCircle } from 'lucide-react'
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

const PROGRAM_ID = 'kilodex_v1.aleo';

interface TokenFaucetProps {
  onMintSuccess: () => void;
}

const TokenFaucet = ({ onMintSuccess }: TokenFaucetProps) => {
  const { publicKey, requestTransaction, transactionStatus } = useWallet();
  const [isMintingWALEO, setIsMintingWALEO] = useState(false);
  const [isMintingUSDC, setIsMintingUSDC] = useState(false);
  const [mintStatus, setMintStatus] = useState<string>('');

  // Mint tokens using the Leo program
  const mintToken = async (tokenId: number, amount: number) => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    const isMinting = tokenId === 1 ? setIsMintingWALEO : setIsMintingUSDC;
    const tokenName = tokenId === 1 ? 'WALEO' : 'USDC';

    isMinting(true);
    setMintStatus(`Minting ${amount} ${tokenName}...`);

    try {
      // Create mint transaction (matching Leo program signature)
      const mintAmount = BigInt(amount * Math.pow(10, 6)); // 6 decimals
 
      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        PROGRAM_ID,
        'mint_to_me',
        [ 
          tokenId.toString() + 'u64',
          mintAmount.toString() + 'u128'
        ],
        70_000, // fee
        false
      );
 

      setMintStatus('Sending transaction...');
      const transactionId = await requestTransaction!(aleoTransaction);

      setMintStatus(`Transaction sent: ${transactionId.substring(0, 10)}...`);
      
      // Poll for transaction status
      let finalized = false;
      const checkStatus = async () => { 
        try {
          const status = await transactionStatus!(transactionId); 
          console.log(`Transaction status check ${Date.now()}: ${status}`);
          
          if (status === "Finalized" || status === "Completed") {
            setMintStatus(`Successfully minted ${amount} ${tokenName}!`);
            onMintSuccess();
            finalized = true;
            setTimeout(() => setMintStatus(''), 3000);
            return true; // Signal success
          } else if (status && status !== "Finalized" && status !== "Completed") {
            setMintStatus(`Processing transaction... (${status})`);
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
        // if (!finalized) {
        //   setMintStatus(`Checking transaction status... (${i + 1}/10)`);
        // }
      }

      // Handle timeout case
      if (!finalized) {
        setMintStatus(`Transaction taking longer than expected. Please check your wallet.`);
        setTimeout(() => setMintStatus(''), 5000);
      }

    } catch (error) {
      console.error('Mint error:', error);
      setMintStatus(`Error: ${error}`);
      setTimeout(() => setMintStatus(''), 5000);
    } finally {
      isMinting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-[#00ff88]" />
        <h3 className="text-lg font-bold text-white">Faucet</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Get test tokens for trading on Aleo Testnet
      </p>

      <div className="space-y-3">
        {/* WALEO Mint Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => mintToken(1, 1000)} // Mint 1000 WALEO
          disabled={isMintingWALEO || isMintingUSDC}
          className="w-full bg-black/30 border border-white/5 hover:border-white/10 rounded-lg p-3 text-left transition-all disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/aleo-icon.png" alt="WALEO" className="w-6 h-6 rounded-full" />
              <span className="text-white font-medium">Mint WALEO</span>
            </div>
            <span className="text-[#00ff88] text-sm">1000</span>
          </div>
        </motion.button>

        {/* USDC Mint Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => mintToken(2, 1000)} // Mint 1000 USDC
          disabled={isMintingWALEO || isMintingUSDC}
          className="w-full bg-black/30 border border-white/5 hover:border-white/10 rounded-lg p-3 text-left transition-all disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/usdc-icon.png" alt="USDC" className="w-6 h-6 rounded-full" />
              <span className="text-white font-medium">Mint USDC</span>
            </div>
            <span className="text-[#00d4ff] text-sm">1000</span>
          </div>
        </motion.button>
      </div>

      {/* Mint Status */}
      {mintStatus && (
        <div className="mt-4 p-3 bg-black/30 border border-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            {mintStatus.includes('Successfully') ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <p className="text-xs text-gray-300">{mintStatus}</p>
          </div>
        </div>
      )}
 
    </motion.div>
  );
};

export default TokenFaucet;