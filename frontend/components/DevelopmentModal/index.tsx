"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface DevelopmentModalProps {
  isOpen: boolean
  onClose: () => void
}

const DevelopmentModal = ({ isOpen, onClose }: DevelopmentModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/10 to-[#00d4ff]/10 rounded-2xl opacity-50"></div>
              
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                {/* <div className="w-16 h-16 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🚀</span>
                </div> */}

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-4">
                 Aleo Testnet Preview
                </h2>

                {/* Message */}
                <p className="text-gray-300 text-sm leading-relaxed mb-8">
                 KiloDEX brings privacy-preserving decentralized trading to Aleo Testnet. The platform is under active development and open for testing with demo tokens.
                </p>
 

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-xl py-3 px-6 transition-all"
                >
                  OK
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DevelopmentModal;