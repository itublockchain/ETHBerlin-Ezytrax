"use client";
import { Inter } from "next/font/google";
import { generateSecretAndNullifier } from "@/utils";
import React, { useState, useRef, useEffect } from "react";
import { fetchSigned } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

async function getUTXO(address: string, poseidonHash: string) {
  let url = new URL("/api/getUTXO", "http://localhost:3001");
  url.search = new URLSearchParams({ address, poseidonHash }).toString();

  const result = await fetch(url.toString(), {
    method: "GET",
  }).then((res) => res.json());
  console.log("RESULT:", result);
  return result;
}

export default function Home() {
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
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Welcome to your Next.js app!</h1>
        <p className="text-lg mt-4">Get started by editing </p>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
      {commitment && <p>Commitment: {commitment}</p>}
    </main>
  );
}
