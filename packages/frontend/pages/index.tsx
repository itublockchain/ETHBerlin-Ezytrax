'use client';
import { Inter } from 'next/font/google';
import { generatePoseidonHash } from '@/utils';
import { fetchSigned } from '@/utils';
import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components';
import { Baloons, Ethereum, Bitcoin, Right } from '@/assets';
import Image from 'next/image';
import { useWriteContract } from 'wagmi';
import { OrderBookABI } from '@/lib/OrderBookABI';
import { btcToSatoshis } from '@/utils/convertToSatoshi';
import { parseEther, toHex } from 'viem';
import { randomBytes } from 'crypto';
import { hexStringToBytes32 } from '@/utils/hexToBytes32';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [commitment, setCommitment] = useState<any>();
  const [nullifier, setNullifier] = useState<bigint>();
  const [secret, setSecret] = useState<bigint>();
  const [btcAmount, setBtcAmount] = useState<bigint>();
  const [ethAmount, setEthAmount] = useState<bigint>();
  const [btcAddress, setBtcAddress] = useState<string>('');
  const { writeContractAsync: orderWrite } = useWriteContract();
  async function createOrder() {
    const nullRandom = randomBytes(32).toString('hex');
    console.log('nullRandom', nullRandom);
    const nullifier = BigInt('0x' + nullRandom);

    setNullifier(nullifier);
    const secret = BigInt('0x' + randomBytes(32).toString('hex'));
    setSecret(secret);
    const commitment = await generatePoseidonHash([nullifier, secret]);
    setCommitment(commitment);
    console.log('nullifier', nullifier);
    console.log('btcaddress setted', btcAddress);
    console.log('btcAmount setted', btcAmount);
    console.log('ethAmount setted', ethAmount);
    console.log('debug', nullifier.toString());
    orderWrite({
      abi: OrderBookABI,
      address: '0x079Cb3A6Df6f85357e886d882073062988d7b516',
      functionName: 'addOrder',
      args: [btcAmount, btcAddress, nullifier.toString()],
      value: BigInt('00001'),
    });
  }
  return (
    <div className={`min-h-screen ${inter.className} bg-[#F5F2F2] py-4`}>
      <Header />
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <Image src={Baloons} alt="Logo" className="w-full" />
          <div className="absolute mt-[-120px] bg-[#3E3E3E] backdrop-blur-lg bg-opacity-60 w-full flex justify-center py-8">
            <div className="flex flex-col gap-9 py-4">
              <h3 className="text-center font-mediun text-4xl gap-4">Order Creation</h3>
              <div className="flex flex-row gap-28">
                <div className="flex flex-col items-center gap-6">
                  <Image src={Ethereum} alt="eth" width={66} />
                  <h3>Ethereum</h3>
                  <input
                    type="text"
                    placeholder="0.003"
                    className="px-4 py-2 rounded-full outline-none"
                    onChange={(e) => {
                      setEthAmount(parseEther(e.target.value));
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <Image src={Right} alt="btc" />
                </div>
                <div className="flex flex-col items-center gap-6">
                  <Image src={Bitcoin} alt="btc" width={116} />
                  <h3>Bitcoin</h3>
                  <input
                    type="text"
                    placeholder="0.2340"
                    className="px-4 py-2 rounded-full outline-none"
                    onChange={(e) => {
                      setBtcAmount(btcToSatoshis(e.target.value));
                    }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="bc1qudk7cvu24wlxd7945rxfayj7f7kjfgve99zt5f"
                className="px-4 py-2 rounded-full outline-none"
                onChange={(e) => {
                  setBtcAddress(e.target.value);
                }}
              />
              <div className="py-2 px-4 bg-white rounded-full cursor-pointer">
                <p
                  className="text-center font-medium text-base"
                  onClick={async () => {
                    await createOrder();
                  }}
                >
                  Create Order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
