"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownUp, TrendingUp, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  price: number
  isStablecoin?: boolean
}

const tokens: Token[] = [
  { symbol: 'USDT', name: 'Tether', icon: '/usdt-icon.svg', balance: '10,000', price: 1.0, isStablecoin: true },
  { symbol: 'USDC', name: 'USD Coin', icon: '/usdc-icon.png', balance: '8,500', price: 1.0, isStablecoin: true },
  { symbol: 'ALEO', name: 'Aleo', icon: '/aleo-icon.png', balance: '1,500', price: 0.1108 },
  { symbol: 'NIGHT', name: 'Midnight', icon: '/midnight-icon.svg', balance: '2,000', price: 0.05910 },
  { symbol: 'CC', name: 'Canton', icon: '/canton-icon.png', balance: '800', price: 0.1546 },
]

const SwapInterface = () => {
  const router = useRouter()
  const [fromToken, setFromToken] = useState(tokens[2]) // Start with ALEO
  const [toToken, setToToken] = useState(tokens[0]) // Start with USDT
  const [fromAmount, setFromAmount] = useState('1000')
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate to amount based on real prices
  const calculateToAmount = (from: Token, to: Token, amount: string) => {
    const fromValue = parseFloat(amount) * from.price
    const result = fromValue / to.price
    return result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const [toAmount, setToAmount] = useState(calculateToAmount(fromToken, toToken, fromAmount))

  // Auto-animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        const nonStablecoins = tokens.filter(t => !t.isStablecoin)
        const stablecoins = tokens.filter(t => t.isStablecoin)
        
        // Alternate between: token->stablecoin and stablecoin->token
        const fromStable = Math.random() > 0.5
        const randomFrom = fromStable 
          ? stablecoins[Math.floor(Math.random() * stablecoins.length)]
          : nonStablecoins[Math.floor(Math.random() * nonStablecoins.length)]
        const randomTo = fromStable
          ? nonStablecoins[Math.floor(Math.random() * nonStablecoins.length)]
          : stablecoins[Math.floor(Math.random() * stablecoins.length)]
        
        if (randomFrom.symbol !== randomTo.symbol) {
          setFromToken(randomFrom)
          setToToken(randomTo)
          const amount = fromStable 
            ? (Math.random() * 500 + 100).toFixed(0)
            : (Math.random() * 5000 + 1000).toFixed(0)
          setFromAmount(amount)
          setToAmount(calculateToAmount(randomFrom, randomTo, amount))
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isAnimating])

  // Update toAmount when tokens or fromAmount change
  useEffect(() => {
    if (!isAnimating) {
      setToAmount(calculateToAmount(fromToken, toToken, fromAmount))
    }
  }, [fromToken, toToken, fromAmount, isAnimating])

  const handleSwap = () => {
    // Navigate to trade page
    router.push('/trade')
  }

  const switchTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      {/* Glass morphism container */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        {/* Gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 rounded-2xl opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* From token */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 mb-2 block">From</label>
            <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <button 
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                  onClick={() => setIsAnimating(true)}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full overflow-hidden">
                    <Image
                      src={fromToken.icon}
                      alt={fromToken.symbol}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-medium">{fromToken.symbol}</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </button>
                <span className="text-xs text-gray-400">Balance: {fromToken.balance}</span>
              </div>
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                onFocus={() => setIsAnimating(true)}
                onBlur={() => setIsAnimating(false)}
              />
            </div>
          </div>

          {/* Switch button */}
          <div className="flex justify-center -my-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={switchTokens}
              className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] p-3 rounded-full shadow-lg hover:shadow-[#00ff88]/50 transition-all"
            >
              <ArrowDownUp className="w-4 h-4 text-black" />
            </motion.button>
          </div>

          {/* To token */}
          <div className="mb-6 mt-4">
            <label className="text-xs text-gray-400 mb-2 block">To</label>
            <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <button 
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                  onClick={() => setIsAnimating(true)}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full overflow-hidden">
                    <Image
                      src={toToken.icon}
                      alt={toToken.symbol}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-medium">{toToken.symbol}</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </button>
                <span className="text-xs text-gray-400">Balance: {toToken.balance}</span>
              </div>
              <input
                type="text"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                onFocus={() => setIsAnimating(true)}
                onBlur={() => setIsAnimating(false)}
              />
            </div>
          </div>

          {/* Swap button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSwap}
            className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-xl py-4   transition-all flex items-center justify-center gap-2"
          >
            Go To Trade
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Price info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              1 {fromToken.symbol} = {(parseFloat(toAmount.replace(/,/g, '')) / parseFloat(fromAmount)).toFixed(2)} {toToken.symbol}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SwapInterface