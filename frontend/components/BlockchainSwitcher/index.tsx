"use client"

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function BlockchainSwitcher() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentBlockchain = state.blockchains.find(
    (blockchain) => blockchain.id === state.activeBlockchain
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBlockchainSelect = (blockchainId: string) => {
    const blockchain = state.blockchains.find(b => b.id === blockchainId);
    if (blockchain?.enabled) {
      dispatch({ type: 'SET_BLOCKCHAIN', payload: blockchainId });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        aria-label="Select blockchain"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentBlockchain && (
          <Image
            src={currentBlockchain.icon}
            alt={currentBlockchain.name}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
        )}
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-52 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
            <div className="p-1">
              {state.blockchains.map((blockchain) => (
                <button
                  key={blockchain.id}
                  onClick={() => handleBlockchainSelect(blockchain.id)}
                  disabled={!blockchain.enabled}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    blockchain.id === state.activeBlockchain
                      ? 'bg-gray-800 text-[#00ff88]'
                      : blockchain.enabled
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                  aria-disabled={!blockchain.enabled}
                >
                  <Image
                    src={blockchain.icon}
                    alt={blockchain.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm font-medium">
                    {blockchain.name}
                  </span>
                  {!blockchain.enabled && (
                    <span className="text-xs text-gray-600 ml-auto">
                      Coming soon
                    </span>
                  )}
                  {blockchain.id === state.activeBlockchain && (
                    <div className="w-2 h-2 bg-[#00ff88] rounded-full ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}