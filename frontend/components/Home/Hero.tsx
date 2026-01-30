"use client"
 
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SwapInterface from '@/components/SwapInterface';

const Hero = () => {
    const router = useRouter();

    return (
        <div className="relative flex items-center justify-center overflow-hidden">
            {/* Background Blockchain Icon - Left Side */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pointer-events-none lg:block hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -50 }}
                    animate={{ opacity: 0.15, scale: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative"
                >
                    <Image
                        src="/aleo-icon.png"
                        alt="Powered by Aleo"
                        width={400}
                        height={400}
                        className="w-64 h-64 lg:w-96 lg:h-96 opacity-20"
                        style={{ filter: 'brightness(1.5) contrast(0.8)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 rounded-full blur-xl"></div>
                </motion.div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
                    {/* Left Side - Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl lg:text-5xl font-bold leading-tight"
                            >
                                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    Liquidity Without{' '}
                                </span>
                                <span className="text-green-400">
                                    Exposure
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-base sm:text-[17px]  text-gray-400 leading-relaxed"
                            >
                                A privacy-first AMM DEX on <span className="text-[#00ff88] font-semibold">Aleo</span> designed for institutional liquidity providers. <span className="text-[#00ff88] font-semibold">Powered by zPass</span> to authenticate counterparties without revealing positions, identities, or strategies.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                onClick={() => router.push('/trade')}
                                className="px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/50 transition-all flex items-center justify-center group"
                            >
                                Try Now
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link
                                href="https://youtu.be/UvyyKhmTAt8"
                                className="px-8 py-4 bg-black/60 border border-gray-700 text-white font-semibold rounded-lg hover:border-gray-600 transition-all flex items-center justify-center group"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Watch YouTube
                            </Link>
                        </motion.div>
 
                    </motion.div>

                    {/* Right Side - Swap Interface */}
                    <SwapInterface />
                </div>
            </div>

        </div>
    );
};

export default Hero;