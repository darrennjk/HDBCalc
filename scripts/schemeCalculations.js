function handleScheme(budget) {
    const schemes = [
        { schemeType: "", lease: "5%", keys: "20%" },
        { schemeType: "staggered", lease: "5%", keys: "20%" },
        { schemeType: "staggeredDiffered", lease: "2.5%", keys: "22.5%" },
        { schemeType: "standard", lease: "10%", keys: "15%" },
    ];

    const currentScheme = get_scheme();
    const scheme = schemes.find(s => s.schemeType === currentScheme);

    if (scheme) {
        set_leaseDownpayment(scheme.lease);
        set_leaseDownpayment_value(budget, scheme.lease);
        set_collectionDownpayment(scheme.keys);
        set_keysDownpayment_value(budget, scheme.keys);
    }
}
