
 
import Hero from "./Hero"
import CriticalQuestion from "./CriticalQuestion"

const HomeContainer = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white"> 
             <Hero />
            <CriticalQuestion />{/*
            <HowItWorks />
            <ComparisonTable />  
            <WhatKiloRailsEnables /> 
            <FinalQA /> */}
        </div>
    )
}

export default HomeContainer
