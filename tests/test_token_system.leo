import kilodex_v1.aleo;

program test_token_system.aleo { 

    // we need at least one transition function 
    @test
    transition dummy_transition() { 
        assert(true);
    }

    @test
    script test_token_creation() {
        // Create a new token (ID: 100 to avoid conflict with demo tokens)
        let fut: Future = kilodex_v1.aleo/create_token(100u64, 8u8);
        fut.await();
        
        // Verify the token was created by checking the mapping
        let token_info = Mapping::get(kilodex_v1.aleo/tokens, 100u64);
        assert_eq(token_info.token_id, 100u64);
        assert_eq(token_info.decimals, 8u8);
        assert_eq(token_info.total_supply, 0u128);
    }

    @test
    script test_token_minting() {
        // Initialize demo tokens first
        let demo_fut: Future = kilodex_v1.aleo/init_demo_tokens();
        demo_fut.await();
        
        // Mint WALEO tokens to a test user
        let user1: address = aleo10jjala2t97zjep2pncvwxhl8zrpmpwfm00acpxeh27umw64g25gqnh5p33;
        let mint_fut: Future = kilodex_v1.aleo/mint(1u64, user1, 1000000u128); // 1 WALEO
        mint_fut.await();
        
        // Check the balance was updated
        let balance_key: field = kilodex_v1.aleo/get_balance_key(1u64, user1);
        let balance: u128 = Mapping::get(kilodex_v1.aleo/balances, balance_key);
        assert_eq(balance, 1000000u128);
        
        // Check total supply was updated
        let token_info = Mapping::get(kilodex_v1.aleo/tokens, 1u64);
        assert_eq(token_info.total_supply, 1000000u128);
    }

    @test
    script test_token_transfers() {
        // Initialize demo tokens first
        let demo_fut: Future = kilodex_v1.aleo/init_demo_tokens();
        demo_fut.await();
        
        // Mint tokens to user1 first
        // let user1: address = self.caller; We don't know user1 address since self.caller is difference
        let user2: address = aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px;
        
        let mint_fut: Future = kilodex_v1.aleo/mint_to_me(1u64, 1000000u128); // 1 WALEO
        mint_fut.await();
        
        // Transfer from user1 to user2
        let transfer_fut: Future = kilodex_v1.aleo/transfer_public(1u64, user2, 500000u128); // 0.5 WALEO
        transfer_fut.await();
        
        // Check final balances
        // let user1_balance_key: field = kilodex_v1.aleo/get_balance_key(1u64, user1);
        // let user1_balance: u128 = Mapping::get(kilodex_v1.aleo/balances, user1_balance_key);
        // assert_eq(user1_balance, 500000u128); // 1 - 0.5 = 0.5 WALEO
        
        let user2_balance_key: field = kilodex_v1.aleo/get_balance_key(1u64, user2);
        let user2_balance: u128 = Mapping::get(kilodex_v1.aleo/balances, user2_balance_key);
        assert_eq(user2_balance, 500000u128); // 0 + 0.5 = 0.5 WALEO
    }

    @test
    script test_e2e() {
        // Test complete token lifecycle: Create -> Mint -> Transfer -> Verify
        
        // Step 1: Create a new token
        let create_fut: Future = kilodex_v1.aleo/create_token(200u64, 8u8);
        create_fut.await();
        
        // Step 2: Mint tokens to user1
        // let user1: address = aleo10jjala2t97zjep2pncvwxhl8zrpmpwfm00acpxeh27umw64g25gqnh5p33; // We don't know user1 address
        let user2: address = aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px;
        
        let mint_fut: Future = kilodex_v1.aleo/mint_to_me(200u64, 10000000u128); // 0.1 tokens
        mint_fut.await();
        
        // Step 3: Transfer from user1 to user2
        let transfer_fut: Future = kilodex_v1.aleo/transfer_public(200u64, user2, 5000000u128); // 0.05 tokens
        transfer_fut.await();
        
        // Step 4: Verify final state
        // let user1_balance_key: field = kilodex_v1.aleo/get_balance_key(200u64, user1);
        // let user1_balance: u128 = Mapping::get(kilodex_v1.aleo/balances, user1_balance_key);
        // assert_eq(user1_balance, 5000000u128); // 0.1 - 0.05 = 0.05 tokens
        
        let user2_balance_key: field = kilodex_v1.aleo/get_balance_key(200u64, user2);
        let user2_balance: u128 = Mapping::get(kilodex_v1.aleo/balances, user2_balance_key);
        assert_eq(user2_balance, 5000000u128); // 0 + 0.05 = 0.05 tokens
        
        // Verify total supply
        let token_info = Mapping::get(kilodex_v1.aleo/tokens, 200u64);
        assert_eq(token_info.total_supply, 10000000u128);
    }

    @test
    @should_fail
    script test_duplicate_token_creation() {
        // Initialize demo tokens first (creates token ID 1)
        let demo_fut: Future = kilodex_v1.aleo/init_demo_tokens();
        demo_fut.await();
        
        // Try to create token with same ID (should fail)
        let duplicate_fut: Future = kilodex_v1.aleo/create_token(1u64, 8u8);
        duplicate_fut.await();
    }

    // The constructor is configured to prevent upgrades.
    @noupgrade
    async constructor() {}

}