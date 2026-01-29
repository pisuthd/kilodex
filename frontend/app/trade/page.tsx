"use client"

import { useState, useEffect } from 'react'
import TradeInterface from "@/components/TradeInterface";
import DevelopmentModal from "@/components/DevelopmentModal";

export default function Trade() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show modal when component mounts
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <DevelopmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <TradeInterface />
    </>
  );
}
