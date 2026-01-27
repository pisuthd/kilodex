import kilodex_v1.aleo;

program test_kilodex_v1.aleo {
    @test
    @should_fail
    transition test_simple_addition_fail() {
        let result: u32 = kilodex_v1.aleo/simple_addition(2u32, 3u32);
        assert_eq(result, 3u32);
    }

    @test
    transition test_simple_addition() {
        let result: u32 = kilodex_v1.aleo/simple_addition(2u32, 3u32);
        assert_eq(result, 5u32);
    }

    // We can await futures, set mapping values, and access mapping values using 
    // `script` testing mode.
    @test
    script test_async() {
        const VAL: field = 12field;
        let fut: Future = kilodex_v1.aleo/set_mapping(VAL);
        // We must await this future for the async code to run.
        fut.await();
        assert_eq(Mapping::get(kilodex_v1.aleo/map, 0field), VAL);

        // scripts can also do other things normally only async code can do:
        let rand_val: field = ChaCha::rand_field();
        Mapping::set(kilodex_v1.aleo/map, VAL, rand_val);
        let value: field = Mapping::get(kilodex_v1.aleo/map, VAL);
        assert_eq(value, rand_val);
    }

    @test
    transition test_record_maker() {
        let r: kilodex_v1.aleo/Example = kilodex_v1.aleo/mint_record(0field);
        assert_eq(r.x, 0field);
    }

    // The constructor is configured to prevent upgrades.
    @noupgrade
    async constructor() {}

}