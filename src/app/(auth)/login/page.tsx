"use client"

import AuthInput from '@/components/AuthInput';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import authBG from '@/assets/AuthBG.png';

export default function Login(): React.ReactNode {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const response = await axios.post('/api/login', user);
    if (response.status === 200) {
      router.push("/");
    }
  }

  return (
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center lg:bg-center'>
      <div className="bg-[#F2F2F2] h-screen w-full lg:h-auto lg:w-auto flex flex-col items-center justify-center gap-[1rem] lg:gap-[0.7rem] lg:p-[2rem] lg:rounded-[10px]">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] lg:text-[0.8rem] tracking-[3px] font-semibold'>welcome back</span>
        <span className='text-center capitalize text-[1.8rem] lg:text-[1.3rem] font-bold'>Sign In to Your Account</span>
        <form className='flex flex-col gap-[1.5rem] lg:gap-[1rem] w-[90%] lg:w-[100%]' onSubmit={handleLogin}>
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
          <Link href="/forgotPassword" className='text-[#287ac3] hover:text-[#2aa3ff] text-center'>Forgot your password?</Link>
          <button
            type="submit"
            className='bg-[#ffd438] p-[1rem] lg:py-[0.5rem] rounded-[10px] text-[#2F2F2F] uppercase font-semibold tracking-[3px] text-[1.5rem] border-[2px] border-[#2F2F2F] shadow-[0_5px_0_0_#2F2F2F] hover:bg-[#fab005] outline-none mb-[10px]'
          >login
          </button>
        </form>
        <span>Don&lsquo;t have an account? <Link href="/register" className='text-[#287ac3] hover:text-[#2aa3ff]'>Register Now</Link></span>
      </div>
    </div>
  )
}
