import { NextResponse } from "next/server";
import { Transaction } from "@iota/iota-sdk/transactions";
import { getIotaClient, getOracleKeypair } from "@/lib/iota";

export async function POST(request: Request) {
  try {
    const { physicalIdHash, productName } = await request.json();

    if (!physicalIdHash || !productName) {
      return NextResponse.json(
        { success: false, error: "physicalIdHash and productName are required" },
        { status: 400 },
      );
    }

    const client = getIotaClient();
    const keypair = getOracleKeypair();
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;
    const oracleCapId = process.env.ORACLE_CAP_ID!;

    // Build PTB: call burning_proof::mint_asset
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::burning_proof::mint_asset`,
      arguments: [
        tx.object(oracleCapId), // &OracleCap
        tx.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(physicalIdHash)),
        ), // physical_id_hash: vector<u8>
        tx.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode(productName)),
        ), // product_name: vector<u8>
      ],
    });

    // Sign & execute with the Oracle keypair
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true, showEvents: true },
    });

    // Wait for the transaction to be committed
    await client.waitForTransaction({ digest: result.digest });

    // Extract the newly created shared object ID from effects
    const created = result.effects?.created;
    const sharedObj = created?.find(
      (c: any) => c.owner && typeof c.owner === "object" && "Shared" in c.owner,
    );
    const assetId = sharedObj?.reference?.objectId ?? "unknown";

    return NextResponse.json({
      success: true,
      digest: result.digest,
      assetId,
    });
  } catch (error: any) {
    console.error("[/api/mint] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
