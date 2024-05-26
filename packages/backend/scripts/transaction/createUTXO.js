const bitcoin = require("bitcoinjs-lib");
const axios = require("axios");

// Calculate the fee
const txSize = 1 * 180 + 34 * 3 + 9;
let fee = 17000;
console.log("Fee: ", fee);

let inputs = [];
let totalAmountAvailable = 0; // To evaluate, if we have enough funds to send the transaction
let inputCount = 0; // To later calculate the transaction size
async function getUtxos(fromAddress, toAddress) {
  // Creating UTXO
  await axios
    .get(`https://mempool.space/testnet/api/address/${fromAddress}/utxo`)
    .then((firstResponse) => {
      //get data create unspentOutput and input it to psbt
      let utxos = firstResponse.data;
      for (const element of utxos) {
        let utxo = {}; // Generate utxo object to specify input for transaction
        utxo.amount = element.value / 1e8; // 100 million satoshi = 1 Bitcoin
        utxo.address = toAddress; // Address of the sender wallet
        utxo.txid = element.txid; // Transaction ID of the transaction behind the utxo
        utxo.vout = element.vout; // To identify the utxo
        totalAmountAvailable += utxo.amount; // increase the available funds by the amount within the utxo
        inputCount += 1;
        inputs.push(utxo);
        console.log("UTXO ADDED INPUT");
      }
    });
}
async function getHexes(address, poseidonHash) {
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet }); // For Mainnet: const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin })
  await getUtxos(address);
  for (let i = 0; i < inputs.length; i++) {
    await axios
      .get(`https://mempool.space/testnet/api/tx/${inputs[i].txid}/hex`)
      .then((secondResponse) => {
        inputs[i].raw = secondResponse.data;
        console.log("UTXO: ", inputs[i]);
      });
  }
  /*   for (let i = 0; i < inputs.length; i++) {
    const rawTransaction = inputs[i].raw;
    // Non-segwit transaction input

    psbt.addInput({
      hash: inputs[i].txid,
      index: inputs[i].vout,
      nonWitnessUtxo: Buffer.from(rawTransaction, "hex"),
    });
    console.log("Input Added");
  } */
  let maxUtxo = inputs.reduce(
    (prev, current) => (prev.amount > current.amount ? prev : current),
    { amount: 0 }
  );
  console.log("Greatest Amount : ", maxUtxo.amount);

  // Call bitcoinTxHexCall to get the hex and pubkey
  if (maxUtxo.txid) {
    const hex = maxUtxo.raw;
    console.log("Transaction Hex: ", hex);
  }
  psbt.addInput({
    hash: maxUtxo.txid,
    index: maxUtxo.vout,
    nonWitnessUtxo: Buffer.from(maxUtxo.raw, "hex"),
  });
  console.log("Amount: 10000");
  console.log("Address:", address);
  psbt.addOutput({
    address: address, // This will change with VAULT Bridge Address
    value: 50000,
  });
  console.log("First Output Added");
  console.log("Total Amount Avaible: ", maxUtxo.amount);
  const changeValue = Math.floor(maxUtxo.amount * 1e8 - 50000 - fee);
  console.log("Change Value: ", changeValue);
  psbt.addOutput({
    address: address, // change address
    value: changeValue,
  });
  console.log("Second Output Added");
  console.log("Poseidon Hash: ", poseidonHash);
  const poseidonHashHex = Buffer.from(poseidonHash, "utf8").toString("hex");
  console.log("Poseidon Hash Hex: ", poseidonHashHex);
  // OP_RETURN output
  const opReturnOutput = {
    script: bitcoin.script.compile([
      bitcoin.opcodes.OP_RETURN,
      Buffer.from(poseidonHashHex, "hex"),
    ]),
    value: 0,
  };

  // Add OP_RETURN output to the transaction
  psbt.addOutput(opReturnOutput);
  console.log("OP_RETURN Output Added");
  const unsignedPsbtHex = psbt.toHex();
  console.log("Unsigned PSBT Hex: ", unsignedPsbtHex);
  return { unsignedPsbtHex };
}

module.exports = { getHexes };
