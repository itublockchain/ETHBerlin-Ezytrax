import { buildPoseidon } from "circomlibjs";

export async function generateCommitment(
  nullifier: bigint,
  secret: bigint
): Promise<string> {
  const poseidon = await buildPoseidon();

  const inputs = [nullifier, secret];

  const commitment = poseidon(inputs);

  return commitment.toString();
}
