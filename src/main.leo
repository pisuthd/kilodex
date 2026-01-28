program kilodex_v1.aleo {

    // ========================= Token System =========================

    // Token information structure
    struct TokenInfo {
        token_id: u64,
        decimals: u8,
        total_supply: u128,
    }

    // Token record
    record Token {
        owner: address,
        token_id: u64,
        amount: u128,
    }

    // Token metadata: token_id => TokenInfo
    mapping tokens: u64 => TokenInfo;

    // User balances: hash(token_id, address) => balance
    mapping balances: field => u128;

    // Create a new token type
    async transition create_token(token_id: u64, decimals: u8) -> Future {
        let new_token: TokenInfo = TokenInfo{
            token_id,
            decimals,
            total_supply: 0u128,
        };
        return finalize_create_token(new_token);
    }

    async function finalize_create_token(new_token: TokenInfo) {
        assert(!Mapping::contains(tokens, new_token.token_id));
        Mapping::set(tokens, new_token.token_id, new_token);
    } 

    // Mint tokens
    async transition mint(token_id: u64, to: address, amount: u128) -> Future {
        let balance_key: field = get_balance_key(token_id, to); 
        return finalize_mint(balance_key, token_id, to, amount);
    }

    async transition mint_to_me(token_id: u64, amount: u128) -> Future {
        let balance_key: field = get_balance_key(token_id, self.caller); 
        return finalize_mint(balance_key, token_id, self.caller, amount);
    }

    async function finalize_mint(balance_key: field, token_id: u64, to: address, amount: u128) {
        let token_info: TokenInfo = Mapping::get(tokens, token_id);
        let new_total_supply: u128 = token_info.total_supply + amount;
        let updated_token_info: TokenInfo = TokenInfo {
            token_id: token_info.token_id,
            decimals: token_info.decimals,
            total_supply: new_total_supply,
        };
        
        Mapping::set(tokens, token_id, updated_token_info);

        let current_balance: u128 = Mapping::get_or_use(balances, balance_key, 0u128);
        Mapping::set(balances, balance_key, current_balance + amount);
    }

    // Transfer tokens publicly
    async transition transfer_public(public token_id: u64, public to: address, public amount: u128) -> Future { 
        let from_balance_key: field = get_balance_key(token_id, self.caller);
        let to_balance_key: field = get_balance_key(token_id, to);
        return finalize_transfer_public(from_balance_key, to_balance_key, token_id, to, amount);
    }

    async function finalize_transfer_public(public from_balance_key: field, public to_balance_key: field, public token_id: u64, public to: address, public amount: u128) {
        
        let from_balance: u128 = Mapping::get_or_use(balances, from_balance_key, 0u128);
        Mapping::set(balances, from_balance_key, from_balance - amount);
        
        let to_balance: u128 = Mapping::get_or_use(balances, to_balance_key, 0u128);
        Mapping::set(balances, to_balance_key, to_balance + amount);
    }

    // Initialize demo tokens 
    async transition init_demo_tokens() -> Future {
        return finalize_init_demo_tokens();
    }

    async function finalize_init_demo_tokens() {
        // Create WALEO token (ID: 1)
        Mapping::set(tokens, 1u64, TokenInfo {
            token_id: 1u64,
            decimals: 6u8,
            total_supply: 0u128,
        });
            
        // Create USDC token (ID: 2)
        Mapping::set(tokens, 2u64, TokenInfo {
            token_id: 2u64,
            decimals: 6u8,
            total_supply: 0u128,
        });
    }

    

    // ========================= Helper Functions =========================

    // Generate balance key for a user and token
    function get_balance_key(token_id: u64, user: address) -> field {
        return BHP256::hash_to_field([token_id as field, user as field]);
    }

    // The constructor is configured to prevent upgrades.
    @noupgrade
    async constructor() {}

}

