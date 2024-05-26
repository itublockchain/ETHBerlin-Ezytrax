"use client";
import React from 'react'
import Image from 'next/image';
import { Logo } from '@/assets';

type Props = {}

function Header({}: Props) {
  return (
    <div className='container mx-auto my-3 flex flex-row justify-between'>
      <Image src={Logo} alt="Logo" />
      <div className='flex justify-center items-center my-auto text-black text-sm font-bold bg-white py-2 px-4 rounded-full'>
        <p>Connect Wallet</p>
      </div>
    </div>
  )
}

export default Header