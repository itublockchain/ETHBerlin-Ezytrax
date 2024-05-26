export function btcToSatoshis(btcString: string) {
  const btcAmount = parseFloat(btcString);
  if (isNaN(btcAmount)) {
    throw new Error('Invalid BTC amount');
  }
  const satoshis = Math.round(btcAmount * 100000000);
  return BigInt(satoshis);
}
