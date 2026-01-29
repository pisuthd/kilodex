"use client"

import { motion } from 'framer-motion'
import { Wallet, Copy, ExternalLink } from 'lucide-react'

interface TokenBalance {
  [key: string]: string;
}

interface WalletInfoProps {
  publicKey: string;
  balances: TokenBalance;
}

const WalletInfo = ({ publicKey, balances }: WalletInfoProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(publicKey);
    // Could add toast notification here
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatBalance = (balance: string, decimals: number = 6) => {
    const num = parseFloat(balance) / Math.pow(10, decimals);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-[#00d4ff]" />
        <h3 className="text-lg font-bold text-white">Wallet Info</h3>
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="text-xs text-gray-400 mb-2 block">Connected Address</label>
        <div className="bg-black/30 border border-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-mono text-sm">
              {formatAddress(publicKey)}
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyAddress}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`https://testnet.aleoscan.io/address?a=${publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Token Balances */}
      <div>
        <label className="text-xs text-gray-400 mb-3 block">Token Balances</label>
        <div className="space-y-3">
          {/* WALEO Balance */}
          <div className="bg-black/30 border border-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/aleo-icon.png" alt="WALEO" className="w-6 h-6 rounded-full" />
                <span className="text-white font-medium">WALEO</span>
              </div>
              <span className="text-[#00ff88] font-mono">
                {formatBalance(balances.WALEO || '0')}
              </span>
            </div>
          </div>

          {/* USDC Balance */}
          <div className="bg-black/30 border border-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/usdc-icon.png" alt="USDC" className="w-6 h-6 rounded-full" />
                <span className="text-white font-medium">USDC</span>
              </div>
              <span className="text-[#00d4ff] font-mono">
                {formatBalance(balances.USDC || '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Notice */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start gap-2"> 
          <div>
            <p className="text-yellow-300 text-xs font-medium mb-1">Notice</p>
            <p className="text-yellow-200 text-xs leading-relaxed">
              Balance is currently fixed to developer wallet. We'll update to show connected wallet in the next wave.
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default WalletInfo;