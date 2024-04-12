"use client"

import AuthInput from '@/components/AuthInput';
import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import profile from "@/assets/profile.png"

export default function Register(): React.ReactNode {
  const [user, setUser] = React.useState({
    email: '',
    password: ''
  })
  const router = useRouter();

  async function registerUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const reponse = await axios.post('/api/sendMail', user);
      console.log(reponse);

      if (reponse.status === 200) {
        setUser({
          email: '',
          password: ''
        })
        router.push('/verify');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center lg:bg-center'>
      <div className="bg-[#F2F2F2] h-screen w-full lg:h-auto lg:w-auto flex flex-col items-center justify-center gap-[1rem] lg:p-[2rem] lg:rounded-[10px]">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] lg:text-[0.8rem] tracking-[3px] font-semibold'>Register</span>
        <span className='text-center capitalize text-[1.8rem] lg:text-[1.3rem] font-bold'>Create Your Account</span>
        <form className='flex flex-col items-center gap-[1.5rem] lg:gap-[1rem] w-[90%] lg:w-[100%]' onSubmit={registerUser}>
          <Image src={profile} alt='profile' className='h-[6rem] w-[6rem] rounded-full border-2 border-[#2F2F2F]' />
          <AuthInput
            type="email"
            placeholder='Email'
            value={user.email}
            setValue={(e) => setUser({ ...user, email: e })}
            name='email'
          />
          <AuthInput
            value={user.password}
            setValue={(e) => setUser({ ...user, password: e })}
            type="password"
            placeholder='Password'
            name='password'
          />
          <button
            type="submit"
            className='w-full bg-[#ffd438] p-[1rem] lg:p-[0.5rem] rounded-[10px] text-[#2F2F2F] uppercase font-semibold tracking-[3px] text-[1.5rem] border-[2px] border-[#2F2F2F] shadow-[0_5px_0_0_#2F2F2F] hover:bg-[#fab005] outline-none mb-[10px]'
          >Register
          </button>
        </form>
        <span>Already have an Account? <Link href="/login" className='text-[#287ac3] hover:text-[#2aa3ff]'>Login Now</Link></span>
      </div>
    </div>
  )
}
