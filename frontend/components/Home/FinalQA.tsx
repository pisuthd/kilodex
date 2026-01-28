"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowRight, ExternalLink } from 'lucide-react';


const FinalQA = () => {
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is KiloDEX?",
            answer:
                "KiloDEX is a privacy-first AMM DEX built for institutional liquidity providers, enabling selective access, policy-controlled trading, and verifiable compliance on privacy-native blockchains. The protocol is currently live on Aleo Testnet and is designed to support additional privacy chains such as Midnight and Canton."
        },
        {
            question: "Who is KiloDEX designed for?",
            answer:
                "KiloDEX is designed for institutional liquidity providers, market makers, treasuries, and regulated entities that require control over counterparties, privacy over positions, and provable compliance when providing on-chain liquidity."
        },
        {
            question: "What does 'selective access' mean?",
            answer:
                "Selective access allows liquidity providers to define on-chain policies that determine who is permitted to trade against their liquidity. Traders must cryptographically prove eligibility without revealing their identity or sensitive data."
        },
        {
            question: "How is KiloDEX different from Uniswap or other AMMs?",
            answer:
                "Unlike traditional AMMs, KiloDEX does not expose liquidity to unrestricted, anonymous order flow. Liquidity providers retain control over access, while trades and balances remain private and compliance can be proven on-chain."
        },
        {
            question: "How does KiloDEX handle privacy and compliance?",
            answer:
                "KiloDEX uses zero-knowledge proofs and privacy-native blockchain features to keep trade details confidential while allowing institutions to prove solvency, policy adherence, and compliance to authorized parties when required."
        },
        {
            question: "Which blockchains does KiloDEX support?",
            answer:
                "KiloDEX is currently deployed on Aleo Testnet. The protocol is architected to support additional privacy-focused blockchains, including Midnight and Canton, each leveraging their unique privacy and selective disclosure capabilities."
        }
    ]



    const toggleQuestion = (index: number) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    return (
        <section className="py-20 px-6 bg-black/20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Frequently Asked
                        </span>
                        <span className="text-green-400">
                            {' '}Questions
                        </span>
                    </motion.h2>
                    <motion.p
                        className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Everything you need to know about <span className="text-[#00ff88] font-semibold">KiloDEX</span> 
                    </motion.p>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    {faqs.map((faq, index) => {
                        const isActive = activeQuestion === index;

                        return (
                            <motion.div
                                key={index}
                                className="bg-gray-900/30 border border-gray-800 rounded-lg mb-4 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
                                >
                                    <span className="text-white font-semibold">{faq.question}</span>

                                    <motion.div
                                        animate={{ rotate: isActive ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-gray-800"
                                        >
                                            <div className="p-6">
                                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default FinalQA;
