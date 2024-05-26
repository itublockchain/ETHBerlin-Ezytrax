"use client";
import { Inter } from "next/font/google";
import { generateSecretAndNullifier } from "@/utils";
import React, { useState, useRef, useEffect } from "react";
import { fetchSigned } from "@/utils";
import { Header } from "@/components";
import { Baloons, Ethereum, Bitcoin, Right } from "@/assets";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Orders() {
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [bitaddress, setAddress] = useState("");

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (accounts.length > 0) {
        setConnected(true);
        localStorage.setItem("connected", "true");
        setAddress(accounts[0]);
        localStorage.setItem("bitAddress", accounts[0]);
      } else {
        setConnected(false);
      }
    }
  }, [accounts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unisat = (window as any).unisat;
      const checkUnisat = async () => {
        try {
          const accounts = await unisat.getAccounts();
          setAccounts(accounts);
        } catch (error) {
          console.error("Error fetching Unisat accounts:", error);
        }
      };
      checkUnisat();
    }
  }, []);

  function truncateAddress(address: any) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const [commitment, setCommitment] = useState<string | null>(null);
  return (
    <div
      className={`min-h-screen ${inter.className} bg-[#312D2D] py-4`}
    >
      <Header />
      <div className="container mx-auto">
        {/* <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded"
          onClick={() => {
            generateSecretAndNullifier().then((commitment) => {
              setCommitment(commitment);
              console.log("Commitment:", commitment);
              console.log("Nullifier:", localStorage.getItem("nullifier"));
              console.log("Secret:", localStorage.getItem("secret"));
            });
          }}
        >
          Button
        </button>
        <button
          className="bg-[#99DDE2] text-black font-sans font-bold border-black border-[3px]
            border-solid text-center rounded-lg textcolor-white w-[188px] h-[40px] hover:bg-white border-l-8 border-b-8 mt-1 shadow-[100px_35px_35px_-15px_rgba(0,0,0,0)] flex items-center justify-center"
          onClick={async () => {
            const result = await unisat.requestAccounts();
            console.log("Result unisat: ", result);
          }}
        >
          Connect Unisat Wallet
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            fetchSigned(unisat, bitaddress, commitment || "0x").then((result) => {
              console.log("Result:", result);
            });
          }}
        ></button>
        {commitment && <p>Commitment: {commitment}</p>} */}
        <div className="flex justify-center items-center">
          <Image src={Baloons} alt="Logo" className="w-full" />
          <div className="absolute mt-[-120px] bg-[#3E3E3E] backdrop-blur-lg bg-opacity-60 w-full flex justify-center py-8">
            <div className="flex flex-col gap-9 py-4">
              <h3 className="text-center font-mediun text-4xl gap-4 text-white">Withdraw</h3>
              <div>
                <div className="flex flex-col gap-4 items-center">
                    <h3 className="text-white">Secret</h3>
                    <input type="text" className="w-[600px] py-2 text-[#686868] font-semibold indent-4 rounded-full outline-none bg-gray-100" />
                </div>
                <div className="border-b-[1px] border-gray-500 my-8" />
                <div className="flex flex-col gap-4 items-center">
                    <h3 className="text-white">Recipient Address</h3>
                    <input type="text" className="w-[600px] py-2 text-[#686868] font-semibold indent-4 rounded-full outline-none bg-gray-100" />
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
