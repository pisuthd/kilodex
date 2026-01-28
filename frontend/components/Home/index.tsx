
 
import Hero from "./Hero"
import CriticalQuestion from "./CriticalQuestion"
import HowItWorks from "../HowItWorks"
import FinalQA from "./FinalQA"

const HomeContainer = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white"> 
             <Hero />
            <CriticalQuestion />
            <HowItWorks />
            <FinalQA/>
        </div>
    )
}

export default HomeContainer
