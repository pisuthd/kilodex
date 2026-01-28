"use client"

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    title: "Private Identity Gating via zPass",
    subtitle: "Compliance-first access without data exposure.",
    description: "LPs selectively gate their liquidity using zPass. Counterparties must prove they meet your specific regulatory criteria (KYC/AML, region, or entity type) through a ZK-proof—verifying their status without ever revealing their identity."
  },
  {
    title: "Shielded Institutional Positions", 
    subtitle: "Protect your proprietary liquidity data on-chain.",
    description: "While pool reserves remain public for price discovery, individual LP positions are stored in Aleo’s private Record Model. Your specific exposure, rebalancing logic, and entry/exit points are invisible to competitors."
  },
  {
    title: "Selective Transparency with View Keys",
    subtitle: "On-demand transparency for regulatory reporting.",
    description: "Hold full sovereignty over your transaction data. Grant auditors or regulators read-only visibility into your specific activity via Account View Keys, satisfying legal mandates without leaking your market alpha to the public."
  }
]

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black/50 to-black relative overflow-hidden">
      {/* Background Blockchain Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <Image
            src="/aleo-icon.png"
            alt="Powered by Aleo"
            width={400}
            height={400}
            className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 opacity-20"
            style={{ filter: 'brightness(1.5) contrast(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 rounded-full blur-xl"></div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              How It{' '}
            </span>
            <span className="bg-gradient-to-r from-[#00ff88] to-[#00ff88] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Privacy-first liquidity provision on <span className="text-[#00ff88] font-semibold">Aleo</span> blockchain
          </p> 
        </motion.div>

        {/* Feature List */}
        <div className="space-y-6 sm:space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: index * 0.2 + 0.3 }}
                  className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#00ff88] rounded-full flex items-center justify-center mt-1 sm:mt-1 group-hover:shadow-lg group-hover:shadow-[#00ff88]/30 transition-all"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  {/* {feature.subtitle && (
                    <p className="text-green-400 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
                      {feature.subtitle}
                    </p>
                  )} */}
                  {feature.description && (
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              {index < features.length - 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  className="ml-3 sm:ml-4 mt-4 sm:mt-6 border-l border-white/10 h-px"
                />
              )}
            </motion.div>
          ))}
        </div>
 
      </div>
    </section>
  )
}

export default HowItWorks
