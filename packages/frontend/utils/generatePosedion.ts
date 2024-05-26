import { buildPoseidon } from 'circomlibjs';
import { randomBytes } from 'crypto';

type Finish = {
  nullifier: bigint;
  secret: bigint;
  commitment: bigint;
};

export async function generatePoseidonHash(inputs: bigint[]): Promise<any> {
  const poseidon = await buildPoseidon();
  const hash = poseidon(inputs);
  return hash;
}

export async function generateSecretAndNullifier() {
  // Generate random nullifier and secret
  const nullifier = BigInt('0x' + randomBytes(16).toString('hex'));
  const secret = BigInt('0x' + randomBytes(16).toString('hex'));

  // Compute the commitment using Poseidon hash
  const commitment = await generatePoseidonHash([nullifier, secret]);

  console.log('Nullifier:', nullifier);
  console.log('Secret:', secret.toString());
  console.log('Commitment:', commitment.toString());

  // Store nullifier and secret in local storage
  localStorage.setItem('nullifier', nullifier.toString());
  localStorage.setItem('secret', secret.toString());

  return { nullifier, secret, commitment };
}
