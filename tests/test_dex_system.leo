import kilodex_v1.aleo;

program test_dex_system.aleo {
    @test
    script test_pool_creation() {
        // Initialize demo tokens
        let demo_fut: Future = kilodex_v1.aleo/init_demo_tokens();
        demo_fut.await();
        
        // Mint tokens for testing
        let mint_fut1: Future = kilodex_v1.aleo/mint_to_me(1u64, 2000000000u128); // 2000 WALEO
        let mint_fut2: Future = kilodex_v1.aleo/mint_to_me(2u64, 4000000000u128); // 4000 USDC
        mint_fut1.await();
        mint_fut2.await();
        
        // Create pool with partial funds, leaving some for swapping
        let pool_fut: Future = kilodex_v1.aleo/create_pool(1u64, 2u64, 1000000000u128, 2000000000u128);
        pool_fut.await();
        
        // Pool creation successful if we reach here
        assert(true);
    }
    
    @test
    script test_basic_swap() {
        // Initialize demo tokens
        let demo_fut: Future = kilodex_v1.aleo/init_demo_tokens();
        demo_fut.await();
        
        // Mint tokens for testing
        let mint_fut1: Future = kilodex_v1.aleo/mint_to_me(1u64, 2000000000u128); // 2000 WALEO
        let mint_fut2: Future = kilodex_v1.aleo/mint_to_me(2u64, 4000000000u128); // 4000 USDC
        mint_fut1.await();
        mint_fut2.await();
        
        // Create pool with partial funds, leaving some for swapping
        let pool_fut: Future = kilodex_v1.aleo/create_pool(1u64, 2u64, 1000000000u128, 2000000000u128);
        pool_fut.await();
        
        // Perform swap: swap 100 WALEO for USDC
        let swap_fut: Future = kilodex_v1.aleo/swap_exact_tokens_for_tokens(1u64, 2u64, 100000000u128, 1000000u128);
        swap_fut.await();
        
        // Swap successful if we reach here
        assert(true);
    }
    
    @test
    script test_full_swap() {
        // Initialize demo tokens
        let demo_fut: Future = kilodex_v1.aleo/init_demo_tokens();
        demo_fut.await();
        
        // Mint tokens for testing
        let mint_fut1: Future = kilodex_v1.aleo/mint_to_me(1u64, 2000000000u128); // 2000 WALEO
        let mint_fut2: Future = kilodex_v1.aleo/mint_to_me(2u64, 4000000000u128); // 4000 USDC
        mint_fut1.await();
        mint_fut2.await();
        
        // Create pool with partial funds, leaving some for swapping
        let pool_fut: Future = kilodex_v1.aleo/create_pool(1u64, 2u64, 1000000000u128, 2000000000u128);
        pool_fut.await();
        
        // Perform multiple swaps with smaller, more reasonable amounts
        let swap_fut1: Future = kilodex_v1.aleo/swap_exact_tokens_for_tokens(1u64, 2u64, 100000000u128, 1000000u128);
        let swap_fut2: Future = kilodex_v1.aleo/swap_exact_tokens_for_tokens(2u64, 1u64, 200000000u128, 50000000u128);
        swap_fut1.await();
        swap_fut2.await();
        
        // Full workflow successful if we reach here
        assert(true);
    }
      
    // Required transition for program
    @test
    transition dummy_transition() {
        // This transition exists to satisfy Leo's requirement of at least one transition
        assert(true);
    }

    // The constructor is configured to prevent upgrades.
    @noupgrade
    async constructor() {}
}