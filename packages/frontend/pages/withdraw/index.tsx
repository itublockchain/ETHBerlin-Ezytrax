'use client';
import { Inter } from 'next/font/google';
import { generateSecretAndNullifier } from '@/utils';
import React, { useState, useRef, useEffect } from 'react';
import { fetchSigned } from '@/utils';
import { Header } from '@/components';
import { Baloons, Ethereum, Bitcoin, Right } from '@/assets';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export default function Orders() {
  const [commitment, setCommitment] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  return (
    <div className={`min-h-screen ${inter.className} bg-[#312D2D] py-4`}>
      <Header />
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <Image src={Baloons} alt="Logo" className="w-full" />
          <div className="absolute mt-[-120px] bg-[#3E3E3E] backdrop-blur-lg bg-opacity-60 w-full flex justify-center py-8">
            <div className="flex flex-col gap-9 py-4">
              <h3 className="text-center font-mediun text-4xl gap-4 text-white">Withdraw</h3>
              <div>
                <div className="flex flex-col gap-4 items-center">
                  <h3 className="text-white">Secret</h3>
                  <input
                    type="text"
                    className="w-[600px] py-2 text-[#686868] font-semibold indent-4 rounded-full outline-none bg-gray-100"
                    onChange={(e) => {
                      setSecret(e.target.value);
                    }}
                  />
                </div>
                <div className="border-b-[1px] border-gray-500 my-8" />
                <div className="flex flex-col gap-4 items-center">
                  <h3 className="text-white">Recipient Address</h3>
                  <input
                    type="text"
                    className="w-[600px] py-2 text-[#686868] font-semibold indent-4 rounded-full outline-none bg-gray-100"
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-center items-center mt-8">
                  <button className="py-2 px-12 bg-white rounded-full font-semibold">Withdraw</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
