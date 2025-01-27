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
    <div className='text-[#2F2F2F] lg:h-screen lg:w-screen lg:flex lg:justify-center lg:items-center lg:bg-center authBackground'>
      <div className="authContainer">
        <span className='text-center text-[#fab005] uppercase text-[1.5rem] lg:text-[0.8rem] tracking-[3px] font-semibold'>welcome back</span>
        <span className='text-center capitalize text-[1.8rem] lg:text-[1.3rem] font-bold'>Sign In to Your Account</span>
        <form className='flex flex-col gap-[1.5rem] lg:gap-[1rem] w-[90%]' onSubmit={handleLogin}>
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
            className='button'
          >login
          </button>
        </form>
        <span className='text-[0.9rem]'>Don&lsquo;t have an account? <Link href="/register" className='text-[#287ac3] hover:text-[#2aa3ff]'>Register Now</Link></span>
      </div>
    </div>
  )
}
