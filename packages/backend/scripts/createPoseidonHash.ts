import { BigNumber } from "@ethersproject/bignumber";
import * as circomlibjs from "circomlibjs";

async function generateCommitment(
  nullifier: bigint,
  secret: bigint
): Promise<string> {
  // Load the Poseidon hash function
  const poseidon = await circomlibjs.buildPoseidon();

  // Convert inputs to BigInt if they are not already
  const inputs = [nullifier, secret];

  // Generate hash (commitment)
  const commitment = poseidon(inputs);

  return commitment.toString();
}

// Example usage
(async () => {
  const nullifier = BigInt("0"); // Example nullifier, should be a random BigInt
  const secret = BigInt("0"); // Example secret, should be a random BigInt
  const commitment = await generateCommitment(nullifier, secret);
  console.log("Commitment:", commitment);
  const newNullifier = BigInt("0x0"); // Example nullifier, should be a random BigInt
  const newSecret = BigInt("0x0"); // Example secret, should be a random BigInt
  const newCommitment = await generateCommitment(newNullifier, newSecret);
  console.log("New commitment:", newCommitment);
  if (newCommitment == commitment) console.log("Success!");
  else console.log("Failure!");
})();
