import { IotaClient } from "@iota/iota-sdk/client";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";

let client: IotaClient | null = null;

export function getIotaClient(): IotaClient {
  if (!client) {
    client = new IotaClient({
      url: process.env.NEXT_PUBLIC_IOTA_RPC_URL!,
    });
  }
  return client;
}

export function getOracleKeypair(): Ed25519Keypair {
  const secretKey = process.env.ORACLE_SECRET_KEY!;
  return Ed25519Keypair.fromSecretKey(secretKey);
}
