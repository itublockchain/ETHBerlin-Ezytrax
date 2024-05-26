'use client';
import { Inter } from 'next/font/google';
import { generateSecretAndNullifier } from '@/utils';
import React, { useState, useRef, useEffect } from 'react';
import { fetchSigned } from '@/utils';
import { Header } from '@/components';
import { Baloons, Ethereum, Bitcoin, Right } from '@/assets';
import Image from 'next/image';
import { randomBytes } from 'crypto';
import { generatePoseidonHash } from '@/utils';

const inter = Inter({ subsets: ['latin'] });

export default function Orders() {
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [bitaddress, setAddress] = useState('');
  const mockAddress = '0xbFA7639367a4947dA1936e56317e483DeB621D96';
  const [data, setData] = useState([
    {
      sells: 1,
      wants: 2,
    },
    {
      sells: 1,
      wants: 2,
    },
    {
      sells: 1,
      wants: 2,
    },
    {
      sells: 1,
      wants: 2,
    },
  ]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (accounts.length > 0) {
        setConnected(true);
        localStorage.setItem('connected', 'true');
        setAddress(accounts[0]);
        localStorage.setItem('bitAddress', accounts[0]);
      } else {
        setConnected(false);
      }
    }
  }, [accounts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unisat = (window as any).unisat;
      const checkUnisat = async () => {
        try {
          const accounts = await unisat.getAccounts();
          setAccounts(accounts);
        } catch (error) {
          console.error('Error fetching Unisat accounts:', error);
        }
      };
      checkUnisat();
    }
  }, []);

  function truncateAddress(address: any) {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  async function createRan() {
    generateSecretAndNullifier().then((commitment) => {
      setCommitment(commitment);
      console.log('Commitment:', commitment);
      console.log('Nullifier:', localStorage.getItem('nullifier'));
      console.log('Secret:', localStorage.getItem('secret'));
    });
  }
  const [commitment, setCommitment] = useState<string | null>(null);
  return (
    <div className={`min-h-screen ${inter.className} bg-[#312D2D] py-4`}>
      <Header />
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <Image src={Baloons} alt="Logo" className="w-full" />
          <div className="absolute mt-[-120px] bg-[#3E3E3E] backdrop-blur-lg bg-opacity-60 w-full flex justify-center py-8">
            <div className="flex flex-col gap-9 py-4">
              <h3 className="text-white text-center font-mediun text-4xl gap-4">Orders</h3>
              <div className="container mx-auto flex flex-wrap gap-4 justify-center">
                {data.map((el, i) => {
                  return (
                    <div className="py-16 px-16 bg-[#606060] rounded-3xl font-semibold text-xl text-[#D8D8D8] flex flex-col gap-12">
                      <div className="text-center">
                        <p>Sells: {(el as any)?.sells} ETH</p>
                        <p>Wants: {(el as any)?.wants} ETH</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          className="border-2 py-2 px-12 rounded-full bg-[#D7D7D7] text-[#686868]"
                          onClick={async () => {
                            await createRan();
                            await fetchSigned(unisat, bitaddress, commitment);
                          }}
                        >
                          FILL
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
