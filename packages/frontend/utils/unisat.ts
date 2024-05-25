const axios = require("axios");
async function signer(unisat: any, unsigned: any) {
  try {
    const unPushed = await unisat.signPsbt(unsigned);
    return unPushed;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function pusher(unisat: any, unPushed: any) {
  try {
    const pushedTx = await unisat.pushPsbt(unPushed);
    return pushedTx;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchUnsigned(address: string, poseidonHash: string) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/getUTXO?address=${address}&poseidonHash=${poseidonHash}`
    );
    const unsigned = response.data;
    return unsigned;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function fetchSigned(
  unisat: any,
  address: string,
  poseidonHash: string
) {
  console.log("fetchSigned");
  try {
    let hex;
    const response = await fetchUnsigned(address, poseidonHash);
    console.log("Response: ", response);
    const { unsignedPsbtHex, raw } = response;
    const unPushed = await signer(unisat, unsignedPsbtHex);
    console.log("unPushed: ", unPushed);
    const pushedTx = await pusher(unisat, unPushed);
    console.log("PushedTx: ", pushedTx);
    await new Promise((r) => setTimeout(r, 2000));
    let response2;
    while (true) {
      try {
        response2 = await axios.get(
          `https://mempool.space/testnet/api/tx/${pushedTx}/hex`
        );
        hex = response2.data;
        if (hex) {
          break;
        }
      } catch (error) {}
      await new Promise((r) => setTimeout(r, 2000));
    }
    return { pushedTx, hex };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
