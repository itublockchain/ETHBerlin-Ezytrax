import { ethers } from 'ethers';

function padToEven(hexString: string) {
  if (hexString.length % 2 !== 0) {
    return '0' + hexString;
  }
  return hexString;
}

export function hexStringToBytes32(hexString: string) {
  // Step 1: Remove commas from the string
  let continuousHexString = hexString.split(',').join('');

  // Step 2: Ensure the resulting string has an even length
  continuousHexString = padToEven(continuousHexString);

  // Step 3: Ensure the resulting string is at least 64 characters long
  if (continuousHexString.length < 64) {
    throw new Error('Hex string is too short for bytes32');
  }

  // Step 4: Extract the first 64 characters for the bytes32 value
  const first64Hex = continuousHexString.slice(0, 64);

  // Step 5: Convert the hexadecimal string to a bytes32 format
  const bytes32Value = ethers.utils.hexZeroPad('0x' + first64Hex, 32);

  return bytes32Value;
}
