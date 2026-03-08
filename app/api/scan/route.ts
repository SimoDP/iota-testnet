import { NextResponse } from "next/server";
import { Transaction } from "@iota/iota-sdk/transactions";
import { getIotaClient, getOracleKeypair } from "@/lib/iota";

export async function POST(request: Request) {
  try {
    const { assetId } = await request.json();

    if (!assetId) {
      return NextResponse.json(
        { success: false, error: "assetId is required" },
        { status: 400 },
      );
    }

    const client = getIotaClient();
    const keypair = getOracleKeypair();
    const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID!;
    const oracleCapId = process.env.ORACLE_CAP_ID!;

    // Build PTB: call burning_proof::record_scan
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::burning_proof::record_scan`,
      arguments: [
        tx.object(oracleCapId), // &OracleCap
        tx.object(assetId), // &mut LuxuryAsset
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

    // Read the updated object to get the new scores
    const obj = await client.getObject({
      id: assetId,
      options: { showContent: true },
    });

    const fields = (obj.data?.content as any)?.fields;

    return NextResponse.json({
      success: true,
      digest: result.digest,
      integrityScore: Number(fields?.integrity_score ?? 0),
      scanCount: Number(fields?.scan_count ?? 0),
    });
  } catch (error: any) {
    console.error("[/api/scan] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
