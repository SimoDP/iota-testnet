module burning_proof::burning_proof {
    use iota::object::{Self, UID};
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};
    use iota::event;

    // ── Errors ──────────────────────────────────────────────
    const E_COOLDOWN_NOT_ELAPSED: u64 = 1;

    // ── Cooldown (in epochs) ────────────────────────────────
    // 0 for MVP demo so every scan succeeds immediately.
    // In production, set to 1+ to enforce a minimum time between scans.
    const SCAN_COOLDOWN_EPOCHS: u64 = 0;

    // ── Capability: only the deployer (oracle server) holds this ──
    public struct OracleCap has key, store {
        id: UID,
    }

    // ── The Digital Twin object (shared) ────────────────────
    public struct LuxuryAsset has key, store {
        id: UID,
        physical_id_hash: vector<u8>,
        product_name: vector<u8>,
        integrity_score: u64,
        scan_count: u64,
        last_scan_epoch: u64,
    }

    // ── Events ──────────────────────────────────────────────
    public struct AssetMinted has copy, drop {
        asset_id: address,
        physical_id_hash: vector<u8>,
        product_name: vector<u8>,
    }

    public struct ScanRecorded has copy, drop {
        asset_id: address,
        new_integrity_score: u64,
        new_scan_count: u64,
        epoch: u64,
    }

    // ── Init: transfer OracleCap to the deployer ────────────
    fun init(ctx: &mut TxContext) {
        transfer::transfer(
            OracleCap { id: object::new(ctx) },
            tx_context::sender(ctx),
        );
    }

    // ── Mint a new Luxury Asset (shared object) ─────────────
    public entry fun mint_asset(
        _cap: &OracleCap,
        physical_id_hash: vector<u8>,
        product_name: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let asset = LuxuryAsset {
            id: object::new(ctx),
            physical_id_hash,
            product_name,
            integrity_score: 0,
            scan_count: 0,
            last_scan_epoch: 0,
        };

        let asset_id = object::uid_to_address(&asset.id);

        event::emit(AssetMinted {
            asset_id,
            physical_id_hash: asset.physical_id_hash,
            product_name: asset.product_name,
        });

        transfer::share_object(asset);
    }

    // ── Record a scan (only oracle can call) ────────────────
    public entry fun record_scan(
        _cap: &OracleCap,
        asset: &mut LuxuryAsset,
        ctx: &mut TxContext,
    ) {
        let current_epoch = tx_context::epoch(ctx);

        assert!(
            current_epoch >= asset.last_scan_epoch + SCAN_COOLDOWN_EPOCHS,
            E_COOLDOWN_NOT_ELAPSED,
        );

        asset.integrity_score = asset.integrity_score + 1;
        asset.scan_count = asset.scan_count + 1;
        asset.last_scan_epoch = current_epoch;

        event::emit(ScanRecorded {
            asset_id: object::uid_to_address(&asset.id),
            new_integrity_score: asset.integrity_score,
            new_scan_count: asset.scan_count,
            epoch: current_epoch,
        });
    }
}
